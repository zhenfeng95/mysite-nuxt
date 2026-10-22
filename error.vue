<script setup lang="ts">
import { SITE_DESCRIPTION } from '~/data/site'

const error = useError()

usePageSeo({
  title: '页面不存在',
  seoTitle: '页面不存在：这个地址没有对应的笔记',
  description: '这个地址没有对应的笔记。',
  path: '/404',
  noindex: true,
})

function goHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <NuxtLayout>
    <p class="text-sm text-moss">{{ error?.statusCode || 404 }}</p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight">这个页面不存在</h1>
    <p class="mt-4 leading-7 text-stone-700">{{ SITE_DESCRIPTION }}</p>
    <button type="button" class="mt-6 text-moss underline underline-offset-4" @click="goHome">
      回到首页
    </button>
  </NuxtLayout>
</template>
