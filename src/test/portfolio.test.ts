import { describe, expect, it } from 'vitest'
import { calculatePortfolio } from '@/lib/portfolio/calculate'

describe('calculatePortfolio', () => {
  it('sums assets and computes eligible % vs capital', () => {
    const result = calculatePortfolio({
      assetClasses: [
        { asset_class: 'equity_quasi_equity', amount: 600 },
        { asset_class: 'liquid_assets_art_9_1_b', amount: 400 },
      ],
      eltifCapital: 1000,
      redemptionFrequency: 'quarterly',
      calibrationMethod: 'annex_ii',
      noticePeriod: '',
    })

    expect(result.total_assets).toBe(1000)
    expect(result.total_eligible_pct).toBe(60)
    expect(result.liquid_pct).toBe(40)
    expect(result.eligible_meets_55).toBe(true)
    // Annex II quarterly max 50% × 4 windows = 100
    expect(result.avg_liquidity_pct).toBe(100)
    expect(result.avg_liquidity_windows).toBe(4)
  })

  it('flags eligible below 55% as advisory shortfall', () => {
    const result = calculatePortfolio({
      assetClasses: [
        { asset_class: 'debt_instruments', amount: 400 },
        { asset_class: 'liquid_assets_art_9_1_b', amount: 600 },
      ],
      eltifCapital: 1000,
      redemptionFrequency: '',
      calibrationMethod: '',
      noticePeriod: '',
    })
    expect(result.total_eligible_pct).toBe(40)
    expect(result.eligible_meets_55).toBe(false)
  })
})
