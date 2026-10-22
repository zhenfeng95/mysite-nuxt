<script setup lang="ts">
import { pickLot, rankClass, type LotEntry } from '~/data/lots'

const tool = useToolSeo('lot')

const lot = ref<LotEntry | null>(null)
const shaking = ref(false)
const shakeEnabled = ref(false)
const shakeHint = ref('')
const shareHint = ref('')
const sharing = ref(false)

let audioCtx: AudioContext | null = null
let lastShake = 0
let motionHandler: ((event: DeviceMotionEvent) => void) | null = null
let shareTimer: ReturnType<typeof setTimeout> | undefined

function setShareHint(text: string) {
  shareHint.value = text
  if (shareTimer) {
    clearTimeout(shareTimer)
  }
  shareTimer = setTimeout(() => {
    shareHint.value = ''
  }, 2200)
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const chars = [...text]
  const lines: string[] = []
  let line = ''
  for (const ch of chars) {
    const next = line + ch
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line)
      line = ch
    }
    else {
      line = next
    }
  }
  if (line) {
    lines.push(line)
  }
  return lines
}

function rankColor(rank: string) {
  if (rank.includes('上上')) {
    return '#2f5d50'
  }
  if (rank.includes('下')) {
    return '#78716c'
  }
  return '#1c1915'
}

function loadSiteQr() {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('qr load failed'))
    img.src = '/site-code.png'
  })
}

async function renderLotImage(entry: LotEntry) {
  const width = 720
  const paddingX = 56
  const qrSize = 132
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('canvas unavailable')
  }

  const fontFamily = '"PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif'
  ctx.font = `28px ${fontFamily}`
  const verseLines = wrapText(ctx, entry.verse, width - paddingX * 2)
  ctx.font = `24px ${fontFamily}`
  const tipLines = wrapText(ctx, entry.tip, width - paddingX * 2)

  const height = 120 + 40 + 56 + 36 + verseLines.length * 44 + 28 + tipLines.length * 38 + 56 + qrSize + 72
  canvas.width = width
  canvas.height = height

  // background
  ctx.fillStyle = '#f7f4ee'
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = '#ffffff'
  roundRect(ctx, 28, 28, width - 56, height - 56, 28)
  ctx.fill()

  // top accent
  ctx.fillStyle = 'rgba(47, 93, 80, 0.28)'
  roundRect(ctx, 120, 28, width - 240, 8, 0)
  ctx.fill()

  let y = 100
  ctx.fillStyle = '#78716c'
  ctx.font = `22px ${fontFamily}`
  ctx.textAlign = 'center'
  ctx.fillText('赛博上上签系统', width / 2, y)

  y += 48
  ctx.fillStyle = rankColor(entry.rank)
  ctx.font = `bold 26px ${fontFamily}`
  ctx.fillText(entry.rank, width / 2, y)

  y += 56
  ctx.fillStyle = '#1c1915'
  ctx.font = `bold 44px ${fontFamily}`
  ctx.fillText(entry.title, width / 2, y)

  y += 56
  ctx.fillStyle = '#44403c'
  ctx.font = `28px ${fontFamily}`
  for (const line of verseLines) {
    ctx.fillText(line, width / 2, y)
    y += 44
  }

  y += 12
  ctx.fillStyle = '#78716c'
  ctx.font = `24px ${fontFamily}`
  for (const line of tipLines) {
    ctx.fillText(line, width / 2, y)
    y += 38
  }

  y += 36
  ctx.fillStyle = '#a8a29e'
  ctx.font = `20px ${fontFamily}`
  ctx.fillText('认真你就输了', width / 2, y)

  // site QR
  y += 28
  try {
    const qr = await loadSiteQr()
    const qrX = (width - qrSize) / 2
    ctx.drawImage(qr, qrX, y, qrSize, qrSize)
    y += qrSize + 28
    ctx.fillStyle = '#a8a29e'
    ctx.font = `20px ${fontFamily}`
    ctx.fillText('扫码也来抽一签', width / 2, y)
  }
  catch {
    // QR missing shouldn't block sharing the card
  }

  return canvas
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      }
      else {
        reject(new Error('toBlob failed'))
      }
    }, 'image/png')
  })
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

async function copyLotImage() {
  if (!lot.value || sharing.value) {
    return
  }
  sharing.value = true
  shareHint.value = ''
  try {
    const canvas = await renderLotImage(lot.value)
    const blob = await canvasToBlob(canvas)
    const filename = `赛博抽签-${lot.value.title}.png`

    const canClipboard = typeof ClipboardItem !== 'undefined'
      && !!navigator.clipboard
      && typeof navigator.clipboard.write === 'function'

    if (canClipboard) {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ])
        setShareHint('已复制图片，可直接粘贴')
        return
      }
      catch {
        // fall through to download
      }
    }

    downloadBlob(blob, filename)
    setShareHint('当前环境不支持复制图片，已改为下载')
  }
  catch {
    setShareHint('生成图片失败，请稍后重试')
  }
  finally {
    sharing.value = false
  }
}

function ensureAudio() {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

function playDrawSound() {
  try {
    const ctx = ensureAudio()
    void ctx.resume()
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(520, now)
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.18)
    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.22)
  }
  catch {
    // ignore
  }
}

function draw() {
  shaking.value = true
  playDrawSound()
  window.setTimeout(() => {
    lot.value = pickLot(lot.value?.id)
    shaking.value = false
  }, 280)
}

async function enableShake() {
  shakeHint.value = ''

  if (typeof window === 'undefined' || !window.DeviceMotionEvent) {
    shakeHint.value = '设备不支持摇一摇，点按钮即可'
    return
  }

  try {
    const DME = DeviceMotionEvent as unknown as {
      requestPermission?: () => Promise<PermissionState>
    }
    if (typeof DME.requestPermission === 'function') {
      const state = await DME.requestPermission()
      if (state !== 'granted') {
        shakeHint.value = '没有获得传感器权限，仍可用点击抽签'
        return
      }
    }
  }
  catch {
    shakeHint.value = '当前环境不支持摇一摇，点按钮即可'
    return
  }

  if (motionHandler) {
    window.removeEventListener('devicemotion', motionHandler)
  }

  motionHandler = (event: DeviceMotionEvent) => {
    const acc = event.accelerationIncludingGravity
    if (!acc) {
      return
    }
    const force = Math.abs(acc.x ?? 0) + Math.abs(acc.y ?? 0) + Math.abs(acc.z ?? 0)
    const now = Date.now()
    if (force > 28 && now - lastShake > 1200) {
      lastShake = now
      draw()
    }
  }

  window.addEventListener('devicemotion', motionHandler)
  shakeEnabled.value = true
  shakeHint.value = '已开启，用力摇一摇手机抽签'
  void ensureAudio().resume()
}

function disableShake() {
  if (motionHandler) {
    window.removeEventListener('devicemotion', motionHandler)
    motionHandler = null
  }
  shakeEnabled.value = false
  shakeHint.value = ''
}

onBeforeUnmount(() => {
  disableShake()
  if (shareTimer) {
    clearTimeout(shareTimer)
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
      点一下，或摇一摇，抽出今日签文。幽默、治愈、带点网感——仅供一乐，不当真。
    </p>

    <div class="mt-8 flex flex-wrap gap-2">
      <button
        type="button"
        class="rounded-xl bg-moss px-5 py-2.5 text-sm font-medium text-white transition hover:bg-moss/90"
        @click="draw"
      >
        {{ lot ? '再抽一签' : '抽一签' }}
      </button>
      <button
        type="button"
        class="rounded-xl border px-4 py-2.5 text-sm transition"
        :class="shakeEnabled
          ? 'border-moss bg-moss text-white'
          : 'border-stone-300/80 bg-white/60 text-stone-700 hover:border-moss/50'"
        @click="shakeEnabled ? disableShake() : enableShake()"
      >
        {{ shakeEnabled ? '关闭摇一摇' : '开启摇一摇' }}
      </button>
    </div>
    <p v-if="shakeHint" class="mt-3 text-sm text-stone-500">{{ shakeHint }}</p>

    <section
      class="relative mx-auto mt-8 w-full max-w-md overflow-hidden rounded-2xl border border-stone-300/80 bg-white/70 px-6 py-8 text-center shadow-[0_10px_30px_rgb(0,0,0,0.04)]"
      :class="shaking ? 'lot-shake' : ''"
    >
      <div class="pointer-events-none absolute inset-x-8 top-0 h-1 rounded-b bg-moss/30" />
      <template v-if="lot">
        <p class="text-sm tracking-widest text-stone-500">赛博上上签系统</p>
        <p class="mt-3 text-sm font-semibold" :class="rankClass(lot.rank)">
          {{ lot.rank }}
        </p>
        <h2 class="mt-3 text-2xl font-semibold tracking-tight text-ink">
          {{ lot.title }}
        </h2>
        <p class="mx-auto mt-5 max-w-sm text-base leading-8 text-stone-700">
          {{ lot.verse }}
        </p>
        <p class="mx-auto mt-4 max-w-sm text-sm leading-7 text-stone-500">
          {{ lot.tip }}
        </p>
        <p class="mt-8 text-xs text-stone-400">
          认真你就输了
        </p>
      </template>
      <template v-else>
        <div class="mx-auto flex h-40 w-16 items-end justify-center rounded-lg border border-dashed border-stone-300/80 bg-stone-100/80">
          <div class="mb-3 h-24 w-8 rounded-md bg-moss/20" />
        </div>
        <p class="mt-6 text-sm text-stone-600">签筒已备好，点上方按钮开始</p>
      </template>
    </section>

    <div v-if="lot" class="mt-5 flex flex-wrap items-center gap-3">
      <button
        type="button"
        class="rounded-xl border border-stone-300/80 bg-white/60 px-4 py-2.5 text-sm text-stone-700 transition hover:border-moss/50 disabled:opacity-60"
        :disabled="sharing"
        @click="copyLotImage"
      >
        {{ sharing ? '生成中…' : '复制图片' }}
      </button>
      <p v-if="shareHint" class="text-sm text-moss">{{ shareHint }}</p>
    </div>

    <p class="mt-6 text-sm text-stone-500">
      抽完也可以去
      <NuxtLink to="/tools/muyu" class="text-moss hover:underline">敲木鱼</NuxtLink>
      或
      <NuxtLink to="/tools/bubbles" class="text-moss hover:underline">捏泡泡</NuxtLink>。
    </p>
  </div>
</template>

<style scoped>
.lot-shake {
  animation: lot-shake 0.28s ease-in-out;
}

@keyframes lot-shake {
  0%,
  100% {
    transform: translateX(0) rotate(0deg);
  }
  25% {
    transform: translateX(-6px) rotate(-1deg);
  }
  75% {
    transform: translateX(6px) rotate(1deg);
  }
}
</style>
