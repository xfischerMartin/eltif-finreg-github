import type { FormValues } from '@/types/form'
import { calculatePortfolio } from '@/lib/portfolio/calculate'
import {
  isFrequencyMoreOftenThanQuarterly,
  isNoticeBelow3Months,
  lookupMaxRedemptionPct,
  lookupMinLiquidAssetsPct,
  maxRedemptionAmount,
  redemptionBase,
} from '@/lib/redemption/lookup'
import type {
  CalibrationMethod,
  NoticePeriod,
  RedemptionFrequency,
} from '@/constants/enums'

export type TermSheetSubmitPayload = ReturnType<typeof buildSubmitPayload>

export function buildSubmitPayload(
  values: FormValues,
  locale: 'cs' | 'en',
): {
  meta: {
    locale: 'cs' | 'en'
    submittedAt: string
    schemaVersion: '1.0'
  }
  fund: Record<string, unknown>
  duration: Record<string, unknown>
  strategy: Record<string, unknown>
  investors_leverage: Record<string, unknown>
  share_classes: unknown[]
  fees: Record<string, unknown>
  subscriptions: Record<string, unknown>
  redemptions: Record<string, unknown>
  contact: Record<string, unknown>
  portfolio: Record<string, unknown>
} {
  const method = values.redemption_calibration_method as CalibrationMethod
  const frequency = values.redemption_frequency as RedemptionFrequency
  const notice =
    values.redemption_calibration_method === 'annex_i'
      ? (values.redemption_notice_period as NoticePeriod)
      : null

  const maxPct = lookupMaxRedemptionPct({
    method,
    frequency,
    noticePeriod: notice,
  })
  const minLiquid =
    method === 'annex_ii' ? lookupMinLiquidAssetsPct(frequency) : null
  const base = redemptionBase(
    values.liquid_assets_amount ?? 0,
    values.expected_cashflow_12m ?? 0,
  )
  const capacity = maxRedemptionAmount(maxPct, base)

  const portfolio = calculatePortfolio({
    assetClasses: values.asset_classes,
    eltifCapital: values.eltif_capital,
    redemptionFrequency: values.redemption_frequency,
    calibrationMethod: values.redemption_calibration_method,
    noticePeriod: values.redemption_notice_period,
  })

  return {
    meta: {
      locale,
      submittedAt: new Date().toISOString(),
      schemaVersion: '1.0',
    },
    fund: {
      name_of_eltif: values.name_of_eltif,
      legal_form: values.legal_form,
      self_managed:
        values.legal_form === 'SICAV' ? values.self_managed === 'yes' : null,
      name_of_aifm:
        values.legal_form === 'SICAV' && values.self_managed === 'no'
          ? values.name_of_aifm
          : null,
      name_of_management_company:
        values.legal_form === 'OPF' ? values.name_of_management_company : null,
      name_of_investment_manager: values.name_of_investment_manager || null,
      name_of_administrator: values.name_of_administrator || null,
      name_of_depositary: values.name_of_depositary,
      fund_reference_currency: values.fund_reference_currency,
    },
    duration: {
      duration: values.duration,
      duration_limited_to:
        values.duration === 'limited' ? values.duration_limited_to : null,
    },
    strategy: {
      strategy_ioas: values.strategy_ioas || null,
      strategy_tatuea: values.strategy_tatuea,
      strategy_ilseeia: values.strategy_ilseeia,
      strategy_ilsuea: values.strategy_ilsuea,
      strategy_apac: values.strategy_apac || null,
      strategy_ramp_up_period: values.strategy_ramp_up_period || null,
      sfdr_category: values.sfdr_category || null,
    },
    investors_leverage: {
      target_investors: values.target_investors,
      leverage_borrowing_amount: values.leverage_borrowing_amount,
      leverage_borrowing_maturity: values.leverage_borrowing_maturity,
      leverage_aifmd_commitment_method: values.leverage_aifmd_commitment_method,
      leverage_aifmd_gross_method: values.leverage_aifmd_gross_method,
    },
    share_classes: values.share_classes.map((row) => ({
      share_class: row.share_class,
      currency: row.currency,
      minimum_subscription_amount: row.minimum_subscription_amount,
      management_fee: row.management_fee,
      performance_fee: row.performance_fee || null,
      distribution_frequency:
        row.share_class === 'distribution'
          ? row.distribution_frequency
          : null,
    })),
    fees: {
      subscription_fee: values.subscription_fee,
      redemption_fee: values.redemption_fee,
      anti_dilution_lmt: values.anti_dilution_lmt,
    },
    subscriptions: {
      subscription_frequency: values.subscription_frequency,
      subscription_cut_off_time: values.subscription_cut_off_time,
      subscription_payment_date: values.subscription_payment_date,
      nav_calculation_date: values.nav_calculation_date,
    },
    redemptions: {
      redemption_calibration_method: values.redemption_calibration_method,
      redemption_frequency: values.redemption_frequency,
      redemption_notice_period: notice,
      min_liquid_assets_pct: minLiquid,
      max_redemption_pct: maxPct,
      liquid_assets_amount: values.liquid_assets_amount,
      expected_cashflow_12m: values.expected_cashflow_12m,
      redemption_base: base,
      max_redemption_amount: capacity,
      redemption_cut_off: values.redemption_cut_off,
      redemption_dealing_date: values.redemption_dealing_date,
      payment_of_redemption_proceeds: values.payment_of_redemption_proceeds,
      carry_policy: values.carry_policy,
      min_holding_period: values.min_holding_period,
      redemption_in_kind:
        values.redemption_in_kind === ''
          ? null
          : values.redemption_in_kind === 'yes',
      advisories: {
        notice_period_below_3_months: isNoticeBelow3Months(notice),
        frequency_more_often_than_quarterly:
          isFrequencyMoreOftenThanQuarterly(frequency),
      },
    },
    contact: {
      title: values.title,
      last_name: values.last_name || null,
      first_name: values.first_name || null,
      email: values.email,
      company: values.company || null,
      agreement: true as const,
    },
    portfolio: {
      asset_classes: values.asset_classes.map((row) => ({
        asset_class: row.asset_class,
        amount: row.amount,
      })),
      eltif_capital: values.eltif_capital,
      nav: values.nav,
      total_assets: portfolio.total_assets,
      total_eligible_pct: portfolio.total_eligible_pct,
      liquid_pct: portfolio.liquid_pct,
      avg_liquidity_pct: portfolio.avg_liquidity_pct,
      avg_liquidity_windows: portfolio.avg_liquidity_windows,
      redemptions_per_year: portfolio.redemptions_per_year,
    },
  }
}
