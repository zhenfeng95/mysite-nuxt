import { SITE_NAME, SITE_URL } from '~/data/site'

export function siteOrigin() {
  return SITE_URL.replace(/\/$/, '')
}

export function defaultOgImage() {
  return `${siteOrigin()}/og-image.jpg`
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
  image?: string
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
    image: input.image || defaultOgImage(),
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

export function itemListLd(input: {
  name: string
  description: string
  path: string
  items: Array<{ name: string; path: string; description?: string }>
}) {
  const origin = siteOrigin()
  const pageUrl = `${origin}${input.path}`
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: input.name,
    description: input.description,
    url: pageUrl,
    numberOfItems: input.items.length,
    itemListElement: input.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: `${origin}${item.path}`,
      description: item.description,
    })),
  }
}

export function webApplicationLd(input: {
  title: string
  description: string
  path: string
}) {
  const origin = siteOrigin()
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: input.title,
    description: input.description,
    url: `${origin}${input.path}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    inLanguage: 'zh-CN',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CNY',
    },
    publisher: organizationLd(),
  }
}
