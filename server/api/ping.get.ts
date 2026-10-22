import { PingError, assertPublicHost, normalizeHost, pingHost } from '../utils/ping'

const hits = new Map<string, number[]>()

function allowRequest(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter(stamp => now - stamp < 60_000)
  if (recent.length >= 8) {
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
  if (error instanceof PingError) {
    throw createError({
      statusCode: error.statusCode,
      message: error.message,
    })
  }
  throw createError({
    statusCode: 502,
    message: '探测失败，请稍后重试',
  })
}

export default defineEventHandler(async (event) => {
  const raw = String(getQuery(event).host || '')
  const host = normalizeHost(raw)

  try {
    assertPublicHost(host)
  }
  catch (error) {
    apiError(error)
  }

  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  if (!allowRequest(ip)) {
    throw createError({
      statusCode: 429,
      message: '操作太频繁，请稍后再试',
    })
  }

  try {
    const result = await pingHost(raw)
    setHeader(event, 'Cache-Control', 'private, no-store')
    return result
  }
  catch (error) {
    apiError(error)
  }
})
