<script setup lang="ts">
const route = useRoute()
const isDark = ref(false)

const links = [
  { to: '/', label: '首页' },
  { to: '/digital-infra', label: '数字基建' },
  { to: '/guides', label: '网站部署' },
]

function isActive(path: string) {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path === path || route.path.startsWith(`${path}/`)
}

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
})

function toggleTheme() {
  isDark.value = !document.documentElement.classList.contains('dark')
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}
</script>

<template>
  <header
    class="site-header sticky top-0 z-30 border-b border-stone-300/80 backdrop-blur-md"
  >
    <div class="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
      <NuxtLink to="/" class="flex items-center gap-2 text-lg font-semibold tracking-tight text-ink">
        <img src="/logo.png" alt="" width="32" height="32" class="h-8 w-8">
        ZZF
      </NuxtLink>
      <div class="flex items-center gap-4 sm:gap-5">
        <nav class="flex items-center gap-1 text-sm">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="rounded-xl px-3 py-1.5 transition-colors"
            :class="isActive(link.to) ? 'nav-current' : 'text-stone-600 hover:text-ink'"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
        <SearchEntry />
        <button
          type="button"
          class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-stone-400 text-stone-600 transition hover:text-ink"
          :aria-label="isDark ? '切换浅色' : '切换深色'"
          @click="toggleTheme"
        >
          <svg class="theme-moon h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z" stroke-linejoin="round" />
          </svg>
          <svg class="theme-sun h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>
