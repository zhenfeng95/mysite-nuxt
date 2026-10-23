import { Resolver } from 'node:dns/promises'
import { isIP } from 'node:net'
import { domainToASCII } from 'node:url'
import { isValidDomain } from './dns'
import { PingError, assertPublicHost, isDisallowedIp, normalizeHost } from './ping'

const TIMEOUT_MS = 10_000
const MAX_REDIRECTS = 5
const MAX_URL_LENGTH = 2000

export type SiteStatusKind = 'online' | 'reachable' | 'error' | 'offline'

export interface SiteStatusResult {
  input: string
  url: string
  finalUrl: string
  host: string
  ip: string
  online: boolean
  kind: SiteStatusKind
  statusCode: number | null
  statusText: string
  timeMs: number
  redirected: boolean
  redirects: string[]
  error: string | null
  checkedAt: string
}

function kindFromStatus(code: number): SiteStatusKind {
  if (code >= 200 && code < 400) {
    return 'online'
  }
  if (code >= 400 && code < 500) {
    return 'reachable'
  }
  return 'error'
}

export function normalizeCheckUrl(raw: string) {
  let value = raw.trim()
  if (!value || value.length > MAX_URL_LENGTH) {
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

  assertPublicHost(host)

  parsed.hostname = isIP(host) ? host : domainToASCII(host) || host
  // Drop credentials if pasted
  parsed.username = ''
  parsed.password = ''

  return parsed
}

async function resolvePublicIp(host: string) {
  if (isIP(host)) {
    if (isDisallowedIp(host)) {
      throw new PingError(400, '不支持检测内网、本机或保留地址')
    }
    return host
  }

  if (!isValidDomain(host)) {
    throw new PingError(400, '请输入有效的网址或域名')
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

async function fetchOnce(url: string, method: 'HEAD' | 'GET') {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const response = await fetch(url, {
      method,
      redirect: 'manual',
      signal: controller.signal,
      headers: {
        'user-agent': 'ZhenviaSiteStatus/1.0 (+https://zhenvia.com/tools/status)',
        accept: '*/*',
      },
    })
    return response
  }
  finally {
    clearTimeout(timer)
  }
}

function redirectLocation(response: Response, current: URL) {
  const location = response.headers.get('location')
  if (!location) {
    return null
  }
  try {
    return new URL(location, current)
  }
  catch {
    return null
  }
}

export async function checkSiteStatus(raw: string): Promise<SiteStatusResult> {
  const input = raw.trim()
  const initial = normalizeCheckUrl(input)
  if (!initial) {
    throw new PingError(400, '请输入有效网址，例如 https://example.com 或 example.com')
  }

  const start = Date.now()
  const redirects: string[] = []
  let current = initial
  let host = normalizeHost(current.hostname)
  let ip = await resolvePublicIp(host)
  let lastStatus: number | null = null
  let lastText = ''

  try {
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      host = normalizeHost(current.hostname)
      assertPublicHost(host)
      ip = await resolvePublicIp(host)

      let response: Response
      try {
        response = await fetchOnce(current.toString(), 'HEAD')
        // Some hosts reject HEAD
        if (response.status === 405 || response.status === 501) {
          response = await fetchOnce(current.toString(), 'GET')
        }
      }
      catch (error: unknown) {
        if (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError') {
          throw new PingError(504, '请求超时，站点可能不可达或响应过慢')
        }
        throw new PingError(502, '无法连接目标站点，可能宕机、拒连或网络不通')
      }

      lastStatus = response.status
      lastText = response.statusText || ''

      if (response.status >= 300 && response.status < 400) {
        const next = redirectLocation(response, current)
        if (!next || (next.protocol !== 'http:' && next.protocol !== 'https:')) {
          break
        }
        redirects.push(next.toString())
        if (hop === MAX_REDIRECTS) {
          throw new PingError(502, '重定向次数过多')
        }
        current = next
        continue
      }

      const kind = kindFromStatus(response.status)
      const timeMs = Math.round((Date.now() - start) * 10) / 10

      return {
        input,
        url: initial.toString(),
        finalUrl: current.toString(),
        host,
        ip,
        online: kind === 'online' || kind === 'reachable',
        kind,
        statusCode: response.status,
        statusText: lastText,
        timeMs,
        redirected: redirects.length > 0,
        redirects,
        error: null,
        checkedAt: new Date().toISOString(),
      }
    }
  }
  catch (error) {
    if (error instanceof PingError) {
      throw error
    }
    throw new PingError(502, '检测失败，请稍后重试')
  }

  const timeMs = Math.round((Date.now() - start) * 10) / 10
  const kind = lastStatus === null ? 'offline' : kindFromStatus(lastStatus)
  return {
    input,
    url: initial.toString(),
    finalUrl: current.toString(),
    host,
    ip,
    online: kind === 'online' || kind === 'reachable',
    kind,
    statusCode: lastStatus,
    statusText: lastText,
    timeMs,
    redirected: redirects.length > 0,
    redirects,
    error: null,
    checkedAt: new Date().toISOString(),
  }
}
