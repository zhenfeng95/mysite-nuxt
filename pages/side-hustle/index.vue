<script setup lang="ts">
import { guidePath, guides } from '~/data/guides'
import { breadcrumbLd, itemListLd } from '~/utils/jsonLd'

const title = '副业变现'
const seoTitle = '副业变现：地推网推接单、指纹浏览器等实践笔记'
const description = '整理地推、网推接单与指纹浏览器等多账号工具的实践笔记，后续会继续补充更多教程。'
const path = '/side-hustle'
const sideGuides = guides.filter(guide => guide.kind === 'side')

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
        items: sideGuides.map(guide => ({
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
    <p class="text-sm text-moss">副业变现</p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight">副业变现</h1>
    <p class="mt-4 leading-8 text-stone-700">
      整理地推、网推接单，以及指纹浏览器等多账号环境工具的实践笔记，后续会继续补充更多教程。
    </p>
    <ul class="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <li v-for="guide in sideGuides" :key="guide.slug" class="h-full">
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
