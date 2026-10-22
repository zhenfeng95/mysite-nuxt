interface PageSeoInput {
  title: string
  description: string
  path: string
  noindex?: boolean
  /** Absolute or site-root path; defaults to /og-image.png */
  image?: string
}

export function usePageSeo(input: PageSeoInput) {
  const config = useRuntimeConfig()
  const siteName = String(config.public.siteName || '真途')
  const origin = String(config.public.siteUrl).replace(/\/$/, '')
  const canonical = `${origin}${input.path === '/' ? '' : input.path}`
  const branded = input.path === '/' ? input.title : `${input.title}｜${siteName}`
  const imagePath = input.image || '/og-image.png'
  const ogImage = imagePath.startsWith('http') ? imagePath : `${origin}${imagePath}`
  const isArticle =
    input.path.startsWith('/guides/')
    || input.path.startsWith('/digital-infra/')
    || input.path === '/side-hustle'

  useSeoMeta({
    title: branded,
    description: input.description,
    ogTitle: branded,
    ogDescription: input.description,
    ogUrl: canonical || origin,
    ogType: isArticle ? 'article' : 'website',
    ogImage,
    ogImageAlt: branded,
    ogSiteName: siteName,
    ogLocale: 'zh_CN',
    twitterCard: 'summary_large_image',
    twitterTitle: branded,
    twitterDescription: input.description,
    twitterImage: ogImage,
    robots: input.noindex ? 'noindex, nofollow' : 'index, follow',
  })

  useHead({
    link: [{ rel: 'canonical', href: canonical || origin }],
  })
}
