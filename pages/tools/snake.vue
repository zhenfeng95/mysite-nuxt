<script setup lang="ts">
const tool = useToolSeo('snake')

const COLS = 20
const ROWS = 20
const BEST_KEY = 'game-snake-best'
const TICK_MS = 120

type Point = { x: number; y: number }
type Dir = 'up' | 'down' | 'left' | 'right'

const snake = ref<Point[]>([])
const food = ref<Point>({ x: 0, y: 0 })
const dir = ref<Dir>('right')
const pendingDir = ref<Dir>('right')
const score = ref(0)
const best = ref(0)
const status = ref<'ready' | 'playing' | 'over'>('ready')

let timer: ReturnType<typeof setInterval> | undefined
let touchStartX = 0
let touchStartY = 0

function stopLoop() {
  if (timer) {
    clearInterval(timer)
    timer = undefined
  }
}

function randomEmptyCell(body: Point[]): Point {
  const occupied = new Set(body.map(p => `${p.x},${p.y}`))
  const empties: Point[] = []
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      if (!occupied.has(`${x},${y}`)) {
        empties.push({ x, y })
      }
    }
  }
  return empties[Math.floor(Math.random() * empties.length)] ?? { x: 0, y: 0 }
}

function resetBoard() {
  const start: Point[] = [
    { x: 8, y: 10 },
    { x: 7, y: 10 },
    { x: 6, y: 10 },
  ]
  snake.value = start
  food.value = randomEmptyCell(start)
  dir.value = 'right'
  pendingDir.value = 'right'
  score.value = 0
  status.value = 'ready'
}

function opposite(a: Dir, b: Dir) {
  return (a === 'up' && b === 'down')
    || (a === 'down' && b === 'up')
    || (a === 'left' && b === 'right')
    || (a === 'right' && b === 'left')
}

function setDir(next: Dir) {
  if (status.value === 'over') {
    return
  }
  if (opposite(dir.value, next)) {
    return
  }
  pendingDir.value = next
}

function tick() {
  dir.value = pendingDir.value
  const head = snake.value[0]!
  const next: Point = {
    x: head.x + (dir.value === 'left' ? -1 : dir.value === 'right' ? 1 : 0),
    y: head.y + (dir.value === 'up' ? -1 : dir.value === 'down' ? 1 : 0),
  }

  if (next.x < 0 || next.x >= COLS || next.y < 0 || next.y >= ROWS) {
    endGame()
    return
  }
  if (snake.value.some(p => p.x === next.x && p.y === next.y)) {
    endGame()
    return
  }

  const grew = next.x === food.value.x && next.y === food.value.y
  const body = [next, ...snake.value]
  if (!grew) {
    body.pop()
  }
  else {
    score.value += 1
    if (score.value > best.value) {
      best.value = score.value
      if (import.meta.client) {
        localStorage.setItem(BEST_KEY, String(best.value))
      }
    }
  }
  snake.value = body
  if (grew) {
    food.value = randomEmptyCell(body)
  }
}

function endGame() {
  stopLoop()
  status.value = 'over'
}

function startGame() {
  if (status.value === 'playing') {
    return
  }
  if (status.value === 'over' || status.value === 'ready') {
    if (status.value === 'over') {
      resetBoard()
    }
  }
  status.value = 'playing'
  stopLoop()
  timer = setInterval(tick, TICK_MS)
}

function newGame() {
  stopLoop()
  resetBoard()
}

function onKey(event: KeyboardEvent) {
  const map: Record<string, Dir> = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    w: 'up',
    s: 'down',
    a: 'left',
    d: 'right',
    W: 'up',
    S: 'down',
    A: 'left',
    D: 'right',
  }
  const next = map[event.key]
  if (!next) {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      if (status.value !== 'playing') {
        startGame()
      }
    }
    return
  }
  event.preventDefault()
  if (status.value === 'ready') {
    startGame()
  }
  setDir(next)
}

function onTouchStart(event: TouchEvent) {
  const t = event.changedTouches[0]
  if (!t) {
    return
  }
  touchStartX = t.clientX
  touchStartY = t.clientY
}

function onTouchEnd(event: TouchEvent) {
  const t = event.changedTouches[0]
  if (!t) {
    return
  }
  const dx = t.clientX - touchStartX
  const dy = t.clientY - touchStartY
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) {
    if (status.value !== 'playing') {
      startGame()
    }
    return
  }
  if (status.value === 'ready') {
    startGame()
  }
  if (Math.abs(dx) > Math.abs(dy)) {
    setDir(dx > 0 ? 'right' : 'left')
  }
  else {
    setDir(dy > 0 ? 'down' : 'up')
  }
}

function cellType(x: number, y: number) {
  if (food.value.x === x && food.value.y === y) {
    return 'food'
  }
  const index = snake.value.findIndex(p => p.x === x && p.y === y)
  if (index === 0) {
    return 'head'
  }
  if (index > 0) {
    return 'body'
  }
  return 'empty'
}

function tileClass(x: number, y: number) {
  const type = cellType(x, y)
  if (type === 'food') {
    return 'bg-gold ring-2 ring-ink/25 ring-inset'
  }
  if (type === 'head') {
    return 'bg-moss'
  }
  if (type === 'body') {
    return 'bg-moss/55'
  }
  return 'bg-stone-100/80'
}

onMounted(() => {
  if (import.meta.client) {
    best.value = Number(localStorage.getItem(BEST_KEY) || 0) || 0
  }
  resetBoard()
  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  stopLoop()
  window.removeEventListener('keydown', onKey)
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
      方向键或 WASD 转向，手机可滑动。绿色是蛇，金色亮格是食物——撞上去就能吃。撞墙或咬到自己会结束。
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

    <div
      class="relative mt-6 w-full max-w-md select-none touch-none rounded-2xl border border-stone-300/80 bg-stone-200/40 p-2"
      @touchstart.passive="onTouchStart"
      @touchend.prevent="onTouchEnd"
    >
      <div
        class="grid gap-0.5"
        :style="{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }"
      >
        <div
          v-for="index in COLS * ROWS"
          :key="index"
          class="aspect-square rounded-[3px]"
          :class="tileClass((index - 1) % COLS, Math.floor((index - 1) / COLS))"
        />
      </div>

      <div
        v-if="status === 'over'"
        class="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-paper/90 px-4 text-center"
      >
        <p class="text-xl font-semibold">本局结束</p>
        <p class="mt-2 text-sm text-stone-600">得分 {{ score }}</p>
        <button
          type="button"
          class="mt-4 rounded-xl bg-moss px-4 py-2 text-sm font-medium text-white"
          @click="startGame"
        >
          再来一局
        </button>
      </div>
    </div>

    <p class="mt-6 text-sm text-stone-500">
      也可以玩玩
      <NuxtLink to="/tools/catch" class="text-moss hover:underline">接水果</NuxtLink>
      或
      <NuxtLink to="/tools/2048" class="text-moss hover:underline">2048</NuxtLink>。
    </p>
  </div>
</template>
