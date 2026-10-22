import { findTool } from '~/data/tools'
import { breadcrumbLd, webApplicationLd } from '~/utils/jsonLd'

export function useToolSeo(slug: string) {
  const tool = findTool(slug)
  if (!tool) {
    throw createError({ statusCode: 404, statusMessage: '页面不存在' })
  }

  usePageSeo({
    title: tool.title,
    seoTitle: tool.seoTitle,
    description: tool.description,
    path: tool.href,
  })

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(webApplicationLd({
          title: tool.seoTitle,
          description: tool.description,
          path: tool.href,
        })),
      },
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(breadcrumbLd([
          { name: '首页', path: '/' },
          { name: '实用工具', path: '/tools' },
          { name: tool.title, path: tool.href },
        ])),
      },
    ],
  })

  return tool
}
