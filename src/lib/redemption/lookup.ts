import type {
  CalibrationMethod,
  NoticePeriod,
  RedemptionFrequency,
} from '@/constants/enums'
import {
  ANNEX_I_TABLE,
  ANNEX_II_TABLE,
  FREQUENCY_MORE_OFTEN_THAN_QUARTERLY,
  NOTICE_BELOW_3_MONTHS,
  NOTICE_PERIOD_DAYS,
  REDEMPTIONS_PER_YEAR,
} from '@/constants/annex-i'

export function lookupMaxRedemptionPct(input: {
  method: CalibrationMethod
  frequency: RedemptionFrequency
  noticePeriod: NoticePeriod | null
}): number {
  if (input.method === 'annex_ii') {
    return ANNEX_II_TABLE[input.frequency].maxRedemptionPct
  }
  if (!input.noticePeriod) return 0
  return ANNEX_I_TABLE[input.frequency][input.noticePeriod]
}

export function lookupMinLiquidAssetsPct(
  frequency: RedemptionFrequency,
): number {
  return ANNEX_II_TABLE[frequency].minLiquidPct
}

export function redemptionsPerYear(frequency: RedemptionFrequency): number {
  return REDEMPTIONS_PER_YEAR[frequency]
}

export function noticePeriodDays(notice: NoticePeriod | null | ''): number {
  if (!notice) return 0
  return NOTICE_PERIOD_DAYS[notice]
}

export function isNoticeBelow3Months(notice: NoticePeriod | null | ''): boolean {
  if (!notice) return false
  return NOTICE_BELOW_3_MONTHS.includes(notice)
}

export function isFrequencyMoreOftenThanQuarterly(
  frequency: RedemptionFrequency | '',
): boolean {
  if (!frequency) return false
  return FREQUENCY_MORE_OFTEN_THAN_QUARTERLY.includes(frequency)
}

export function redemptionBase(
  liquidAssets: number,
  expectedCashflow12m: number,
): number {
  return liquidAssets + expectedCashflow12m
}

export function maxRedemptionAmount(
  maxRedemptionPct: number,
  base: number,
): number {
  return (maxRedemptionPct / 100) * base
}
