<script setup lang="ts">
const tool = useToolSeo('ssl')

type SslExpiryKind = 'ok' | 'soon' | 'expired' | 'invalid'

interface SslResponse {
  input: string
  host: string
  port: number
  ip: string
  kind: SslExpiryKind
  valid: boolean
  daysRemaining: number | null
  validFrom: string | null
  validTo: string | null
  subject: string | null
  issuer: string | null
  altNames: string[]
  fingerprint256: string | null
  protocol: string | null
  authorized: boolean
  authorizationError: string | null
  checkedAt: string
}

const host = ref('')
const loading = ref(false)
const checkError = ref('')
const result = ref<SslResponse | null>(null)

const kindMeta: Record<SslExpiryKind, { label: string; className: string }> = {
  ok: { label: '证书有效', className: 'border-emerald-300/80 bg-emerald-50 text-emerald-900' },
  soon: { label: '即将到期（≤30 天）', className: 'border-amber-300/80 bg-amber-50 text-amber-950' },
  expired: { label: '证书已过期', className: 'border-red-300/80 bg-red-50 text-red-900' },
  invalid: { label: '证书异常或不受信', className: 'border-red-300/80 bg-red-50 text-red-900' },
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
  const days = result.value.daysRemaining
  let daysText = '—'
  if (days !== null) {
    daysText = days < 0 ? `已过期 ${Math.abs(days)} 天` : `剩余 ${days} 天`
  }
  return [
    { label: '剩余天数', value: daysText },
    { label: '生效时间', value: formatTime(result.value.validFrom) },
    { label: '到期时间', value: formatTime(result.value.validTo) },
    { label: '协议', value: result.value.protocol || '—' },
  ]
})

function formatTime(iso: string | null) {
  if (!iso) {
    return '—'
  }
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return iso
  }
  return date.toLocaleString('zh-CN', { hour12: false })
}

async function runCheck() {
  const value = host.value.trim()
  if (!value) {
    checkError.value = '请先输入域名或网址'
    result.value = null
    return
  }

  loading.value = true
  checkError.value = ''
  result.value = null

  try {
    result.value = await $fetch<SslResponse>('/api/ssl', {
      query: { host: value },
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
      SSL 证书
    </p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight">{{ tool.title }}</h1>
    <p class="mt-4 max-w-3xl leading-8 text-stone-700">
      输入域名或网址，从本站服务器读取对方 HTTPS 证书，查看颁发者、生效/到期时间与剩余天数。适合核对自动续期是否还在正常工作。
    </p>

    <form class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end" @submit.prevent="runCheck">
      <label class="min-w-0 flex-1">
        <span class="mb-1.5 block text-sm text-stone-600">域名或网址</span>
        <input
          v-model="host"
          type="text"
          name="host"
          autocomplete="off"
          spellcheck="false"
          placeholder="example.com 或 https://example.com"
          class="w-full rounded-xl border border-stone-300/80 bg-white/70 px-3 py-2.5 text-ink outline-none ring-moss/30 placeholder:text-stone-400 focus:ring-2"
        >
      </label>
      <button
        type="submit"
        class="rounded-xl bg-moss px-5 py-2.5 text-sm font-medium text-white transition hover:bg-moss/90 disabled:opacity-60"
        :disabled="loading"
      >
        {{ loading ? '检测中…' : '查看证书' }}
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
        <span v-if="result.daysRemaining !== null" class="ml-2 font-mono font-normal opacity-80">
          <template v-if="result.daysRemaining < 0">
            已过期 {{ Math.abs(result.daysRemaining) }} 天
          </template>
          <template v-else>
            剩余 {{ result.daysRemaining }} 天
          </template>
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
          <span class="text-stone-500">主机</span>
          <span class="mx-2 text-stone-400">·</span>
          <span class="font-mono text-stone-800">{{ result.host }}:{{ result.port }}</span>
          <span class="mx-2 text-stone-400">→</span>
          <span class="font-mono text-stone-800">{{ result.ip }}</span>
        </p>
        <p>
          <span class="text-stone-500">颁发给</span>
          <span class="mx-2 text-stone-400">·</span>
          <span class="font-mono text-stone-800">{{ result.subject || '—' }}</span>
        </p>
        <p>
          <span class="text-stone-500">颁发者</span>
          <span class="mx-2 text-stone-400">·</span>
          <span class="text-stone-800">{{ result.issuer || '—' }}</span>
        </p>
        <p v-if="result.altNames.length">
          <span class="text-stone-500">备用名 SAN</span>
          <span class="mx-2 text-stone-400">·</span>
          <span class="font-mono text-stone-800">{{ result.altNames.join(', ') }}</span>
        </p>
        <p v-if="!result.authorized && result.authorizationError">
          <span class="text-stone-500">校验说明</span>
          <span class="mx-2 text-stone-400">·</span>
          <span class="text-red-700">{{ result.authorizationError }}</span>
        </p>
        <p v-if="result.fingerprint256">
          <span class="text-stone-500">指纹 SHA-256</span>
          <span class="mx-2 text-stone-400">·</span>
          <span class="break-all font-mono text-xs text-stone-800">{{ result.fingerprint256 }}</span>
        </p>
        <p class="text-stone-500">
          检测时间 {{ formatTime(result.checkedAt) }}
        </p>
      </div>
    </div>

    <p class="mt-10 text-sm leading-7 text-stone-500">
      检测从网站服务器发起 TLS 握手读取证书，不代表你本机浏览器的信任库结果。不探测内网与保留地址。证书申请与自动续期可对照
      <NuxtLink to="/guides/acme-sh-certificate-guide" class="text-moss hover:underline">acme.sh 证书教程</NuxtLink>
      ；想看站点是否可打开可用
      <NuxtLink to="/tools/status" class="text-moss hover:underline">网站状态检测</NuxtLink>
      。
    </p>
  </div>
</template>
