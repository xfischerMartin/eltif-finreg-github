import type {
  AntiDilutionLmt,
  AssetClass,
  CalibrationMethod,
  CarryPolicy,
  ContactTitle,
  Currency,
  DistributionFrequency,
  Duration,
  LegalForm,
  NoticePeriod,
  RampUpPeriod,
  RedemptionFrequency,
  SfdrCategory,
  ShareClassType,
  TargetInvestors,
  YesNo,
} from '@/constants/enums'

export type ShareClassRow = {
  share_class: ShareClassType | ''
  currency: Currency | ''
  minimum_subscription_amount: number | null
  management_fee: number | null
  performance_fee: string
  distribution_frequency: DistributionFrequency | ''
}

export type AssetClassRow = {
  asset_class: AssetClass | ''
  amount: number | null
}

export type FormValues = {
  // Section 1
  name_of_eltif: string
  legal_form: LegalForm | ''
  self_managed: YesNo | ''
  name_of_aifm: string
  name_of_management_company: string
  name_of_investment_manager: string
  name_of_administrator: string
  name_of_depositary: string
  fund_reference_currency: Currency | ''

  // Section 2
  duration: Duration | ''
  duration_limited_to: number | null

  // Section 3
  strategy_ioas: string
  strategy_tatuea: number | null
  strategy_ilseeia: number | null
  strategy_ilsuea: number | null
  strategy_apac: string
  strategy_ramp_up_period: RampUpPeriod | ''
  sfdr_category: SfdrCategory | ''

  // Section 4
  target_investors: TargetInvestors
  leverage_borrowing_amount: number | null
  leverage_borrowing_maturity: string
  leverage_aifmd_commitment_method: string
  leverage_aifmd_gross_method: string

  // Section 5
  share_classes: ShareClassRow[]

  // Section 6
  subscription_fee: number | null
  redemption_fee: number | null
  anti_dilution_lmt: AntiDilutionLmt[]

  // Section 7
  subscription_frequency: string
  subscription_cut_off_time: number | null
  subscription_payment_date: number | null
  nav_calculation_date: string

  // Section 8 — fund terms
  redemption_calibration_method: CalibrationMethod | ''
  redemption_frequency: RedemptionFrequency | ''
  redemption_notice_period: NoticePeriod | ''
  liquid_assets_amount: number | null
  expected_cashflow_12m: number | null
  redemption_cut_off: number | null
  redemption_dealing_date: string
  payment_of_redemption_proceeds: number | null
  carry_policy: CarryPolicy | ''
  min_holding_period: number | null
  redemption_in_kind: YesNo | ''

  // Section 8 — simulation scenario
  sim_investor_amount: number | null
  sim_investor_request_date: string
  sim_aggregate_demand: number | null
  sim_investor_chooses_carry: boolean
  sim_suspension_enabled: boolean
  sim_suspension_start: string
  sim_suspension_days: number | null

  // Section 10 — portfolio (wizard step before contact)
  asset_classes: AssetClassRow[]
  eltif_capital: number | null
  nav: number | null

  // Section 9 — contact (last)
  title: ContactTitle | ''
  last_name: string
  first_name: string
  email: string
  company: string
  agreement: boolean
}

export const emptyShareClassRow = (): ShareClassRow => ({
  share_class: '',
  currency: '',
  minimum_subscription_amount: null,
  management_fee: null,
  performance_fee: '',
  distribution_frequency: '',
})

export const emptyAssetClassRow = (): AssetClassRow => ({
  asset_class: '',
  amount: null,
})

export const defaultFormValues: FormValues = {
  name_of_eltif: '',
  legal_form: '',
  self_managed: '',
  name_of_aifm: '',
  name_of_management_company: '',
  name_of_investment_manager: '',
  name_of_administrator: '',
  name_of_depositary: '',
  fund_reference_currency: '',

  duration: '',
  duration_limited_to: null,

  strategy_ioas: '',
  strategy_tatuea: null,
  strategy_ilseeia: null,
  strategy_ilsuea: null,
  strategy_apac: '',
  strategy_ramp_up_period: '',
  sfdr_category: '',

  target_investors: 'retail',
  leverage_borrowing_amount: null,
  leverage_borrowing_maturity: '',
  leverage_aifmd_commitment_method: '',
  leverage_aifmd_gross_method: '',

  share_classes: [emptyShareClassRow()],

  subscription_fee: null,
  redemption_fee: null,
  anti_dilution_lmt: [],

  subscription_frequency: '',
  subscription_cut_off_time: null,
  subscription_payment_date: null,
  nav_calculation_date: '',

  redemption_calibration_method: '',
  redemption_frequency: '',
  redemption_notice_period: '',
  liquid_assets_amount: null,
  expected_cashflow_12m: null,
  redemption_cut_off: null,
  redemption_dealing_date: '',
  payment_of_redemption_proceeds: null,
  carry_policy: '',
  min_holding_period: null,
  redemption_in_kind: '',

  sim_investor_amount: null,
  sim_investor_request_date: '',
  sim_aggregate_demand: null,
  sim_investor_chooses_carry: true,
  sim_suspension_enabled: false,
  sim_suspension_start: '',
  sim_suspension_days: null,

  asset_classes: [emptyAssetClassRow()],
  eltif_capital: null,
  nav: null,

  title: '',
  last_name: '',
  first_name: '',
  email: '',
  company: '',
  agreement: false,
}
