<script setup lang="ts">
import { findGuide } from '~/data/guides'
import { articleLd, breadcrumbLd } from '~/utils/jsonLd'

const route = useRoute()
const post = findGuide(String(route.params.slug || ''), 'blog')

if (!post) {
  throw createError({ statusCode: 404, statusMessage: '页面不存在' })
}

const path = `/blog/${post.slug}`
usePageSeo({ title: post.title, description: post.description, path })
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(articleLd({ title: post.title, description: post.description, path, dateModified: post.updatedAt })),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(breadcrumbLd([
        { name: '首页', path: '/' },
        { name: '个人博客', path: '/blog' },
        { name: post.title, path },
      ])),
    },
  ],
})
</script>

<template>
  <article v-if="post">
    <p class="text-sm text-moss">个人博客</p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight">{{ post.title }}</h1>
    <p class="mt-3 text-sm text-stone-500">更新于 {{ post.updatedAt }}</p>
    <div class="mt-8">
      <ProseBlocks :blocks="post.blocks" />
    </div>
  </article>
</template>
