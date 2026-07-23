import { z } from 'zod'
import { DURATIONS } from '@/constants/enums'

export const section2Schema = z
  .object({
    duration: z.enum(DURATIONS, { message: 'required' }),
    duration_limited_to: z.number().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.duration !== 'limited') return

    if (
      data.duration_limited_to === null ||
      Number.isNaN(data.duration_limited_to)
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['duration_limited_to'],
        message: 'required',
      })
      return
    }

    if (
      !Number.isInteger(data.duration_limited_to) ||
      data.duration_limited_to < 1
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['duration_limited_to'],
        message: 'min:1',
      })
    }
  })
