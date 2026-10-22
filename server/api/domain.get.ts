import {
  guessRegisteredDomain,
  isValidDomain,
  lookupDnsBundle,
  normalizeDomain,
} from '../utils/dns'
import { fetchRdapWhois } from '../utils/rdap'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const name = normalizeDomain(String(query.name || ''))

  if (!isValidDomain(name)) {
    throw createError({
      statusCode: 400,
      message: '请输入有效域名，例如 example.com',
    })
  }

  const whoisDomain = guessRegisteredDomain(name)

  const [dns, whoisResult] = await Promise.all([
    lookupDnsBundle(name).catch(() => null),
    fetchRdapWhois(whoisDomain)
      .then(data => ({ ok: true as const, data }))
      .catch((error: unknown) => {
        const statusCode = error && typeof error === 'object' && 'statusCode' in error
          ? Number((error as { statusCode?: number }).statusCode)
          : 0
        const message = statusCode === 404
          ? '未查到该域名的注册信息（可能未注册，或注册局未提供 RDAP）'
          : 'WHOIS / RDAP 查询失败，请稍后重试'
        return { ok: false as const, message }
      }),
  ])

  if (!dns) {
    throw createError({
      statusCode: 502,
      message: 'DNS 查询失败，请稍后重试',
    })
  }

  setHeader(event, 'Cache-Control', 'public, max-age=120')

  return {
    name,
    whoisDomain,
    dns,
    whois: whoisResult.ok ? whoisResult.data : null,
    whoisError: whoisResult.ok ? null : whoisResult.message,
  }
})
