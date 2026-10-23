<script setup lang="ts">
import type { SearchResult } from '~/utils/search'
import { groupSearchResults, searchSite } from '~/utils/search'

const open = ref(false)
const query = ref('')
const activeIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)

const results = computed(() => searchSite(query.value))
const grouped = computed(() => groupSearchResults(results.value))

watch(query, () => {
  activeIndex.value = 0
})

watch(open, async (value) => {
  if (!import.meta.client) {
    return
  }
  document.body.style.overflow = value ? 'hidden' : ''
  if (value) {
    query.value = ''
    activeIndex.value = 0
    await nextTick()
    inputRef.value?.focus()
  }
})

function close() {
  open.value = false
}

function openSearch() {
  open.value = true
}

function selectResult(item: SearchResult) {
  close()
  if (item.to) {
    navigateTo(item.to)
    return
  }
  if (item.href && import.meta.client) {
    window.open(item.href, '_blank', 'noopener,noreferrer')
  }
}

function moveActive(delta: number) {
  const total = results.value.length
  if (!total) {
    activeIndex.value = 0
    return
  }
  activeIndex.value = (activeIndex.value + delta + total) % total
}

function onInputKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    moveActive(1)
    return
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    moveActive(-1)
    return
  }
  if (event.key === 'Enter') {
    const item = results.value[activeIndex.value]
    if (item) {
      event.preventDefault()
      selectResult(item)
    }
    return
  }
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
  }
}

function flatIndexOf(item: SearchResult) {
  return results.value.findIndex(entry => entry.id === item.id)
}

function onGlobalKeydown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    open.value = !open.value
  }
}

onMounted(() => {
  window.addEventListener('keydown', onGlobalKeydown)
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onGlobalKeydown)
})
</script>

<template>
  <div>
    <button
      type="button"
      class="header-icon-btn"
      aria-label="搜索"
      title="搜索（⌘K）"
      @click="openSearch"
    >
      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" stroke-linecap="round" />
      </svg>
    </button>

    <Teleport to="body">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 px-4 pt-[12vh] backdrop-blur-sm"
        @click.self="close"
      >
        <div
          class="flex max-h-[min(32rem,72vh)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-stone-300/80 bg-paper"
          role="dialog"
          aria-modal="true"
          aria-label="站内搜索"
        >
          <div class="flex items-center gap-3 border-b border-stone-300/80 px-4">
            <svg class="h-4 w-4 shrink-0 text-stone-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" stroke-linecap="round" />
            </svg>
            <input
              ref="inputRef"
              v-model="query"
              type="search"
              class="h-12 w-full bg-transparent text-sm text-ink outline-none placeholder:text-stone-400"
              placeholder="搜索部署与基建…"
              autocomplete="off"
              enterkeyhint="search"
              @keydown="onInputKeydown"
            >
            <button
              type="button"
              class="shrink-0 rounded-full p-1 text-stone-500 hover:text-ink"
              aria-label="关闭搜索"
              @click="close"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
              </svg>
            </button>
          </div>

          <div class="min-h-0 flex-1 overflow-y-auto p-2">
            <p v-if="!query.trim()" class="px-3 py-8 text-center text-sm text-stone-500">
              输入关键词，查找建站攻略与网站部署相关内容
            </p>
            <p v-else-if="!results.length" class="px-3 py-8 text-center text-sm text-stone-500">
              没有找到「{{ query.trim() }}」相关结果
            </p>
            <div v-for="section in grouped" :key="section.group" class="mb-2 last:mb-0">
              <p class="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-stone-500">
                {{ section.label }}
              </p>
              <ul>
                <li v-for="item in section.items" :key="item.id">
                  <button
                    type="button"
                    class="flex w-full flex-col rounded-xl px-3 py-2.5 text-left transition"
                    :class="flatIndexOf(item) === activeIndex ? 'search-active' : 'text-stone-700 hover:bg-stone-200/70'"
                    @click="selectResult(item)"
                    @mouseenter="activeIndex = flatIndexOf(item)"
                  >
                    <span class="flex items-center justify-between gap-3">
                      <span class="truncate text-sm font-medium">{{ item.title }}</span>
                      <span v-if="item.meta" class="shrink-0 text-[11px] opacity-60">{{ item.meta }}</span>
                    </span>
                    <span class="mt-0.5 line-clamp-1 text-xs opacity-60">{{ item.description }}</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div class="flex items-center gap-3 border-t border-stone-300/80 px-4 py-2.5 text-[11px] text-stone-500">
            <span>↑↓ 选择</span>
            <span>↵ 打开</span>
            <span>Esc 关闭</span>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
