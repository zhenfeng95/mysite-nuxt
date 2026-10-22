interface RdapEvent {
  eventAction?: string
  eventDate?: string
}

interface RdapEntity {
  roles?: string[]
  vcardArray?: unknown
  publicIds?: Array<{ type?: string; identifier?: string }>
}

interface RdapNameserver {
  ldhName?: string
}

interface RdapResponse {
  ldhName?: string
  unicodeName?: string
  status?: string[]
  events?: RdapEvent[]
  entities?: RdapEntity[]
  nameservers?: RdapNameserver[]
  secureDNS?: { delegationSigned?: boolean }
  port43?: string
}

interface IanaBootstrap {
  services?: Array<[string[], string[]]>
}

export interface DomainWhoisSummary {
  queried: string
  source: 'rdap'
  name: string | null
  statuses: string[]
  created: string | null
  updated: string | null
  expires: string | null
  registrar: string | null
  nameservers: string[]
  dnssec: boolean | null
  port43: string | null
}

/** 常见后缀直连注册局 RDAP，避免 rdap.org 跳转超时 */
const RDAP_BY_TLD: Record<string, string> = {
  com: 'https://rdap.verisign.com/com/v1/domain/',
  net: 'https://rdap.verisign.com/net/v1/domain/',
  org: 'https://rdap.publicinterestregistry.org/rdap/domain/',
  xyz: 'https://rdap.centralnic.com/xyz/v1/domain/',
  io: 'https://rdap.nic.io/domain/',
  app: 'https://rdap.nic.google/domain/',
  dev: 'https://rdap.nic.google/domain/',
  page: 'https://rdap.nic.google/domain/',
  cc: 'https://rdap.nic.cc/domain/',
  tv: 'https://rdap.nic.tv/domain/',
  me: 'https://rdap.nic.me/domain/',
  co: 'https://rdap.nic.co/domain/',
  cn: 'https://rdap.cnnic.cn/rdap/domain/',
}

let bootstrapCache: Map<string, string> | null = null
let bootstrapLoadedAt = 0

function eventDate(events: RdapEvent[] | undefined, action: string) {
  const hit = events?.find(item => item.eventAction === action)
  return hit?.eventDate || null
}

function vcardFn(entity: RdapEntity) {
  const vcard = entity.vcardArray
  if (!Array.isArray(vcard) || vcard.length < 2 || !Array.isArray(vcard[1])) {
    return null
  }
  for (const row of vcard[1]) {
    if (Array.isArray(row) && row[0] === 'fn' && typeof row[3] === 'string') {
      return row[3]
    }
  }
  return null
}

function pickRegistrar(entities: RdapEntity[] | undefined) {
  if (!entities?.length) {
    return null
  }
  const registrar = entities.find(item => item.roles?.includes('registrar'))
  if (!registrar) {
    return null
  }
  return vcardFn(registrar)
    || registrar.publicIds?.find(item => item.type === 'IANA Registrar ID')?.identifier
    || null
}

function tldOf(domain: string) {
  const parts = domain.split('.')
  return parts[parts.length - 1] || ''
}

async function loadBootstrap() {
  const now = Date.now()
  if (bootstrapCache && now - bootstrapLoadedAt < 24 * 60 * 60 * 1000) {
    return bootstrapCache
  }

  try {
    const payload = await $fetch<IanaBootstrap>('https://data.iana.org/rdap/dns.json', {
      timeout: 10000,
    })
    const map = new Map<string, string>()
    for (const service of payload.services || []) {
      const [tlds, urls] = service
      const https = urls.find(url => url.startsWith('https://')) || urls[0]
      if (!https) {
        continue
      }
      const base = https.endsWith('/') ? https : `${https}/`
      for (const tld of tlds) {
        map.set(tld.toLowerCase(), `${base}domain/`)
      }
    }
    bootstrapCache = map
    bootstrapLoadedAt = now
    return map
  }
  catch {
    return bootstrapCache || new Map<string, string>()
  }
}

async function resolveRdapUrl(domain: string) {
  const tld = tldOf(domain)
  const known = RDAP_BY_TLD[tld]
  if (known) {
    return `${known}${encodeURIComponent(domain)}`
  }

  const bootstrap = await loadBootstrap()
  const fromBootstrap = bootstrap.get(tld)
  if (fromBootstrap) {
    return `${fromBootstrap}${encodeURIComponent(domain)}`
  }

  return `https://rdap.org/domain/${encodeURIComponent(domain)}`
}

function summarize(domain: string, payload: RdapResponse): DomainWhoisSummary {
  return {
    queried: domain,
    source: 'rdap',
    name: payload.unicodeName || payload.ldhName || domain,
    statuses: payload.status || [],
    created: eventDate(payload.events, 'registration'),
    updated: eventDate(payload.events, 'last changed'),
    expires: eventDate(payload.events, 'expiration'),
    registrar: pickRegistrar(payload.entities),
    nameservers: (payload.nameservers || [])
      .map(item => item.ldhName?.replace(/\.$/, '') || '')
      .filter(Boolean),
    dnssec: payload.secureDNS?.delegationSigned ?? null,
    port43: payload.port43 || null,
  }
}

export async function fetchRdapWhois(domain: string): Promise<DomainWhoisSummary> {
  const url = await resolveRdapUrl(domain)
  const payload = await $fetch<RdapResponse>(url, {
    timeout: 15000,
    redirect: 'follow',
    headers: {
      Accept: 'application/rdap+json, application/json',
    },
  })
  return summarize(domain, payload)
}
