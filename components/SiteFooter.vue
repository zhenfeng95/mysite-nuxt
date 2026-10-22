<script setup lang="ts">
import { SITE_DISCLAIMER, SITE_NAME, SITE_SLOGAN } from '~/data/site'

const year = new Date().getFullYear()

const siteLinks = [
  { to: '/about', label: '关于我们' },
  { to: '/contact', label: '联系我们' },
] as const

const topicLinks = [
  { to: '/digital-infra', label: '建站攻略' },
  { to: '/guides', label: '网站部署' },
  { to: '/tools', label: '实用工具' },
  { to: '/side-hustle', label: '副业变现' },
] as const
</script>

<template>
  <footer class="mt-16 border-t border-stone-300/80 bg-stone-200/40">
    <div class="mx-auto max-w-[72rem] px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,0.85fr)_minmax(0,0.85fr)] lg:gap-16">
        <div class="sm:col-span-2 lg:col-span-1">
          <NuxtLink to="/" class="inline-flex items-center gap-2 text-base font-semibold leading-none tracking-tight text-ink">
            <img src="/logo.png" alt="" width="28" height="28" class="block h-7 w-7 shrink-0 object-contain">
            <span class="leading-none">{{ SITE_NAME }}</span>
          </NuxtLink>
          <p class="mt-3 max-w-md text-sm leading-7 text-stone-500">
            {{ SITE_SLOGAN }}。建站攻略整理域名、邮箱与 Cloudflare；网站部署写清上线、自动更新与免费证书。
          </p>
        </div>

        <div>
          <p class="text-sm font-semibold text-ink">{{ SITE_NAME }}</p>
          <ul class="mt-4 space-y-2.5 text-sm text-stone-500">
            <li v-for="link in siteLinks" :key="link.to">
              <NuxtLink :to="link.to" class="transition hover:text-ink">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <p class="text-sm font-semibold text-ink">内容分类</p>
          <ul class="mt-4 space-y-2.5 text-sm text-stone-500">
            <li v-for="link in topicLinks" :key="link.to">
              <NuxtLink :to="link.to" class="transition hover:text-ink">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-10 border-t border-stone-300/70 pt-6 text-xs leading-6 text-stone-500">
        <p>© {{ year }} {{ SITE_NAME }}</p>
        <p class="mt-2">{{ SITE_DISCLAIMER }}</p>
      </div>
    </div>
  </footer>
</template>
