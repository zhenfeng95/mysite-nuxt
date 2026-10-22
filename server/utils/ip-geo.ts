import { Resolver } from 'node:dns/promises'
import { isIP } from 'node:net'
import { isValidDomain } from './dns'
import { canonicalIp, isDisallowedIp, normalizeHost } from './ping'

export class IpGeoError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
}

export interface IpGeoResult {
  host: string
  ip: string
  location: string
  isp: string
  org: string
  asn: string
  timezone: string
}

interface WhoPayload {
  success?: boolean
  country?: string
  region?: string
  city?: string
  connection?: {
    asn?: number | string
    org?: string
    isp?: string
  }
  timezone?: {
    id?: string
    utc?: string
  }
}

interface BaiduPayload {
  data?: Array<{ location?: string }>
}

const TRADITIONAL: Record<string, string> = {
  聖: '圣',
  舊: '旧',
  臺: '台',
  灣: '湾',
  門: '门',
  東: '东',
  廣: '广',
  島: '岛',
  縣: '县',
  區: '区',
  龍: '龙',
  雲: '云',
  國: '国',
  華: '华',
  萬: '万',
  長: '长',
  風: '风',
  馬: '马',
  鳥: '鸟',
  魚: '鱼',
  車: '车',
  關: '关',
  雙: '双',
  歐: '欧',
  亞: '亚',
  爾: '尔',
  蘭: '兰',
  義: '义',
  極: '极',
  約: '约',
  紐: '纽',
  奧: '奥',
  內: '内',
  羅: '罗',
  來: '来',
  麗: '丽',
  貝: '贝',
  魯: '鲁',
  薩: '萨',
}

const cache = new Map<string, { at: number, value: Omit<IpGeoResult, 'host'> }>()

function toSimplified(value: string) {
  return value.replace(/[\u4e00-\u9fff]/g, char => TRADITIONAL[char] || char)
}

function joinPlace(parts: Array<string | undefined>) {
  const place: string[] = []
  for (const part of parts) {
    const value = String(part || '').trim()
    if (!value || place.at(-1) === value) {
      continue
    }
    place.push(value)
  }
  return place.join(' ')
}

function parseBaidu(location: string) {
  const text = location.replace(/<[^>]+>/g, '').trim()
  if (!text || text === '0' || /保留|局域网|本机/.test(text)) {
    return { place: '', isp: '' }
  }
  const matched = text.match(/^(.*?(?:省|市|区|县).*?)\s+(\S+)$/)
  if (matched) {
    return {
      place: (matched[1] || '').trim(),
      isp: (matched[2] || '').trim(),
    }
  }
  return { place: text, isp: '' }
}

function formatAsn(asn: number | string | undefined) {
  if (asn === undefined || asn === null || asn === '') {
    return ''
  }
  const text = String(asn).trim()
  if (!text || text === '0') {
    return ''
  }
  return /^AS/i.test(text) ? text.toUpperCase() : `AS${text}`
}

function formatTimezone(timezone: WhoPayload['timezone']) {
  if (!timezone?.id) {
    return ''
  }
  return timezone.utc ? `${timezone.id}（UTC${timezone.utc}）` : timezone.id
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) {
      return null
    }
    return await response.json() as T
  }
  catch {
    return null
  }
}

async function fetchBaidu(ip: string) {
  const url = new URL('https://opendata.baidu.com/api.php')
  url.searchParams.set('query', ip)
  url.searchParams.set('co', '')
  url.searchParams.set('resource_id', '6006')
  url.searchParams.set('oe', 'utf8')
  const payload = await fetchJson<BaiduPayload>(url.toString())
  return parseBaidu(String(payload?.data?.[0]?.location || ''))
}

async function fetchWho(ip: string) {
  const payload = await fetchJson<WhoPayload>(`https://ipwho.is/${encodeURIComponent(ip)}?lang=zh-CN`)
  if (!payload?.success) {
    return null
  }
  return payload
}

async function lookupFacts(ip: string): Promise<Omit<IpGeoResult, 'host'>> {
  const hit = cache.get(ip)
  if (hit && Date.now() - hit.at < 10 * 60 * 1000) {
    return hit.value
  }

  const [baidu, who] = await Promise.all([
    isIP(ip) === 4 ? fetchBaidu(ip) : Promise.resolve({ place: '', isp: '' }),
    fetchWho(ip),
  ])

  const whoPlace = joinPlace([who?.country, who?.region, who?.city])
  const baiduHasCity = /省|市|区|县/.test(baidu.place)
  const location = baiduHasCity ? baidu.place : (whoPlace || baidu.place)
  const whoIsp = String(who?.connection?.isp || '').trim()
  const whoOrg = String(who?.connection?.org || '').trim()
  const isp = baidu.isp || whoIsp
  const org = whoOrg && whoOrg !== isp ? whoOrg : ''
  const facts = {
    ip,
    location: toSimplified(location),
    isp: toSimplified(isp),
    org: toSimplified(org),
    asn: formatAsn(who?.connection?.asn),
    timezone: formatTimezone(who?.timezone),
  }

  if (!facts.location && !facts.isp && !facts.org) {
    throw new IpGeoError(502, '没有查到该 IP 的归属地，请稍后重试')
  }

  cache.set(ip, { at: Date.now(), value: facts })
  if (cache.size > 500) {
    const now = Date.now()
    for (const [key, entry] of cache) {
      if (now - entry.at >= 10 * 60 * 1000) {
        cache.delete(key)
      }
    }
  }
  return facts
}

export function assertClientIp(ip: string) {
  const normalized = canonicalIp(ip)
  if (!normalized || isIP(normalized) === 0 || isDisallowedIp(normalized)) {
    throw new IpGeoError(400, '没有拿到公网 IP，请直接输入要查询的地址')
  }
  return normalized
}

export async function lookupIpGeo(raw: string): Promise<IpGeoResult> {
  const host = normalizeHost(raw)
  if (!host || (isIP(host) === 0 && !isValidDomain(host))) {
    throw new IpGeoError(400, '请输入有效的域名或 IP，例如 8.8.8.8 或 example.com')
  }

  let ip = host
  if (isIP(host) === 0) {
    const resolver = new Resolver()
    resolver.setServers(['1.1.1.1', '8.8.8.8'])
    const [v4, v6] = await Promise.all([
      resolver.resolve4(host).catch(() => [] as string[]),
      resolver.resolve6(host).catch(() => [] as string[]),
    ])
    const ips = [...v4, ...v6].map(canonicalIp)
    if (!ips.length) {
      throw new IpGeoError(400, '无法解析该主机，请检查域名是否正确')
    }
    if (ips.some(isDisallowedIp)) {
      throw new IpGeoError(400, '不支持查询内网、本机或保留地址')
    }
    ip = ips.find(item => isIP(item) === 4) || ips[0] || host
  }
  else {
    ip = canonicalIp(host)
    if (isDisallowedIp(ip)) {
      throw new IpGeoError(400, '不支持查询内网、本机或保留地址')
    }
  }

  const facts = await lookupFacts(ip)
  return { host, ...facts, ip }
}
