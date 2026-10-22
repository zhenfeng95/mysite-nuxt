<script setup lang="ts">
const tool = useToolSeo('muyu')

const TOTAL_KEY = 'game-muyu-total'

const merit = ref(0)
const totalAll = ref(0)
const striking = ref(false)
const auto = ref(false)
const muted = ref(false)
const autoIntervalMs = ref(900)
const floatTexts = ref<Array<{ id: number; x: number; y: number }>>([])

let nextFloatId = 1
let audioCtx: AudioContext | null = null
let autoTimer: ReturnType<typeof setInterval> | undefined
let strikeTimer: ReturnType<typeof setTimeout> | undefined

function ensureAudio() {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

function playKnock() {
  if (muted.value) {
    return
  }
  try {
    const ctx = ensureAudio()
    void ctx.resume()
    const now = ctx.currentTime

    // Soft wooden knock: short noise + low tone
    const noiseLen = Math.floor(ctx.sampleRate * 0.035)
    const buffer = ctx.createBuffer(1, noiseLen, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < noiseLen; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / noiseLen) ** 1.5
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 520 + Math.random() * 120
    filter.Q.value = 1.4
    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.45, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)
    noise.connect(filter)
    filter.connect(noiseGain)
    noiseGain.connect(ctx.destination)
    noise.start(now)
    noise.stop(now + 0.06)

    const osc = ctx.createOscillator()
    const oscGain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(180 + Math.random() * 30, now)
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.12)
    oscGain.gain.setValueAtTime(0.22, now)
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14)
    osc.connect(oscGain)
    oscGain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.15)
  }
  catch {
    // ignore
  }
}

function spawnFloat(clientX?: number, clientY?: number) {
  const id = nextFloatId++
  floatTexts.value.push({
    id,
    x: clientX ?? window.innerWidth / 2,
    y: clientY ?? window.innerHeight / 2,
  })
  window.setTimeout(() => {
    floatTexts.value = floatTexts.value.filter(item => item.id !== id)
  }, 700)
}

function strike(event?: PointerEvent) {
  playKnock()
  merit.value += 1
  totalAll.value += 1
  if (import.meta.client) {
    localStorage.setItem(TOTAL_KEY, String(totalAll.value))
  }

  striking.value = true
  if (strikeTimer) {
    clearTimeout(strikeTimer)
  }
  strikeTimer = setTimeout(() => {
    striking.value = false
  }, 120)

  if (event) {
    spawnFloat(event.clientX, event.clientY)
  }
  else {
    // Auto mode: float near the wooden fish center-ish
    const el = document.getElementById('muyu-body')
    if (el) {
      const rect = el.getBoundingClientRect()
      spawnFloat(rect.left + rect.width * 0.55, rect.top + rect.height * 0.35)
    }
    else {
      spawnFloat()
    }
  }
}

function stopAuto() {
  if (autoTimer) {
    clearInterval(autoTimer)
    autoTimer = undefined
  }
}

function startAuto() {
  stopAuto()
  autoTimer = setInterval(() => {
    strike()
  }, Math.max(400, autoIntervalMs.value))
}

function toggleAuto() {
  auto.value = !auto.value
  if (auto.value) {
    // Unlock audio on user gesture
    void ensureAudio().resume()
    startAuto()
  }
  else {
    stopAuto()
  }
}

watch(autoIntervalMs, () => {
  if (auto.value) {
    startAuto()
  }
})

function resetSession() {
  merit.value = 0
}

onMounted(() => {
  if (import.meta.client) {
    totalAll.value = Number(localStorage.getItem(TOTAL_KEY) || 0) || 0
  }
})

onBeforeUnmount(() => {
  stopAuto()
  if (strikeTimer) {
    clearTimeout(strikeTimer)
  }
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
      点一下，敲一声，功德 +1。也可挂机自动敲。纯解压，不作任何评判。
    </p>

    <div class="mt-8 flex flex-wrap items-end justify-between gap-4">
      <div class="flex gap-3">
        <div class="rounded-2xl border border-stone-300/80 bg-white/60 px-4 py-3">
          <p class="text-xs text-stone-500">本轮功德</p>
          <p class="mt-0.5 text-xl font-semibold tabular-nums">{{ merit }}</p>
        </div>
        <div class="rounded-2xl border border-stone-300/80 bg-white/60 px-4 py-3">
          <p class="text-xs text-stone-500">累计</p>
          <p class="mt-0.5 text-xl font-semibold tabular-nums">{{ totalAll }}</p>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-xl border border-stone-300/80 bg-white/60 px-4 py-2.5 text-sm text-stone-700 transition hover:border-moss/50"
          @click="muted = !muted"
        >
          {{ muted ? '开启声效' : '静音' }}
        </button>
        <button
          type="button"
          class="rounded-xl border px-4 py-2.5 text-sm transition"
          :class="auto
            ? 'border-moss bg-moss text-white'
            : 'border-stone-300/80 bg-white/60 text-stone-700 hover:border-moss/50'"
          @click="toggleAuto"
        >
          {{ auto ? '停止自动' : '自动敲' }}
        </button>
        <button
          type="button"
          class="rounded-xl border border-stone-300/80 bg-white/60 px-4 py-2.5 text-sm text-stone-700 transition hover:border-moss/50"
          @click="resetSession"
        >
          清空本轮
        </button>
      </div>
    </div>

    <label v-if="auto" class="mt-5 block max-w-md">
      <div class="mb-2 flex items-center justify-between text-sm text-stone-600">
        <span>自动节奏</span>
        <span>{{ (autoIntervalMs / 1000).toFixed(1) }} 秒/次</span>
      </div>
      <input
        v-model.number="autoIntervalMs"
        type="range"
        min="400"
        max="2000"
        step="100"
        class="w-full accent-moss"
      >
    </label>

    <button
      id="muyu-body"
      type="button"
      class="muyu-wrap relative mx-auto mt-10 flex h-56 w-56 touch-manipulation items-center justify-center sm:h-64 sm:w-64"
      aria-label="敲木鱼"
      @pointerdown.prevent="strike"
    >
      <span
        class="muyu-body absolute inset-[12%] rounded-[45%] bg-gradient-to-b from-[#6b4a32] to-[#3d2a1c] shadow-[inset_0_8px_16px_rgba(255,255,255,0.12),0_12px_28px_rgba(28,25,21,0.2)]"
        :class="striking ? 'muyu-hit' : ''"
      />
      <span
        class="absolute left-[28%] top-[30%] h-[18%] w-[38%] rounded-full bg-gradient-to-b from-white/25 to-transparent"
      />
      <span
        class="absolute bottom-[22%] left-1/2 h-3 w-16 -translate-x-1/2 rounded-full bg-[#2a1c12]/70"
      />
      <span
        class="muyu-stick absolute right-[6%] top-[18%] h-24 w-3 origin-bottom -rotate-[28deg] rounded-full bg-gradient-to-b from-[#a67c52] to-[#5c3d24]"
        :class="striking ? 'muyu-stick-hit' : ''"
      />
    </button>

    <p class="mt-6 text-center text-sm text-stone-500">
      点击木鱼敲击 · 功德 +1
    </p>

    <p class="mt-8 text-sm text-stone-500">
      想更静一点可开
      <NuxtLink to="/tools/noise" class="text-moss hover:underline">白噪音</NuxtLink>
      ，或去
      <NuxtLink to="/tools/bubbles" class="text-moss hover:underline">捏泡泡</NuxtLink>。
    </p>

    <Teleport to="body">
      <div
        v-for="item in floatTexts"
        :key="item.id"
        class="merit-float pointer-events-none fixed z-50 text-sm font-semibold text-moss"
        :style="{ left: `${item.x}px`, top: `${item.y}px` }"
      >
        功德 +1
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.muyu-hit {
  animation: muyu-squash 0.12s ease-out;
}

.muyu-stick-hit {
  animation: muyu-stick 0.12s ease-out;
}

@keyframes muyu-squash {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.96, 1.03);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes muyu-stick {
  0% {
    transform: rotate(-28deg);
  }
  50% {
    transform: rotate(-8deg) translate(-6px, 10px);
  }
  100% {
    transform: rotate(-28deg);
  }
}
</style>

<style>
.merit-float {
  animation: merit-rise 0.7s ease-out forwards;
  transform: translate(-50%, -120%);
}

@keyframes merit-rise {
  0% {
    opacity: 0;
    transform: translate(-50%, -40%);
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -160%);
  }
}
</style>
