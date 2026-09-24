<script setup lang="ts">
import { guides } from '~/data/guides'

usePageSeo({
  title: '部署步骤',
  description: '网站怎么跑起来、怎么从 GitHub 更新、怎么申请证书。步骤写在本站。',
  path: '/guides',
})

const stepGuides = guides.filter(guide => guide.kind === 'steps')
</script>

<template>
  <div>
    <p class="text-sm text-moss">网站部署</p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight">部署步骤</h1>
    <p class="mt-4 leading-8 text-stone-700">
      网站怎么跑起来、怎么从 GitHub 更新、怎么申请证书。域名与邮箱相关的基建服务在数字基建页。
    </p>
    <ul class="mt-10 space-y-4">
      <li v-for="guide in stepGuides" :key="guide.slug">
        <NuxtLink
          :to="`/guides/${guide.slug}`"
          class="block rounded-2xl border border-stone-300/80 bg-white/60 px-5 py-4 transition hover:border-moss/50"
        >
          <p class="text-xs text-stone-500">更新于 {{ guide.updatedAt }}</p>
          <p class="mt-1 font-semibold">{{ guide.title }}</p>
          <p class="mt-1 text-sm leading-6 text-stone-600">{{ guide.description }}</p>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
