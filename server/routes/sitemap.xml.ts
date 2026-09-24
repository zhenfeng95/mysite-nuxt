import { guidePath, guides } from '~/data/guides'
import { SITE_URL } from '~/data/site'

function latestUpdate() {
  return guides.map(guide => guide.updatedAt).sort().at(-1) ?? ''
}

export default defineEventHandler((event) => {
  const origin = SITE_URL.replace(/\/$/, '')
  const siteUpdatedAt = latestUpdate()
  const urls = [
    { path: '/', lastmod: siteUpdatedAt },
    { path: '/digital-infra', lastmod: siteUpdatedAt },
    { path: '/guides', lastmod: siteUpdatedAt },
    ...guides.map(guide => ({
      path: guidePath(guide),
      lastmod: guide.updatedAt,
    })),
  ]

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(({ path, lastmod }) => [
      '  <url>',
      `    <loc>${path === '/' ? origin : `${origin}${path}`}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      '  </url>',
    ].join('\n')),
    '</urlset>',
    '',
  ].join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return body
})
