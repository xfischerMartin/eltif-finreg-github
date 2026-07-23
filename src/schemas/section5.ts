import { z } from 'zod'
import {
  CURRENCIES,
  DISTRIBUTION_FREQUENCIES,
  SHARE_CLASS_TYPES,
} from '@/constants/enums'

const requiredNumber = z.number().nullable().superRefine((value, ctx) => {
  if (value === null || Number.isNaN(value)) {
    ctx.addIssue({ code: 'custom', message: 'required' })
    return
  }
  if (value < 0) {
    ctx.addIssue({ code: 'custom', message: 'min:0' })
  }
})

export const shareClassRowSchema = z
  .object({
    share_class: z.enum(SHARE_CLASS_TYPES, { message: 'required' }),
    currency: z.enum(CURRENCIES, { message: 'required' }),
    minimum_subscription_amount: requiredNumber,
    management_fee: requiredNumber,
    performance_fee: z.string(),
    distribution_frequency: z.union([
      z.literal(''),
      z.enum(DISTRIBUTION_FREQUENCIES),
    ]),
  })
  .superRefine((row, ctx) => {
    if (row.share_class !== 'distribution') return
    if (
      row.distribution_frequency !== 'monthly' &&
      row.distribution_frequency !== 'quarterly'
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['distribution_frequency'],
        message: 'required',
      })
    }
  })

export const section5Schema = z.object({
  share_classes: z
    .array(shareClassRowSchema)
    .min(1, { message: 'required' }),
})
