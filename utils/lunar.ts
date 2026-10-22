import { Solar } from 'lunar-javascript'

export interface LunarDayInfo {
  /** 农历月日，如「八月廿八」 */
  full: string
  /** 格子短文案：节气优先，否则初一显示月份，其余显示日 */
  short: string
  /** 当天节气名，无则为空 */
  jieQi: string
  month: string
  day: string
}

export function getLunarDayInfo(date: Date): LunarDayInfo {
  const solar = Solar.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate())
  const lunar = solar.getLunar()
  const month = String(lunar.getMonthInChinese())
  const day = String(lunar.getDayInChinese())
  const jieQi = String(lunar.getJieQi() || '')
  const full = `${month}月${day}`

  let short = day
  if (jieQi) {
    short = jieQi
  }
  else if (lunar.getDay() === 1) {
    short = `${month}月`
  }

  return {
    full,
    short,
    jieQi,
    month,
    day,
  }
}
