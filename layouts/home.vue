<script setup lang="ts">
import { SITE_DISCLAIMER } from '~/data/site'
</script>

<template>
  <div class="home-screen relative flex min-h-screen flex-col">
    <SiteHeader />
    <div class="relative z-10 flex min-h-0 flex-1 flex-col">
      <div class="relative z-10 flex min-h-0 flex-1 flex-col">
        <slot />
      </div>
      <footer class="relative z-10 mx-auto w-full max-w-[72rem] px-4 pb-16 pt-8 text-center text-xs leading-5 text-stone-500 sm:px-6 lg:px-8">
        <nav class="mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2" aria-label="页脚导航">
          <NuxtLink to="/about" class="hover:text-ink">关于我们</NuxtLink>
          <NuxtLink to="/contact" class="hover:text-ink">联系我们</NuxtLink>
        </nav>
        <p>{{ SITE_DISCLAIMER }}</p>
      </footer>
    </div>
  </div>
</template>
