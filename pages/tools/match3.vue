<script setup lang="ts">
const tool = useToolSeo('match3')

const ROWS = 8
const COLS = 8
const TYPES = 5
const BEST_KEY = 'game-match3-best'

/** Tile kinds shown as short labels */
const LABELS = ['A', 'B', 'C', 'D', 'E'] as const

type Board = number[][]

const board = ref<Board>([])
const selected = ref<{ r: number; c: number } | null>(null)
const score = ref(0)
const best = ref(0)
const moves = ref(0)
const busy = ref(false)
const message = ref('点选一个方块，再点相邻方块交换')

function randType() {
  return Math.floor(Math.random() * TYPES)
}

function createBoard(): Board {
  const next: Board = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => randType()),
  )
  // Avoid starting with ready matches
  for (let guard = 0; guard < 40; guard += 1) {
    const matches = findMatches(next)
    if (!matches.size) {
      break
    }
    for (const key of matches) {
      const [r, c] = key.split(',').map(Number) as [number, number]
      next[r]![c] = randType()
    }
  }
  return next
}

function cellKey(r: number, c: number) {
  return `${r},${c}`
}

function findMatches(source: Board) {
  const matched = new Set<string>()

  for (let r = 0; r < ROWS; r += 1) {
    let run = 1
    for (let c = 1; c <= COLS; c += 1) {
      const same = c < COLS && source[r]![c] === source[r]![c - 1]
      if (same) {
        run += 1
      }
      else {
        if (run >= 3) {
          for (let k = c - run; k < c; k += 1) {
            matched.add(cellKey(r, k))
          }
        }
        run = 1
      }
    }
  }

  for (let c = 0; c < COLS; c += 1) {
    let run = 1
    for (let r = 1; r <= ROWS; r += 1) {
      const same = r < ROWS && source[r]![c] === source[r - 1]![c]
      if (same) {
        run += 1
      }
      else {
        if (run >= 3) {
          for (let k = r - run; k < r; k += 1) {
            matched.add(cellKey(k, c))
          }
        }
        run = 1
      }
    }
  }

  return matched
}

function wouldMatchAfterSwap(source: Board, r1: number, c1: number, r2: number, c2: number) {
  const copy = source.map(row => [...row])
  const tmp = copy[r1]![c1]!
  copy[r1]![c1] = copy[r2]![c2]!
  copy[r2]![c2] = tmp
  return findMatches(copy).size > 0
}

function adjacent(a: { r: number; c: number }, b: { r: number; c: number }) {
  return Math.abs(a.r - b.r) + Math.abs(a.c - b.c) === 1
}

async function wait(ms: number) {
  await new Promise(resolve => setTimeout(resolve, ms))
}

function applyGravity(source: Board) {
  for (let c = 0; c < COLS; c += 1) {
    let write = ROWS - 1
    for (let r = ROWS - 1; r >= 0; r -= 1) {
      if (source[r]![c] !== -1) {
        source[write]![c] = source[r]![c]!
        if (write !== r) {
          source[r]![c] = -1
        }
        write -= 1
      }
    }
    for (let r = write; r >= 0; r -= 1) {
      source[r]![c] = randType()
    }
  }
}

async function resolveBoard() {
  let cascade = 0
  while (true) {
    const matches = findMatches(board.value)
    if (!matches.size) {
      break
    }
    cascade += 1
    const gained = matches.size * 10 * cascade
    score.value += gained
    if (score.value > best.value) {
      best.value = score.value
      if (import.meta.client) {
        localStorage.setItem(BEST_KEY, String(best.value))
      }
    }

    const next = board.value.map(row => [...row])
    for (const key of matches) {
      const [r, c] = key.split(',').map(Number) as [number, number]
      next[r]![c] = -1
    }
    board.value = next
    message.value = cascade > 1 ? `连锁 ×${cascade}，+${gained}` : `消除 +${gained}`
    await wait(180)

    const fallen = board.value.map(row => [...row])
    applyGravity(fallen)
    board.value = fallen
    await wait(160)
  }
}

async function trySwap(a: { r: number; c: number }, b: { r: number; c: number }) {
  if (!adjacent(a, b)) {
    selected.value = b
    return
  }

  if (!wouldMatchAfterSwap(board.value, a.r, a.c, b.r, b.c)) {
    message.value = '这样交换消不掉，换一组试试'
    selected.value = null
    return
  }

  busy.value = true
  const next = board.value.map(row => [...row])
  const tmp = next[a.r]![a.c]!
  next[a.r]![a.c] = next[b.r]![b.c]!
  next[b.r]![b.c] = tmp
  board.value = next
  selected.value = null
  moves.value += 1
  await wait(120)
  await resolveBoard()
  message.value = '继续点选相邻方块交换'
  busy.value = false
}

async function onCell(r: number, c: number) {
  if (busy.value || board.value[r]![c] === -1) {
    return
  }
  if (!selected.value) {
    selected.value = { r, c }
    message.value = '再点相邻的方块进行交换'
    return
  }
  if (selected.value.r === r && selected.value.c === c) {
    selected.value = null
    message.value = '点选一个方块，再点相邻方块交换'
    return
  }
  await trySwap(selected.value, { r, c })
}

function tileClass(type: number, r: number, c: number) {
  if (type < 0) {
    return 'bg-transparent text-transparent'
  }
  const colors = [
    'bg-moss/25 text-moss',
    'bg-stone-300/80 text-stone-700',
    'bg-amber-100 text-amber-800',
    'bg-sky-100 text-sky-800',
    'bg-rose-100 text-rose-800',
  ]
  const base = colors[type] ?? colors[0]
  const isSelected = selected.value?.r === r && selected.value?.c === c
  return `${base} ${isSelected ? 'ring-2 ring-moss scale-95' : ''}`
}

function newGame() {
  board.value = createBoard()
  selected.value = null
  score.value = 0
  moves.value = 0
  busy.value = false
  message.value = '点选一个方块，再点相邻方块交换'
}

onMounted(() => {
  if (import.meta.client) {
    best.value = Number(localStorage.getItem(BEST_KEY) || 0) || 0
  }
  newGame()
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
      简化三消：先点一个方块，再点上下左右相邻的方块交换。横或竖有三个及以上相同就会消除，掉落可连锁得分。
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
          <p class="text-xs text-stone-500">步数</p>
          <p class="mt-0.5 text-xl font-semibold tabular-nums">{{ moves }}</p>
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

    <p class="mt-4 text-sm text-stone-600">{{ message }}</p>

    <div class="mt-4 w-full max-w-md rounded-2xl border border-stone-300/80 bg-stone-200/40 p-3">
      <div
        class="grid gap-1.5"
        :style="{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }"
      >
        <button
          v-for="(type, index) in board.flat()"
          :key="index"
          type="button"
          class="flex aspect-square items-center justify-center rounded-xl text-sm font-semibold transition sm:text-base"
          :class="tileClass(type, Math.floor(index / COLS), index % COLS)"
          :disabled="busy || type < 0"
          @click="onCell(Math.floor(index / COLS), index % COLS)"
        >
          {{ type >= 0 ? LABELS[type] : '' }}
        </button>
      </div>
    </div>

    <p class="mt-6 text-sm text-stone-500">
      也可以玩玩
      <NuxtLink to="/tools/bubbles" class="text-moss hover:underline">捏泡泡</NuxtLink>
      或
      <NuxtLink to="/tools/catch" class="text-moss hover:underline">接水果</NuxtLink>。
    </p>
  </div>
</template>
