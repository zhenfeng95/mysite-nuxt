import { IpGeoError, assertClientIp, lookupIpGeo } from '../utils/ip-geo'
import { canonicalIp } from '../utils/ping'

const hits = new Map<string, number[]>()

function allowRequest(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter(stamp => now - stamp < 60_000)
  if (recent.length >= 20) {
    hits.set(ip, recent)
    return false
  }
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) {
    for (const [key, stamps] of hits) {
      if (stamps.every(stamp => now - stamp >= 60_000)) {
        hits.delete(key)
      }
    }
  }
  return true
}

function apiError(error: unknown): never {
  if (error instanceof IpGeoError) {
    throw createError({
      statusCode: error.statusCode,
      message: error.message,
    })
  }
  throw createError({
    statusCode: 502,
    message: '查询失败，请稍后重试',
  })
}

export default defineEventHandler(async (event) => {
  const raw = String(getQuery(event).host || '').trim()
  const self = !raw
  let target = raw

  if (self) {
    try {
      target = assertClientIp(canonicalIp(getRequestIP(event, { xForwardedFor: true }) || ''))
    }
    catch (error) {
      apiError(error)
    }
  }

  const requester = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  if (!allowRequest(requester)) {
    throw createError({
      statusCode: 429,
      message: '操作太频繁，请稍后再试',
    })
  }

  try {
    const result = await lookupIpGeo(target)
    setHeader(event, 'Cache-Control', self ? 'private, no-store' : 'public, max-age=600')
    return { ...result, self }
  }
  catch (error) {
    apiError(error)
  }
})
