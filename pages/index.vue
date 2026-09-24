<script setup lang="ts">
import { SITE_DESCRIPTION } from '~/data/site'

definePageMeta({
  layout: 'home',
})

usePageSeo({
  title: 'ZZF｜爱分享的基建小站',
  description: SITE_DESCRIPTION,
  path: '/',
})
</script>

<template>
  <div class="w-full text-center">
    <h1 class="font-serif text-6xl leading-none tracking-tight sm:text-7xl md:text-8xl">
      <span class="block text-ink">ZZF</span>
      <span class="mt-1 block italic text-gold">笔记</span>
    </h1>
    <p class="mx-auto mt-8 max-w-xl text-sm leading-7 text-stone-600 sm:text-base">
      这里是爱分享的基建小站。从网站怎么上线、到 GitHub 自动更新、再到申请免费域名证书，完整步骤都在「网站部署」模块；免费域名、邮箱与购域等服务，则整理在「数字基建」模块。
    </p>
    <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
      <NuxtLink
        to="/digital-infra"
        class="rounded-full bg-gold px-5 py-2 text-sm font-medium text-night transition hover:bg-[#f0c44a]"
      >
        数字基建
      </NuxtLink>
      <NuxtLink
        to="/guides"
        class="rounded-full border border-stone-400 px-5 py-2 text-sm text-ink transition hover:border-ink"
      >
        网站部署
      </NuxtLink>
    </div>
  </div>
</template>
