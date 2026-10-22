<script setup lang="ts">
import { tools } from '~/data/tools'

usePageSeo({
  title: '实用工具',
  description: '实用工具：DNS 查询、域名粗查、在线 Ping、IP 归属地、编解码与日历等，配合站内教程使用。',
  path: '/tools',
})
</script>

<template>
  <div>
    <p class="text-sm text-moss">实用工具</p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight">实用工具</h1>
    <p class="mt-4 leading-8 text-stone-700">
      围绕建站常见操作整理，可查解析、看域名信息、Ping 测连通、查 IP 归属地，也可以做编解码和日历计算。
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
