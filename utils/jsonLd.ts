import { SITE_NAME, SITE_URL } from '~/data/site'

export function siteOrigin() {
  return SITE_URL.replace(/\/$/, '')
}

export function organizationLd() {
  const origin = siteOrigin()
  return {
    '@type': 'Organization',
    name: SITE_NAME,
    url: origin,
    logo: `${origin}/logo.png`,
  }
}

export function websiteLd(description: string) {
  const origin = siteOrigin()
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: origin,
    description,
    inLanguage: 'zh-CN',
    publisher: organizationLd(),
  }
}

export function articleLd(input: {
  title: string
  description: string
  path: string
  dateModified: string
  datePublished?: string
}) {
  const origin = siteOrigin()
  const pageUrl = `${origin}${input.path}`
  const publisher = organizationLd()
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    datePublished: input.datePublished || input.dateModified,
    dateModified: input.dateModified,
    inLanguage: 'zh-CN',
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    author: publisher,
    publisher,
  }
}

export function breadcrumbLd(items: Array<{ name: string; path: string }>) {
  const origin = siteOrigin()
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.path === '/' ? origin : `${origin}${item.path}`,
    })),
  }
}
