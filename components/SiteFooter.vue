<script setup lang="ts">
import { ICP_NUMBER, ICP_URL } from '~/data/site'
</script>

<template>
  <footer class="mt-16 border-t border-stone-300/80">
    <div class="mx-auto flex max-w-3xl flex-col gap-2 px-5 py-8 text-sm text-stone-600">
      <p>个人技术笔记，仅供信息整理，不构成注册、购买或建站建议。</p>
      <a :href="ICP_URL" target="_blank" rel="noopener noreferrer" class="w-fit text-moss hover:underline">
        {{ ICP_NUMBER }}
      </a>
    </div>
  </footer>
</template>
