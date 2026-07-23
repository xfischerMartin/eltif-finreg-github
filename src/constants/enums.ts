/** Stable option keys stored in form state (never localized). */

export const LEGAL_FORMS = ['SICAV', 'OPF'] as const
export type LegalForm = (typeof LEGAL_FORMS)[number]

export const YES_NO = ['yes', 'no'] as const
export type YesNo = (typeof YES_NO)[number]

export const CURRENCIES = ['CZK', 'EUR', 'USD'] as const
export type Currency = (typeof CURRENCIES)[number]

export const DURATIONS = ['undetermined', 'limited'] as const
export type Duration = (typeof DURATIONS)[number]

export const RAMP_UP_PERIODS = [
  'less_than_1',
  '1',
  '2',
  '3',
  '4',
  '5',
] as const
export type RampUpPeriod = (typeof RAMP_UP_PERIODS)[number]

export const SFDR_CATEGORIES = ['6', '8', '9'] as const
export type SfdrCategory = (typeof SFDR_CATEGORIES)[number]

/** Locked retail-only target market (field model decision). */
export const TARGET_INVESTORS = ['retail'] as const
export type TargetInvestors = (typeof TARGET_INVESTORS)[number]

export const SHARE_CLASS_TYPES = ['accumulation', 'distribution'] as const
export type ShareClassType = (typeof SHARE_CLASS_TYPES)[number]

export const DISTRIBUTION_FREQUENCIES = ['monthly', 'quarterly'] as const
export type DistributionFrequency = (typeof DISTRIBUTION_FREQUENCIES)[number]

export const ANTI_DILUTION_LMTS = [
  'anti_dilution_levy',
  'swing_pricing',
  'redemption_fee',
] as const
export type AntiDilutionLmt = (typeof ANTI_DILUTION_LMTS)[number]

export const CALIBRATION_METHODS = ['annex_i', 'annex_ii'] as const
export type CalibrationMethod = (typeof CALIBRATION_METHODS)[number]

export const REDEMPTION_FREQUENCIES = [
  'weekly',
  'bi_weekly',
  'monthly',
  'bimonthly',
  'quarterly',
  'semiannual',
  'annual',
] as const
export type RedemptionFrequency = (typeof REDEMPTION_FREQUENCIES)[number]

export const NOTICE_PERIODS = [
  'none',
  '2_weeks',
  '1_month',
  '3_months',
  '6_months',
  '9_months',
  '12_months',
] as const
export type NoticePeriod = (typeof NOTICE_PERIODS)[number]

export const CARRY_POLICIES = [
  'automatic_carry_over',
  'new_request',
  'investor_choice',
] as const
export type CarryPolicy = (typeof CARRY_POLICIES)[number]

export const ASSET_CLASSES = [
  'equity_quasi_equity',
  'debt_instruments',
  'loans',
  'units_in_other_funds',
  'real_assets',
  'sts_securitisation',
  'green_bonds',
  'liquid_assets_art_9_1_b',
] as const
export type AssetClass = (typeof ASSET_CLASSES)[number]

export const ELIGIBLE_ASSET_CLASSES = ASSET_CLASSES.filter(
  (c) => c !== 'liquid_assets_art_9_1_b',
)

export const CONTACT_TITLES = ['ms', 'mr'] as const
export type ContactTitle = (typeof CONTACT_TITLES)[number]

export const WIZARD_STEPS = [
  'fund',
  'duration',
  'strategy',
  'leverage',
  'shareClasses',
  'fees',
  'subscriptions',
  'redemptions',
  'portfolio',
  'contact',
] as const

export type WizardStepId = (typeof WIZARD_STEPS)[number]
