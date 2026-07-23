import { z } from 'zod'

const requiredString = z.string().trim().min(1, { message: 'required' })

function requiredDays(min: number, max: number) {
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
    if (value > max) {
      ctx.addIssue({ code: 'custom', message: `max:${max}` })
    }
  })
}

export const section7Schema = z.object({
  subscription_frequency: requiredString,
  subscription_cut_off_time: requiredDays(1, 29),
  subscription_payment_date: requiredDays(1, 10),
  nav_calculation_date: requiredString,
})
