import { guidePath, guides } from '~/data/guides'
import { SITE_URL } from '~/data/site'
import { tools } from '~/data/tools'

function latestUpdate() {
  return guides.map(guide => guide.updatedAt).sort().at(-1) ?? new Date().toISOString().slice(0, 10)
}

export default defineEventHandler((event) => {
  const origin = SITE_URL.replace(/\/$/, '')
  const siteUpdatedAt = latestUpdate()

  const staticPaths = [
    '/',
    '/digital-infra',
    '/guides',
    '/tools',
    '/side-hustle',
    '/about',
    '/contact',
  ]

  const urls = [
    ...staticPaths.map(path => ({ path, lastmod: siteUpdatedAt })),
    ...tools.map(tool => ({ path: tool.href, lastmod: siteUpdatedAt })),
    ...guides.map(guide => ({
      path: guidePath(guide),
      lastmod: guide.updatedAt,
    })),
  ]

  // Deduplicate hubs that also appear via guidePath / tools
  const seen = new Set<string>()
  const unique = urls.filter(({ path }) => {
    if (seen.has(path)) {
      return false
    }
    seen.add(path)
    return true
  })

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...unique.map(({ path, lastmod }) => [
      '  <url>',
      `    <loc>${path === '/' ? origin : `${origin}${path}`}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      '  </url>',
    ].join('\n')),
    '</urlset>',
    '',
  ].join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=3600')
  return body
})
