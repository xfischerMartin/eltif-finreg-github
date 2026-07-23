import type {
  CalibrationMethod,
  CarryPolicy,
  NoticePeriod,
  RedemptionFrequency,
} from '@/constants/enums'
import {
  lookupMaxRedemptionPct,
  maxRedemptionAmount,
  noticePeriodDays,
  redemptionBase,
} from '@/lib/redemption/lookup'
import {
  addUtcDays,
  advanceDealingDate,
  isDateInSuspension,
  nextDealingDateOnOrAfter,
  parseIsoDate,
  toIsoDate,
} from '@/lib/redemption/schedule'

export type SimulationWindow = {
  dealing_date: string
  gross_accepted: number
  pro_rata_factor: number
  remainder: number
  fee: number
  net_payout: number
  payment_date: string
}

export type SimulationResult = {
  max_redemption_pct: number
  redemption_base: number
  capacity: number
  windows: SimulationWindow[]
  days_to_full_redemption: number | null
  fully_executed: boolean
  total_net_payout: number
  total_gross_accepted: number
}

export type SimulateRedemptionsInput = {
  method: CalibrationMethod
  frequency: RedemptionFrequency
  noticePeriod: NoticePeriod | null
  liquidAssetsAmount: number
  expectedCashflow12m: number
  redemptionCutOff: number
  paymentOfRedemptionProceeds: number
  /** Fee in percent points, e.g. 2 = 2%. */
  redemptionFeePct: number
  carryPolicy: CarryPolicy
  /** When carry_policy is investor_choice, true = carry remainder. */
  investorChoosesCarry: boolean
  investorRequestAmount: number
  /** ISO date YYYY-MM-DD */
  investorRequestDate: string
  /** Total demand including the investor. */
  aggregateDemand: number
  suspension?: { startIso: string; days: number } | null
}

function effectiveCarry(
  policy: CarryPolicy,
  investorChoosesCarry: boolean,
): 'carry' | 'lapse' {
  if (policy === 'automatic_carry_over') return 'carry'
  if (policy === 'new_request') return 'lapse'
  return investorChoosesCarry ? 'carry' : 'lapse'
}

export function simulateRedemptions(
  input: SimulateRedemptionsInput,
): SimulationResult {
  const pct = lookupMaxRedemptionPct({
    method: input.method,
    frequency: input.frequency,
    noticePeriod: input.noticePeriod,
  })
  const base = redemptionBase(
    input.liquidAssetsAmount,
    input.expectedCashflow12m,
  )
  const capacity = maxRedemptionAmount(pct, base)

  const leadDays = Math.max(
    noticePeriodDays(input.noticePeriod),
    input.redemptionCutOff,
  )
  const requestDate = parseIsoDate(input.investorRequestDate)
  const earliest = addUtcDays(requestDate, leadDays)

  const suspension =
    input.suspension && input.suspension.days > 0
      ? {
          start: parseIsoDate(input.suspension.startIso),
          days: input.suspension.days,
        }
      : null

  let dealing = nextDealingDateOnOrAfter(earliest, input.frequency)
  let guard = 0
  while (isDateInSuspension(dealing, suspension) && guard < 500) {
    dealing = advanceDealingDate(dealing, input.frequency)
    guard += 1
  }

  const carryMode = effectiveCarry(
    input.carryPolicy,
    input.investorChoosesCarry,
  )

  let pending = input.investorRequestAmount
  const windows: SimulationWindow[] = []
  const aggregate = Math.max(input.aggregateDemand, input.investorRequestAmount)

  guard = 0
  while (pending > 1e-9 && guard < 200) {
    guard += 1

    if (isDateInSuspension(dealing, suspension)) {
      dealing = advanceDealingDate(dealing, input.frequency)
      continue
    }

    const oversubscribed = aggregate > capacity + 1e-9
    const proRata = oversubscribed ? capacity / aggregate : 1
    const accepted = Math.min(pending, pending * proRata)
    const remainder = pending - accepted
    const feeAmount = accepted * (input.redemptionFeePct / 100)
    const net = accepted - feeAmount
    const paymentDate = addUtcDays(dealing, input.paymentOfRedemptionProceeds)

    windows.push({
      dealing_date: toIsoDate(dealing),
      gross_accepted: round2(accepted),
      pro_rata_factor: round4(proRata),
      remainder: round2(remainder),
      fee: round2(feeAmount),
      net_payout: round2(net),
      payment_date: toIsoDate(paymentDate),
    })

    pending = remainder

    if (carryMode === 'lapse' || pending <= 1e-9) {
      break
    }

    dealing = advanceDealingDate(dealing, input.frequency)
  }

  const totalNet = windows.reduce((s, w) => s + w.net_payout, 0)
  const totalGross = windows.reduce((s, w) => s + w.gross_accepted, 0)
  const fullyExecuted = pending <= 1e-9
  const lastWindow = windows[windows.length - 1]
  const daysToFull =
    fullyExecuted && lastWindow
      ? Math.round(
          (parseIsoDate(lastWindow.payment_date).getTime() -
            requestDate.getTime()) /
            (24 * 60 * 60 * 1000),
        )
      : null

  return {
    max_redemption_pct: pct,
    redemption_base: round2(base),
    capacity: round2(capacity),
    windows,
    days_to_full_redemption: daysToFull,
    fully_executed: fullyExecuted,
    total_net_payout: round2(totalNet),
    total_gross_accepted: round2(totalGross),
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000
}
