<script setup lang="ts">
import { guidePath, guides } from '~/data/guides'
import { breadcrumbLd, itemListLd } from '~/utils/jsonLd'

const title = '网站部署'
const seoTitle = '网站部署教程：上线、GitHub 自动更新与免费证书'
const description = '网站怎么跑起来、怎么从 GitHub 更新、怎么申请证书。域名、邮箱与免费建站相关内容在建站攻略页。'
const path = '/guides'
const stepGuides = guides.filter(guide => guide.kind === 'steps')

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
        items: stepGuides.map(guide => ({
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
    <p class="text-sm text-moss">网站部署</p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight">网站部署</h1>
    <p class="mt-4 leading-8 text-stone-700">
      网站怎么跑起来、怎么从 GitHub 更新、怎么申请证书。域名、邮箱与免费建站相关内容在建站攻略页。
    </p>
    <ul class="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <li v-for="guide in stepGuides" :key="guide.slug" class="h-full">
        <NuxtLink
          :to="`/guides/${guide.slug}`"
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
