<script setup lang="ts">
import { SITE_NAME } from '~/data/site'

const route = useRoute()
const isDark = ref(false)
const menuOpen = ref(false)

const links = [
  { to: '/', label: '首页' },
  { to: '/digital-infra', label: '建站攻略' },
  { to: '/guides', label: '网站部署' },
  { to: '/side-hustle', label: '副业变现' },
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

watch(() => route.path, () => {
  menuOpen.value = false
})

watch(menuOpen, (value) => {
  if (!import.meta.client) {
    return
  }
  document.body.style.overflow = value ? 'hidden' : ''
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})

function toggleTheme() {
  isDark.value = !document.documentElement.classList.contains('dark')
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}
</script>

<template>
  <header
    class="site-header sticky top-0 z-30 border-b border-stone-300/80 backdrop-blur-md"
  >
    <div class="mx-auto flex max-w-[72rem] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <NuxtLink to="/" class="flex items-center gap-2 text-lg font-semibold tracking-tight text-ink">
        <img src="/logo.png" alt="" width="32" height="32" class="h-8 w-8">
        {{ SITE_NAME }}
      </NuxtLink>

      <div class="flex items-center gap-2.5 sm:gap-5">
        <nav class="hidden items-center gap-1 text-sm sm:flex">
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
          class="header-icon-btn"
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

        <button
          type="button"
          class="header-icon-btn sm:hidden"
          :aria-label="menuOpen ? '关闭菜单' : '打开菜单'"
          :aria-expanded="menuOpen"
          @click="toggleMenu"
        >
          <svg v-if="!menuOpen" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round" />
          </svg>
          <svg v-else class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="menuOpen"
        class="fixed inset-0 z-40 sm:hidden"
      >
        <button
          type="button"
          class="absolute inset-0 bg-ink/30 backdrop-blur-sm"
          aria-label="关闭菜单"
          @click="closeMenu"
        />
        <nav
          class="absolute inset-x-0 top-[4.25rem] mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8"
          aria-label="移动端导航"
        >
          <div class="overflow-hidden rounded-2xl border border-stone-300/80 bg-paper shadow-lg">
            <NuxtLink
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              class="block border-b border-stone-200 px-4 py-3.5 text-sm last:border-b-0"
              :class="isActive(link.to) ? 'nav-current' : 'text-stone-700'"
              @click="closeMenu"
            >
              {{ link.label }}
            </NuxtLink>
          </div>
        </nav>
      </div>
    </Teleport>
  </header>
</template>
