import { z } from 'zod'
import { CURRENCIES, LEGAL_FORMS, YES_NO } from '@/constants/enums'

const requiredString = (message: string) =>
  z.string().trim().min(1, { message })

export const section1Schema = z
  .object({
    name_of_eltif: requiredString('required'),
    legal_form: z.enum(LEGAL_FORMS, { message: 'required' }),
    self_managed: z.union([z.enum(YES_NO), z.literal('')]),
    name_of_aifm: z.string(),
    name_of_management_company: z.string(),
    name_of_investment_manager: z.string(),
    name_of_administrator: z.string(),
    name_of_depositary: requiredString('required'),
    fund_reference_currency: z.enum(CURRENCIES, { message: 'required' }),
  })
  .superRefine((data, ctx) => {
    if (data.legal_form === 'SICAV') {
      if (data.self_managed !== 'yes' && data.self_managed !== 'no') {
        ctx.addIssue({
          code: 'custom',
          path: ['self_managed'],
          message: 'required',
        })
      }
      if (
        data.self_managed === 'no' &&
        data.name_of_aifm.trim().length === 0
      ) {
        ctx.addIssue({
          code: 'custom',
          path: ['name_of_aifm'],
          message: 'required',
        })
      }
    }

    if (
      data.legal_form === 'OPF' &&
      data.name_of_management_company.trim().length === 0
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['name_of_management_company'],
        message: 'required',
      })
    }
  })

export type Section1Values = z.infer<typeof section1Schema>

/** Fields belonging to the current wizard step (for targeted trigger). */
export const SECTION1_FIELD_NAMES = [
  'name_of_eltif',
  'legal_form',
  'self_managed',
  'name_of_aifm',
  'name_of_management_company',
  'name_of_investment_manager',
  'name_of_administrator',
  'name_of_depositary',
  'fund_reference_currency',
] as const
