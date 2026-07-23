import { z } from 'zod'
import { RAMP_UP_PERIODS, SFDR_CATEGORIES } from '@/constants/enums'

function optionalPercent(min: number, max: number) {
  return z
    .number()
    .nullable()
    .superRefine((value, ctx) => {
      if (value === null || Number.isNaN(value)) return
      if (value < min) {
        ctx.addIssue({ code: 'custom', message: `min:${min}` })
      }
      if (value > max) {
        ctx.addIssue({ code: 'custom', message: `max:${max}` })
      }
    })
}

export const section3Schema = z.object({
  strategy_ioas: z.string(),
  strategy_tatuea: optionalPercent(1, 45),
  strategy_ilseeia: optionalPercent(1, 20),
  strategy_ilsuea: optionalPercent(1, 10),
  strategy_apac: z.string(),
  strategy_ramp_up_period: z.union([
    z.literal(''),
    z.enum(RAMP_UP_PERIODS),
  ]),
  sfdr_category: z.union([z.literal(''), z.enum(SFDR_CATEGORIES)]),
})
