<script setup lang="ts">
import { findGuide } from '~/data/guides'
import { articleLd, breadcrumbLd } from '~/utils/jsonLd'

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

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(articleLd({
        title: guide.title,
        description: guide.description,
        path,
        dateModified: guide.updatedAt,
      })),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(breadcrumbLd([
        { name: '首页', path: '/' },
        { name: '建站攻略', path: '/digital-infra' },
        { name: guide.title, path },
      ])),
    },
  ],
})
</script>

<template>
  <article v-if="guide">
    <p class="text-sm text-moss">建站攻略</p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight">{{ guide.title }}</h1>
    <p class="mt-3 text-sm text-stone-500">更新于 {{ guide.updatedAt }}</p>
    <div class="mt-8">
      <ProseBlocks :blocks="guide.blocks" />
    </div>
  </article>
</template>
