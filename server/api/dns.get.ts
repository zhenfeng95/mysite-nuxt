import { DNS_TYPES, isValidDomain, lookupDns, normalizeDomain, type DnsType } from '../utils/dns'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const name = normalizeDomain(String(query.name || ''))
  const typeRaw = String(query.type || 'A').toUpperCase()
  const type = (DNS_TYPES.includes(typeRaw as DnsType) ? typeRaw : 'A') as DnsType

  if (!isValidDomain(name)) {
    throw createError({
      statusCode: 400,
      message: '请输入有效域名，例如 example.com 或 www.example.com',
    })
  }

  let records
  try {
    records = await lookupDns(name, type)
  }
  catch {
    throw createError({
      statusCode: 502,
      message: 'DNS 查询失败，请稍后重试',
    })
  }

  setHeader(event, 'Cache-Control', 'public, max-age=60')

  return {
    name,
    type,
    status: records.length ? 0 : 3,
    records,
  }
})
