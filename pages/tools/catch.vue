<script setup lang="ts">
const tool = useToolSeo('catch')

const BEST_KEY = 'game-catch-best'
const WIDTH = 320
const HEIGHT = 420
const BASKET_W = 64
const BASKET_H = 18
const FRUIT_R = 12
const MAX_MISSES = 3

interface Fruit {
  id: number
  x: number
  y: number
  vy: number
  kind: number
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
const score = ref(0)
const best = ref(0)
const misses = ref(0)
const status = ref<'ready' | 'playing' | 'over'>('ready')

let basketX = WIDTH / 2
let fruits: Fruit[] = []
let nextId = 1
let spawnAcc = 0
let raf = 0
let lastTs = 0
let keys = { left: false, right: false }
let dragging = false

const KIND_COLORS = ['#2f5d50', '#c4a35a', '#b85c38', '#6b8f71', '#8b5e3c']

function resetState() {
  score.value = 0
  misses.value = 0
  fruits = []
  nextId = 1
  spawnAcc = 0
  basketX = WIDTH / 2
  status.value = 'ready'
}

function stopLoop() {
  if (raf) {
    cancelAnimationFrame(raf)
    raf = 0
  }
}

function draw() {
  const canvas = canvasRef.value
  if (!canvas) {
    return
  }
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return
  }

  ctx.clearRect(0, 0, WIDTH, HEIGHT)

  // ground strip
  ctx.fillStyle = 'rgba(47, 93, 80, 0.08)'
  ctx.fillRect(0, HEIGHT - 36, WIDTH, 36)

  // fruits
  for (const fruit of fruits) {
    ctx.beginPath()
    ctx.fillStyle = KIND_COLORS[fruit.kind % KIND_COLORS.length]!
    ctx.arc(fruit.x, fruit.y, FRUIT_R, 0, Math.PI * 2)
    ctx.fill()
  }

  // basket
  const bx = basketX - BASKET_W / 2
  const by = HEIGHT - 28
  ctx.fillStyle = '#2f5d50'
  ctx.fillRect(bx, by, BASKET_W, BASKET_H)
  ctx.fillStyle = '#9dccb4'
  ctx.fillRect(bx + 4, by + 4, BASKET_W - 8, 4)
}

function spawnFruit() {
  fruits.push({
    id: nextId++,
    x: FRUIT_R + Math.random() * (WIDTH - FRUIT_R * 2),
    y: -FRUIT_R,
    vy: 1.6 + Math.random() * 1.4 + Math.min(2.2, score.value * 0.05),
    kind: Math.floor(Math.random() * KIND_COLORS.length),
  })
}

function step(dt: number) {
  const speed = 260
  if (keys.left) {
    basketX -= speed * dt
  }
  if (keys.right) {
    basketX += speed * dt
  }
  basketX = Math.max(BASKET_W / 2, Math.min(WIDTH - BASKET_W / 2, basketX))

  spawnAcc += dt
  const spawnEvery = Math.max(0.45, 1.05 - score.value * 0.02)
  if (spawnAcc >= spawnEvery) {
    spawnAcc = 0
    spawnFruit()
  }

  const basketTop = HEIGHT - 28
  const basketLeft = basketX - BASKET_W / 2
  const basketRight = basketX + BASKET_W / 2

  const remain: Fruit[] = []
  for (const fruit of fruits) {
    fruit.y += fruit.vy * dt * 60
    const hit = fruit.y + FRUIT_R >= basketTop
      && fruit.y - FRUIT_R <= basketTop + BASKET_H
      && fruit.x >= basketLeft
      && fruit.x <= basketRight

    if (hit) {
      score.value += 1
      if (score.value > best.value) {
        best.value = score.value
        if (import.meta.client) {
          localStorage.setItem(BEST_KEY, String(best.value))
        }
      }
      continue
    }

    if (fruit.y - FRUIT_R > HEIGHT) {
      misses.value += 1
      if (misses.value >= MAX_MISSES) {
        status.value = 'over'
        stopLoop()
      }
      continue
    }

    remain.push(fruit)
  }
  fruits = remain
}

function loop(ts: number) {
  if (status.value !== 'playing') {
    draw()
    return
  }
  if (!lastTs) {
    lastTs = ts
  }
  const dt = Math.min(0.05, (ts - lastTs) / 1000)
  lastTs = ts
  step(dt)
  draw()
  if (status.value === 'playing') {
    raf = requestAnimationFrame(loop)
  }
}

function startGame() {
  if (status.value === 'over') {
    resetState()
  }
  status.value = 'playing'
  lastTs = 0
  stopLoop()
  raf = requestAnimationFrame(loop)
}

function newGame() {
  stopLoop()
  resetState()
  draw()
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
    keys.left = true
    event.preventDefault()
    if (status.value === 'ready') {
      startGame()
    }
  }
  if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
    keys.right = true
    event.preventDefault()
    if (status.value === 'ready') {
      startGame()
    }
  }
  if ((event.key === ' ' || event.key === 'Enter') && status.value !== 'playing') {
    event.preventDefault()
    startGame()
  }
}

function onKeyUp(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
    keys.left = false
  }
  if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
    keys.right = false
  }
}

function pointerToX(clientX: number) {
  const canvas = canvasRef.value
  if (!canvas) {
    return basketX
  }
  const rect = canvas.getBoundingClientRect()
  const ratio = WIDTH / rect.width
  return (clientX - rect.left) * ratio
}

function onPointerDown(event: PointerEvent) {
  dragging = true
  canvasRef.value?.setPointerCapture(event.pointerId)
  basketX = Math.max(BASKET_W / 2, Math.min(WIDTH - BASKET_W / 2, pointerToX(event.clientX)))
  if (status.value !== 'playing') {
    startGame()
  }
  draw()
}

function onPointerMove(event: PointerEvent) {
  if (!dragging) {
    return
  }
  basketX = Math.max(BASKET_W / 2, Math.min(WIDTH - BASKET_W / 2, pointerToX(event.clientX)))
}

function onPointerUp() {
  dragging = false
}

onMounted(() => {
  if (import.meta.client) {
    best.value = Number(localStorage.getItem(BEST_KEY) || 0) || 0
  }
  resetState()
  nextTick(() => draw())
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
})

onBeforeUnmount(() => {
  stopLoop()
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
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
      左右移动篮子接住掉下来的水果。方向键或 A/D，手机可拖动。漏接 {{ MAX_MISSES }} 次就结束。
    </p>

    <div class="mt-8 flex flex-wrap items-end justify-between gap-4">
      <div class="flex gap-3">
        <div class="rounded-2xl border border-stone-300/80 bg-white/60 px-4 py-3">
          <p class="text-xs text-stone-500">分数</p>
          <p class="mt-0.5 text-xl font-semibold tabular-nums">{{ score }}</p>
        </div>
        <div class="rounded-2xl border border-stone-300/80 bg-white/60 px-4 py-3">
          <p class="text-xs text-stone-500">最高</p>
          <p class="mt-0.5 text-xl font-semibold tabular-nums">{{ best }}</p>
        </div>
        <div class="rounded-2xl border border-stone-300/80 bg-white/60 px-4 py-3">
          <p class="text-xs text-stone-500">漏接</p>
          <p class="mt-0.5 text-xl font-semibold tabular-nums">{{ misses }}/{{ MAX_MISSES }}</p>
        </div>
      </div>
      <div class="flex gap-2">
        <button
          v-if="status !== 'playing'"
          type="button"
          class="rounded-xl bg-moss px-4 py-2.5 text-sm font-medium text-white transition hover:bg-moss/90"
          @click="startGame"
        >
          {{ status === 'over' ? '再来一局' : '开始' }}
        </button>
        <button
          type="button"
          class="rounded-xl border border-stone-300/80 bg-white/60 px-4 py-2.5 text-sm text-stone-700 transition hover:border-moss/50"
          @click="newGame"
        >
          重置
        </button>
      </div>
    </div>

    <div class="relative mt-6 inline-block max-w-full">
      <canvas
        ref="canvasRef"
        :width="WIDTH"
        :height="HEIGHT"
        class="w-full max-w-md touch-none rounded-2xl border border-stone-300/80 bg-white/70"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      />
      <div
        v-if="status === 'over'"
        class="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-paper/90 px-4 text-center"
      >
        <p class="text-xl font-semibold">本局结束</p>
        <p class="mt-2 text-sm text-stone-600">接到 {{ score }} 个</p>
        <button
          type="button"
          class="mt-4 rounded-xl bg-moss px-4 py-2 text-sm font-medium text-white"
          @click="startGame"
        >
          再来一局
        </button>
      </div>
      <p
        v-else-if="status === 'ready'"
        class="pointer-events-none absolute inset-x-0 top-6 text-center text-sm text-stone-500"
      >
        点击画面或按开始
      </p>
    </div>

    <p class="mt-6 text-sm text-stone-500">
      也可以玩玩
      <NuxtLink to="/tools/bubbles" class="text-moss hover:underline">捏泡泡</NuxtLink>
      或
      <NuxtLink to="/tools/match3" class="text-moss hover:underline">消消看</NuxtLink>。
    </p>
  </div>
</template>
