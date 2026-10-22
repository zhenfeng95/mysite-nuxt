import { Resolver } from 'node:dns/promises'

export const DNS_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SOA'] as const

export type DnsType = (typeof DNS_TYPES)[number]

export interface DnsRecord {
  name: string
  type: DnsType
  ttl: number | null
  data: string
}

export function normalizeDomain(raw: string) {
  let value = raw.trim().toLowerCase()
  value = value.replace(/^https?:\/\//, '')
  value = value.split('/')[0] || ''
  value = value.split('?')[0] || ''
  value = value.replace(/:\d+$/, '')
  value = value.replace(/\.$/, '')
  return value
}

export function isValidDomain(name: string) {
  if (!name || name.length > 253) {
    return false
  }
  return /^(?=.{1,253}$)(?!-)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(name)
}

/** 粗略取注册域：去掉 www，其余取末两段（多级后缀如 .co.uk 可能不准） */
export function guessRegisteredDomain(name: string) {
  const parts = name.split('.').filter(Boolean)
  if (parts.length <= 2) {
    return name
  }
  if (parts[0] === 'www') {
    return parts.slice(1).join('.')
  }
  return parts.slice(-2).join('.')
}

function isNotFound(error: unknown) {
  return Boolean(
    error
    && typeof error === 'object'
    && 'code' in error
    && ['ENOTFOUND', 'ENODATA', 'ESERVFAIL'].includes(String((error as { code?: string }).code)),
  )
}

export async function lookupDns(name: string, type: DnsType): Promise<DnsRecord[]> {
  const resolver = new Resolver()
  resolver.setServers(['1.1.1.1', '8.8.8.8'])

  try {
    switch (type) {
      case 'A': {
        const rows = await resolver.resolve4(name, { ttl: true })
        return rows.map(row => ({
          name,
          type,
          ttl: row.ttl,
          data: row.address,
        }))
      }
      case 'AAAA': {
        const rows = await resolver.resolve6(name, { ttl: true })
        return rows.map(row => ({
          name,
          type,
          ttl: row.ttl,
          data: row.address,
        }))
      }
      case 'CNAME': {
        const rows = await resolver.resolveCname(name)
        return rows.map(data => ({
          name,
          type,
          ttl: null,
          data: data.replace(/\.$/, ''),
        }))
      }
      case 'MX': {
        const rows = await resolver.resolveMx(name)
        return rows
          .sort((a, b) => a.priority - b.priority)
          .map(row => ({
            name,
            type,
            ttl: null,
            data: `${row.priority} ${row.exchange.replace(/\.$/, '')}`,
          }))
      }
      case 'TXT': {
        const rows = await resolver.resolveTxt(name)
        return rows.map(parts => ({
          name,
          type,
          ttl: null,
          data: parts.join(''),
        }))
      }
      case 'NS': {
        const rows = await resolver.resolveNs(name)
        return rows.map(data => ({
          name,
          type,
          ttl: null,
          data: data.replace(/\.$/, ''),
        }))
      }
      case 'SOA': {
        const row = await resolver.resolveSoa(name)
        return [{
          name,
          type,
          ttl: null,
          data: `${row.nsname.replace(/\.$/, '')} ${row.hostmaster.replace(/\.$/, '')} ${row.serial}`,
        }]
      }
    }
  }
  catch (error) {
    if (isNotFound(error)) {
      return []
    }
    throw error
  }
}

export async function lookupDnsBundle(name: string, types: DnsType[] = ['A', 'AAAA', 'MX', 'NS', 'TXT', 'CNAME']) {
  const entries = await Promise.all(
    types.map(async (type) => {
      try {
        return [type, await lookupDns(name, type)] as const
      }
      catch {
        return [type, [] as DnsRecord[]] as const
      }
    }),
  )

  return Object.fromEntries(entries) as Record<DnsType, DnsRecord[]>
}
