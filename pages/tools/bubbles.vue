<script setup lang="ts">
const tool = useToolSeo('bubbles')

interface Bubble {
  id: number
  size: number
  hue: number
  popping: boolean
}

const COLS = 5
const ROWS = 7
const TOTAL = COLS * ROWS
const TOTAL_KEY = 'game-bubbles-total'

const bubbles = ref<Bubble[]>([])
const popped = ref(0)
const totalAll = ref(0)
const muted = ref(false)

let nextId = 1
let audioCtx: AudioContext | null = null

function makeBubble(): Bubble {
  return {
    id: nextId++,
    size: 0.78 + Math.random() * 0.22,
    hue: Math.floor(Math.random() * 40) - 10, // around moss greens / soft shifts via filter
    popping: false,
  }
}

function refill() {
  bubbles.value = Array.from({ length: TOTAL }, () => makeBubble())
}

function ensureAudio() {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

function playPop() {
  if (muted.value) {
    return
  }
  try {
    const ctx = ensureAudio()
    void ctx.resume()
    const now = ctx.currentTime

    const noiseLen = Math.floor(ctx.sampleRate * 0.04)
    const buffer = ctx.createBuffer(1, noiseLen, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < noiseLen; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / noiseLen)
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'bandpass'
    noiseFilter.frequency.value = 1800 + Math.random() * 800
    noiseFilter.Q.value = 0.8
    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.35, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(ctx.destination)
    noise.start(now)
    noise.stop(now + 0.05)

    const osc = ctx.createOscillator()
    const oscGain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(420 + Math.random() * 180, now)
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.08)
    oscGain.gain.setValueAtTime(0.18, now)
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09)
    osc.connect(oscGain)
    oscGain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.1)
  }
  catch {
    // ignore audio failures
  }
}

function popAt(index: number) {
  const bubble = bubbles.value[index]
  if (!bubble || bubble.popping) {
    return
  }

  playPop()
  bubble.popping = true
  popped.value += 1
  totalAll.value += 1
  if (import.meta.client) {
    localStorage.setItem(TOTAL_KEY, String(totalAll.value))
  }

  window.setTimeout(() => {
    bubbles.value[index] = makeBubble()
  }, 220)
}

function resetSession() {
  popped.value = 0
  refill()
}

onMounted(() => {
  if (import.meta.client) {
    totalAll.value = Number(localStorage.getItem(TOTAL_KEY) || 0) || 0
  }
  refill()
})

onBeforeUnmount(() => {
  void audioCtx?.close()
  audioCtx = null
})
</script>

<template>
  <div>
    <p class="text-sm text-moss">
      <NuxtLink to="/tools" class="hover:underline">实用工具</NuxtLink>
      <span class="mx-1.5 text-stone-400">/</span>
      小游戏
    </p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight">{{ tool.title }}</h1>
    <p class="mt-4 max-w-2xl leading-8 text-stone-700">
      点一下，破一个。没有关卡，也不用赢，就是捏着解压。手机和电脑都能点。
    </p>

    <div class="mt-8 flex flex-wrap items-end justify-between gap-4">
      <div class="flex gap-3">
        <div class="rounded-2xl border border-stone-300/80 bg-white/60 px-4 py-3">
          <p class="text-xs text-stone-500">本轮</p>
          <p class="mt-0.5 text-xl font-semibold tabular-nums">{{ popped }}</p>
        </div>
        <div class="rounded-2xl border border-stone-300/80 bg-white/60 px-4 py-3">
          <p class="text-xs text-stone-500">累计</p>
          <p class="mt-0.5 text-xl font-semibold tabular-nums">{{ totalAll }}</p>
        </div>
      </div>
      <div class="flex gap-2">
        <button
          type="button"
          class="rounded-xl border border-stone-300/80 bg-white/60 px-4 py-2.5 text-sm text-stone-700 transition hover:border-moss/50"
          @click="muted = !muted"
        >
          {{ muted ? '开启声效' : '静音' }}
        </button>
        <button
          type="button"
          class="rounded-xl bg-moss px-4 py-2.5 text-sm font-medium text-white transition hover:bg-moss/90"
          @click="resetSession"
        >
          清空本轮
        </button>
      </div>
    </div>

    <div
      class="mt-6 grid w-full max-w-md gap-2 rounded-2xl border border-stone-300/80 bg-stone-200/40 p-3 sm:gap-3 sm:p-4"
      :style="{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }"
    >
      <button
        v-for="(bubble, index) in bubbles"
        :key="bubble.id"
        type="button"
        class="bubble relative aspect-square touch-manipulation rounded-full border border-white/70 outline-none transition active:scale-95"
        :class="bubble.popping ? 'bubble-pop pointer-events-none' : 'hover:brightness-105'"
        :style="{
          transform: bubble.popping ? undefined : `scale(${bubble.size})`,
          background: `radial-gradient(circle at 30% 28%, rgba(255,255,255,0.85), rgba(157,204,180,0.55) 42%, rgba(47,93,80,0.55) 100%)`,
          filter: `hue-rotate(${bubble.hue}deg)`,
        }"
        :aria-label="`捏破泡泡 ${index + 1}`"
        @pointerdown.prevent="popAt(index)"
      >
        <span
          class="pointer-events-none absolute left-[22%] top-[20%] h-[28%] w-[28%] rounded-full bg-white/70"
        />
      </button>
    </div>

    <p class="mt-6 text-sm text-stone-500">
      也可以敲敲
      <NuxtLink to="/tools/muyu" class="text-moss hover:underline">木鱼</NuxtLink>
      ，或听听
      <NuxtLink to="/tools/noise" class="text-moss hover:underline">白噪音</NuxtLink>。
    </p>
  </div>
</template>

<style scoped>
.bubble {
  box-shadow:
    inset -6px -8px 12px rgb(47 93 80 / 0.18),
    inset 4px 5px 10px rgb(255 255 255 / 0.45);
}

.bubble-pop {
  animation: bubble-pop 0.22s ease-out forwards;
}

@keyframes bubble-pop {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  55% {
    transform: scale(1.35);
    opacity: 0.55;
  }
  100% {
    transform: scale(0.15);
    opacity: 0;
  }
}
</style>
