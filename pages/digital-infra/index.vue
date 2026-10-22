<script setup lang="ts">
import { infraEntries, infraGroups } from '~/data/entries'
import { breadcrumbLd, itemListLd } from '~/utils/jsonLd'

const title = '建站攻略'
const seoTitle = '建站攻略：域名、邮箱与 Cloudflare 等服务教程'
const description =
  '按域名、邮箱、建站分类整理 Google Workspace、Spaceship、DNSHE、OquMail 与 Cloudflare 的官网入口和图文教程。'
const path = '/digital-infra'

usePageSeo({
  title,
  seoTitle,
  description,
  path,
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(itemListLd({
        name: title,
        description,
        path,
        items: infraEntries
          .filter(entry => entry.guideSlug)
          .map(entry => ({
            name: entry.name,
            path: `/digital-infra/${entry.guideSlug}`,
            description: entry.description,
          })),
      })),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(breadcrumbLd([
        { name: '首页', path: '/' },
        { name: title, path },
      ])),
    },
  ],
})
</script>

<template>
  <div>
    <p class="text-sm text-moss">建站攻略</p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight">建站攻略</h1>
    <p class="mt-4 leading-8 text-stone-700">
      按域名、邮箱和建站分类，整理相关服务的官网入口和图文教程。
    </p>
    <section
      v-for="group in infraGroups"
      :key="group.id"
      class="mt-10"
    >
      <h2 class="text-xl font-semibold tracking-tight">{{ group.title }}</h2>
      <p class="mt-1 text-sm leading-6 text-stone-500">{{ group.description }}</p>
      <ul
        class="mt-4 grid gap-4"
        :class="group.entries.length > 1 ? 'md:grid-cols-2 xl:grid-cols-3' : ''"
      >
        <li
          v-for="entry in group.entries"
          :key="entry.id"
          class="flex h-full flex-col rounded-2xl border border-stone-300/80 bg-white/60 px-5 py-4"
        >
          <div class="flex flex-wrap items-baseline justify-between gap-2">
            <h3 class="text-lg font-semibold">{{ entry.name }}</h3>
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
          <div class="mt-auto flex flex-wrap gap-4 pt-3 text-sm">
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
    </section>
  </div>
</template>
