import { SITE_URL } from '~/data/site'

export default defineEventHandler((event) => {
  const origin = SITE_URL.replace(/\/$/, '')
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`
})
