import { z } from 'zod'
import { ANTI_DILUTION_LMTS } from '@/constants/enums'

function requiredPercent(min: number, max: number) {
  return z.number().nullable().superRefine((value, ctx) => {
    if (value === null || Number.isNaN(value)) {
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

export const section6Schema = z.object({
  subscription_fee: requiredPercent(0, 5),
  redemption_fee: requiredPercent(0, 11),
  anti_dilution_lmt: z.array(z.enum(ANTI_DILUTION_LMTS)),
})
