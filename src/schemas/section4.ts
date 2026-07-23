import { z } from 'zod'
import { TARGET_INVESTORS } from '@/constants/enums'

const requiredString = (message = 'required') =>
  z.string().trim().min(1, { message })

export const section4Schema = z
  .object({
    target_investors: z.enum(TARGET_INVESTORS),
    leverage_borrowing_amount: z.number().nullable(),
    leverage_borrowing_maturity: requiredString(),
    leverage_aifmd_commitment_method: requiredString(),
    leverage_aifmd_gross_method: requiredString(),
  })
  .superRefine((data, ctx) => {
    const amount = data.leverage_borrowing_amount
    if (amount === null || Number.isNaN(amount)) {
      ctx.addIssue({
        code: 'custom',
        path: ['leverage_borrowing_amount'],
        message: 'required',
      })
      return
    }
    if (amount < 1) {
      ctx.addIssue({
        code: 'custom',
        path: ['leverage_borrowing_amount'],
        message: 'min:1',
      })
    }
    if (amount > 50) {
      ctx.addIssue({
        code: 'custom',
        path: ['leverage_borrowing_amount'],
        message: 'max:50',
      })
    }
  })
