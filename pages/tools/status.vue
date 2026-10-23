<script setup lang="ts">
const tool = useToolSeo('status')

type SiteStatusKind = 'online' | 'reachable' | 'error' | 'offline'

interface StatusResponse {
  input: string
  url: string
  finalUrl: string
  host: string
  ip: string
  online: boolean
  kind: SiteStatusKind
  statusCode: number | null
  statusText: string
  timeMs: number
  redirected: boolean
  redirects: string[]
  error: string | null
  checkedAt: string
}

const url = ref('')
const loading = ref(false)
const checkError = ref('')
const result = ref<StatusResponse | null>(null)

const kindMeta: Record<SiteStatusKind, { label: string; className: string }> = {
  online: { label: '正常访问', className: 'border-emerald-300/80 bg-emerald-50 text-emerald-900' },
  reachable: { label: '能连通，但页面异常', className: 'border-amber-300/80 bg-amber-50 text-amber-950' },
  error: { label: '站点返回错误', className: 'border-red-300/80 bg-red-50 text-red-900' },
  offline: { label: '无法访问', className: 'border-red-300/80 bg-red-50 text-red-900' },
}

const summary = computed(() => {
  if (!result.value) {
    return null
  }
  return kindMeta[result.value.kind]
})

const detailRows = computed(() => {
  if (!result.value) {
    return []
  }
  return [
    { label: 'HTTP 状态', value: result.value.statusCode === null ? '—' : `${result.value.statusCode}${result.value.statusText ? ` ${result.value.statusText}` : ''}` },
    { label: '响应耗时', value: `${result.value.timeMs.toFixed(1)} ms` },
    { label: '解析 IP', value: result.value.ip },
    { label: '检测时间', value: formatTime(result.value.checkedAt) },
  ]
})

function formatTime(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return iso
  }
  return date.toLocaleString('zh-CN', { hour12: false })
}

async function runCheck() {
  const value = url.value.trim()
  if (!value) {
    checkError.value = '请先输入网址或域名'
    result.value = null
    return
  }

  loading.value = true
  checkError.value = ''
  result.value = null

  try {
    result.value = await $fetch<StatusResponse>('/api/status', {
      query: { url: value },
    })
  }
  catch (error: unknown) {
    const err = error as {
      data?: { statusMessage?: string, message?: string }
      statusMessage?: string
      message?: string
    }
    checkError.value
      = err?.data?.message
        || err?.data?.statusMessage
        || err?.message
        || '检测失败，请稍后重试'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <p class="text-sm text-moss">
      <NuxtLink to="/tools" class="hover:underline">实用工具</NuxtLink>
      <span class="mx-1.5 text-stone-400">/</span>
      网站状态
    </p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight">{{ tool.title }}</h1>
    <p class="mt-4 max-w-3xl leading-8 text-stone-700">
      输入网址或域名，从本站服务器发起一次 HTTP 请求，看目标能不能打开、状态码是多少、大概耗时多久。适合快速确认站点是否宕机。
    </p>

    <form class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end" @submit.prevent="runCheck">
      <label class="min-w-0 flex-1">
        <span class="mb-1.5 block text-sm text-stone-600">网址或域名</span>
        <input
          v-model="url"
          type="text"
          name="url"
          autocomplete="off"
          spellcheck="false"
          placeholder="https://example.com 或 example.com"
          class="w-full rounded-xl border border-stone-300/80 bg-white/70 px-3 py-2.5 text-ink outline-none ring-moss/30 placeholder:text-stone-400 focus:ring-2"
        >
      </label>
      <button
        type="submit"
        class="rounded-xl bg-moss px-5 py-2.5 text-sm font-medium text-white transition hover:bg-moss/90 disabled:opacity-60"
        :disabled="loading"
      >
        {{ loading ? '检测中…' : '开始检测' }}
      </button>
    </form>

    <p v-if="checkError" class="mt-4 text-sm text-red-700">
      {{ checkError }}
    </p>

    <div v-else-if="result && summary" class="mt-6">
      <div
        class="rounded-2xl border px-4 py-3 text-sm font-medium"
        :class="summary.className"
      >
        {{ summary.label }}
        <span v-if="result.statusCode !== null" class="ml-2 font-mono font-normal opacity-80">
          HTTP {{ result.statusCode }}
        </span>
      </div>

      <dl class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div
          v-for="item in detailRows"
          :key="item.label"
          class="rounded-xl border border-stone-300/80 bg-white/60 px-3 py-2.5"
        >
          <dt class="text-xs text-stone-500">{{ item.label }}</dt>
          <dd class="mt-1 break-all text-sm font-semibold text-ink">{{ item.value }}</dd>
        </div>
      </dl>

      <div class="mt-4 space-y-2 text-sm leading-7 text-stone-600">
        <p>
          <span class="text-stone-500">请求地址</span>
          <span class="mx-2 text-stone-400">·</span>
          <span class="font-mono text-stone-800">{{ result.url }}</span>
        </p>
        <p v-if="result.redirected">
          <span class="text-stone-500">最终地址</span>
          <span class="mx-2 text-stone-400">·</span>
          <span class="font-mono text-stone-800">{{ result.finalUrl }}</span>
        </p>
        <p v-if="result.redirects.length">
          <span class="text-stone-500">重定向</span>
          <span class="mx-2 text-stone-400">·</span>
          <span class="font-mono text-stone-800">{{ result.redirects.join(' → ') }}</span>
        </p>
      </div>
    </div>

    <p class="mt-10 text-sm leading-7 text-stone-500">
      检测从网站服务器发出，只反映服务器到目标的连通情况，不代表你本机网络。不探测内网与保留地址；未写协议时默认按 https 访问。想测延迟与丢包可用
      <NuxtLink to="/tools/ping" class="text-moss hover:underline">在线 Ping</NuxtLink>
      ；想看解析可用
      <NuxtLink to="/tools/dns" class="text-moss hover:underline">DNS 查询</NuxtLink>
      。
    </p>
  </div>
</template>
