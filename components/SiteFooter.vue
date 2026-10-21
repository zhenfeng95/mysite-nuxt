<script setup lang="ts">
import { SITE_DISCLAIMER, SITE_NAME } from '~/data/site'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-16 border-t border-stone-300/80">
    <div class="mx-auto flex max-w-[72rem] flex-col gap-4 px-4 py-8 text-sm text-stone-600 sm:px-6 lg:px-8">
      <nav class="flex flex-wrap gap-x-4 gap-y-2" aria-label="页脚导航">
        <NuxtLink to="/about" class="hover:text-ink">关于我们</NuxtLink>
        <NuxtLink to="/contact" class="hover:text-ink">联系我们</NuxtLink>
        <NuxtLink to="/digital-infra" class="hover:text-ink">建站攻略</NuxtLink>
        <NuxtLink to="/guides" class="hover:text-ink">网站部署</NuxtLink>
        <NuxtLink to="/side-hustle" class="hover:text-ink">副业变现</NuxtLink>
      </nav>
      <p class="text-xs text-stone-500">© {{ year }} {{ SITE_NAME }}</p>
      <p>{{ SITE_DISCLAIMER }}</p>
    </div>
  </footer>
</template>
