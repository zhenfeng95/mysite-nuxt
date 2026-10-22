<script setup lang="ts">
const tool = useToolSeo('noise')

type NoiseKind = 'white' | 'pink' | 'brown' | 'rain'

const kinds: Array<{ id: NoiseKind; label: string; hint: string }> = [
  { id: 'white', label: '白噪声', hint: '全频均匀，适合盖过杂音' },
  { id: 'pink', label: '粉红噪声', hint: '更柔和，常见于专注场景' },
  { id: 'brown', label: '棕噪声', hint: '低频更多，偏沉稳' },
  { id: 'rain', label: '雨声', hint: '滤波噪声模拟连绵雨' },
]

const kind = ref<NoiseKind>('pink')
const playing = ref(false)
const volume = ref(0.35)

let audioCtx: AudioContext | null = null
let masterGain: GainNode | null = null
let sourceNode: AudioBufferSourceNode | null = null
let filterNode: BiquadFilterNode | null = null
let rainTimer: ReturnType<typeof setInterval> | undefined

function ensureContext() {
  if (!audioCtx) {
    audioCtx = new AudioContext()
    masterGain = audioCtx.createGain()
    masterGain.gain.value = volume.value
    masterGain.connect(audioCtx.destination)
  }
  return audioCtx
}

function createNoiseBuffer(ctx: AudioContext, type: NoiseKind, seconds = 2) {
  const sampleRate = ctx.sampleRate
  const length = Math.floor(sampleRate * seconds)
  const buffer = ctx.createBuffer(1, length, sampleRate)
  const data = buffer.getChannelData(0)

  if (type === 'white' || type === 'rain') {
    for (let i = 0; i < length; i += 1) {
      data[i] = Math.random() * 2 - 1
    }
  }
  else if (type === 'pink') {
    let b0 = 0
    let b1 = 0
    let b2 = 0
    let b3 = 0
    let b4 = 0
    let b5 = 0
    let b6 = 0
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.969 * b2 + white * 0.153852
      b3 = 0.8665 * b3 + white * 0.3104856
      b4 = 0.55 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.016898
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
      b6 = white * 0.115926
    }
  }
  else {
    let last = 0
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1
      last = (last + 0.02 * white) / 1.02
      data[i] = last * 3.5
    }
  }

  return buffer
}

function stopGraph() {
  if (rainTimer) {
    clearInterval(rainTimer)
    rainTimer = undefined
  }
  try {
    sourceNode?.stop()
  }
  catch {
    // already stopped
  }
  sourceNode?.disconnect()
  filterNode?.disconnect()
  sourceNode = null
  filterNode = null
}

function startGraph() {
  const ctx = ensureContext()
  if (!masterGain) {
    return
  }
  stopGraph()

  const buffer = createNoiseBuffer(ctx, kind.value)
  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.loop = true

  if (kind.value === 'rain') {
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 900
    filter.Q.value = 0.7
    source.connect(filter)
    filter.connect(masterGain)
    filterNode = filter

    rainTimer = setInterval(() => {
      if (!audioCtx || !masterGain || !playing.value) {
        return
      }
      filter.frequency.setTargetAtTime(
        700 + Math.random() * 500,
        audioCtx.currentTime,
        0.2,
      )
    }, 800)
  }
  else {
    source.connect(masterGain)
  }

  source.start()
  sourceNode = source
}

async function togglePlay() {
  const ctx = ensureContext()
  if (ctx.state === 'suspended') {
    await ctx.resume()
  }

  if (playing.value) {
    stopGraph()
    playing.value = false
    return
  }

  startGraph()
  playing.value = true
}

function switchKind(next: NoiseKind) {
  kind.value = next
  if (playing.value) {
    startGraph()
  }
}

watch(volume, (value) => {
  if (masterGain && audioCtx) {
    masterGain.gain.setTargetAtTime(value, audioCtx.currentTime, 0.05)
  }
})

onBeforeUnmount(() => {
  stopGraph()
  void audioCtx?.close()
  audioCtx = null
  masterGain = null
})
</script>

<template>
  <div>
    <p class="text-sm text-moss">
      <NuxtLink to="/tools" class="hover:underline">实用工具</NuxtLink>
      <span class="mx-1.5 text-stone-400">/</span>
      白噪音
    </p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight">{{ tool.title }}</h1>
    <p class="mt-4 max-w-3xl leading-8 text-stone-700">
      用浏览器本地生成环境噪声，适合盖过杂音、辅助专注。无需下载音频，也不会上传任何内容。
    </p>

    <div class="mt-8 flex flex-wrap gap-2">
      <button
        v-for="item in kinds"
        :key="item.id"
        type="button"
        class="rounded-xl border px-3 py-1.5 text-sm transition"
        :class="kind === item.id
          ? 'border-moss bg-moss text-white'
          : 'border-stone-300/80 bg-white/60 text-stone-700 hover:border-moss/50'"
        @click="switchKind(item.id)"
      >
        {{ item.label }}
      </button>
    </div>
    <p class="mt-3 text-sm text-stone-600">
      {{ kinds.find(item => item.id === kind)?.hint }}
    </p>

    <section class="mt-8 max-w-xl rounded-2xl border border-stone-300/80 bg-white/60 px-5 py-6">
      <div class="flex flex-wrap items-center gap-3">
        <button
          type="button"
          class="rounded-xl bg-moss px-5 py-2.5 text-sm font-medium text-white transition hover:bg-moss/90"
          @click="togglePlay"
        >
          {{ playing ? '暂停' : '播放' }}
        </button>
        <p class="text-sm text-stone-600">
          {{ playing ? '正在播放' : '已暂停' }} · {{ kinds.find(item => item.id === kind)?.label }}
        </p>
      </div>

      <label class="mt-6 block">
        <div class="mb-2 flex items-center justify-between text-sm text-stone-600">
          <span>音量</span>
          <span>{{ Math.round(volume * 100) }}%</span>
        </div>
        <input
          v-model.number="volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          class="w-full accent-moss"
        >
      </label>
    </section>

    <p class="mt-6 text-sm leading-7 text-stone-500">
      也可搭配
      <NuxtLink to="/tools/pomodoro" class="text-moss hover:underline">番茄钟</NuxtLink>
      一起用。
    </p>
  </div>
</template>
