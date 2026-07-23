import type { AssetClass, RedemptionFrequency } from '@/constants/enums'
import { ELIGIBLE_ASSET_CLASSES } from '@/constants/enums'
import {
  lookupMaxRedemptionPct,
  redemptionsPerYear,
} from '@/lib/redemption/lookup'
import type { CalibrationMethod, NoticePeriod } from '@/constants/enums'

export type AssetClassRowInput = {
  asset_class: AssetClass | ''
  amount: number | null
}

export type PortfolioMetrics = {
  total_assets: number
  eligible_amount: number
  liquid_amount: number
  total_eligible_pct: number | null
  liquid_pct: number | null
  redemptions_per_year: number | null
  avg_liquidity_pct: number | null
  avg_liquidity_windows: number | null
  eligible_meets_55: boolean | null
}

export function calculatePortfolio(input: {
  assetClasses: AssetClassRowInput[]
  eltifCapital: number | null
  redemptionFrequency: RedemptionFrequency | ''
  calibrationMethod: CalibrationMethod | ''
  noticePeriod: NoticePeriod | ''
}): PortfolioMetrics {
  const total_assets = input.assetClasses.reduce(
    (sum, row) => sum + (row.amount ?? 0),
    0,
  )

  const eligible_amount = input.assetClasses.reduce((sum, row) => {
    if (
      row.asset_class &&
      (ELIGIBLE_ASSET_CLASSES as readonly string[]).includes(row.asset_class)
    ) {
      return sum + (row.amount ?? 0)
    }
    return sum
  }, 0)

  const liquid_amount = input.assetClasses.reduce((sum, row) => {
    if (row.asset_class === 'liquid_assets_art_9_1_b') {
      return sum + (row.amount ?? 0)
    }
    return sum
  }, 0)

  const capital =
    input.eltifCapital !== null && input.eltifCapital > 0
      ? input.eltifCapital
      : null

  const total_eligible_pct =
    capital !== null ? (eligible_amount / capital) * 100 : null
  const liquid_pct = capital !== null ? (liquid_amount / capital) * 100 : null

  const frequency = input.redemptionFrequency
  const method = input.calibrationMethod
  const redemptions_per_year = frequency ? redemptionsPerYear(frequency) : null

  let avg_liquidity_pct: number | null = null
  let avg_liquidity_windows: number | null = null

  if (frequency && method && redemptions_per_year !== null) {
    const maxPct = lookupMaxRedemptionPct({
      method,
      frequency,
      noticePeriod:
        method === 'annex_i' && input.noticePeriod
          ? input.noticePeriod
          : null,
    })
    avg_liquidity_pct = Math.min(100, maxPct * redemptions_per_year)
    avg_liquidity_windows = redemptions_per_year
  }

  return {
    total_assets: round2(total_assets),
    eligible_amount: round2(eligible_amount),
    liquid_amount: round2(liquid_amount),
    total_eligible_pct:
      total_eligible_pct === null ? null : round2(total_eligible_pct),
    liquid_pct: liquid_pct === null ? null : round2(liquid_pct),
    redemptions_per_year,
    avg_liquidity_pct:
      avg_liquidity_pct === null ? null : round2(avg_liquidity_pct),
    avg_liquidity_windows,
    eligible_meets_55:
      total_eligible_pct === null ? null : total_eligible_pct >= 55,
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}
