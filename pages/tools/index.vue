<script setup lang="ts">
import { TOOLS_HUB, tools } from '~/data/tools'
import { breadcrumbLd, itemListLd } from '~/utils/jsonLd'

usePageSeo({
  title: TOOLS_HUB.title,
  seoTitle: TOOLS_HUB.seoTitle,
  description: TOOLS_HUB.description,
  path: TOOLS_HUB.path,
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(itemListLd({
        name: TOOLS_HUB.title,
        description: TOOLS_HUB.description,
        path: TOOLS_HUB.path,
        items: tools.map(tool => ({
          name: tool.title,
          path: tool.href,
          description: tool.description,
        })),
      })),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(breadcrumbLd([
        { name: '首页', path: '/' },
        { name: TOOLS_HUB.title, path: TOOLS_HUB.path },
      ])),
    },
  ],
})
</script>

<template>
  <div>
    <p class="text-sm text-moss">实用工具</p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight">实用工具</h1>
    <p class="mt-4 leading-8 text-stone-700">
      围绕建站常见操作整理，可查解析、看域名信息、Ping 测连通、查 IP 归属地，也可以做编解码、日历与房贷计算。
    </p>
    <ul class="mt-10 grid gap-4 md:grid-cols-2">
      <li v-for="tool in tools" :key="tool.slug" class="h-full">
        <NuxtLink
          :to="tool.href"
          class="block h-full rounded-2xl border border-stone-300/80 bg-white/60 px-5 py-4 transition hover:border-moss/50"
        >
          <p class="font-semibold">{{ tool.title }}</p>
          <p class="mt-1 text-sm leading-6 text-stone-600">{{ tool.description }}</p>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
