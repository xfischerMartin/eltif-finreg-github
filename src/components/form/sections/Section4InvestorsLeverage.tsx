import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { FormValues } from '@/types/form'
import { useFieldErrorMessage } from '@/hooks/useFieldErrorMessage'
import { Field } from '@/components/ui/Field'
import { NumberInput, TextInput } from '@/components/ui/Inputs'

export function Section4InvestorsLeverage() {
  const { t } = useTranslation('fields')
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<FormValues>()

  const borrowingError = useFieldErrorMessage(
    errors.leverage_borrowing_amount?.message,
  )

  return (
    <div className="grid gap-5">
      <Field name="target_investors" required>
        <div
          className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink"
          aria-readonly="true"
        >
          <input
            type="radio"
            checked
            readOnly
            disabled
            className="accent-accent"
            aria-label={t('target_investors.options.retail')}
          />
          <span className="font-medium">
            {t('target_investors.options.retail')}
          </span>
          <span className="text-xs text-ink-muted">
            ({t('target_investors.lockedHint')})
          </span>
        </div>
        <input type="hidden" {...register('target_investors')} />
      </Field>

      <Field
        name="leverage_borrowing_amount"
        required
        error={borrowingError}
      >
        <Controller
          name="leverage_borrowing_amount"
          control={control}
          render={({ field }) => (
            <NumberInput
              id="leverage_borrowing_amount"
              min={1}
              max={50}
              step={0.1}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              suffix="%"
            />
          )}
        />
      </Field>

      <Field
        name="leverage_borrowing_maturity"
        required
        error={errors.leverage_borrowing_maturity?.message}
      >
        <TextInput
          id="leverage_borrowing_maturity"
          {...register('leverage_borrowing_maturity')}
        />
      </Field>

      <Field
        name="leverage_aifmd_commitment_method"
        required
        error={errors.leverage_aifmd_commitment_method?.message}
      >
        <TextInput
          id="leverage_aifmd_commitment_method"
          {...register('leverage_aifmd_commitment_method')}
        />
      </Field>

      <Field
        name="leverage_aifmd_gross_method"
        required
        error={errors.leverage_aifmd_gross_method?.message}
      >
        <TextInput
          id="leverage_aifmd_gross_method"
          {...register('leverage_aifmd_gross_method')}
        />
      </Field>
    </div>
  )
}
