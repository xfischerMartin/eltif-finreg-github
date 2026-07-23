import { z } from 'zod'
import { CONTACT_TITLES } from '@/constants/enums'

export const section9Schema = z
  .object({
    title: z.enum(CONTACT_TITLES, { message: 'required' }),
    last_name: z.string(),
    first_name: z.string(),
    email: z.string().trim().min(1, { message: 'required' }),
    company: z.string(),
    agreement: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      ctx.addIssue({ code: 'custom', path: ['email'], message: 'email' })
    }
    if (!data.agreement) {
      ctx.addIssue({ code: 'custom', path: ['agreement'], message: 'required' })
    }
  })
