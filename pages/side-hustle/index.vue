<script setup lang="ts">
import { findGuide } from '~/data/guides'
import { SITE_NAME, SITE_URL } from '~/data/site'

const guide = findGuide('rentuibang-guide', 'side')

if (!guide) {
  throw createError({ statusCode: 404, statusMessage: '页面不存在' })
}

const path = '/side-hustle'

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
    <p class="text-sm text-moss">副业变现</p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight">{{ guide.title }}</h1>
    <p class="mt-3 text-sm text-stone-500">更新于 {{ guide.updatedAt }}</p>
    <div class="mt-8">
      <ProseBlocks :blocks="guide.blocks" />
    </div>
  </article>
</template>
