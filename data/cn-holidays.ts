export type CnHolidayKind = 'holiday' | 'workday'

export interface CnHolidayDay {
  /** YYYY-MM-DD */
  date: string
  /** 节日名称，如「春节」 */
  name: string
  /** holiday=放假休息；workday=调休上班 */
  kind: CnHolidayKind
  /** 格子上的短标签 */
  short: string
}

type HolidayRange = {
  name: string
  from: string
  to: string
  short?: string
}

type WorkdayMark = {
  name: string
  date: string
}

function eachDate(from: string, to: string) {
  const start = new Date(`${from}T00:00:00`)
  const end = new Date(`${to}T00:00:00`)
  const dates: string[] = []
  for (let cursor = start; cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
    const y = cursor.getFullYear()
    const m = String(cursor.getMonth() + 1).padStart(2, '0')
    const d = String(cursor.getDate()).padStart(2, '0')
    dates.push(`${y}-${m}-${d}`)
  }
  return dates
}

function buildYear(
  year: number,
  holidays: HolidayRange[],
  workdays: WorkdayMark[],
): CnHolidayDay[] {
  const days: CnHolidayDay[] = []

  for (const item of holidays) {
    const short = item.short || item.name.slice(0, 2)
    for (const date of eachDate(item.from, item.to)) {
      days.push({
        date,
        name: item.name,
        kind: 'holiday',
        short: date === item.from ? short : '休',
      })
    }
  }

  for (const item of workdays) {
    days.push({
      date: item.date,
      name: `${item.name}调休`,
      kind: 'workday',
      short: '班',
    })
  }

  return days
}

/**
 * 大陆法定节假日与调休，按国务院办公厅通知整理。
 * 未收录年份不显示节假日标记。
 */
const BY_YEAR: Record<number, CnHolidayDay[]> = {
  // 国办发明电〔2023〕7号
  2024: buildYear(
    2024,
    [
      { name: '元旦', from: '2024-01-01', to: '2024-01-01' },
      { name: '春节', from: '2024-02-10', to: '2024-02-17' },
      { name: '清明节', from: '2024-04-04', to: '2024-04-06', short: '清明' },
      { name: '劳动节', from: '2024-05-01', to: '2024-05-05', short: '劳动' },
      { name: '端午节', from: '2024-06-10', to: '2024-06-10', short: '端午' },
      { name: '中秋节', from: '2024-09-15', to: '2024-09-17', short: '中秋' },
      { name: '国庆节', from: '2024-10-01', to: '2024-10-07', short: '国庆' },
    ],
    [
      { name: '春节', date: '2024-02-04' },
      { name: '春节', date: '2024-02-18' },
      { name: '劳动节', date: '2024-04-28' },
      { name: '劳动节', date: '2024-05-11' },
      { name: '中秋节', date: '2024-09-14' },
      { name: '国庆节', date: '2024-09-29' },
      { name: '国庆节', date: '2024-10-12' },
    ],
  ),
  // 国办发明电〔2024〕12号
  2025: buildYear(
    2025,
    [
      { name: '元旦', from: '2025-01-01', to: '2025-01-01' },
      { name: '春节', from: '2025-01-28', to: '2025-02-04' },
      { name: '清明节', from: '2025-04-04', to: '2025-04-06', short: '清明' },
      { name: '劳动节', from: '2025-05-01', to: '2025-05-05', short: '劳动' },
      { name: '端午节', from: '2025-05-31', to: '2025-06-02', short: '端午' },
      { name: '国庆节、中秋节', from: '2025-10-01', to: '2025-10-08', short: '国庆' },
    ],
    [
      { name: '春节', date: '2025-01-26' },
      { name: '春节', date: '2025-02-08' },
      { name: '劳动节', date: '2025-04-27' },
      { name: '国庆节', date: '2025-09-28' },
      { name: '国庆节', date: '2025-10-11' },
    ],
  ),
  // 国办发明电〔2025〕7号
  2026: buildYear(
    2026,
    [
      { name: '元旦', from: '2026-01-01', to: '2026-01-03' },
      { name: '春节', from: '2026-02-15', to: '2026-02-23' },
      { name: '清明节', from: '2026-04-04', to: '2026-04-06', short: '清明' },
      { name: '劳动节', from: '2026-05-01', to: '2026-05-05', short: '劳动' },
      { name: '端午节', from: '2026-06-19', to: '2026-06-21', short: '端午' },
      { name: '中秋节', from: '2026-09-25', to: '2026-09-27', short: '中秋' },
      { name: '国庆节', from: '2026-10-01', to: '2026-10-07', short: '国庆' },
    ],
    [
      { name: '元旦', date: '2026-01-04' },
      { name: '春节', date: '2026-02-14' },
      { name: '春节', date: '2026-02-28' },
      { name: '劳动节', date: '2026-05-09' },
      { name: '国庆节', date: '2026-09-20' },
      { name: '国庆节', date: '2026-10-10' },
    ],
  ),
}

const holidayMap = new Map<string, CnHolidayDay>()
for (const days of Object.values(BY_YEAR)) {
  for (const day of days) {
    holidayMap.set(day.date, day)
  }
}

export const CN_HOLIDAY_YEARS = Object.keys(BY_YEAR)
  .map(Number)
  .sort((a, b) => a - b)

function toKey(date: Date | string) {
  if (typeof date === 'string') {
    return date
  }
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function daysBetween(a: Date, b: Date) {
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / 86400000)
}

export function getCnHoliday(date: Date | string): CnHolidayDay | null {
  return holidayMap.get(toKey(date)) || null
}

export function hasCnHolidayYear(year: number) {
  return year in BY_YEAR
}

/** 是否工作日：调休上班算工作日；法定放假不算；其余按周一至周五 */
export function isCnWorkday(date: Date) {
  const holiday = getCnHoliday(date)
  if (holiday?.kind === 'workday') {
    return true
  }
  if (holiday?.kind === 'holiday') {
    return false
  }
  const weekday = date.getDay()
  return weekday !== 0 && weekday !== 6
}

export function countCnDays(from: Date, to: Date) {
  let start = startOfDay(from)
  let end = startOfDay(to)
  if (start > end) {
    const tmp = start
    start = end
    end = tmp
  }

  let natural = 0
  let workdays = 0
  let holidays = 0
  let makeupWorkdays = 0

  for (let cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
    natural += 1
    const mark = getCnHoliday(cursor)
    if (mark?.kind === 'holiday') {
      holidays += 1
    }
    if (mark?.kind === 'workday') {
      makeupWorkdays += 1
    }
    if (isCnWorkday(cursor)) {
      workdays += 1
    }
  }

  return {
    natural,
    workdays,
    holidays,
    makeupWorkdays,
    from: toKey(start),
    to: toKey(end),
  }
}

export type NextHolidayInfo = {
  status: 'ongoing' | 'upcoming' | 'unknown'
  name: string
  start: string
  end: string
  /** 距假期开始的天数；进行中为 0 */
  daysToStart: number
  /** 距假期结束（含当天）还剩几天 */
  daysToEnd: number
}

/** 查找从某日起的当前/下一个法定放假区间（不含调休上班日） */
export function getNextHolidayInfo(from: Date = new Date()): NextHolidayInfo | null {
  const origin = startOfDay(from)
  const holidayDays = [...holidayMap.values()]
    .filter(item => item.kind === 'holiday')
    .sort((a, b) => a.date.localeCompare(b.date))

  if (!holidayDays.length) {
    return null
  }

  // 合并同名连续区间
  const spans: Array<{ name: string; start: string; end: string }> = []
  for (const day of holidayDays) {
    const last = spans[spans.length - 1]
    if (last && last.name === day.name) {
      const prev = new Date(`${last.end}T00:00:00`)
      prev.setDate(prev.getDate() + 1)
      const expect = toKey(prev)
      if (expect === day.date) {
        last.end = day.date
        continue
      }
    }
    spans.push({ name: day.name, start: day.date, end: day.date })
  }

  const originKey = toKey(origin)

  for (const span of spans) {
    if (originKey >= span.start && originKey <= span.end) {
      return {
        status: 'ongoing',
        name: span.name,
        start: span.start,
        end: span.end,
        daysToStart: 0,
        daysToEnd: daysBetween(origin, new Date(`${span.end}T00:00:00`)),
      }
    }
    if (originKey < span.start) {
      const startDate = new Date(`${span.start}T00:00:00`)
      const endDate = new Date(`${span.end}T00:00:00`)
      return {
        status: 'upcoming',
        name: span.name,
        start: span.start,
        end: span.end,
        daysToStart: daysBetween(origin, startDate),
        daysToEnd: daysBetween(origin, endDate),
      }
    }
  }

  return null
}
