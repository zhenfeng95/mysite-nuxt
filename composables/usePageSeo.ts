interface PageSeoInput {
  title: string
  description: string
  path: string
  noindex?: boolean
}

export function usePageSeo(input: PageSeoInput) {
  const config = useRuntimeConfig()
  const siteName = String(config.public.siteName || '真途')
  const origin = String(config.public.siteUrl).replace(/\/$/, '')
  const canonical = `${origin}${input.path === '/' ? '' : input.path}`
  const branded = input.path === '/' ? input.title : `${input.title}｜${siteName}`

  useSeoMeta({
    title: branded,
    description: input.description,
    ogTitle: branded,
    ogDescription: input.description,
    ogUrl: canonical || origin,
    ogType: input.path.startsWith('/guides/') || input.path.startsWith('/digital-infra/')
      ? 'article'
      : 'website',
    robots: input.noindex ? 'noindex, nofollow' : 'index, follow',
  })

  useHead({
    link: [{ rel: 'canonical', href: canonical || origin }],
  })
}
