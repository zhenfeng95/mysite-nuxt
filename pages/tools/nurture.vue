<script setup lang="ts">
const tool = useToolSeo('nurture')

type Mode = 'cat' | 'tree'
type Mood = 'idle' | 'happy' | 'eat' | 'water'

const STORAGE_KEY = 'game-nurture-v1'

const mode = ref<Mode>('cat')
const catCare = ref(0)
const treeCare = ref(0)
const mood = ref<Mood>('idle')
const floatLabel = ref('')
const showFloat = ref(false)

let moodTimer: ReturnType<typeof setTimeout> | undefined
let floatTimer: ReturnType<typeof setTimeout> | undefined

const modes: Array<{ id: Mode; label: string }> = [
  { id: 'cat', label: '云养猫' },
  { id: 'tree', label: '云种树' },
]

const care = computed(() => (mode.value === 'cat' ? catCare.value : treeCare.value))

const stage = computed(() => {
  const n = care.value
  if (n < 5) {
    return 0
  }
  if (n < 15) {
    return 1
  }
  if (n < 35) {
    return 2
  }
  return 3
})

const stageText = computed(() => {
  if (mode.value === 'cat') {
    return ['还有点认生', '开始亲近你了', '吃得圆滚滚', '安心趴着晒太阳'][stage.value]
  }
  return ['刚冒出小芽', '抽出几片嫩叶', '枝干慢慢长高', '已经像棵小树了'][stage.value]
})

function persist() {
  if (!import.meta.client) {
    return
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    catCare: catCare.value,
    treeCare: treeCare.value,
  }))
}

function load() {
  if (!import.meta.client) {
    return
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return
    }
    const parsed = JSON.parse(raw) as { catCare?: number; treeCare?: number }
    if (typeof parsed.catCare === 'number') {
      catCare.value = parsed.catCare
    }
    if (typeof parsed.treeCare === 'number') {
      treeCare.value = parsed.treeCare
    }
  }
  catch {
    // ignore
  }
}

function flash(next: Mood, label: string) {
  mood.value = next
  floatLabel.value = label
  showFloat.value = true

  if (moodTimer) {
    clearTimeout(moodTimer)
  }
  if (floatTimer) {
    clearTimeout(floatTimer)
  }
  moodTimer = setTimeout(() => {
    mood.value = 'happy'
    moodTimer = setTimeout(() => {
      mood.value = 'idle'
    }, 500)
  }, 420)
  floatTimer = setTimeout(() => {
    showFloat.value = false
  }, 700)
}

function careOnce() {
  if (mode.value === 'cat') {
    catCare.value += 1
    flash('eat', '好吃！')
  }
  else {
    treeCare.value += 1
    flash('water', '滋润')
  }
  persist()
}

function switchMode(next: Mode) {
  mode.value = next
  mood.value = 'idle'
  showFloat.value = false
}

function resetCurrent() {
  if (mode.value === 'cat') {
    catCare.value = 0
  }
  else {
    treeCare.value = 0
  }
  mood.value = 'idle'
  persist()
}

onMounted(() => {
  load()
})

onBeforeUnmount(() => {
  if (moodTimer) {
    clearTimeout(moodTimer)
  }
  if (floatTimer) {
    clearTimeout(floatTimer)
  }
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
      极简养成：养猫或种树。点一下喂食 / 浇水，看一点动画反馈。没有催促，进度存在本机。
    </p>

    <div class="mt-8 flex flex-wrap gap-2">
      <button
        v-for="item in modes"
        :key="item.id"
        type="button"
        class="rounded-xl border px-3 py-1.5 text-sm transition"
        :class="mode === item.id
          ? 'border-moss bg-moss text-white'
          : 'border-stone-300/80 bg-white/60 text-stone-700 hover:border-moss/50'"
        @click="switchMode(item.id)"
      >
        {{ item.label }}
      </button>
    </div>

    <div class="mt-6 flex flex-wrap items-end justify-between gap-4">
      <div class="flex gap-3">
        <div class="rounded-2xl border border-stone-300/80 bg-white/60 px-4 py-3">
          <p class="text-xs text-stone-500">{{ mode === 'cat' ? '投喂' : '浇水' }}</p>
          <p class="mt-0.5 text-xl font-semibold tabular-nums">{{ care }}</p>
        </div>
        <div class="rounded-2xl border border-stone-300/80 bg-white/60 px-4 py-3">
          <p class="text-xs text-stone-500">状态</p>
          <p class="mt-0.5 text-sm font-semibold">{{ stageText }}</p>
        </div>
      </div>
      <button
        type="button"
        class="rounded-xl border border-stone-300/80 bg-white/60 px-4 py-2.5 text-sm text-stone-700 transition hover:border-moss/50"
        @click="resetCurrent"
      >
        重新养起
      </button>
    </div>

    <button
      type="button"
      class="relative mx-auto mt-8 flex h-64 w-full max-w-md touch-manipulation flex-col items-center justify-end overflow-hidden rounded-2xl border border-stone-300/80 bg-gradient-to-b from-sky-50/80 to-stone-200/50 px-4 pb-6 pt-8 outline-none transition active:scale-[0.99] sm:h-72"
      :aria-label="mode === 'cat' ? '喂食' : '浇水'"
      @pointerdown.prevent="careOnce"
    >
      <p
        v-if="showFloat"
        class="care-float pointer-events-none absolute left-1/2 top-8 z-10 -translate-x-1/2 text-sm font-semibold text-moss"
      >
        {{ floatLabel }}
      </p>

      <!-- Cat -->
      <div
        v-if="mode === 'cat'"
        class="cat relative mb-2"
        :class="{
          'cat-eat': mood === 'eat',
          'cat-happy': mood === 'happy',
        }"
      >
        <div
          class="relative mx-auto"
          :style="{ transform: `scale(${0.85 + stage * 0.08})` }"
        >
          <div class="absolute -left-3 top-2 h-8 w-5 -rotate-12 rounded-t-full bg-[#d6c2a8]" />
          <div class="absolute -right-3 top-2 h-8 w-5 rotate-12 rounded-t-full bg-[#d6c2a8]" />
          <div class="h-24 w-28 rounded-[2rem] bg-[#e4d2b8] shadow-[inset_0_-8px_0_rgba(0,0,0,0.04)]">
            <div class="absolute left-7 top-10 h-2.5 w-2.5 rounded-full bg-ink" />
            <div class="absolute right-7 top-10 h-2.5 w-2.5 rounded-full bg-ink" />
            <div
              class="absolute left-1/2 top-[3.4rem] h-2 w-3 -translate-x-1/2 rounded-b-full bg-[#c4a07a]"
              :class="mood === 'eat' ? 'scale-125' : ''"
            />
            <div
              v-if="mood === 'happy' || mood === 'eat'"
              class="absolute left-5 top-8 h-1.5 w-3 rounded-full bg-[#f0b7b0]/70"
            />
            <div
              v-if="mood === 'happy' || mood === 'eat'"
              class="absolute right-5 top-8 h-1.5 w-3 rounded-full bg-[#f0b7b0]/70"
            />
          </div>
          <div class="mx-auto -mt-2 h-16 w-32 rounded-[2rem] bg-[#e4d2b8]" />
          <div
            class="cat-tail absolute -right-6 bottom-6 h-3 w-14 origin-left rounded-full bg-[#d6c2a8]"
            :class="mood !== 'idle' ? 'cat-tail-wag' : ''"
          />
        </div>
        <p class="mt-4 text-center text-sm text-stone-600">点一下喂食</p>
      </div>

      <!-- Tree -->
      <div
        v-else
        class="tree relative mb-2 flex flex-col items-center"
        :class="{
          'tree-water': mood === 'water',
          'tree-happy': mood === 'happy',
        }"
      >
        <div
          class="relative flex flex-col items-center"
          :style="{ transform: `scale(${0.75 + stage * 0.12})` }"
        >
          <div
            class="rounded-full bg-moss/70"
            :class="stage === 0 ? 'mb-0 h-8 w-8' : stage === 1 ? 'mb-0 h-14 w-14' : stage === 2 ? 'h-20 w-20' : 'h-24 w-28'"
          />
          <div
            v-if="stage >= 1"
            class="absolute top-2 h-10 w-10 -translate-x-8 rounded-full bg-moss/50"
          />
          <div
            v-if="stage >= 2"
            class="absolute top-3 h-12 w-12 translate-x-7 rounded-full bg-moss/55"
          />
          <div
            class="w-3 rounded-b-md bg-[#6b4a32]"
            :class="stage === 0 ? 'h-8' : stage === 1 ? 'h-12' : stage === 2 ? 'h-16' : 'h-20'"
          />
        </div>
        <div class="mt-1 h-3 w-28 rounded-full bg-[#c4b59a]" />
        <div
          v-if="mood === 'water'"
          class="pointer-events-none absolute left-1/2 top-0 flex -translate-x-1/2 gap-2"
        >
          <span class="drop h-2.5 w-2 rounded-full bg-sky-400/80" />
          <span class="drop drop-delay h-2.5 w-2 rounded-full bg-sky-400/80" />
          <span class="drop drop-delay-2 h-2.5 w-2 rounded-full bg-sky-400/80" />
        </div>
        <p class="mt-4 text-center text-sm text-stone-600">点一下浇水</p>
      </div>
    </button>

    <p class="mt-6 text-sm text-stone-500">
      也可以去
      <NuxtLink to="/tools/muyu" class="text-moss hover:underline">敲木鱼</NuxtLink>
      或
      <NuxtLink to="/tools/bubbles" class="text-moss hover:underline">捏泡泡</NuxtLink>。
    </p>
  </div>
</template>

<style scoped>
.cat-eat {
  animation: cat-bounce 0.42s ease-out;
}

.cat-happy {
  animation: cat-sway 0.5s ease-out;
}

.cat-tail {
  transform: rotate(18deg);
}

.cat-tail-wag {
  animation: tail-wag 0.45s ease-in-out;
}

.tree-water {
  animation: tree-sway 0.45s ease-out;
}

.tree-happy {
  animation: tree-sway 0.5s ease-out;
}

.drop {
  animation: drop-fall 0.45s ease-in forwards;
}

.drop-delay {
  animation-delay: 0.06s;
}

.drop-delay-2 {
  animation-delay: 0.12s;
}

.care-float {
  animation: care-rise 0.7s ease-out forwards;
}

@keyframes cat-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px) scale(1.03);
  }
}

@keyframes cat-sway {
  0%,
  100% {
    transform: rotate(0deg);
  }
  40% {
    transform: rotate(-3deg);
  }
  70% {
    transform: rotate(3deg);
  }
}

@keyframes tail-wag {
  0%,
  100% {
    transform: rotate(18deg);
  }
  50% {
    transform: rotate(42deg);
  }
}

@keyframes tree-sway {
  0%,
  100% {
    transform: rotate(0deg);
  }
  40% {
    transform: rotate(-2deg);
  }
  70% {
    transform: rotate(2deg);
  }
}

@keyframes drop-fall {
  0% {
    opacity: 0;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(36px);
  }
}

@keyframes care-rise {
  0% {
    opacity: 0;
    transform: translate(-50%, 8px);
  }
  25% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -18px);
  }
}
</style>
