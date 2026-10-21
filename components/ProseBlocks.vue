<script setup lang="ts">
import type { Block, TextPart } from '~/data/guides'

defineProps<{ blocks: Block[] }>()

const copiedIndex = ref<number | null>(null)
let copiedTimer: ReturnType<typeof setTimeout> | undefined

function isLink(part: TextPart): part is { text: string; href: string } {
  return typeof part !== 'string'
}

function external(href: string) {
  return href.startsWith('http')
}

async function copyCode(text: string, index: number) {
  try {
    await navigator.clipboard.writeText(text)
  }
  catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }

  copiedIndex.value = index
  if (copiedTimer) {
    clearTimeout(copiedTimer)
  }
  copiedTimer = setTimeout(() => {
    copiedIndex.value = null
  }, 1600)
}

onBeforeUnmount(() => {
  if (copiedTimer) {
    clearTimeout(copiedTimer)
  }
})
</script>

<template>
  <div class="space-y-4 text-[17px] leading-8 text-stone-800">
    <template v-for="(block, index) in blocks" :key="index">
      <h2 v-if="block.type === 'h2'" class="pt-6 text-2xl font-semibold text-ink">
        {{ block.text }}
      </h2>
      <h3 v-else-if="block.type === 'h3'" class="pt-2 text-xl font-semibold text-ink">
        {{ block.text }}
      </h3>
      <h4 v-else-if="block.type === 'h4'" class="font-semibold text-ink">
        {{ block.text }}
      </h4>
      <p v-else-if="block.type === 'p'">
        <template v-for="(part, partIndex) in block.parts" :key="partIndex">
          <a
            v-if="isLink(part)"
            :href="part.href"
            class="text-moss underline decoration-moss/40 underline-offset-4 hover:decoration-moss"
            :target="external(part.href) ? '_blank' : undefined"
            :rel="external(part.href) ? 'noopener noreferrer' : undefined"
          >{{ part.text }}</a>
          <template v-else>{{ part }}</template>
        </template>
      </p>
      <blockquote v-else-if="block.type === 'quote'" class="border-l-2 border-moss/40 pl-4 text-stone-700">
        <template v-for="(part, partIndex) in block.parts" :key="partIndex">
          <a
            v-if="isLink(part)"
            :href="part.href"
            class="text-moss underline decoration-moss/40 underline-offset-4 hover:decoration-moss"
            :target="external(part.href) ? '_blank' : undefined"
            :rel="external(part.href) ? 'noopener noreferrer' : undefined"
          >{{ part.text }}</a>
          <template v-else>{{ part }}</template>
        </template>
      </blockquote>
      <ul v-else-if="block.type === 'ul'" class="list-disc space-y-2 pl-5">
        <li v-for="(item, itemIndex) in block.items" :key="itemIndex">
          <template v-if="typeof item === 'string'">{{ item }}</template>
          <template v-else>
            <template v-for="(part, partIndex) in item" :key="partIndex">
              <a
                v-if="isLink(part)"
                :href="part.href"
                class="text-moss underline decoration-moss/40 underline-offset-4 hover:decoration-moss"
                :target="external(part.href) ? '_blank' : undefined"
                :rel="external(part.href) ? 'noopener noreferrer' : undefined"
              >{{ part.text }}</a>
              <template v-else>{{ part }}</template>
            </template>
          </template>
        </li>
      </ul>
      <ol v-else-if="block.type === 'ol'" class="list-decimal space-y-2 pl-5">
        <li v-for="(item, itemIndex) in block.items" :key="itemIndex">
          <template v-if="typeof item === 'string'">{{ item }}</template>
          <template v-else>
            <template v-for="(part, partIndex) in item" :key="partIndex">
              <a
                v-if="isLink(part)"
                :href="part.href"
                class="text-moss underline decoration-moss/40 underline-offset-4 hover:decoration-moss"
                :target="external(part.href) ? '_blank' : undefined"
                :rel="external(part.href) ? 'noopener noreferrer' : undefined"
              >{{ part.text }}</a>
              <template v-else>{{ part }}</template>
            </template>
          </template>
        </li>
      </ol>
      <div
        v-else-if="block.type === 'code'"
        class="group relative overflow-hidden rounded-xl bg-ink"
      >
        <div class="flex items-center gap-3 px-4 pt-3">
          <p v-if="block.lang" class="text-xs tracking-wide text-stone-400">{{ block.lang }}</p>
          <button
            type="button"
            class="ml-auto rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-stone-300 opacity-100 transition hover:bg-white/10 hover:text-white sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            :aria-label="copiedIndex === index ? '已复制' : '复制代码'"
            @click="copyCode(block.text, index)"
          >
            {{ copiedIndex === index ? '已复制' : '复制' }}
          </button>
        </div>
        <pre class="overflow-x-auto px-4 py-3 font-mono text-sm leading-6 text-stone-100"><code>{{ block.text }}</code></pre>
      </div>
      <img
        v-else-if="block.type === 'img'"
        :src="block.src"
        :alt="block.alt"
        class="rounded-xl border border-stone-300/80"
        :class="block.fit === 'intrinsic' ? 'mx-auto h-auto w-auto max-w-full' : 'w-full'"
        loading="lazy"
      />
      <div
        v-else-if="block.type === 'imgs'"
        class="grid grid-cols-3 gap-2 sm:gap-3"
      >
        <img
          v-for="item in block.items"
          :key="item.src"
          :src="item.src"
          :alt="item.alt"
          class="w-full rounded-xl border border-stone-300/80"
          loading="lazy"
        />
      </div>
      <div v-else-if="block.type === 'table'" class="overflow-x-auto">
        <table class="w-full border-collapse text-left text-base">
          <thead>
            <tr class="border-b border-stone-300">
              <th
                v-for="header in block.headers"
                :key="header"
                class="py-2 pr-4 font-semibold text-ink"
              >
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in block.rows" :key="row.join('|')" class="border-b border-stone-200">
              <td v-for="cell in row" :key="cell" class="py-2 pr-4 align-top">{{ cell }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else-if="block.type === 'note'" class="rounded-xl bg-white/70 px-4 py-3 text-base text-stone-700">
        {{ block.text }}
      </p>
    </template>
  </div>
</template>
