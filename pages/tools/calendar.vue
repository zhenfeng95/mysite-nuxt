<script setup lang="ts">
import {
  CN_HOLIDAY_YEARS,
  countCnDays,
  getCnHoliday,
  getNextHolidayInfo,
  hasCnHolidayYear,
} from '~/data/cn-holidays'
import { getLunarDayInfo } from '~/utils/lunar'

usePageSeo({
  title: '日历',
  description: '月历、农历节气、大陆法定节假日与调休、下次放假倒计时、工作日统计、证书到期速算与时间戳互转。',
  path: '/tools/calendar',
})

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日'] as const

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate()
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function toDateInputValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function parseDateInput(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim())
  if (!match) {
    return null
  }
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)
  if (
    date.getFullYear() !== year
    || date.getMonth() !== month - 1
    || date.getDate() !== day
  ) {
    return null
  }
  return startOfDay(date)
}

function dayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0)
  return Math.round((startOfDay(date).getTime() - start.getTime()) / 86400000)
}

function isoWeek(date: Date) {
  const tmp = startOfDay(date)
  tmp.setDate(tmp.getDate() + 3 - ((tmp.getDay() + 6) % 7))
  const week1 = new Date(tmp.getFullYear(), 0, 4)
  return 1 + Math.round(((tmp.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
}

const today = startOfDay(new Date())
const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth())
const selected = ref(startOfDay(today))

const workFrom = ref(toDateInputValue(today))
const workTo = ref('')
const expiryMode = ref<'date' | 'issue'>('date')
const expiryDate = ref('')
const issueDate = ref(toDateInputValue(today))
const validDays = ref(90)

const timestampInput = ref(String(Math.floor(Date.now() / 1000)))
const timestampError = ref('')
const timestampResult = ref('')

const yearOptions = computed(() => {
  const center = today.getFullYear()
  return Array.from({ length: 21 }, (_, i) => center - 10 + i)
})

const monthLabel = computed(() => `${viewYear.value} 年 ${viewMonth.value + 1} 月`)

const nextHoliday = computed(() => getNextHolidayInfo(today))

const cells = computed(() => {
  const first = new Date(viewYear.value, viewMonth.value, 1)
  const startOffset = (first.getDay() + 6) % 7
  const daysInMonth = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
  const prevDays = new Date(viewYear.value, viewMonth.value, 0).getDate()

  const list: Array<{
    date: Date
    day: number
    inMonth: boolean
    isToday: boolean
    isSelected: boolean
    isWeekend: boolean
    holiday: ReturnType<typeof getCnHoliday>
    lunar: ReturnType<typeof getLunarDayInfo>
    badge: string
  }> = []

  for (let i = 0; i < 42; i += 1) {
    let date: Date
    let inMonth = true
    if (i < startOffset) {
      date = new Date(viewYear.value, viewMonth.value - 1, prevDays - startOffset + i + 1)
      inMonth = false
    }
    else if (i >= startOffset + daysInMonth) {
      date = new Date(viewYear.value, viewMonth.value + 1, i - startOffset - daysInMonth + 1)
      inMonth = false
    }
    else {
      date = new Date(viewYear.value, viewMonth.value, i - startOffset + 1)
    }

    const weekday = (date.getDay() + 6) % 7
    const holiday = getCnHoliday(date)
    const lunar = getLunarDayInfo(date)
    const badge = holiday?.short || lunar.short

    list.push({
      date,
      day: date.getDate(),
      inMonth,
      isToday: sameDay(date, today),
      isSelected: sameDay(date, selected.value),
      isWeekend: weekday >= 5,
      holiday,
      lunar,
      badge,
    })
  }

  return list
})

const yearHasHolidays = computed(() => hasCnHolidayYear(viewYear.value))

const selectedMeta = computed(() => {
  const date = selected.value
  const weekday = WEEKDAYS[(date.getDay() + 6) % 7]
  const holiday = getCnHoliday(date)
  const lunar = getLunarDayInfo(date)
  return {
    label: `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`,
    weekday: `星期${weekday}`,
    dayOfYear: dayOfYear(date),
    isoWeek: isoWeek(date),
    unix: Math.floor(date.getTime() / 1000),
    iso: toDateInputValue(date),
    holiday,
    lunar,
  }
})

const workdayResult = computed(() => {
  const from = parseDateInput(workFrom.value)
  const to = parseDateInput(workTo.value)
  if (!from || !to) {
    return null
  }
  return countCnDays(from, to)
})

const resolvedExpiry = computed(() => {
  if (expiryMode.value === 'date') {
    return parseDateInput(expiryDate.value)
  }
  const issue = parseDateInput(issueDate.value)
  if (!issue) {
    return null
  }
  const days = Math.min(3650, Math.max(1, Number(validDays.value) || 1))
  const expiry = new Date(issue)
  expiry.setDate(expiry.getDate() + days)
  return startOfDay(expiry)
})

const expiryResult = computed(() => {
  const expiry = resolvedExpiry.value
  if (!expiry) {
    return null
  }
  const daysLeft = Math.round((expiry.getTime() - today.getTime()) / 86400000)
  const holiday = getCnHoliday(expiry)
  const inLongHoliday = holiday?.kind === 'holiday'
  return {
    expiry,
    iso: toDateInputValue(expiry),
    daysLeft,
    holiday,
    inLongHoliday,
    weekday: WEEKDAYS[(expiry.getDay() + 6) % 7],
  }
})

const copiedKey = ref('')
let copiedTimer: ReturnType<typeof setTimeout> | undefined

async function copyText(text: string, key: string) {
  try {
    await navigator.clipboard.writeText(text)
  }
  catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
  copiedKey.value = key
  if (copiedTimer) {
    clearTimeout(copiedTimer)
  }
  copiedTimer = setTimeout(() => {
    copiedKey.value = ''
  }, 1600)
}

onBeforeUnmount(() => {
  if (copiedTimer) {
    clearTimeout(copiedTimer)
  }
})

function selectDay(date: Date) {
  selected.value = startOfDay(date)
  viewYear.value = date.getFullYear()
  viewMonth.value = date.getMonth()
}

function goToday() {
  selectDay(today)
}

function shiftMonth(delta: number) {
  const next = new Date(viewYear.value, viewMonth.value + delta, 1)
  viewYear.value = next.getFullYear()
  viewMonth.value = next.getMonth()
}

function convertTimestamp() {
  timestampError.value = ''
  timestampResult.value = ''
  const raw = timestampInput.value.trim()
  if (!raw) {
    timestampError.value = '请输入时间戳或日期'
    return
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(raw) || raw.includes('T') || raw.includes(' ')) {
    const date = new Date(raw)
    if (Number.isNaN(date.getTime())) {
      timestampError.value = '无法解析该日期'
      return
    }
    timestampResult.value = String(Math.floor(date.getTime() / 1000))
    return
  }

  if (!/^-?\d+$/.test(raw)) {
    timestampError.value = '请输入 Unix 秒/毫秒时间戳，或可解析的日期字符串'
    return
  }

  let ms = Number(raw)
  if (Math.abs(ms) < 1e12) {
    ms *= 1000
  }
  const date = new Date(ms)
  if (Number.isNaN(date.getTime())) {
    timestampError.value = '时间戳无效'
    return
  }
  timestampResult.value = date.toLocaleString('zh-CN', { hour12: false })
}
</script>

<template>
  <div>
    <p class="text-sm text-moss">
      <NuxtLink to="/tools" class="hover:underline">实用工具</NuxtLink>
      <span class="mx-1.5 text-stone-400">/</span>
      日历
    </p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight">日历</h1>
    <p class="mt-4 max-w-3xl leading-8 text-stone-700">
      月历与农历节气、大陆法定节假日调休、下次放假倒计时、工作日统计、到期速算与时间戳互转。全程在本地完成。
    </p>

    <section
      v-if="nextHoliday"
      class="mt-8 max-w-xl rounded-2xl border border-moss/30 bg-moss/5 px-5 py-4"
    >
      <p class="text-sm text-moss">下次放假</p>
      <template v-if="nextHoliday.status === 'ongoing'">
        <p class="mt-1 text-2xl font-semibold tracking-tight text-ink">
          正在放 {{ nextHoliday.name }}
        </p>
        <p class="mt-1 text-sm leading-6 text-stone-600">
          {{ nextHoliday.start }} 至 {{ nextHoliday.end }}
          · 还剩 {{ nextHoliday.daysToEnd }} 天（含今天）
        </p>
      </template>
      <template v-else>
        <p class="mt-1 text-2xl font-semibold tracking-tight text-ink">
          距 {{ nextHoliday.name }} 还有 {{ nextHoliday.daysToStart }} 天
        </p>
        <p class="mt-1 text-sm leading-6 text-stone-600">
          {{ nextHoliday.start }} 至 {{ nextHoliday.end }}
        </p>
      </template>
    </section>
    <p
      v-else
      class="mt-8 max-w-xl text-sm text-stone-500"
    >
      暂无后续法定节假日数据（已收录 {{ CN_HOLIDAY_YEARS.join('、') }} 年）。
    </p>

    <section class="mt-10 max-w-xl">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-xl border border-stone-300/80 bg-white/60 px-3 py-1.5 text-sm text-stone-700 transition hover:border-moss/50"
            aria-label="上一月"
            @click="shiftMonth(-1)"
          >
            ‹
          </button>
          <p class="min-w-[8.5rem] text-center text-base font-semibold text-ink">
            {{ monthLabel }}
          </p>
          <button
            type="button"
            class="rounded-xl border border-stone-300/80 bg-white/60 px-3 py-1.5 text-sm text-stone-700 transition hover:border-moss/50"
            aria-label="下一月"
            @click="shiftMonth(1)"
          >
            ›
          </button>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <select
            v-model.number="viewYear"
            class="min-w-[7.25rem] rounded-xl border border-stone-300/80 bg-white/70 py-1.5 pl-2.5 text-sm outline-none ring-moss/30 focus:ring-2"
          >
            <option v-for="year in yearOptions" :key="year" :value="year">
              {{ year }} 年
            </option>
          </select>
          <select
            v-model.number="viewMonth"
            class="min-w-[5.75rem] rounded-xl border border-stone-300/80 bg-white/70 py-1.5 pl-2.5 text-sm outline-none ring-moss/30 focus:ring-2"
          >
            <option v-for="month in 12" :key="month" :value="month - 1">
              {{ month }} 月
            </option>
          </select>
          <button
            type="button"
            class="rounded-xl bg-moss px-3 py-1.5 text-sm font-medium text-white transition hover:bg-moss/90"
            @click="goToday"
          >
            今天
          </button>
        </div>
      </div>

      <div class="mt-3 flex flex-wrap gap-3 text-xs text-stone-500">
        <span class="inline-flex items-center gap-1">
          <span class="inline-block h-2.5 w-2.5 rounded-sm bg-red-500/80" />
          放假
        </span>
        <span class="inline-flex items-center gap-1">
          <span class="inline-block h-2.5 w-2.5 rounded-sm bg-sky-600/80" />
          调休上班
        </span>
        <span>格子下方为农历 / 节气；有放假安排时优先显示假日</span>
      </div>

      <div class="mt-3 grid grid-cols-7 gap-1 text-center text-xs text-stone-500">
        <span v-for="label in WEEKDAYS" :key="label" class="py-1">{{ label }}</span>
      </div>
      <div class="grid grid-cols-7 gap-1">
        <button
          v-for="cell in cells"
          :key="cell.date.toISOString()"
          type="button"
          class="relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition"
          :class="[
            cell.isSelected
              ? 'bg-moss text-white'
              : cell.holiday?.kind === 'holiday' && cell.inMonth
                ? 'border border-red-300/70 bg-red-50 text-red-700'
                : cell.holiday?.kind === 'workday' && cell.inMonth
                  ? 'border border-sky-300/70 bg-sky-50 text-sky-800'
                  : cell.isToday
                    ? 'bg-moss/15 text-moss'
                    : cell.inMonth
                      ? 'bg-white/60 text-ink hover:border-moss/40 hover:bg-white'
                      : 'bg-transparent text-stone-400',
            cell.inMonth && !cell.isSelected && !cell.holiday ? 'border border-stone-300/60' : '',
            cell.isWeekend && cell.inMonth && !cell.isSelected && !cell.holiday ? 'text-stone-500' : '',
          ]"
          @click="selectDay(cell.date)"
        >
          <span>{{ cell.day }}</span>
          <span
            v-if="cell.inMonth"
            class="mt-0.5 max-w-full truncate px-0.5 text-[10px] leading-none"
            :class="cell.isSelected
              ? 'text-white/90'
              : cell.holiday?.kind === 'holiday'
                ? 'text-red-600'
                : cell.holiday?.kind === 'workday'
                  ? 'text-sky-700'
                  : cell.lunar.jieQi
                    ? 'text-moss'
                    : 'text-stone-400'"
          >
            {{ cell.badge }}
          </span>
        </button>
      </div>
      <p v-if="!yearHasHolidays" class="mt-3 text-xs leading-5 text-stone-500">
        当前年份暂无法定节假日数据（已收录 {{ CN_HOLIDAY_YEARS.join('、') }} 年）；农历与节气仍可显示。
      </p>
    </section>

    <section class="mt-10 max-w-xl">
      <h2 class="text-xl font-semibold tracking-tight">选中日期</h2>
      <dl class="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <dt class="text-sm text-stone-500">公历</dt>
          <dd class="mt-0.5 text-sm text-stone-800">{{ selectedMeta.label }} · {{ selectedMeta.weekday }}</dd>
        </div>
        <div>
          <dt class="text-sm text-stone-500">农历 / 节气</dt>
          <dd class="mt-0.5 text-sm text-stone-800">
            {{ selectedMeta.lunar.full }}
            <template v-if="selectedMeta.lunar.jieQi">
              · {{ selectedMeta.lunar.jieQi }}
            </template>
          </dd>
        </div>
        <div>
          <dt class="text-sm text-stone-500">节假日</dt>
          <dd class="mt-0.5 text-sm text-stone-800">
            <template v-if="selectedMeta.holiday">
              {{ selectedMeta.holiday.name }}
              ·
              {{ selectedMeta.holiday.kind === 'holiday' ? '放假休息' : '调休上班' }}
            </template>
            <template v-else>—</template>
          </dd>
        </div>
        <div>
          <dt class="text-sm text-stone-500">年内第几天 / ISO 周</dt>
          <dd class="mt-0.5 text-sm text-stone-800">第 {{ selectedMeta.dayOfYear }} 天 · 第 {{ selectedMeta.isoWeek }} 周</dd>
        </div>
        <div>
          <dt class="text-sm text-stone-500">ISO 日期</dt>
          <dd class="mt-0.5 flex items-center gap-2 font-mono text-sm text-stone-800">
            <span>{{ selectedMeta.iso }}</span>
            <button type="button" class="text-xs text-moss hover:underline" @click="copyText(selectedMeta.iso, 'iso')">
              {{ copiedKey === 'iso' ? '已复制' : '复制' }}
            </button>
          </dd>
        </div>
        <div>
          <dt class="text-sm text-stone-500">当天 0 点 Unix（秒）</dt>
          <dd class="mt-0.5 flex items-center gap-2 font-mono text-sm text-stone-800">
            <span>{{ selectedMeta.unix }}</span>
            <button type="button" class="text-xs text-moss hover:underline" @click="copyText(String(selectedMeta.unix), 'unix')">
              {{ copiedKey === 'unix' ? '已复制' : '复制' }}
            </button>
          </dd>
        </div>
      </dl>
    </section>

    <section class="mt-12 max-w-xl">
      <h2 class="text-xl font-semibold tracking-tight">工作日计算</h2>
      <p class="mt-1 text-sm leading-6 text-stone-500">
        起止日期均计入。周末与法定放假不计工作日；调休上班日计入。无节假日数据的年份仅按周末估算。
      </p>
      <div class="mt-3 grid gap-3 sm:grid-cols-2">
        <label>
          <span class="mb-1.5 block text-sm text-stone-600">开始</span>
          <input
            v-model="workFrom"
            type="date"
            class="w-full rounded-xl border border-stone-300/80 bg-white/70 px-3 py-2.5 text-ink outline-none ring-moss/30 focus:ring-2"
          >
        </label>
        <label>
          <span class="mb-1.5 block text-sm text-stone-600">结束</span>
          <input
            v-model="workTo"
            type="date"
            class="w-full rounded-xl border border-stone-300/80 bg-white/70 px-3 py-2.5 text-ink outline-none ring-moss/30 focus:ring-2"
          >
        </label>
      </div>
      <dl v-if="workdayResult" class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <dt class="text-sm text-stone-500">自然日</dt>
          <dd class="mt-0.5 text-lg font-semibold text-ink">{{ workdayResult.natural }}</dd>
        </div>
        <div>
          <dt class="text-sm text-stone-500">工作日</dt>
          <dd class="mt-0.5 text-lg font-semibold text-moss">{{ workdayResult.workdays }}</dd>
        </div>
        <div>
          <dt class="text-sm text-stone-500">法定放假</dt>
          <dd class="mt-0.5 text-lg font-semibold text-ink">{{ workdayResult.holidays }}</dd>
        </div>
        <div>
          <dt class="text-sm text-stone-500">调休上班</dt>
          <dd class="mt-0.5 text-lg font-semibold text-ink">{{ workdayResult.makeupWorkdays }}</dd>
        </div>
      </dl>
    </section>

    <section class="mt-12 max-w-xl">
      <h2 class="text-xl font-semibold tracking-tight">到期还有几天</h2>
      <p class="mt-1 text-sm leading-6 text-stone-500">
        适合域名、证书续期估算。可直接填到期日，或按签发日 + 有效天数（如 Let's Encrypt 常见 90 天）推算。
      </p>
      <div class="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-xl border px-3 py-1.5 text-sm transition"
          :class="expiryMode === 'date'
            ? 'border-moss bg-moss text-white'
            : 'border-stone-300/80 bg-white/60 text-stone-700 hover:border-moss/50'"
          @click="expiryMode = 'date'"
        >
          填到期日
        </button>
        <button
          type="button"
          class="rounded-xl border px-3 py-1.5 text-sm transition"
          :class="expiryMode === 'issue'
            ? 'border-moss bg-moss text-white'
            : 'border-stone-300/80 bg-white/60 text-stone-700 hover:border-moss/50'"
          @click="expiryMode = 'issue'"
        >
          签发日 + 天数
        </button>
      </div>

      <div v-if="expiryMode === 'date'" class="mt-3 max-w-xs">
        <label>
          <span class="mb-1.5 block text-sm text-stone-600">到期日</span>
          <input
            v-model="expiryDate"
            type="date"
            class="w-full rounded-xl border border-stone-300/80 bg-white/70 px-3 py-2.5 text-ink outline-none ring-moss/30 focus:ring-2"
          >
        </label>
      </div>
      <div v-else class="mt-3 grid gap-3 sm:grid-cols-2">
        <label>
          <span class="mb-1.5 block text-sm text-stone-600">签发日</span>
          <input
            v-model="issueDate"
            type="date"
            class="w-full rounded-xl border border-stone-300/80 bg-white/70 px-3 py-2.5 text-ink outline-none ring-moss/30 focus:ring-2"
          >
        </label>
        <label>
          <span class="mb-1.5 block text-sm text-stone-600">有效天数</span>
          <input
            v-model.number="validDays"
            type="number"
            min="1"
            max="3650"
            class="w-full rounded-xl border border-stone-300/80 bg-white/70 px-3 py-2.5 text-ink outline-none ring-moss/30 focus:ring-2"
          >
        </label>
      </div>

      <div v-if="expiryResult" class="mt-4 rounded-2xl border border-stone-300/80 bg-white/60 px-4 py-3">
        <p class="text-sm text-stone-600">
          到期日 {{ expiryResult.iso }}（星期{{ expiryResult.weekday }}）
        </p>
        <p class="mt-1 text-2xl font-semibold text-ink">
          <template v-if="expiryResult.daysLeft > 0">还有 {{ expiryResult.daysLeft }} 天</template>
          <template v-else-if="expiryResult.daysLeft === 0">今天到期</template>
          <template v-else>已过期 {{ Math.abs(expiryResult.daysLeft) }} 天</template>
        </p>
        <p v-if="expiryResult.inLongHoliday" class="mt-1 text-sm text-red-700">
          到期日落在「{{ expiryResult.holiday?.name }}」假期，续期建议提前避开长假。
        </p>
      </div>
    </section>

    <section class="mt-12 max-w-xl">
      <h2 class="text-xl font-semibold tracking-tight">时间戳互转</h2>
      <p class="mt-1 text-sm leading-6 text-stone-500">
        输入 Unix 秒或毫秒，或可解析的日期字符串（如 2026-10-22 10:00:00）。
      </p>
      <div class="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label class="min-w-0 flex-1">
          <span class="mb-1.5 block text-sm text-stone-600">输入</span>
          <input
            v-model="timestampInput"
            type="text"
            spellcheck="false"
            placeholder="1730000000 或 2026-10-22"
            class="w-full rounded-xl border border-stone-300/80 bg-white/70 px-3 py-2.5 font-mono text-sm text-ink outline-none ring-moss/30 placeholder:text-stone-400 focus:ring-2"
          >
        </label>
        <button
          type="button"
          class="rounded-xl bg-moss px-5 py-2.5 text-sm font-medium text-white transition hover:bg-moss/90"
          @click="convertTimestamp"
        >
          转换
        </button>
      </div>
      <p v-if="timestampError" class="mt-3 text-sm text-red-700">{{ timestampError }}</p>
      <div v-if="timestampResult" class="mt-3 flex items-center gap-2">
        <span class="font-mono text-sm text-stone-800">{{ timestampResult }}</span>
        <button type="button" class="text-xs text-moss hover:underline" @click="copyText(timestampResult, 'ts')">
          {{ copiedKey === 'ts' ? '已复制' : '复制' }}
        </button>
      </div>
    </section>
  </div>
</template>
