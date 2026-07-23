import { useTranslation } from 'react-i18next'

/** Maps Zod manual codes (`required`, `min:N`, `max:N`) to i18n strings. */
export function useFieldErrorMessage(raw?: string) {
  const { t } = useTranslation('common')
  if (!raw) return undefined
  if (raw === 'required') return t('validation.required')
  if (raw === 'email') return t('validation.email')

  const minMatch = /^min:(-?\d+(?:\.\d+)?)$/.exec(raw)
  if (minMatch) return t('validation.min', { min: minMatch[1] })

  const maxMatch = /^max:(-?\d+(?:\.\d+)?)$/.exec(raw)
  if (maxMatch) return t('validation.max', { max: maxMatch[1] })

  if (raw === 'aggregate_below_investor') {
    return t('validation.aggregateBelowInvestor')
  }

  if (raw === 'email') return t('validation.email')

  return raw
}
