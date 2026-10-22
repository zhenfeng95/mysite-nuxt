import { execFile } from 'node:child_process'
import { Resolver } from 'node:dns/promises'
import net, { BlockList, isIP } from 'node:net'
import { domainToASCII } from 'node:url'
import { isValidDomain } from './dns'

export const PING_COUNT = 4

export class PingError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
}

export interface PingReply {
  seq: number
  timeMs: number | null
}

export interface PingResult {
  host: string
  ip: string
  method: 'icmp' | 'tcp'
  port: number | null
  sent: number
  received: number
  loss: number
  min: number | null
  avg: number | null
  max: number | null
  replies: PingReply[]
}

const blocked = new BlockList()
blocked.addSubnet('0.0.0.0', 8, 'ipv4')
blocked.addSubnet('10.0.0.0', 8, 'ipv4')
blocked.addSubnet('100.64.0.0', 10, 'ipv4')
blocked.addSubnet('127.0.0.0', 8, 'ipv4')
blocked.addSubnet('169.254.0.0', 16, 'ipv4')
blocked.addSubnet('172.16.0.0', 12, 'ipv4')
blocked.addSubnet('192.0.0.0', 24, 'ipv4')
blocked.addSubnet('192.0.2.0', 24, 'ipv4')
blocked.addSubnet('192.168.0.0', 16, 'ipv4')
blocked.addSubnet('198.18.0.0', 15, 'ipv4')
blocked.addSubnet('198.51.100.0', 24, 'ipv4')
blocked.addSubnet('203.0.113.0', 24, 'ipv4')
blocked.addSubnet('224.0.0.0', 4, 'ipv4')
blocked.addSubnet('240.0.0.0', 4, 'ipv4')
blocked.addAddress('::', 'ipv6')
blocked.addAddress('::1', 'ipv6')
blocked.addSubnet('fc00::', 7, 'ipv6')
blocked.addSubnet('fe80::', 10, 'ipv6')
blocked.addSubnet('ff00::', 8, 'ipv6')
blocked.addSubnet('2001:db8::', 32, 'ipv6')

let active = 0

function roundMs(value: number) {
  return Math.round(value * 10) / 10
}

export function canonicalIp(ip: string) {
  const mapped = ip.match(/^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i)
  if (mapped && isIP(mapped[1] || '') === 4) {
    return mapped[1] || ip
  }
  return ip
}

export function isDisallowedIp(ip: string) {
  const normalized = canonicalIp(ip)
  const kind = isIP(normalized)
  if (kind === 4) {
    return blocked.check(normalized, 'ipv4')
  }
  if (kind === 6) {
    return blocked.check(normalized, 'ipv6')
  }
  return true
}

export function normalizeHost(raw: string) {
  let value = raw.trim()
  if (!value || value.length > 500) {
    return ''
  }

  value = value.replace(/^https?:\/\//i, '')
  value = value.split(/[/?#]/)[0] || ''

  if (value.startsWith('[')) {
    const end = value.indexOf(']')
    value = end > 1 ? value.slice(1, end) : ''
  }
  else if (isIP(value) !== 6) {
    value = value.replace(/:\d+$/, '')
  }

  value = value.replace(/\.$/, '').toLowerCase()
  if (!value || isIP(value)) {
    return value
  }

  return domainToASCII(value)
}

export function assertPublicHost(host: string) {
  if (!host || (isIP(host) === 0 && !isValidDomain(host))) {
    throw new PingError(400, '请输入有效的域名或 IP，例如 example.com 或 1.1.1.1')
  }
  if (isIP(host) && isDisallowedIp(host)) {
    throw new PingError(400, '不支持探测内网、本机或保留地址')
  }
}

async function resolveProbeIp(host: string) {
  if (isIP(host)) {
    return canonicalIp(host)
  }

  const resolver = new Resolver()
  resolver.setServers(['1.1.1.1', '8.8.8.8'])

  const [v4, v6] = await Promise.all([
    resolver.resolve4(host).catch(() => [] as string[]),
    resolver.resolve6(host).catch(() => [] as string[]),
  ])
  const ips = [...v4, ...v6].map(canonicalIp)

  if (!ips.length) {
    throw new PingError(400, '无法解析该主机，请检查域名是否正确')
  }
  if (ips.some(isDisallowedIp)) {
    throw new PingError(400, '不支持探测内网、本机或保留地址')
  }

  return ips.find(ip => isIP(ip) === 4) || ips[0] || host
}

function summarize(times: Array<number | null>): Omit<PingResult, 'host' | 'ip' | 'method' | 'port'> {
  const receivedTimes = times.filter((time): time is number => time !== null)
  const sent = times.length
  const received = receivedTimes.length
  const loss = sent ? roundMs(((sent - received) / sent) * 100) : 100
  const min = received ? Math.min(...receivedTimes) : null
  const avg = received
    ? roundMs(receivedTimes.reduce((sum, time) => sum + time, 0) / received)
    : null
  const max = received ? Math.max(...receivedTimes) : null

  return {
    sent,
    received,
    loss,
    min,
    avg,
    max,
    replies: times.map((timeMs, index) => ({
      seq: index + 1,
      timeMs,
    })),
  }
}

function parseIcmpTimes(output: string, count: number) {
  const bySeq = new Map<number, number | null>()

  for (const line of output.split(/\r?\n/)) {
    const success = line.match(/icmp_seq[= ](\d+).*?(?:time|时间)[=<]\s*([\d.]+)\s*ms/i)
    if (success) {
      const seq = Number(success[1])
      const time = Number(success[2])
      if (Number.isFinite(seq) && Number.isFinite(time)) {
        bySeq.set(seq, roundMs(time))
      }
      continue
    }

    const failed = line.match(/icmp_seq[= ](\d+)/i)
    if (failed && /timeout|unreachable|exceeded|no answer/i.test(line)) {
      const seq = Number(failed[1])
      if (Number.isFinite(seq) && !bySeq.has(seq)) {
        bySeq.set(seq, null)
      }
    }
  }

  if (bySeq.size) {
    const start = Math.min(...bySeq.keys())
    return Array.from({ length: count }, (_, index) => bySeq.get(start + index) ?? null)
  }

  if (!/packets transmitted|packet loss/i.test(output)) {
    return null
  }

  const times: number[] = []
  const matcher = /(?:time|时间)[=<]\s*([\d.]+)\s*ms/gi
  for (const match of output.matchAll(matcher)) {
    const time = Number(match[1])
    if (Number.isFinite(time)) {
      times.push(roundMs(time))
    }
  }

  return Array.from({ length: count }, (_, index) => times[index] ?? null)
}

function icmpPing(ip: string, count: number): Promise<Array<number | null> | null> {
  if (process.platform === 'win32') {
    return Promise.resolve(null)
  }

  const isV6 = isIP(ip) === 6
  const darwin = process.platform === 'darwin'
  const command = darwin && isV6 ? 'ping6' : 'ping'
  const args = darwin
    ? ['-c', String(count), '-W', '1000', '-n', ip]
    : ['-c', String(count), '-W', '1', '-n', isV6 ? '-6' : '-4', ip]

  return new Promise((resolve) => {
    execFile(command, args, { timeout: 12_000 }, (error, stdout, stderr) => {
      const output = `${stdout || ''}\n${stderr || ''}`
      const icmpDenied = /operation not permitted|permission denied/i.test(output)
      const times = parseIcmpTimes(output, count)
      const err = error as NodeJS.ErrnoException | null
      const unavailable = !err
        ? false
        : err.code === 'ENOENT' || err.code === 'EPERM' || err.code === 'EACCES' || icmpDenied

      if (unavailable && !output.match(/(?:time|时间)[=<]\s*[\d.]+\s*ms/i)) {
        resolve(null)
        return
      }
      if (times) {
        resolve(times)
        return
      }
      if (err?.killed) {
        resolve(Array.from({ length: count }, () => null))
        return
      }
      resolve(null)
    })
  })
}

function tcpOnce(ip: string, port: number, timeoutMs: number) {
  return new Promise<number | null>((resolve) => {
    const started = performance.now()
    const socket = net.connect({
      host: ip,
      port,
      family: isIP(ip) === 6 ? 6 : 4,
    })
    let settled = false

    const finish = (value: number | null) => {
      if (settled) {
        return
      }
      settled = true
      socket.destroy()
      resolve(value)
    }

    socket.setTimeout(timeoutMs)
    socket.once('connect', () => finish(roundMs(performance.now() - started)))
    socket.once('timeout', () => finish(null))
    socket.once('error', () => finish(null))
  })
}

async function tcpPing(ip: string, count: number) {
  for (const port of [443, 80]) {
    const first = await tcpOnce(ip, port, 2000)
    if (first === null) {
      continue
    }

    const times = [first]
    for (let index = 1; index < count; index += 1) {
      times.push(await tcpOnce(ip, port, 2000))
    }
    return { port, times }
  }

  return {
    port: null,
    times: [null, null],
  }
}

export async function pingHost(raw: string): Promise<PingResult> {
  if (active >= 3) {
    throw new PingError(429, '当前探测较多，请稍后再试')
  }

  active += 1
  try {
    const host = normalizeHost(raw)
    assertPublicHost(host)
    const ip = await resolveProbeIp(host)
    const icmpTimes = await icmpPing(ip, PING_COUNT)

    if (icmpTimes) {
      return {
        host,
        ip,
        method: 'icmp',
        port: null,
        ...summarize(icmpTimes),
      }
    }

    const tcp = await tcpPing(ip, PING_COUNT)
    return {
      host,
      ip,
      method: 'tcp',
      port: tcp.port,
      ...summarize(tcp.times),
    }
  }
  finally {
    active -= 1
  }
}
