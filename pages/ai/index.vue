<script setup lang="ts">
import { guidePath, guides } from '~/data/guides'
import { breadcrumbLd, itemListLd } from '~/utils/jsonLd'

const title = 'AI 笔记'
const seoTitle = 'AI 笔记：Cursor、Obsidian 与知识库实践'
const description = '整理用 Cursor、Obsidian 把本地笔记接成可读写知识库的步骤，后续会继续补充同类实践。'
const path = '/ai'
const aiGuides = guides.filter(guide => guide.kind === 'ai')

usePageSeo({
  title,
  seoTitle,
  description,
  path,
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(itemListLd({
        name: title,
        description,
        path,
        items: aiGuides.map(guide => ({
          name: guide.title,
          path: guidePath(guide),
          description: guide.description,
        })),
      })),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(breadcrumbLd([
        { name: '首页', path: '/' },
        { name: title, path },
      ])),
    },
  ],
})
</script>

<template>
  <div>
    <p class="text-sm text-moss">AI 笔记</p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight">AI 笔记</h1>
    <p class="mt-4 leading-8 text-stone-700">
      整理用 Cursor、Obsidian 把本地笔记接成可读写知识库的步骤，后续会继续补充同类实践。
    </p>
    <ul class="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <li v-for="guide in aiGuides" :key="guide.slug" class="h-full">
        <NuxtLink
          :to="guidePath(guide)"
          class="block h-full rounded-2xl border border-stone-300/80 bg-white/60 px-5 py-4 transition hover:border-moss/50"
        >
          <p class="text-xs text-stone-500">更新于 {{ guide.updatedAt }}</p>
          <p class="mt-1 font-semibold">{{ guide.title }}</p>
          <p class="mt-1 text-sm leading-6 text-stone-600">{{ guide.description }}</p>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
