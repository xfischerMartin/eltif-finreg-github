import { describe, expect, it } from 'vitest'
import {
  lookupMaxRedemptionPct,
  lookupMinLiquidAssetsPct,
} from '@/lib/redemption/lookup'
import { simulateRedemptions } from '@/lib/redemption/simulate'

describe('Annex lookups', () => {
  it('returns Annex I weekly / none = 1.9%', () => {
    expect(
      lookupMaxRedemptionPct({
        method: 'annex_i',
        frequency: 'weekly',
        noticePeriod: 'none',
      }),
    ).toBe(1.9)
  })

  it('returns Annex I quarterly / 6 months = 50%', () => {
    expect(
      lookupMaxRedemptionPct({
        method: 'annex_i',
        frequency: 'quarterly',
        noticePeriod: '6_months',
      }),
    ).toBe(50)
  })

  it('returns Annex II bimonthly interpolated constants', () => {
    expect(lookupMinLiquidAssetsPct('bimonthly')).toBe(22.5)
    expect(
      lookupMaxRedemptionPct({
        method: 'annex_ii',
        frequency: 'bimonthly',
        noticePeriod: null,
      }),
    ).toBe(35)
  })

  it('returns Annex II monthly = 25% liquid / 20% max', () => {
    expect(lookupMinLiquidAssetsPct('monthly')).toBe(25)
    expect(
      lookupMaxRedemptionPct({
        method: 'annex_ii',
        frequency: 'monthly',
        noticePeriod: null,
      }),
    ).toBe(20)
  })
})

describe('simulateRedemptions', () => {
  const baseInput = {
    method: 'annex_ii' as const,
    frequency: 'quarterly' as const,
    noticePeriod: null,
    liquidAssetsAmount: 800_000,
    expectedCashflow12m: 200_000,
    redemptionCutOff: 5,
    paymentOfRedemptionProceeds: 3,
    redemptionFeePct: 1,
    carryPolicy: 'automatic_carry_over' as const,
    investorChoosesCarry: true,
    investorRequestAmount: 100_000,
    investorRequestDate: '2026-01-10',
    aggregateDemand: 100_000,
    suspension: null,
  }

  it('pays in full when demand ≤ capacity', () => {
    // capacity = 50% * 1_000_000 = 500_000
    const result = simulateRedemptions(baseInput)
    expect(result.capacity).toBe(500_000)
    expect(result.fully_executed).toBe(true)
    expect(result.windows).toHaveLength(1)
    expect(result.windows[0].gross_accepted).toBe(100_000)
    expect(result.windows[0].net_payout).toBe(99_000)
    expect(result.windows[0].pro_rata_factor).toBe(1)
  })

  it('applies pro-rata and carry-over on oversubscription', () => {
    const result = simulateRedemptions({
      ...baseInput,
      investorRequestAmount: 200_000,
      aggregateDemand: 1_000_000, // capacity 500k → s = 0.5
    })
    expect(result.windows[0].pro_rata_factor).toBe(0.5)
    expect(result.windows[0].gross_accepted).toBe(100_000)
    expect(result.windows[0].remainder).toBe(100_000)
    expect(result.windows.length).toBeGreaterThan(1)
    expect(result.fully_executed).toBe(true)
  })

  it('lapses remainder when new_request policy', () => {
    const result = simulateRedemptions({
      ...baseInput,
      carryPolicy: 'new_request',
      investorRequestAmount: 200_000,
      aggregateDemand: 1_000_000,
    })
    expect(result.windows).toHaveLength(1)
    expect(result.fully_executed).toBe(false)
    expect(result.windows[0].remainder).toBe(100_000)
  })
})
