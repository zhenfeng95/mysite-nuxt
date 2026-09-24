<script setup lang="ts">
import { ICP_NUMBER, ICP_URL } from '~/data/site'
</script>

<template>
  <div class="home-screen relative flex min-h-screen flex-col">
    <SiteHeader />
    <div class="home-copy relative z-10 flex min-h-0 flex-1 flex-col">
      <div class="home-glow pointer-events-none absolute inset-0" />
      <div class="relative z-10 mx-auto flex w-full max-w-3xl flex-1 items-center justify-center px-5 py-8">
        <slot />
      </div>
      <footer class="relative z-10 mx-auto w-full max-w-3xl px-5 pb-16 text-center text-xs leading-5 text-stone-500">
        <p>个人技术笔记，仅供信息整理，不构成注册、购买或建站建议。</p>
        <a :href="ICP_URL" target="_blank" rel="noopener noreferrer" class="mt-1 inline-block text-moss hover:underline">
          {{ ICP_NUMBER }}
        </a>
      </footer>
      <svg
        class="pointer-events-none absolute bottom-0 left-0 z-10 h-24 w-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path class="home-wave" d="M0 78 C 240 112, 480 36, 720 68 S 1200 104, 1440 58" fill="none" stroke-width="1.2" />
        <path class="home-wave-gold" d="M0 96 C 300 58, 620 114, 920 78 S 1280 46, 1440 92" fill="none" stroke-width="1.2" />
        <path class="home-wave" d="M0 112 C 360 92, 760 124, 1100 98 S 1320 104, 1440 108" fill="none" stroke-width="1.2" />
      </svg>
    </div>
  </div>
</template>
