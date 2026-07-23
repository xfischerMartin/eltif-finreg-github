import { z } from 'zod'
import { ASSET_CLASSES } from '@/constants/enums'

const requiredAmount = z.number().nullable().superRefine((value, ctx) => {
  if (value === null || Number.isNaN(value)) {
    ctx.addIssue({ code: 'custom', message: 'required' })
    return
  }
  if (value < 0) {
    ctx.addIssue({ code: 'custom', message: 'min:0' })
  }
})

export const assetClassRowSchema = z.object({
  asset_class: z.enum(ASSET_CLASSES, { message: 'required' }),
  amount: requiredAmount,
})

export const section10Schema = z.object({
  asset_classes: z.array(assetClassRowSchema).min(1, { message: 'required' }),
  eltif_capital: requiredAmount,
  nav: requiredAmount,
})
