<script setup lang="ts">
import { guidePath, guides } from '~/data/guides'
import { breadcrumbLd, itemListLd } from '~/utils/jsonLd'

const title = '个人博客'
const description = '记录工作、生活和新行业的探索，以及继续折腾技术的过程。'
const path = '/blog'
const posts = guides.filter(guide => guide.kind === 'blog').sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

usePageSeo({ title, description, path })
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(itemListLd({
        name: title,
        description,
        path,
        items: posts.map(post => ({ name: post.title, path: guidePath(post), description: post.description })),
      })),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(breadcrumbLd([{ name: '首页', path: '/' }, { name: title, path }])),
    },
  ],
})
</script>

<template>
  <div>
    <p class="text-sm text-moss">个人博客</p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight">个人博客</h1>
    <p class="mt-4 leading-8 text-stone-700">{{ description }}</p>
    <ul class="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <li v-for="post in posts" :key="post.slug" class="h-full">
        <NuxtLink :to="guidePath(post)" class="block h-full rounded-2xl border border-stone-300/80 bg-white/60 px-5 py-4 transition hover:border-moss/50">
          <p class="text-xs text-stone-500">更新于 {{ post.updatedAt }}</p>
          <p class="mt-1 font-semibold">{{ post.title }}</p>
          <p class="mt-1 text-sm leading-6 text-stone-600">{{ post.description }}</p>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
