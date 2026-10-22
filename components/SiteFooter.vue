<script setup lang="ts">
import { SITE_DISCLAIMER, SITE_NAME, SITE_SLOGAN, SISTER_SITES } from '~/data/site'

const year = new Date().getFullYear()
const InternalLink = resolveComponent('NuxtLink')

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

function isExternal(href: string) {
  return href.startsWith('http')
}
</script>

<template>
  <footer class="mt-16 border-t border-stone-300/80 bg-stone-200/40">
    <div class="mx-auto max-w-[72rem] px-4 py-12 sm:px-6 lg:px-8">
      <div class="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
        <div class="max-w-md shrink-0">
          <NuxtLink to="/" class="inline-flex items-center gap-2 text-base font-semibold leading-none tracking-tight text-ink">
            <img src="/logo.png" alt="" width="28" height="28" class="block h-7 w-7 shrink-0 object-contain">
            <span class="leading-none">{{ SITE_NAME }}</span>
          </NuxtLink>
          <p class="mt-3 text-sm leading-7 text-stone-500">
            {{ SITE_SLOGAN }}。建站攻略整理域名、邮箱与 Cloudflare；网站部署写清上线、自动更新与免费证书。
          </p>
        </div>

        <div class="grid grid-cols-2 gap-x-12 gap-y-8 sm:grid-cols-3 sm:gap-x-20 lg:shrink-0 lg:gap-x-24">
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

          <div>
            <p class="text-sm font-semibold text-ink">更多入口</p>
            <ul class="mt-4 space-y-2.5 text-sm text-stone-500">
              <li v-for="site in SISTER_SITES" :key="site.href">
                <component
                  :is="isExternal(site.href) ? 'a' : InternalLink"
                  v-bind="isExternal(site.href) ? { href: site.href, target: '_blank', rel: 'noopener noreferrer' } : { to: site.href }"
                  class="group inline-flex items-center gap-1 transition hover:text-ink"
                >
                  {{ site.name }}
                  <svg
                    v-if="isExternal(site.href)"
                    class="h-3.5 w-3.5 shrink-0 text-stone-400 transition group-hover:text-ink"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    aria-hidden="true"
                  >
                    <path d="M7 17L17 7M9 7h8v8" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </component>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mt-10 border-t border-stone-300/70 pt-6 text-xs leading-6 text-stone-500">
        <p>© {{ year }} {{ SITE_NAME }}</p>
        <p class="mt-2">{{ SITE_DISCLAIMER }}</p>
      </div>
    </div>
  </footer>
</template>
