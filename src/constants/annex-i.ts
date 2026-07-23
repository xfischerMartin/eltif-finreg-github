import type { NoticePeriod, RedemptionFrequency } from '@/constants/enums'

/** Annex I — exact % lookup (frequency × notice). */
export const ANNEX_I_TABLE: Record<
  RedemptionFrequency,
  Record<NoticePeriod, number>
> = {
  annual: {
    none: 100,
    '2_weeks': 100,
    '1_month': 100,
    '3_months': 100,
    '6_months': 100,
    '9_months': 100,
    '12_months': 100,
  },
  semiannual: {
    none: 50.0,
    '2_weeks': 52.2,
    '1_month': 54.5,
    '3_months': 66.7,
    '6_months': 100,
    '9_months': 100,
    '12_months': 100,
  },
  quarterly: {
    none: 25.0,
    '2_weeks': 26.1,
    '1_month': 27.3,
    '3_months': 33.3,
    '6_months': 50.0,
    '9_months': 100,
    '12_months': 100,
  },
  bimonthly: {
    none: 16.7,
    '2_weeks': 17.4,
    '1_month': 18.2,
    '3_months': 22.2,
    '6_months': 33.3,
    '9_months': 66.7,
    '12_months': 100,
  },
  monthly: {
    none: 8.3,
    '2_weeks': 8.7,
    '1_month': 9.1,
    '3_months': 11.1,
    '6_months': 16.7,
    '9_months': 33.3,
    '12_months': 100,
  },
  bi_weekly: {
    none: 4.2,
    '2_weeks': 4.3,
    '1_month': 4.5,
    '3_months': 5.6,
    '6_months': 8.3,
    '9_months': 16.7,
    '12_months': 100,
  },
  weekly: {
    none: 1.9,
    '2_weeks': 2.0,
    '1_month': 2.1,
    '3_months': 2.6,
    '6_months': 3.8,
    '9_months': 7.7,
    '12_months': 100,
  },
}

/** Annex II — min liquid buffer % + max redemption %. Bi-monthly = fixed interpolation. */
export const ANNEX_II_TABLE: Record<
  RedemptionFrequency,
  { minLiquidPct: number; maxRedemptionPct: number }
> = {
  annual: { minLiquidPct: 10, maxRedemptionPct: 100 },
  semiannual: { minLiquidPct: 15, maxRedemptionPct: 67 },
  quarterly: { minLiquidPct: 20, maxRedemptionPct: 50 },
  bimonthly: { minLiquidPct: 22.5, maxRedemptionPct: 35 },
  monthly: { minLiquidPct: 25, maxRedemptionPct: 20 },
  bi_weekly: { minLiquidPct: 25, maxRedemptionPct: 20 },
  weekly: { minLiquidPct: 25, maxRedemptionPct: 20 },
}

export const REDEMPTIONS_PER_YEAR: Record<RedemptionFrequency, number> = {
  weekly: 52,
  bi_weekly: 26,
  monthly: 12,
  bimonthly: 6,
  quarterly: 4,
  semiannual: 2,
  annual: 1,
}

export const NOTICE_PERIOD_DAYS: Record<NoticePeriod, number> = {
  none: 0,
  '2_weeks': 14,
  '1_month': 30,
  '3_months': 90,
  '6_months': 180,
  '9_months': 270,
  '12_months': 365,
}

/** Notice periods shorter than 3 months → NCA notification (Art. 5(8)). */
export const NOTICE_BELOW_3_MONTHS: NoticePeriod[] = [
  'none',
  '2_weeks',
  '1_month',
]

/** Frequencies more often than quarterly → NCA justification (Art. 5(4)). */
export const FREQUENCY_MORE_OFTEN_THAN_QUARTERLY: RedemptionFrequency[] = [
  'weekly',
  'bi_weekly',
  'monthly',
  'bimonthly',
]
