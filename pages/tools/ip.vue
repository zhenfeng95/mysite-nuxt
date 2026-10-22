<script setup lang="ts">
const tool = useToolSeo('ip')

interface IpResponse {
  host: string
  ip: string
  location: string
  isp: string
  org: string
  asn: string
  timezone: string
  self: boolean
}

const host = ref('')
const pending = ref<'' | 'host' | 'self'>('')
const lookupError = ref('')
const result = ref<IpResponse | null>(null)
const copied = ref(false)
let copiedTimer: ReturnType<typeof setTimeout> | undefined

const rows = computed(() => {
  if (!result.value) {
    return []
  }
  return [
    { label: 'IP', value: result.value.ip, mono: true },
    { label: '归属地', value: result.value.location, mono: false },
    { label: '运营商', value: result.value.isp, mono: false },
    { label: '组织', value: result.value.org, mono: false },
    { label: 'ASN', value: result.value.asn, mono: true },
    { label: '时区', value: result.value.timezone, mono: true },
  ].filter(row => row.value)
})

function reportText() {
  if (!result.value) {
    return ''
  }
  const lines = rows.value.map(row => `${row.label}：${row.value}`)
  if (result.value.host !== result.value.ip) {
    lines.unshift(`查询：${result.value.host}`)
  }
  return lines.join('\n')
}

async function copyReport() {
  const text = reportText()
  if (!text) {
    return
  }
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

  copied.value = true
  if (copiedTimer) {
    clearTimeout(copiedTimer)
  }
  copiedTimer = setTimeout(() => {
    copied.value = false
  }, 1600)
}

onBeforeUnmount(() => {
  if (copiedTimer) {
    clearTimeout(copiedTimer)
  }
})

async function runLookup(self = false) {
  const name = host.value.trim()
  if (!self && !name) {
    lookupError.value = '请先输入域名或 IP'
    result.value = null
    return
  }

  pending.value = self ? 'self' : 'host'
  lookupError.value = ''
  result.value = null
  copied.value = false

  try {
    result.value = await $fetch<IpResponse>('/api/ip', {
      query: self ? {} : { host: name },
    })
  }
  catch (error: unknown) {
    const err = error as {
      data?: { statusMessage?: string, message?: string }
      statusMessage?: string
      message?: string
    }
    lookupError.value
      = err?.data?.message
        || err?.data?.statusMessage
        || err?.message
        || '查询失败，请稍后重试'
  }
  finally {
    pending.value = ''
  }
}
</script>

<template>
  <div>
    <p class="text-sm text-moss">
      <NuxtLink to="/tools" class="hover:underline">实用工具</NuxtLink>
      <span class="mx-1.5 text-stone-400">/</span>
      IP
    </p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight">{{ tool.title }}</h1>
    <p class="mt-4 max-w-3xl leading-8 text-stone-700">
      输入公网 IP 或域名，查看归属地、运营商和 ASN。支持粘贴带 https:// 的地址。
    </p>

    <form class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end" @submit.prevent="runLookup(false)">
      <label class="min-w-0 flex-1">
        <span class="mb-1.5 block text-sm text-stone-600">域名或 IP</span>
        <input
          v-model="host"
          type="text"
          name="host"
          autocomplete="off"
          spellcheck="false"
          placeholder="8.8.8.8"
          class="w-full rounded-xl border border-stone-300/80 bg-white/70 px-3 py-2.5 text-ink outline-none ring-moss/30 placeholder:text-stone-400 focus:ring-2"
        >
      </label>
      <div class="flex gap-3">
        <button
          type="submit"
          class="rounded-xl bg-moss px-5 py-2.5 text-sm font-medium text-white transition hover:bg-moss/90 disabled:opacity-60"
          :disabled="pending !== ''"
        >
          {{ pending === 'host' ? '查询中…' : '查询' }}
        </button>
        <button
          type="button"
          class="rounded-xl border border-stone-300/80 bg-white/70 px-5 py-2.5 text-sm font-medium text-ink transition hover:border-moss/50 disabled:opacity-60"
          :disabled="pending !== ''"
          @click="runLookup(true)"
        >
          {{ pending === 'self' ? '查询中…' : '查我的 IP' }}
        </button>
      </div>
    </form>

    <p v-if="lookupError" class="mt-4 text-sm text-red-700">
      {{ lookupError }}
    </p>

    <div v-else-if="result" class="mt-6">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <p class="text-sm text-stone-500">
          <template v-if="result.self">当前访问的公网 IP</template>
          <template v-else-if="result.host !== result.ip">
            <span class="font-mono text-stone-800">{{ result.host }}</span>
            <span class="mx-1.5 text-stone-400">→</span>
            <span class="font-mono text-stone-800">{{ result.ip }}</span>
          </template>
          <span v-else class="font-mono text-stone-800">{{ result.ip }}</span>
        </p>
        <button
          type="button"
          class="text-xs text-moss hover:underline"
          @click="copyReport"
        >
          {{ copied ? '已复制' : '复制结果' }}
        </button>
      </div>

      <dl class="mt-4">
        <div
          v-for="row in rows"
          :key="row.label"
          class="grid grid-cols-[4.5rem_1fr] gap-3 border-b border-stone-200 py-2.5 text-sm"
        >
          <dt class="text-stone-500">{{ row.label }}</dt>
          <dd class="break-all text-stone-800" :class="row.mono ? 'font-mono' : ''">{{ row.value }}</dd>
        </div>
      </dl>
    </div>

    <p class="mt-10 text-sm leading-7 text-stone-500">
      归属地来自公开 IP 数据，一般只到城市或运营商，仅供参考。不查询内网和保留地址。想看连通和延迟，可用
      <NuxtLink to="/tools/ping" class="text-moss hover:underline">在线 Ping</NuxtLink>
      。
    </p>
  </div>
</template>
