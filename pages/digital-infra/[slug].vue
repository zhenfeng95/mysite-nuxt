<script setup lang="ts">
import { findGuide } from '~/data/guides'
import { SITE_NAME, SITE_URL } from '~/data/site'

const route = useRoute()
const slug = String(route.params.slug || '')
const guide = findGuide(slug, 'excerpt')

if (!guide) {
  throw createError({ statusCode: 404, statusMessage: '页面不存在' })
}

const path = `/digital-infra/${guide.slug}`

usePageSeo({
  title: guide.title,
  description: guide.description,
  path,
})

const origin = SITE_URL.replace(/\/$/, '')
const pageUrl = `${origin}${path}`
const publisher = {
  '@type': 'Organization',
  name: SITE_NAME,
  url: origin,
}

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: guide.title,
        description: guide.description,
        datePublished: guide.updatedAt,
        dateModified: guide.updatedAt,
        inLanguage: 'zh-CN',
        url: pageUrl,
        mainEntityOfPage: pageUrl,
        author: publisher,
        publisher,
      }),
    },
  ],
})
</script>

<template>
  <article v-if="guide">
    <p class="text-sm text-moss">数字基建</p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight">{{ guide.title }}</h1>
    <p class="mt-3 text-sm text-stone-500">更新于 {{ guide.updatedAt }}</p>
    <div class="mt-8">
      <ProseBlocks :blocks="guide.blocks" />
    </div>
    <aside v-if="guide.fullUrl" class="mt-10 rounded-2xl border border-moss/30 bg-white/70 px-5 py-4">
      <p class="font-semibold text-ink">查看全文</p>
      <p class="mt-1 text-sm leading-6 text-stone-600">
        截图、界面文案和更完整的步骤在 Zhen Invest。打开后停留在对应文章，不会自动跳转。
      </p>
      <a
        :href="guide.fullUrl"
        class="mt-3 inline-block text-moss underline decoration-moss/40 underline-offset-4 hover:decoration-moss"
      >
        在 Zhen Invest 阅读全文
      </a>
    </aside>
  </article>
</template>
