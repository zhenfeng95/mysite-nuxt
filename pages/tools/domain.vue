<script setup lang="ts">
const tool = useToolSeo('domain')

interface DnsRecord {
  name: string
  type: string
  ttl: number | null
  data: string
}

interface WhoisSummary {
  queried: string
  source: string
  name: string | null
  statuses: string[]
  created: string | null
  updated: string | null
  expires: string | null
  registrar: string | null
  nameservers: string[]
  dnssec: boolean | null
  port43: string | null
}

interface DomainResponse {
  name: string
  whoisDomain: string
  dns: Record<string, DnsRecord[]>
  whois: WhoisSummary | null
  whoisError: string | null
}

const DNS_ORDER = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'TXT'] as const

const domain = ref('')
const loading = ref(false)
const error = ref('')
const result = ref<DomainResponse | null>(null)

const copiedKey = ref('')
let copiedTimer: ReturnType<typeof setTimeout> | undefined

async function copyText(text: string, key: string) {
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

  copiedKey.value = key
  if (copiedTimer) {
    clearTimeout(copiedTimer)
  }
  copiedTimer = setTimeout(() => {
    copiedKey.value = ''
  }, 1600)
}

onBeforeUnmount(() => {
  if (copiedTimer) {
    clearTimeout(copiedTimer)
  }
})

function formatDate(value: string | null) {
  if (!value) {
    return '—'
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return date.toLocaleString('zh-CN', { hour12: false })
}

async function runLookup() {
  const name = domain.value.trim()
  if (!name) {
    error.value = '请先输入域名'
    result.value = null
    return
  }

  loading.value = true
  error.value = ''
  result.value = null

  try {
    result.value = await $fetch<DomainResponse>('/api/domain', {
      query: { name },
    })
  }
  catch (err: unknown) {
    const e = err as {
      data?: { message?: string }
      message?: string
    }
    error.value = e?.data?.message || e?.message || '查询失败，请检查域名后重试'
  }
  finally {
    loading.value = false
  }
}

const dnsSections = computed(() => {
  if (!result.value) {
    return []
  }
  return DNS_ORDER
    .map(type => ({
      type,
      records: result.value!.dns[type] || [],
    }))
    .filter(section => section.records.length > 0)
})
</script>

<template>
  <div>
    <p class="text-sm text-moss">
      <NuxtLink to="/tools" class="hover:underline">实用工具</NuxtLink>
      <span class="mx-1.5 text-stone-400">/</span>
      域名粗查
    </p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight">{{ tool.title }}</h1>
    <p class="mt-4 max-w-3xl leading-8 text-stone-700">
      一次查看注册信息（经 RDAP，相当于现代 WHOIS）和常用 DNS 解析。适合改完 Nameserver、加完 MX / TXT 后做快速核对；隐私保护域名可能看不到持有人信息。
    </p>

    <form class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end" @submit.prevent="runLookup">
      <label class="min-w-0 flex-1">
        <span class="mb-1.5 block text-sm text-stone-600">域名</span>
        <input
          v-model="domain"
          type="text"
          name="domain"
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
        {{ loading ? '查询中…' : '查询' }}
      </button>
    </form>

    <p v-if="error" class="mt-4 text-sm text-red-700">
      {{ error }}
    </p>

    <template v-if="result">
      <section class="mt-10">
        <h2 class="text-xl font-semibold tracking-tight">注册信息</h2>
        <p class="mt-1 text-sm leading-6 text-stone-500">
          查询对象：{{ result.whoisDomain }}
          <span v-if="result.whoisDomain !== result.name">（由 {{ result.name }} 推断）</span>
        </p>

        <p v-if="result.whoisError" class="mt-4 text-sm text-stone-600">
          {{ result.whoisError }}
        </p>

        <dl
          v-else-if="result.whois"
          class="mt-4 grid gap-3 sm:grid-cols-2"
        >
          <div>
            <dt class="text-sm text-stone-500">域名</dt>
            <dd class="mt-0.5 font-mono text-sm text-stone-800">{{ result.whois.name || '—' }}</dd>
          </div>
          <div>
            <dt class="text-sm text-stone-500">注册商</dt>
            <dd class="mt-0.5 text-sm text-stone-800">{{ result.whois.registrar || '—' }}</dd>
          </div>
          <div>
            <dt class="text-sm text-stone-500">注册时间</dt>
            <dd class="mt-0.5 text-sm text-stone-800">{{ formatDate(result.whois.created) }}</dd>
          </div>
          <div>
            <dt class="text-sm text-stone-500">到期时间</dt>
            <dd class="mt-0.5 text-sm text-stone-800">{{ formatDate(result.whois.expires) }}</dd>
          </div>
          <div>
            <dt class="text-sm text-stone-500">更新时间</dt>
            <dd class="mt-0.5 text-sm text-stone-800">{{ formatDate(result.whois.updated) }}</dd>
          </div>
          <div>
            <dt class="text-sm text-stone-500">DNSSEC</dt>
            <dd class="mt-0.5 text-sm text-stone-800">
              {{ result.whois.dnssec === null ? '—' : result.whois.dnssec ? '已签署' : '未签署' }}
            </dd>
          </div>
          <div class="sm:col-span-2">
            <dt class="text-sm text-stone-500">状态</dt>
            <dd class="mt-0.5 text-sm text-stone-800">
              {{ result.whois.statuses.length ? result.whois.statuses.join(' · ') : '—' }}
            </dd>
          </div>
          <div class="sm:col-span-2">
            <dt class="text-sm text-stone-500">Nameserver（注册局）</dt>
            <dd class="mt-0.5 font-mono text-sm leading-6 text-stone-800">
              <template v-if="result.whois.nameservers.length">
                <p v-for="ns in result.whois.nameservers" :key="ns">{{ ns }}</p>
              </template>
              <template v-else>—</template>
            </dd>
          </div>
        </dl>
      </section>

      <section class="mt-12">
        <h2 class="text-xl font-semibold tracking-tight">DNS 解析</h2>
        <p class="mt-1 text-sm leading-6 text-stone-500">
          查询主机：{{ result.name }}
        </p>

        <p v-if="!dnsSections.length" class="mt-4 text-sm text-stone-600">
          暂无常用解析记录。
        </p>

        <div v-for="section in dnsSections" :key="section.type" class="mt-6">
          <h3 class="text-base font-semibold text-ink">{{ section.type }}</h3>
          <ul class="mt-2 space-y-2">
            <li
              v-for="(record, index) in section.records"
              :key="`${section.type}-${record.data}-${index}`"
              class="flex items-start justify-between gap-3 border-b border-stone-200 py-2 text-sm"
            >
              <span class="min-w-0 break-all font-mono text-stone-800">{{ record.data }}</span>
              <button
                type="button"
                class="shrink-0 text-xs text-moss hover:underline"
                @click="copyText(record.data, `${section.type}-${index}`)"
              >
                {{ copiedKey === `${section.type}-${index}` ? '已复制' : '复制' }}
              </button>
            </li>
          </ul>
        </div>
      </section>
    </template>

    <p class="mt-10 text-sm leading-7 text-stone-500">
      需要按类型细查或生成记录，可用
      <NuxtLink to="/tools/dns" class="text-moss hover:underline">DNS 查询</NuxtLink>
      。
    </p>
  </div>
</template>
