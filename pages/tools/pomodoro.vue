<script setup lang="ts">
const tool = useToolSeo('pomodoro')

type Phase = 'focus' | 'short' | 'long'

const presets: Array<{ id: Phase; label: string; minutes: number }> = [
  { id: 'focus', label: '专注', minutes: 25 },
  { id: 'short', label: '短休', minutes: 5 },
  { id: 'long', label: '长休', minutes: 15 },
]

const phase = ref<Phase>('focus')
const focusMinutes = ref(25)
const shortMinutes = ref(5)
const longMinutes = ref(15)
const remaining = ref(25 * 60)
const running = ref(false)
const completedFocus = ref(0)
const notifyEnabled = ref(false)

let tickTimer: ReturnType<typeof setInterval> | undefined
let audioCtx: AudioContext | null = null

const phaseLabel = computed(() => presets.find(item => item.id === phase.value)?.label ?? '专注')

const display = computed(() => {
  const m = Math.floor(remaining.value / 60)
  const s = remaining.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

const totalSeconds = computed(() => {
  if (phase.value === 'focus') {
    return Math.max(1, Math.round(focusMinutes.value)) * 60
  }
  if (phase.value === 'short') {
    return Math.max(1, Math.round(shortMinutes.value)) * 60
  }
  return Math.max(1, Math.round(longMinutes.value)) * 60
})

const progress = computed(() => {
  const total = totalSeconds.value
  if (total <= 0) {
    return 0
  }
  return Math.min(1, 1 - remaining.value / total)
})

function minutesFor(next: Phase) {
  if (next === 'focus') {
    return Math.max(1, Math.round(Number(focusMinutes.value) || 25))
  }
  if (next === 'short') {
    return Math.max(1, Math.round(Number(shortMinutes.value) || 5))
  }
  return Math.max(1, Math.round(Number(longMinutes.value) || 15))
}

function stopTick() {
  if (tickTimer) {
    clearInterval(tickTimer)
    tickTimer = undefined
  }
  running.value = false
}

function playChime() {
  try {
    if (!audioCtx) {
      audioCtx = new AudioContext()
    }
    const ctx = audioCtx
    void ctx.resume()
    const now = ctx.currentTime
    ;[523.25, 659.25, 783.99].forEach((freq, index) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02 + index * 0.12)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45 + index * 0.12)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + index * 0.12)
      osc.stop(now + 0.5 + index * 0.12)
    })
  }
  catch {
    // ignore audio failures
  }
}

async function notifyDone() {
  playChime()
  if (!notifyEnabled.value || typeof Notification === 'undefined') {
    return
  }
  if (Notification.permission === 'default') {
    await Notification.requestPermission()
  }
  if (Notification.permission === 'granted') {
    new Notification(`${phaseLabel.value}结束`, {
      body: phase.value === 'focus' ? '休息一下，再继续。' : '可以开始下一轮专注了。',
    })
  }
}

function onComplete() {
  stopTick()
  remaining.value = 0
  if (phase.value === 'focus') {
    completedFocus.value += 1
  }
  void notifyDone()
}

function startTick() {
  stopTick()
  if (remaining.value <= 0) {
    remaining.value = totalSeconds.value
  }
  running.value = true
  tickTimer = setInterval(() => {
    if (remaining.value <= 1) {
      onComplete()
      return
    }
    remaining.value -= 1
  }, 1000)
}

function toggle() {
  if (running.value) {
    stopTick()
    return
  }
  startTick()
}

function resetTimer() {
  stopTick()
  remaining.value = totalSeconds.value
}

function selectPhase(next: Phase) {
  phase.value = next
  stopTick()
  remaining.value = minutesFor(next) * 60
}

async function enableNotify() {
  if (typeof Notification === 'undefined') {
    notifyEnabled.value = false
    return
  }
  const permission = await Notification.requestPermission()
  notifyEnabled.value = permission === 'granted'
}

watch([focusMinutes, shortMinutes, longMinutes], () => {
  if (!running.value) {
    remaining.value = totalSeconds.value
  }
})

watch(display, (value) => {
  if (!import.meta.client) {
    return
  }
  document.title = running.value ? `${value} · ${phaseLabel.value}` : tool.title
})

onBeforeUnmount(() => {
  stopTick()
  void audioCtx?.close()
  audioCtx = null
  if (import.meta.client) {
    document.title = tool.title
  }
})
</script>

<template>
  <div>
    <p class="text-sm text-moss">
      <NuxtLink to="/tools" class="hover:underline">实用工具</NuxtLink>
      <span class="mx-1.5 text-stone-400">/</span>
      番茄钟
    </p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight">{{ tool.title }}</h1>
    <p class="mt-4 max-w-3xl leading-8 text-stone-700">
      专注一段时间，再短暂休息。时长可改；结束后会有提示音，也可开启浏览器通知。
    </p>

    <div class="mt-8 flex flex-wrap gap-2">
      <button
        v-for="item in presets"
        :key="item.id"
        type="button"
        class="rounded-xl border px-3 py-1.5 text-sm transition"
        :class="phase === item.id
          ? 'border-moss bg-moss text-white'
          : 'border-stone-300/80 bg-white/60 text-stone-700 hover:border-moss/50'"
        @click="selectPhase(item.id)"
      >
        {{ item.label }}
      </button>
    </div>

    <section class="mt-8 max-w-xl rounded-2xl border border-stone-300/80 bg-white/60 px-5 py-8 text-center">
      <p class="text-sm text-moss">{{ phaseLabel }}</p>
      <p class="mt-3 font-mono text-6xl font-semibold tracking-tight text-ink tabular-nums sm:text-7xl">
        {{ display }}
      </p>

      <div class="mx-auto mt-6 h-1.5 max-w-xs overflow-hidden rounded-full bg-stone-200/80">
        <div
          class="h-full rounded-full bg-moss transition-[width] duration-1000 ease-linear"
          :style="{ width: `${progress * 100}%` }"
        />
      </div>

      <div class="mt-8 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          class="rounded-xl bg-moss px-5 py-2.5 text-sm font-medium text-white transition hover:bg-moss/90"
          @click="toggle"
        >
          {{ running ? '暂停' : remaining === 0 ? '再来一轮' : '开始' }}
        </button>
        <button
          type="button"
          class="rounded-xl border border-stone-300/80 bg-white/60 px-4 py-2.5 text-sm text-stone-700 transition hover:border-moss/50"
          @click="resetTimer"
        >
          重置
        </button>
      </div>

      <p class="mt-5 text-sm text-stone-600">
        已完成专注 {{ completedFocus }} 轮
      </p>
    </section>

    <section class="mt-8 grid max-w-xl gap-4 sm:grid-cols-3">
      <label class="block">
        <span class="mb-1.5 block text-sm text-stone-600">专注（分）</span>
        <input
          v-model.number="focusMinutes"
          type="number"
          min="1"
          max="180"
          class="w-full rounded-xl border border-stone-300/80 bg-white/70 px-3 py-2.5 text-ink outline-none ring-moss/30 focus:ring-2"
          :disabled="running"
        >
      </label>
      <label class="block">
        <span class="mb-1.5 block text-sm text-stone-600">短休（分）</span>
        <input
          v-model.number="shortMinutes"
          type="number"
          min="1"
          max="60"
          class="w-full rounded-xl border border-stone-300/80 bg-white/70 px-3 py-2.5 text-ink outline-none ring-moss/30 focus:ring-2"
          :disabled="running"
        >
      </label>
      <label class="block">
        <span class="mb-1.5 block text-sm text-stone-600">长休（分）</span>
        <input
          v-model.number="longMinutes"
          type="number"
          min="1"
          max="60"
          class="w-full rounded-xl border border-stone-300/80 bg-white/70 px-3 py-2.5 text-ink outline-none ring-moss/30 focus:ring-2"
          :disabled="running"
        >
      </label>
    </section>

    <div class="mt-6 flex flex-wrap items-center gap-3">
      <button
        type="button"
        class="rounded-xl border border-stone-300/80 bg-white/60 px-3 py-1.5 text-sm text-stone-700 transition hover:border-moss/50"
        @click="enableNotify"
      >
        {{ notifyEnabled ? '通知已开启' : '开启结束通知' }}
      </button>
      <p class="text-sm text-stone-500">
        可搭配
        <NuxtLink to="/tools/noise" class="text-moss hover:underline">白噪音</NuxtLink>
      </p>
    </div>
  </div>
</template>
