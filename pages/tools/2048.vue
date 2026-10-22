<script setup lang="ts">
const tool = useToolSeo('2048')

const SIZE = 4
const BEST_KEY = 'game-2048-best'

type Cell = number
type Board = Cell[][]

const board = ref<Board>(emptyBoard())
const score = ref(0)
const best = ref(0)
const won = ref(false)
const over = ref(false)
const keepGoing = ref(false)
const movedFlash = ref(0)

let touchStartX = 0
let touchStartY = 0

function emptyBoard(): Board {
  return Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => 0))
}

function cloneBoard(source: Board): Board {
  return source.map(row => [...row])
}

function emptyCells(source: Board) {
  const cells: Array<[number, number]> = []
  for (let r = 0; r < SIZE; r += 1) {
    for (let c = 0; c < SIZE; c += 1) {
      if (source[r]![c] === 0) {
        cells.push([r, c])
      }
    }
  }
  return cells
}

function addRandom(source: Board) {
  const cells = emptyCells(source)
  if (!cells.length) {
    return
  }
  const [r, c] = cells[Math.floor(Math.random() * cells.length)]!
  source[r]![c] = Math.random() < 0.9 ? 2 : 4
}

function slideLine(line: number[]) {
  const filtered = line.filter(n => n !== 0)
  const result: number[] = []
  let gained = 0
  let i = 0
  while (i < filtered.length) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      const merged = filtered[i]! * 2
      result.push(merged)
      gained += merged
      i += 2
    }
    else {
      result.push(filtered[i]!)
      i += 1
    }
  }
  while (result.length < SIZE) {
    result.push(0)
  }
  return { line: result, gained }
}

function move(direction: 'left' | 'right' | 'up' | 'down') {
  if (over.value || (won.value && !keepGoing.value)) {
    return
  }

  const next = cloneBoard(board.value)
  let gained = 0
  let changed = false

  const applyRow = (r: number, reverse: boolean) => {
    const original = [...next[r]!]
    const input = reverse ? [...original].reverse() : original
    const { line, gained: g } = slideLine(input)
    const output = reverse ? line.reverse() : line
    gained += g
    for (let c = 0; c < SIZE; c += 1) {
      if (next[r]![c] !== output[c]) {
        changed = true
      }
      next[r]![c] = output[c]!
    }
  }

  const applyCol = (c: number, reverse: boolean) => {
    const original = next.map(row => row[c]!)
    const input = reverse ? [...original].reverse() : original
    const { line, gained: g } = slideLine(input)
    const output = reverse ? line.reverse() : line
    gained += g
    for (let r = 0; r < SIZE; r += 1) {
      if (next[r]![c] !== output[r]) {
        changed = true
      }
      next[r]![c] = output[r]!
    }
  }

  if (direction === 'left') {
    for (let r = 0; r < SIZE; r += 1) {
      applyRow(r, false)
    }
  }
  else if (direction === 'right') {
    for (let r = 0; r < SIZE; r += 1) {
      applyRow(r, true)
    }
  }
  else if (direction === 'up') {
    for (let c = 0; c < SIZE; c += 1) {
      applyCol(c, false)
    }
  }
  else {
    for (let c = 0; c < SIZE; c += 1) {
      applyCol(c, true)
    }
  }

  if (!changed) {
    return
  }

  addRandom(next)
  board.value = next
  score.value += gained
  if (score.value > best.value) {
    best.value = score.value
    if (import.meta.client) {
      localStorage.setItem(BEST_KEY, String(best.value))
    }
  }
  movedFlash.value += 1

  if (!won.value && next.some(row => row.some(n => n >= 2048))) {
    won.value = true
  }
  if (!canMove(next)) {
    over.value = true
  }
}

function canMove(source: Board) {
  if (emptyCells(source).length) {
    return true
  }
  for (let r = 0; r < SIZE; r += 1) {
    for (let c = 0; c < SIZE; c += 1) {
      const v = source[r]![c]!
      if (c + 1 < SIZE && source[r]![c + 1] === v) {
        return true
      }
      if (r + 1 < SIZE && source[r + 1]![c] === v) {
        return true
      }
    }
  }
  return false
}

function newGame() {
  const next = emptyBoard()
  addRandom(next)
  addRandom(next)
  board.value = next
  score.value = 0
  won.value = false
  over.value = false
  keepGoing.value = false
}

function tileClass(value: number) {
  if (!value) {
    return 'bg-stone-200/50 text-transparent'
  }
  if (value <= 4) {
    return 'bg-white text-ink'
  }
  if (value <= 16) {
    return 'bg-moss/15 text-ink'
  }
  if (value <= 64) {
    return 'bg-moss/30 text-ink'
  }
  if (value <= 256) {
    return 'bg-moss/55 text-white'
  }
  return 'bg-moss text-white'
}

function onKey(event: KeyboardEvent) {
  const map: Record<string, 'left' | 'right' | 'up' | 'down'> = {
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'up',
    ArrowDown: 'down',
    a: 'left',
    d: 'right',
    w: 'up',
    s: 'down',
  }
  const dir = map[event.key]
  if (!dir) {
    return
  }
  event.preventDefault()
  move(dir)
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
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) {
    return
  }
  if (Math.abs(dx) > Math.abs(dy)) {
    move(dx > 0 ? 'right' : 'left')
  }
  else {
    move(dy > 0 ? 'down' : 'up')
  }
}

onMounted(() => {
  if (import.meta.client) {
    best.value = Number(localStorage.getItem(BEST_KEY) || 0) || 0
  }
  newGame()
  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
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
      用方向键或 WASD，手机可滑动。合并相同数字，目标是 2048。最高分保存在本机。
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
      <button
        type="button"
        class="rounded-xl bg-moss px-4 py-2.5 text-sm font-medium text-white transition hover:bg-moss/90"
        @click="newGame"
      >
        新游戏
      </button>
    </div>

    <div
      class="relative mt-6 w-full max-w-md select-none touch-none rounded-2xl border border-stone-300/80 bg-stone-200/40 p-3"
      @touchstart.passive="onTouchStart"
      @touchend.prevent="onTouchEnd"
    >
      <div class="grid grid-cols-4 gap-2">
        <div
          v-for="(value, index) in board.flat()"
          :key="`${movedFlash}-${index}`"
          class="flex aspect-square items-center justify-center rounded-xl text-lg font-semibold tabular-nums sm:text-2xl"
          :class="tileClass(value)"
        >
          {{ value || '' }}
        </div>
      </div>

      <div
        v-if="won && !keepGoing && !over"
        class="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-paper/90 px-4 text-center"
      >
        <p class="text-xl font-semibold">到 2048 了</p>
        <div class="mt-4 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            class="rounded-xl bg-moss px-4 py-2 text-sm font-medium text-white"
            @click="keepGoing = true"
          >
            继续玩
          </button>
          <button
            type="button"
            class="rounded-xl border border-stone-300/80 bg-white/70 px-4 py-2 text-sm"
            @click="newGame"
          >
            再来一局
          </button>
        </div>
      </div>

      <div
        v-if="over"
        class="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-paper/90 px-4 text-center"
      >
        <p class="text-xl font-semibold">没有可移动的步了</p>
        <p class="mt-2 text-sm text-stone-600">本局 {{ score }} 分</p>
        <button
          type="button"
          class="mt-4 rounded-xl bg-moss px-4 py-2 text-sm font-medium text-white"
          @click="newGame"
        >
          再来一局
        </button>
      </div>
    </div>

    <p class="mt-6 text-sm text-stone-500">
      也可以玩玩
      <NuxtLink to="/tools/match3" class="text-moss hover:underline">消消看</NuxtLink>。
    </p>
  </div>
</template>
