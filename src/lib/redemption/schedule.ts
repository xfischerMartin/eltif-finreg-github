import type { RedemptionFrequency } from '@/constants/enums'

function startOfUtcDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  )
}

function addUtcDays(date: Date, days: number): Date {
  const next = new Date(date.getTime())
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

function firstOfMonthUtc(year: number, monthIndex: number): Date {
  return new Date(Date.UTC(year, monthIndex, 1))
}

/**
 * Synthetic dealing calendar driven by redemption frequency.
 * Monthly+ periods use the 1st of the period month; weekly/bi-weekly use fixed day steps.
 */
export function nextDealingDateOnOrAfter(
  fromInclusive: Date,
  frequency: RedemptionFrequency,
): Date {
  const from = startOfUtcDay(fromInclusive)

  if (frequency === 'weekly') {
    return from
  }
  if (frequency === 'bi_weekly') {
    return from
  }

  const year = from.getUTCFullYear()
  const month = from.getUTCMonth()

  if (frequency === 'monthly') {
    const candidate = firstOfMonthUtc(year, month)
    if (candidate >= from) return candidate
    return firstOfMonthUtc(year, month + 1)
  }

  if (frequency === 'bimonthly') {
    const periodStartMonth = month % 2 === 0 ? month : month - 1
    const candidate = firstOfMonthUtc(year, periodStartMonth)
    if (candidate >= from) return candidate
    return firstOfMonthUtc(year, periodStartMonth + 2)
  }

  if (frequency === 'quarterly') {
    const qStart = Math.floor(month / 3) * 3
    const candidate = firstOfMonthUtc(year, qStart)
    if (candidate >= from) return candidate
    return firstOfMonthUtc(year, qStart + 3)
  }

  if (frequency === 'semiannual') {
    const hStart = month < 6 ? 0 : 6
    const candidate = firstOfMonthUtc(year, hStart)
    if (candidate >= from) return candidate
    return firstOfMonthUtc(year, hStart + 6)
  }

  // annual — 1 January
  const candidate = firstOfMonthUtc(year, 0)
  if (candidate >= from) return candidate
  return firstOfMonthUtc(year + 1, 0)
}

export function advanceDealingDate(
  current: Date,
  frequency: RedemptionFrequency,
): Date {
  const day = startOfUtcDay(current)

  if (frequency === 'weekly') return addUtcDays(day, 7)
  if (frequency === 'bi_weekly') return addUtcDays(day, 14)

  if (frequency === 'monthly') {
    return firstOfMonthUtc(day.getUTCFullYear(), day.getUTCMonth() + 1)
  }
  if (frequency === 'bimonthly') {
    return firstOfMonthUtc(day.getUTCFullYear(), day.getUTCMonth() + 2)
  }
  if (frequency === 'quarterly') {
    return firstOfMonthUtc(day.getUTCFullYear(), day.getUTCMonth() + 3)
  }
  if (frequency === 'semiannual') {
    return firstOfMonthUtc(day.getUTCFullYear(), day.getUTCMonth() + 6)
  }
  return firstOfMonthUtc(day.getUTCFullYear() + 1, 0)
}

export function isDateInSuspension(
  date: Date,
  suspension: { start: Date; days: number } | null,
): boolean {
  if (!suspension || suspension.days <= 0) return false
  const d = startOfUtcDay(date)
  const start = startOfUtcDay(suspension.start)
  const end = addUtcDays(start, suspension.days)
  return d >= start && d < end
}

export function toIsoDate(date: Date): string {
  return startOfUtcDay(date).toISOString().slice(0, 10)
}

export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

export { addUtcDays, startOfUtcDay }
