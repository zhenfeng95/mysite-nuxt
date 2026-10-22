<script setup lang="ts">
const tool = useToolSeo('encode')

type Panel = 'base64' | 'url' | 'random'

const panel = ref<Panel>('base64')

const base64Input = ref('')
const base64Output = ref('')
const base64Error = ref('')

const urlInput = ref('')
const urlOutput = ref('')
const urlError = ref('')

const randomLength = ref(24)
const useLower = ref(true)
const useUpper = ref(true)
const useDigits = ref(true)
const useSymbols = ref(false)
const randomOutput = ref('')
const randomError = ref('')

const copiedKey = ref('')
let copiedTimer: ReturnType<typeof setTimeout> | undefined

async function copyText(text: string, key: string) {
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

function encodeBase64() {
  base64Error.value = ''
  try {
    const bytes = new TextEncoder().encode(base64Input.value)
    let binary = ''
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte)
    })
    base64Output.value = btoa(binary)
  }
  catch {
    base64Error.value = 'Base64 编码失败'
    base64Output.value = ''
  }
}

function decodeBase64() {
  base64Error.value = ''
  try {
    const normalized = base64Input.value.trim().replace(/\s+/g, '')
    const binary = atob(normalized)
    const bytes = Uint8Array.from(binary, char => char.charCodeAt(0))
    base64Output.value = new TextDecoder().decode(bytes)
  }
  catch {
    base64Error.value = '不是有效的 Base64 文本'
    base64Output.value = ''
  }
}

function encodeUrl() {
  urlError.value = ''
  try {
    urlOutput.value = encodeURIComponent(urlInput.value)
  }
  catch {
    urlError.value = 'URL 编码失败'
    urlOutput.value = ''
  }
}

function decodeUrl() {
  urlError.value = ''
  try {
    urlOutput.value = decodeURIComponent(urlInput.value.replace(/\+/g, '%20'))
  }
  catch {
    urlError.value = '不是有效的 URL 编码文本'
    urlOutput.value = ''
  }
}

function charset() {
  let set = ''
  if (useLower.value) {
    set += 'abcdefghijklmnopqrstuvwxyz'
  }
  if (useUpper.value) {
    set += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  }
  if (useDigits.value) {
    set += '0123456789'
  }
  if (useSymbols.value) {
    set += '!@#$%^&*_-+=?'
  }
  return set
}

function generateRandom() {
  randomError.value = ''
  const set = charset()
  const length = Math.min(256, Math.max(1, Number(randomLength.value) || 1))
  randomLength.value = length

  if (!set) {
    randomError.value = '至少勾选一种字符类型'
    randomOutput.value = ''
    return
  }

  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  let result = ''
  for (let i = 0; i < length; i += 1) {
    result += set[bytes[i]! % set.length]
  }
  randomOutput.value = result
}

const panels: Array<{ id: Panel; label: string }> = [
  { id: 'base64', label: 'Base64' },
  { id: 'url', label: 'URL' },
  { id: 'random', label: '随机串' },
]
</script>

<template>
  <div>
    <p class="text-sm text-moss">
      <NuxtLink to="/tools" class="hover:underline">实用工具</NuxtLink>
      <span class="mx-1.5 text-stone-400">/</span>
      编解码
    </p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight">{{ tool.title }}</h1>
    <p class="mt-4 max-w-3xl leading-8 text-stone-700">
      Base64、URL 编解码，以及可配置字符集的随机字符串。全程在浏览器本地完成，不会上传内容。
    </p>

    <div class="mt-8 flex flex-wrap gap-2">
      <button
        v-for="item in panels"
        :key="item.id"
        type="button"
        class="rounded-xl border px-3 py-1.5 text-sm transition"
        :class="panel === item.id
          ? 'border-moss bg-moss text-white'
          : 'border-stone-300/80 bg-white/60 text-stone-700 hover:border-moss/50'"
        @click="panel = item.id"
      >
        {{ item.label }}
      </button>
    </div>

    <section v-if="panel === 'base64'" class="mt-6">
      <label class="block">
        <span class="mb-1.5 block text-sm text-stone-600">输入</span>
        <textarea
          v-model="base64Input"
          rows="6"
          spellcheck="false"
          placeholder="要编码的原文，或要解码的 Base64"
          class="w-full rounded-xl border border-stone-300/80 bg-white/70 px-3 py-2.5 font-mono text-sm leading-6 text-ink outline-none ring-moss/30 placeholder:text-stone-400 focus:ring-2"
        />
      </label>
      <div class="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-xl bg-moss px-4 py-2 text-sm font-medium text-white transition hover:bg-moss/90"
          @click="encodeBase64"
        >
          编码
        </button>
        <button
          type="button"
          class="rounded-xl border border-stone-300/80 bg-white/60 px-4 py-2 text-sm text-stone-700 transition hover:border-moss/50"
          @click="decodeBase64"
        >
          解码
        </button>
      </div>
      <p v-if="base64Error" class="mt-3 text-sm text-red-700">{{ base64Error }}</p>
      <div v-if="base64Output" class="mt-4">
        <div class="mb-1.5 flex items-center justify-between gap-3">
          <span class="text-sm text-stone-600">结果</span>
          <button type="button" class="text-xs text-moss hover:underline" @click="copyText(base64Output, 'b64')">
            {{ copiedKey === 'b64' ? '已复制' : '复制' }}
          </button>
        </div>
        <pre class="overflow-x-auto rounded-xl border border-stone-300/80 bg-white/70 px-3 py-2.5 font-mono text-sm leading-6 text-stone-800 whitespace-pre-wrap break-all">{{ base64Output }}</pre>
      </div>
    </section>

    <section v-else-if="panel === 'url'" class="mt-6">
      <label class="block">
        <span class="mb-1.5 block text-sm text-stone-600">输入</span>
        <textarea
          v-model="urlInput"
          rows="6"
          spellcheck="false"
          placeholder="要编码的文本，或要解码的 %xx 串"
          class="w-full rounded-xl border border-stone-300/80 bg-white/70 px-3 py-2.5 font-mono text-sm leading-6 text-ink outline-none ring-moss/30 placeholder:text-stone-400 focus:ring-2"
        />
      </label>
      <div class="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-xl bg-moss px-4 py-2 text-sm font-medium text-white transition hover:bg-moss/90"
          @click="encodeUrl"
        >
          编码
        </button>
        <button
          type="button"
          class="rounded-xl border border-stone-300/80 bg-white/60 px-4 py-2 text-sm text-stone-700 transition hover:border-moss/50"
          @click="decodeUrl"
        >
          解码
        </button>
      </div>
      <p v-if="urlError" class="mt-3 text-sm text-red-700">{{ urlError }}</p>
      <div v-if="urlOutput" class="mt-4">
        <div class="mb-1.5 flex items-center justify-between gap-3">
          <span class="text-sm text-stone-600">结果</span>
          <button type="button" class="text-xs text-moss hover:underline" @click="copyText(urlOutput, 'url')">
            {{ copiedKey === 'url' ? '已复制' : '复制' }}
          </button>
        </div>
        <pre class="overflow-x-auto rounded-xl border border-stone-300/80 bg-white/70 px-3 py-2.5 font-mono text-sm leading-6 text-stone-800 whitespace-pre-wrap break-all">{{ urlOutput }}</pre>
      </div>
    </section>

    <section v-else class="mt-6">
      <div class="flex flex-wrap items-end gap-4">
        <label>
          <span class="mb-1.5 block text-sm text-stone-600">长度</span>
          <input
            v-model.number="randomLength"
            type="number"
            min="1"
            max="256"
            class="w-28 rounded-xl border border-stone-300/80 bg-white/70 px-3 py-2.5 text-ink outline-none ring-moss/30 focus:ring-2"
          >
        </label>
        <fieldset class="flex flex-wrap gap-3 text-sm text-stone-700">
          <legend class="sr-only">字符集</legend>
          <label class="inline-flex items-center gap-1.5">
            <input v-model="useLower" type="checkbox" class="accent-moss">
            小写
          </label>
          <label class="inline-flex items-center gap-1.5">
            <input v-model="useUpper" type="checkbox" class="accent-moss">
            大写
          </label>
          <label class="inline-flex items-center gap-1.5">
            <input v-model="useDigits" type="checkbox" class="accent-moss">
            数字
          </label>
          <label class="inline-flex items-center gap-1.5">
            <input v-model="useSymbols" type="checkbox" class="accent-moss">
            符号
          </label>
        </fieldset>
        <button
          type="button"
          class="rounded-xl bg-moss px-4 py-2.5 text-sm font-medium text-white transition hover:bg-moss/90"
          @click="generateRandom"
        >
          生成
        </button>
      </div>
      <p v-if="randomError" class="mt-3 text-sm text-red-700">{{ randomError }}</p>
      <div v-if="randomOutput" class="mt-4">
        <div class="mb-1.5 flex items-center justify-between gap-3">
          <span class="text-sm text-stone-600">结果</span>
          <button type="button" class="text-xs text-moss hover:underline" @click="copyText(randomOutput, 'rand')">
            {{ copiedKey === 'rand' ? '已复制' : '复制' }}
          </button>
        </div>
        <pre class="overflow-x-auto rounded-xl border border-stone-300/80 bg-white/70 px-3 py-2.5 font-mono text-sm leading-6 text-stone-800 whitespace-pre-wrap break-all">{{ randomOutput }}</pre>
      </div>
    </section>
  </div>
</template>
