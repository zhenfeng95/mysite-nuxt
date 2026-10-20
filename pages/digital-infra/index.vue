<script setup lang="ts">
import { infraEntries } from '~/data/entries'

usePageSeo({
  title: '基建服务',
  description: 'Google Workspace、Spaceship、Cloudflare、DNSHE 与 OquMail 的官网入口与图文教程。',
  path: '/digital-infra',
})
</script>

<template>
  <div>
    <p class="text-sm text-moss">建站攻略</p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight">基建服务</h1>
    <p class="mt-4 leading-8 text-stone-700">
      域名、邮箱与免费建站相关基建服务的官网入口，以及对应图文教程。
    </p>
    <ul class="mt-8 space-y-4">
      <li
        v-for="entry in infraEntries"
        :key="entry.id"
        class="rounded-2xl border border-stone-300/80 bg-white/60 px-5 py-4"
      >
        <div class="flex flex-wrap items-baseline justify-between gap-2">
          <h2 class="text-lg font-semibold">{{ entry.name }}</h2>
          <ul class="flex flex-wrap gap-2">
            <li
              v-for="tag in entry.tags"
              :key="tag"
              class="rounded-full bg-stone-200/70 px-2 py-0.5 text-xs text-stone-600"
            >
              {{ tag }}
            </li>
          </ul>
        </div>
        <p class="mt-2 leading-7 text-stone-700">{{ entry.description }}</p>
        <div class="mt-3 flex flex-wrap gap-4 text-sm">
          <NuxtLink
            v-if="entry.guideSlug"
            :to="`/digital-infra/${entry.guideSlug}`"
            class="text-moss hover:underline"
          >
            {{ entry.guideLabel }}
          </NuxtLink>
          <a
            :href="entry.url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-stone-500 hover:text-stone-700 hover:underline"
          >
            官方网站
          </a>
        </div>
      </li>
    </ul>
  </div>
</template>
