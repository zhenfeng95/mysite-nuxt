<script setup lang="ts">
import QRCode from 'qrcode'

const tool = useToolSeo('qrcode')

type EccLevel = 'L' | 'M' | 'Q' | 'H'
type QrStyle = 'classic' | 'gradient'

const text = ref('')
const size = ref(280)
const ecc = ref<EccLevel>('M')
const style = ref<QrStyle>('classic')
const error = ref('')
const hint = ref('')
const hasImage = ref(false)
const busy = ref(false)

const canvasRef = ref<HTMLCanvasElement | null>(null)

const sizePresets = [200, 280, 360, 480]
const eccLevels: Array<{ id: EccLevel; label: string; tip: string }> = [
  { id: 'L', label: 'L', tip: '约 7%' },
  { id: 'M', label: 'M', tip: '约 15%' },
  { id: 'Q', label: 'Q', tip: '约 25%' },
  { id: 'H', label: 'H', tip: '约 30%' },
]
const styleOptions: Array<{ id: QrStyle; label: string }> = [
  { id: 'classic', label: '经典黑白' },
  { id: 'gradient', label: '简约渐变' },
]

let hintTimer: ReturnType<typeof setTimeout> | undefined

function setHint(message: string) {
  hint.value = message
  if (hintTimer) {
    clearTimeout(hintTimer)
  }
  hintTimer = setTimeout(() => {
    hint.value = ''
  }, 2200)
}

function isFinderCell(row: number, col: number, n: number) {
  const inTL = row < 7 && col < 7
  const inTR = row < 7 && col >= n - 7
  const inBL = row >= n - 7 && col < 7
  return inTL || inTR || inBL
}

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radii: { tl: number; tr: number; br: number; bl: number },
) {
  const tl = Math.min(radii.tl, w / 2, h / 2)
  const tr = Math.min(radii.tr, w / 2, h / 2)
  const br = Math.min(radii.br, w / 2, h / 2)
  const bl = Math.min(radii.bl, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + tl, y)
  ctx.lineTo(x + w - tr, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + tr)
  ctx.lineTo(x + w, y + h - br)
  ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h)
  ctx.lineTo(x + bl, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - bl)
  ctx.lineTo(x, y + tl)
  ctx.quadraticCurveTo(x, y, x + tl, y)
  ctx.closePath()
}

function drawFinder(
  ctx: CanvasRenderingContext2D,
  originX: number,
  originY: number,
  moduleSize: number,
  fill: CanvasFillStrokeStyles['fillStyle'],
) {
  const outer = moduleSize * 7
  const ring = moduleSize
  const inner = moduleSize * 3
  const innerOffset = moduleSize * 2
  const outerR = moduleSize * 1.35
  const holeR = moduleSize * 0.85
  const innerR = moduleSize * 0.75

  ctx.fillStyle = fill
  roundedRectPath(ctx, originX, originY, outer, outer, {
    tl: outerR,
    tr: outerR,
    br: outerR,
    bl: outerR,
  })
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  roundedRectPath(
    ctx,
    originX + ring,
    originY + ring,
    outer - ring * 2,
    outer - ring * 2,
    { tl: holeR, tr: holeR, br: holeR, bl: holeR },
  )
  ctx.fill()

  ctx.fillStyle = fill
  roundedRectPath(
    ctx,
    originX + innerOffset,
    originY + innerOffset,
    inner,
    inner,
    { tl: innerR, tr: innerR, br: innerR, bl: innerR },
  )
  ctx.fill()
}

function drawGradientQr(
  ctx: CanvasRenderingContext2D,
  modules: boolean[][],
  canvasSize: number,
) {
  const n = modules.length
  const marginModules = 2
  const totalModules = n + marginModules * 2
  const moduleSize = canvasSize / totalModules
  const offset = marginModules * moduleSize

  ctx.clearRect(0, 0, canvasSize, canvasSize)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvasSize, canvasSize)

  const gradient = ctx.createLinearGradient(0, 0, canvasSize, canvasSize)
  gradient.addColorStop(0, '#3cb3c5')
  gradient.addColorStop(1, '#2a52be')
  ctx.fillStyle = gradient

  const dark = (r: number, c: number) =>
    r >= 0 && r < n && c >= 0 && c < n && modules[r]![c]!

  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      if (!dark(row, col) || isFinderCell(row, col, n)) {
        continue
      }

      const left = dark(row, col - 1) && !isFinderCell(row, col - 1, n)
      const right = dark(row, col + 1) && !isFinderCell(row, col + 1, n)
      const up = dark(row - 1, col) && !isFinderCell(row - 1, col, n)
      const down = dark(row + 1, col) && !isFinderCell(row + 1, col, n)

      const r = moduleSize * 0.48
      const x = offset + col * moduleSize
      const y = offset + row * moduleSize

      roundedRectPath(ctx, x, y, moduleSize, moduleSize, {
        tl: !left && !up ? r : 0,
        tr: !right && !up ? r : 0,
        br: !right && !down ? r : 0,
        bl: !left && !down ? r : 0,
      })
      ctx.fill()
    }
  }

  const finders = [
    { row: 0, col: 0 },
    { row: 0, col: n - 7 },
    { row: n - 7, col: 0 },
  ]
  for (const f of finders) {
    drawFinder(
      ctx,
      offset + f.col * moduleSize,
      offset + f.row * moduleSize,
      moduleSize,
      gradient,
    )
  }
}

async function generate() {
  const value = text.value.trim()
  error.value = ''
  if (!value) {
    error.value = '请先输入链接或文案'
    hasImage.value = false
    const canvas = canvasRef.value
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx?.clearRect(0, 0, canvas.width, canvas.height)
    }
    return
  }

  const canvas = canvasRef.value
  if (!canvas) {
    return
  }

  busy.value = true
  try {
    if (style.value === 'classic') {
      await QRCode.toCanvas(canvas, value, {
        width: size.value,
        margin: 2,
        errorCorrectionLevel: ecc.value,
        color: {
          dark: '#1c1915',
          light: '#ffffff',
        },
      })
    }
    else {
      const qr = QRCode.create(value, {
        errorCorrectionLevel: ecc.value,
      })
      const count = qr.modules.size
      const modules: boolean[][] = []
      for (let row = 0; row < count; row++) {
        const line: boolean[] = []
        for (let col = 0; col < count; col++) {
          line.push(qr.modules.get(row, col))
        }
        modules.push(line)
      }

      canvas.width = size.value
      canvas.height = size.value
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        throw new Error('no 2d context')
      }
      drawGradientQr(ctx, modules, size.value)
    }
    hasImage.value = true
  }
  catch {
    error.value = '生成失败，文案可能过长，可缩短后再试'
    hasImage.value = false
  }
  finally {
    busy.value = false
  }
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

async function downloadPng() {
  const canvas = canvasRef.value
  if (!canvas || !hasImage.value) {
    return
  }
  const blob = await canvasToBlob(canvas)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'qrcode.png'
  a.click()
  URL.revokeObjectURL(url)
  setHint('已开始下载')
}

async function copyPng() {
  const canvas = canvasRef.value
  if (!canvas || !hasImage.value) {
    return
  }
  const blob = await canvasToBlob(canvas)
  const canClipboard = typeof ClipboardItem !== 'undefined'
    && !!navigator.clipboard
    && typeof navigator.clipboard.write === 'function'

  if (canClipboard) {
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setHint('已复制图片，可直接粘贴')
      return
    }
    catch {
      // fall through
    }
  }

  await downloadPng()
  setHint('当前环境不支持复制图片，已改为下载')
}

watch([size, ecc, style], () => {
  if (text.value.trim()) {
    void generate()
  }
})

onBeforeUnmount(() => {
  if (hintTimer) {
    clearTimeout(hintTimer)
  }
})
</script>

<template>
  <div>
    <p class="text-sm text-moss">
      <NuxtLink to="/tools" class="hover:underline">实用工具</NuxtLink>
      <span class="mx-1.5 text-stone-400">/</span>
      二维码
    </p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight">{{ tool.title }}</h1>
    <p class="mt-4 max-w-3xl leading-8 text-stone-700">
      把网址、文本或配置片段生成二维码。全程在浏览器本地完成，不会上传内容。
    </p>

    <section class="mt-8 max-w-xl">
      <label class="block">
        <span class="mb-1.5 block text-sm text-stone-600">内容</span>
        <textarea
          v-model="text"
          rows="5"
          spellcheck="false"
          placeholder="例如 https://example.com 或任意文案"
          class="w-full rounded-xl border border-stone-300/80 bg-white/70 px-3 py-2.5 font-mono text-sm leading-6 text-ink outline-none ring-moss/30 placeholder:text-stone-400 focus:ring-2"
        />
      </label>

      <div class="mt-5">
        <p class="mb-2 text-sm text-stone-600">样式</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="item in styleOptions"
            :key="item.id"
            type="button"
            class="rounded-xl border px-3 py-1.5 text-sm transition"
            :class="style === item.id
              ? 'border-moss bg-moss text-white'
              : 'border-stone-300/80 bg-white/60 text-stone-700 hover:border-moss/50'"
            @click="style = item.id"
          >
            {{ item.label }}
          </button>
        </div>
      </div>

      <div class="mt-5">
        <p class="mb-2 text-sm text-stone-600">尺寸</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="preset in sizePresets"
            :key="preset"
            type="button"
            class="rounded-xl border px-3 py-1.5 text-sm transition"
            :class="size === preset
              ? 'border-moss bg-moss text-white'
              : 'border-stone-300/80 bg-white/60 text-stone-700 hover:border-moss/50'"
            @click="size = preset"
          >
            {{ preset }}px
          </button>
        </div>
      </div>

      <div class="mt-5">
        <p class="mb-2 text-sm text-stone-600">容错级别</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="item in eccLevels"
            :key="item.id"
            type="button"
            class="rounded-xl border px-3 py-1.5 text-sm transition"
            :class="ecc === item.id
              ? 'border-moss bg-moss text-white'
              : 'border-stone-300/80 bg-white/60 text-stone-700 hover:border-moss/50'"
            :title="item.tip"
            @click="ecc = item.id"
          >
            {{ item.label }}
            <span class="ml-1 text-xs opacity-80">{{ item.tip }}</span>
          </button>
        </div>
        <p class="mt-2 text-xs text-stone-500">级别越高越耐污损，二维码也会更密一点。</p>
      </div>

      <div class="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-xl bg-moss px-5 py-2.5 text-sm font-medium text-white transition hover:bg-moss/90 disabled:opacity-60"
          :disabled="busy"
          @click="generate"
        >
          {{ busy ? '生成中…' : '生成二维码' }}
        </button>
        <button
          type="button"
          class="rounded-xl border border-stone-300/80 bg-white/60 px-4 py-2.5 text-sm text-stone-700 transition hover:border-moss/50 disabled:opacity-50"
          :disabled="!hasImage"
          @click="copyPng"
        >
          复制图片
        </button>
        <button
          type="button"
          class="rounded-xl border border-stone-300/80 bg-white/60 px-4 py-2.5 text-sm text-stone-700 transition hover:border-moss/50 disabled:opacity-50"
          :disabled="!hasImage"
          @click="downloadPng"
        >
          下载 PNG
        </button>
      </div>

      <p v-if="error" class="mt-3 text-sm text-red-700">{{ error }}</p>
      <p v-else-if="hint" class="mt-3 text-sm text-moss">{{ hint }}</p>
    </section>

    <div class="mt-8 inline-block rounded-2xl border border-stone-300/80 bg-white p-4">
      <canvas
        ref="canvasRef"
        class="block max-w-full"
        :width="size"
        :height="size"
        aria-label="二维码预览"
      />
      <p v-if="!hasImage" class="mt-2 text-center text-sm text-stone-500">
        生成后在这里预览
      </p>
    </div>
  </div>
</template>
