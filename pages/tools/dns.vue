<script setup lang="ts">
const tool = useToolSeo('dns')

const LOOKUP_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SOA'] as const

type LookupType = (typeof LOOKUP_TYPES)[number]

interface LookupRecord {
  name: string
  type: string
  ttl: number | null
  data: string
}

interface LookupResponse {
  name: string
  type: string
  status: number | null
  records: LookupRecord[]
}

const domain = ref('')
const lookupType = ref<LookupType>('A')
const loading = ref(false)
const lookupError = ref('')
const lookupResult = ref<LookupResponse | null>(null)

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

async function runLookup() {
  const name = domain.value.trim()
  if (!name) {
    lookupError.value = '请先输入域名'
    lookupResult.value = null
    return
  }

  loading.value = true
  lookupError.value = ''
  lookupResult.value = null

  try {
    lookupResult.value = await $fetch<LookupResponse>('/api/dns', {
      query: {
        name,
        type: lookupType.value,
      },
    })
  }
  catch (error: unknown) {
    const err = error as {
      data?: { statusMessage?: string; message?: string }
      statusMessage?: string
      message?: string
    }
    lookupError.value
      = err?.data?.statusMessage
      || err?.data?.message
      || err?.statusMessage
      || err?.message
      || '查询失败，请检查域名后重试'
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
      DNS
    </p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight">{{ tool.title }}</h1>
    <p class="mt-4 max-w-3xl leading-8 text-stone-700">
      改完 Nameserver，或加完 A / MX / TXT 后，在这里核对解析是否已生效。支持粘贴带 https:// 的地址。解析经公共 DNS 查询，仅供参考。
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
      <label class="sm:w-36">
        <span class="mb-1.5 block text-sm text-stone-600">类型</span>
        <select
          v-model="lookupType"
          class="w-full rounded-xl border border-stone-300/80 bg-white/70 py-2.5 pl-3 text-ink outline-none ring-moss/30 focus:ring-2"
        >
          <option v-for="type in LOOKUP_TYPES" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
      </label>
      <button
        type="submit"
        class="rounded-xl bg-moss px-5 py-2.5 text-sm font-medium text-white transition hover:bg-moss/90 disabled:opacity-60"
        :disabled="loading"
      >
        {{ loading ? '查询中…' : '查询' }}
      </button>
    </form>

    <p v-if="lookupError" class="mt-4 text-sm text-red-700">
      {{ lookupError }}
    </p>

    <div v-else-if="lookupResult" class="mt-4 overflow-x-auto">
      <p class="text-sm text-stone-500">
        {{ lookupResult.name }} · {{ lookupResult.type }}
        <span v-if="!lookupResult.records.length"> · 暂无记录</span>
      </p>
      <table
        v-if="lookupResult.records.length"
        class="mt-3 w-full min-w-[28rem] border-collapse text-left text-sm"
      >
        <thead>
          <tr class="border-b border-stone-300">
            <th class="py-2 pr-4 font-semibold text-ink">主机名</th>
            <th class="py-2 pr-4 font-semibold text-ink">类型</th>
            <th class="py-2 pr-4 font-semibold text-ink">TTL</th>
            <th class="py-2 font-semibold text-ink">值</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(record, index) in lookupResult.records"
            :key="`${record.name}-${record.data}-${index}`"
            class="border-b border-stone-200 align-top"
          >
            <td class="py-2 pr-4 font-mono text-stone-700">{{ record.name }}</td>
            <td class="py-2 pr-4">{{ record.type }}</td>
            <td class="py-2 pr-4 text-stone-500">{{ record.ttl ?? '—' }}</td>
            <td class="py-2">
              <div class="flex items-start gap-2">
                <span class="min-w-0 break-all font-mono text-stone-800">{{ record.data }}</span>
                <button
                  type="button"
                  class="shrink-0 text-xs text-moss hover:underline"
                  @click="copyText(record.data, `lookup-${index}`)"
                >
                  {{ copiedKey === `lookup-${index}` ? '已复制' : '复制' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="mt-10 text-sm leading-7 text-stone-500">
      想一次看注册信息 + 多种解析，可用
      <NuxtLink to="/tools/domain" class="text-moss hover:underline">域名信息粗查</NuxtLink>
      。相关教程：
      <NuxtLink to="/digital-infra/cloudflare-free-stack-guide" class="text-moss hover:underline">Cloudflare 全家桶</NuxtLink>
      、
      <NuxtLink to="/digital-infra/google-workspace-domain-guide" class="text-moss hover:underline">Google Workspace 域名</NuxtLink>
      、
      <NuxtLink to="/digital-infra/oqumail-free-domain-email-guide" class="text-moss hover:underline">OquMail 域名邮箱</NuxtLink>
      。
    </p>
  </div>
</template>
