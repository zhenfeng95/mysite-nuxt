<script setup lang="ts">
import { SITE_DESCRIPTION, SITE_NAME, SITE_SLOGAN, SISTER_SITES } from '~/data/site'

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
  <div class="flex min-h-0 w-full flex-1 flex-col">
    <section class="home-hero relative flex flex-1 items-center justify-center px-5 py-16">
      <div class="home-glow pointer-events-none absolute inset-0" />
      <div class="relative z-10 w-full max-w-3xl text-center">
        <h1 class="font-serif text-6xl leading-none tracking-tight sm:text-7xl md:text-8xl">
          <span class="block text-ink">{{ SITE_NAME }}</span>
          <span class="mt-3 block font-sans text-xl font-normal italic leading-snug tracking-normal text-gold sm:text-2xl md:text-3xl">
            {{ SITE_SLOGAN }}
          </span>
        </h1>
        <p class="mx-auto mt-8 max-w-xl text-sm leading-7 text-stone-500 sm:text-base">
          「建站攻略」整理域名、邮箱与 Cloudflare；「网站部署」写清上线、自动更新与免费证书。
        </p>
      </div>
    </section>

    <div class="mx-auto w-full max-w-md px-5 py-10 text-center">
      <p class="text-xs tracking-wide text-stone-400">
        更多入口
      </p>
      <div class="mt-3 flex flex-wrap items-stretch justify-center gap-x-8 gap-y-4">
        <a
          v-for="site in SISTER_SITES"
          :key="site.href"
          :href="site.href"
          target="_blank"
          rel="noopener noreferrer"
          class="group inline-flex flex-col items-center gap-0.5 text-sm text-ink transition hover:text-gold"
        >
          <span class="inline-flex items-center gap-1 font-medium">
            {{ site.name }}
            <svg
              class="h-3.5 w-3.5 text-stone-400 transition group-hover:text-gold"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              aria-hidden="true"
            >
              <path d="M7 17L17 7M9 7h8v8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <span class="text-xs text-stone-400 transition group-hover:text-stone-500">
            {{ site.blurb }}
          </span>
        </a>
      </div>
    </div>
  </div>
</template>
