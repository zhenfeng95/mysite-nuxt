<script setup lang="ts">
import { TOOLS_HUB, toolGroups, tools } from '~/data/tools'
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
      围绕建站与日常使用整理：网络排查、效率计算（含二维码生成）、专注减压，以及捏泡泡、木鱼、赛博抽签等小游戏。
    </p>

    <section
      v-for="(group, index) in toolGroups"
      :key="group.id"
      :class="index === 0 ? 'mt-10' : 'mt-12'"
    >
      <h2 class="text-xl font-semibold tracking-tight text-ink">{{ group.title }}</h2>
      <p v-if="group.description" class="mt-2 text-sm leading-6 text-stone-600">
        {{ group.description }}
      </p>
      <ul class="mt-5 grid gap-4 md:grid-cols-2">
        <li v-for="tool in group.tools" :key="tool.slug" class="h-full">
          <NuxtLink
            :to="tool.href"
            class="block h-full rounded-2xl border border-stone-300/80 bg-white/60 px-5 py-4 transition hover:border-moss/50"
          >
            <p class="font-semibold">{{ tool.title }}</p>
            <p class="mt-1 text-sm leading-6 text-stone-600">{{ tool.description }}</p>
          </NuxtLink>
        </li>
      </ul>
    </section>
  </div>
</template>
