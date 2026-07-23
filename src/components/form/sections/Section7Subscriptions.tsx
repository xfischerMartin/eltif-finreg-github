import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { FormValues } from '@/types/form'
import { useFieldErrorMessage } from '@/hooks/useFieldErrorMessage'
import { Field } from '@/components/ui/Field'
import { NumberInput, TextInput } from '@/components/ui/Inputs'

export function Section7Subscriptions() {
  const { t } = useTranslation('fields')
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<FormValues>()

  const cutOffError = useFieldErrorMessage(
    errors.subscription_cut_off_time?.message,
  )
  const paymentError = useFieldErrorMessage(
    errors.subscription_payment_date?.message,
  )

  return (
    <div className="grid gap-6">
      <Field
        name="subscription_frequency"
        required
        error={errors.subscription_frequency?.message}
      >
        <TextInput
          id="subscription_frequency"
          placeholder={t('subscription_frequency.placeholder')}
          {...register('subscription_frequency')}
        />
      </Field>

      <Field name="subscription_cut_off_time" required error={cutOffError}>
        <Controller
          name="subscription_cut_off_time"
          control={control}
          render={({ field }) => (
            <NumberInput
              id="subscription_cut_off_time"
              min={1}
              max={29}
              step={1}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              suffix={t('subscription_cut_off_time.unit')}
            />
          )}
        />
      </Field>

      <Field name="subscription_payment_date" required error={paymentError}>
        <Controller
          name="subscription_payment_date"
          control={control}
          render={({ field }) => (
            <NumberInput
              id="subscription_payment_date"
              min={1}
              max={10}
              step={1}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              suffix={t('subscription_payment_date.unit')}
            />
          )}
        />
      </Field>

      <Field
        name="nav_calculation_date"
        required
        error={errors.nav_calculation_date?.message}
      >
        <TextInput
          id="nav_calculation_date"
          placeholder={t('nav_calculation_date.placeholder')}
          {...register('nav_calculation_date')}
        />
      </Field>
    </div>
  )
}
