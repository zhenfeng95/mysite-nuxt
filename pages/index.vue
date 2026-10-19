<script setup lang="ts">
import { SITE_DESCRIPTION, SITE_NAME, SITE_SLOGAN } from '~/data/site'

definePageMeta({
  layout: 'home',
})

usePageSeo({
  title: `${SITE_NAME}｜${SITE_SLOGAN}`,
  description: SITE_DESCRIPTION,
  path: '/',
})
</script>

<template>
  <div class="w-full text-center">
    <h1 class="font-serif text-6xl leading-none tracking-tight sm:text-7xl md:text-8xl">
      <span class="block text-ink">{{ SITE_NAME }}</span>
      <span class="mt-3 block font-sans text-xl font-normal italic leading-snug tracking-normal text-gold sm:text-2xl md:text-3xl">
        {{ SITE_SLOGAN }}
      </span>
    </h1>
    <p class="mx-auto mt-8 max-w-xl text-sm leading-7 text-stone-500 sm:text-base">
      从网站怎么上线、到 GitHub 自动更新、再到申请免费域名证书，完整步骤都在「网站部署」模块；免费域名、邮箱与购域等服务，则整理在「数字基建」模块。
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
