<script setup lang="ts">
usePageSeo({
  title: '在线 Ping',
  description: '输入域名或 IP，从本站服务器探测连通性、延迟和丢包。无法发送 ICMP 时，改用 TCP 443 或 80 测量建连时间。',
  path: '/tools/ping',
})

interface PingReply {
  seq: number
  timeMs: number | null
}

interface PingResponse {
  host: string
  ip: string
  method: 'icmp' | 'tcp'
  port: number | null
  sent: number
  received: number
  loss: number
  min: number | null
  avg: number | null
  max: number | null
  replies: PingReply[]
}

const host = ref('')
const loading = ref(false)
const pingError = ref('')
const result = ref<PingResponse | null>(null)
const copied = ref(false)
let copiedTimer: ReturnType<typeof setTimeout> | undefined

const methodLabel = computed(() => {
  if (!result.value) {
    return ''
  }
  if (result.value.method === 'icmp') {
    return 'ICMP'
  }
  return result.value.port ? `TCP ${result.value.port}` : 'TCP'
})

const stats = computed(() => {
  if (!result.value) {
    return []
  }
  return [
    { label: '丢包', value: `${result.value.loss.toFixed(1)}%` },
    { label: '最小', value: formatMs(result.value.min) },
    { label: '平均', value: formatMs(result.value.avg) },
    { label: '最大', value: formatMs(result.value.max) },
  ]
})

function formatMs(value: number | null) {
  if (value === null) {
    return '—'
  }
  return `${value.toFixed(1)} ms`
}

function replyText(value: number | null) {
  return value === null ? '超时' : formatMs(value)
}

function reportText() {
  if (!result.value) {
    return ''
  }
  const target = result.value.host === result.value.ip
    ? result.value.ip
    : `${result.value.host} (${result.value.ip})`
  const lines = [
    `${target} ${methodLabel.value}`,
    ...result.value.replies.map(reply => `#${reply.seq} ${replyText(reply.timeMs)}`),
    `发送 ${result.value.sent}，收到 ${result.value.received}，丢包 ${result.value.loss.toFixed(1)}%`,
    `最小 ${formatMs(result.value.min)}，平均 ${formatMs(result.value.avg)}，最大 ${formatMs(result.value.max)}`,
  ]
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

async function runPing() {
  const name = host.value.trim()
  if (!name) {
    pingError.value = '请先输入域名或 IP'
    result.value = null
    return
  }

  loading.value = true
  pingError.value = ''
  result.value = null
  copied.value = false

  try {
    result.value = await $fetch<PingResponse>('/api/ping', {
      query: { host: name },
    })
  }
  catch (error: unknown) {
    const err = error as {
      data?: { statusMessage?: string, message?: string }
      statusMessage?: string
      message?: string
    }
    pingError.value
      = err?.data?.message
        || err?.data?.statusMessage
        || err?.message
        || '探测失败，请稍后重试'
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
      Ping
    </p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight">在线 Ping</h1>
    <p class="mt-4 max-w-3xl leading-8 text-stone-700">
      输入域名或 IP，从本站服务器看它通不通、延迟多少、有没有丢包。支持粘贴带 https:// 的地址。
    </p>

    <form class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end" @submit.prevent="runPing">
      <label class="min-w-0 flex-1">
        <span class="mb-1.5 block text-sm text-stone-600">域名或 IP</span>
        <input
          v-model="host"
          type="text"
          name="host"
          autocomplete="off"
          spellcheck="false"
          placeholder="example.com"
          class="w-full rounded-xl border border-stone-300/80 bg-white/70 px-3 py-2.5 text-ink outline-none ring-moss/30 placeholder:text-stone-400 focus:ring-2"
        >
      </label>
      <button
        type="submit"
        class="rounded-xl bg-moss px-5 py-2.5 text-sm font-medium text-white transition hover:bg-moss/90 disabled:opacity-60"
        :disabled="loading"
      >
        {{ loading ? '探测中…' : 'Ping' }}
      </button>
    </form>

    <p v-if="pingError" class="mt-4 text-sm text-red-700">
      {{ pingError }}
    </p>

    <div v-else-if="result" class="mt-6">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <p class="text-sm text-stone-500">
          <span class="font-mono text-stone-800">{{ result.host }}</span>
          <template v-if="result.host !== result.ip">
            <span class="mx-1.5 text-stone-400">→</span>
            <span class="font-mono text-stone-800">{{ result.ip }}</span>
          </template>
          <span class="mx-1.5 text-stone-400">·</span>
          {{ methodLabel }}
          <span class="mx-1.5 text-stone-400">·</span>
          发送 {{ result.sent }}，收到 {{ result.received }}
        </p>
        <button
          type="button"
          class="text-xs text-moss hover:underline"
          @click="copyReport"
        >
          {{ copied ? '已复制' : '复制结果' }}
        </button>
      </div>

      <p v-if="result.method === 'tcp'" class="mt-2 text-sm leading-6 text-stone-500">
        <template v-if="result.port">
          当前环境发不出 ICMP，延迟来自 TCP {{ result.port }} 的建连时间，不能和系统 Ping 直接对比。
        </template>
        <template v-else>
          当前环境发不出 ICMP，TCP 443 和 80 也都没连上。
        </template>
      </p>

      <ol class="mt-4 font-mono text-sm">
        <li
          v-for="reply in result.replies"
          :key="reply.seq"
          class="flex justify-between gap-4 border-b border-stone-200 py-1.5"
        >
          <span class="text-stone-500">#{{ reply.seq }}</span>
          <span :class="reply.timeMs === null ? 'text-red-700' : 'text-stone-800'">
            {{ replyText(reply.timeMs) }}
          </span>
        </li>
      </ol>

      <dl class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div
          v-for="item in stats"
          :key="item.label"
          class="rounded-xl border border-stone-300/80 bg-white/60 px-3 py-2.5"
        >
          <dt class="text-xs text-stone-500">{{ item.label }}</dt>
          <dd class="mt-1 text-sm font-semibold text-ink">{{ item.value }}</dd>
        </div>
      </dl>
    </div>

    <p class="mt-10 text-sm leading-7 text-stone-500">
      探测从网站服务器发出，只反映服务器到目标的网络，不代表你当前设备的线路。每次固定 4 次，不访问内网和保留地址。想核对解析，可用
      <NuxtLink to="/tools/dns" class="text-moss hover:underline">DNS 查询</NuxtLink>
      ；想看地址归属，可用
      <NuxtLink to="/tools/ip" class="text-moss hover:underline">IP 归属地</NuxtLink>
      。
    </p>
  </div>
</template>
