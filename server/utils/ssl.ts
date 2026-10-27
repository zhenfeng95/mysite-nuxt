import { Resolver } from 'node:dns/promises'
import tls from 'node:tls'
import { isIP } from 'node:net'
import { isValidDomain } from './dns'
import { PingError, assertPublicHost, isDisallowedIp, normalizeHost } from './ping'

const TIMEOUT_MS = 12_000
const DEFAULT_PORT = 443

export type SslExpiryKind = 'ok' | 'soon' | 'expired' | 'invalid'

export interface SslCheckResult {
  input: string
  host: string
  port: number
  ip: string
  kind: SslExpiryKind
  valid: boolean
  daysRemaining: number | null
  validFrom: string | null
  validTo: string | null
  subject: string | null
  issuer: string | null
  altNames: string[]
  fingerprint256: string | null
  protocol: string | null
  authorized: boolean
  authorizationError: string | null
  checkedAt: string
}

function parseHostPort(raw: string) {
  let value = raw.trim()
  if (!value || value.length > 500) {
    return null
  }

  if (!/^https?:\/\//i.test(value)) {
    value = `https://${value}`
  }

  let parsed: URL
  try {
    parsed = new URL(value)
  }
  catch {
    return null
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return null
  }

  const host = normalizeHost(parsed.hostname)
  if (!host) {
    return null
  }

  const port = parsed.port
    ? Number(parsed.port)
    : DEFAULT_PORT

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    return null
  }

  return { host, port, input: raw.trim() }
}

async function resolvePublicIp(host: string) {
  if (isIP(host)) {
    if (isDisallowedIp(host)) {
      throw new PingError(400, '不支持检测内网、本机或保留地址')
    }
    return host
  }

  if (!isValidDomain(host)) {
    throw new PingError(400, '请输入有效的域名或网址')
  }

  const resolver = new Resolver()
  resolver.setServers(['1.1.1.1', '8.8.8.8'])

  let addresses: string[] = []
  try {
    addresses = await resolver.resolve4(host)
  }
  catch {
    try {
      addresses = await resolver.resolve6(host)
    }
    catch {
      throw new PingError(502, '域名解析失败，站点可能不存在或 DNS 未生效')
    }
  }

  const publicIp = addresses.find(ip => !isDisallowedIp(ip))
  if (!publicIp) {
    throw new PingError(400, '不支持检测内网、本机或保留地址')
  }
  return publicIp
}

function pickCn(subject: tls.PeerCertificate['subject']) {
  if (!subject) {
    return null
  }
  if (typeof subject.CN === 'string' && subject.CN) {
    return subject.CN
  }
  const entries = Object.entries(subject)
  if (!entries.length) {
    return null
  }
  return entries.map(([k, v]) => `${k}=${v}`).join(', ')
}

function pickIssuer(issuer: tls.PeerCertificate['issuer']) {
  if (!issuer) {
    return null
  }
  if (typeof issuer.O === 'string' && issuer.O) {
    return issuer.CN ? `${issuer.O} (${issuer.CN})` : issuer.O
  }
  if (typeof issuer.CN === 'string' && issuer.CN) {
    return issuer.CN
  }
  return Object.entries(issuer).map(([k, v]) => `${k}=${v}`).join(', ') || null
}

function parseAltNames(raw: string | undefined) {
  if (!raw) {
    return []
  }
  return raw
    .split(',')
    .map(part => part.trim())
    .map((part) => {
      const dns = part.match(/^DNS:(.+)$/i)
      if (dns?.[1]) {
        return dns[1].trim()
      }
      const ip = part.match(/^IP Address:(.+)$/i)
      if (ip?.[1]) {
        return ip[1].trim()
      }
      return ''
    })
    .filter(Boolean)
}

function kindFromDates(validTo: Date | null, authorized: boolean): {
  kind: SslExpiryKind
  daysRemaining: number | null
} {
  if (!validTo || Number.isNaN(validTo.getTime())) {
    return { kind: 'invalid', daysRemaining: null }
  }

  const ms = validTo.getTime() - Date.now()
  const daysRemaining = Math.ceil(ms / (24 * 60 * 60 * 1000))

  if (daysRemaining < 0) {
    return { kind: 'expired', daysRemaining }
  }
  if (!authorized) {
    return { kind: 'invalid', daysRemaining }
  }
  if (daysRemaining <= 30) {
    return { kind: 'soon', daysRemaining }
  }
  return { kind: 'ok', daysRemaining }
}

function fetchCertificate(host: string, port: number, servername: string) {
  return new Promise<{
    cert: tls.PeerCertificate
    protocol: string | null
    authorized: boolean
    authorizationError: Error | null
  }>((resolve, reject) => {
    const socket = tls.connect({
      host,
      port,
      servername: isIP(servername) ? undefined : servername,
      rejectUnauthorized: false,
      timeout: TIMEOUT_MS,
    })

    const fail = (error: Error) => {
      socket.destroy()
      reject(error)
    }

    socket.once('timeout', () => {
      fail(new PingError(504, '连接超时，无法获取证书'))
    })

    socket.once('error', (error) => {
      fail(new PingError(502, error.message || 'TLS 连接失败'))
    })

    socket.once('secureConnect', () => {
      try {
        const cert = socket.getPeerCertificate(true)
        if (!cert || !Object.keys(cert).length) {
          fail(new PingError(502, '未能读取到服务器证书'))
          return
        }
        const protocol = socket.getProtocol()
        const authorized = socket.authorized
        const authorizationError = socket.authorizationError
          ? new Error(String(socket.authorizationError))
          : null
        socket.end()
        resolve({
          cert,
          protocol,
          authorized,
          authorizationError,
        })
      }
      catch (error) {
        fail(error instanceof Error ? error : new Error('读取证书失败'))
      }
    })
  })
}

export async function checkSslCertificate(raw: string): Promise<SslCheckResult> {
  const parsed = parseHostPort(raw)
  if (!parsed) {
    throw new PingError(400, '请输入有效域名或网址，例如 example.com 或 https://example.com')
  }

  assertPublicHost(parsed.host)
  const ip = await resolvePublicIp(parsed.host)

  let fetched: Awaited<ReturnType<typeof fetchCertificate>>
  try {
    fetched = await fetchCertificate(ip, parsed.port, parsed.host)
  }
  catch (error) {
    if (error instanceof PingError) {
      throw error
    }
    throw new PingError(502, 'TLS 握手失败，站点可能未启用 HTTPS')
  }

  const { cert, protocol, authorized, authorizationError } = fetched
  const validFrom = cert.valid_from ? new Date(cert.valid_from) : null
  const validTo = cert.valid_to ? new Date(cert.valid_to) : null
  const { kind, daysRemaining } = kindFromDates(validTo, authorized)

  return {
    input: parsed.input,
    host: parsed.host,
    port: parsed.port,
    ip,
    kind,
    valid: kind === 'ok' || kind === 'soon',
    daysRemaining,
    validFrom: validFrom && !Number.isNaN(validFrom.getTime()) ? validFrom.toISOString() : null,
    validTo: validTo && !Number.isNaN(validTo.getTime()) ? validTo.toISOString() : null,
    subject: pickCn(cert.subject),
    issuer: pickIssuer(cert.issuer),
    altNames: parseAltNames(cert.subjectaltname),
    fingerprint256: cert.fingerprint256 || null,
    protocol,
    authorized,
    authorizationError: authorizationError?.message || null,
    checkedAt: new Date().toISOString(),
  }
}
