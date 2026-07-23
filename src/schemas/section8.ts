import { z } from 'zod'
import {
  CALIBRATION_METHODS,
  CARRY_POLICIES,
  NOTICE_PERIODS,
  REDEMPTION_FREQUENCIES,
  YES_NO,
} from '@/constants/enums'

const requiredString = z.string().trim().min(1, { message: 'required' })

function requiredNonNegNumber() {
  return z.number().nullable().superRefine((value, ctx) => {
    if (value === null || Number.isNaN(value)) {
      ctx.addIssue({ code: 'custom', message: 'required' })
      return
    }
    if (value < 0) {
      ctx.addIssue({ code: 'custom', message: 'min:0' })
    }
  })
}

function requiredDays(min: number, max?: number) {
  return z.number().nullable().superRefine((value, ctx) => {
    if (value === null || Number.isNaN(value)) {
      ctx.addIssue({ code: 'custom', message: 'required' })
      return
    }
    if (!Number.isInteger(value)) {
      ctx.addIssue({ code: 'custom', message: 'required' })
      return
    }
    if (value < min) {
      ctx.addIssue({ code: 'custom', message: `min:${min}` })
    }
    if (max !== undefined && value > max) {
      ctx.addIssue({ code: 'custom', message: `max:${max}` })
    }
  })
}

export const section8Schema = z
  .object({
    redemption_calibration_method: z.enum(CALIBRATION_METHODS, {
      message: 'required',
    }),
    redemption_frequency: z.enum(REDEMPTION_FREQUENCIES, {
      message: 'required',
    }),
    redemption_notice_period: z.union([
      z.literal(''),
      z.enum(NOTICE_PERIODS),
    ]),
    liquid_assets_amount: requiredNonNegNumber(),
    expected_cashflow_12m: requiredNonNegNumber(),
    redemption_cut_off: requiredDays(1, 29),
    redemption_dealing_date: requiredString,
    payment_of_redemption_proceeds: requiredDays(0),
    carry_policy: z.enum(CARRY_POLICIES, { message: 'required' }),
    min_holding_period: z.number().nullable(),
    redemption_in_kind: z.union([z.literal(''), z.enum(YES_NO)]),
    sim_investor_amount: requiredNonNegNumber(),
    sim_investor_request_date: requiredString,
    sim_aggregate_demand: requiredNonNegNumber(),
    sim_investor_chooses_carry: z.boolean(),
    sim_suspension_enabled: z.boolean(),
    sim_suspension_start: z.string(),
    sim_suspension_days: z.number().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.redemption_calibration_method === 'annex_i') {
      if (!data.redemption_notice_period) {
        ctx.addIssue({
          code: 'custom',
          path: ['redemption_notice_period'],
          message: 'required',
        })
      }
    }

    if (
      data.min_holding_period !== null &&
      !Number.isNaN(data.min_holding_period) &&
      data.min_holding_period < 0
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['min_holding_period'],
        message: 'min:0',
      })
    }

    if (data.sim_suspension_enabled) {
      if (!data.sim_suspension_start.trim()) {
        ctx.addIssue({
          code: 'custom',
          path: ['sim_suspension_start'],
          message: 'required',
        })
      }
      if (
        data.sim_suspension_days === null ||
        Number.isNaN(data.sim_suspension_days) ||
        data.sim_suspension_days < 1
      ) {
        ctx.addIssue({
          code: 'custom',
          path: ['sim_suspension_days'],
          message: 'min:1',
        })
      }
    }

    if (
      data.sim_aggregate_demand !== null &&
      data.sim_investor_amount !== null &&
      data.sim_aggregate_demand < data.sim_investor_amount
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['sim_aggregate_demand'],
        message: 'aggregate_below_investor',
      })
    }
  })
