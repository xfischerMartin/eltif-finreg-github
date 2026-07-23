import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ANTI_DILUTION_LMTS } from '@/constants/enums'
import type { FormValues } from '@/types/form'
import { useFieldErrorMessage } from '@/hooks/useFieldErrorMessage'
import { Field } from '@/components/ui/Field'
import { AdvisoryNotice } from '@/components/ui/AdvisoryNotice'
import { CheckboxGroup, NumberInput } from '@/components/ui/Inputs'

export function Section6Fees() {
  const { t } = useTranslation(['fields', 'common'])
  const {
    control,
    formState: { errors },
  } = useFormContext<FormValues>()

  const antiDilution = useWatch({ control, name: 'anti_dilution_lmt' }) ?? []
  const subscriptionError = useFieldErrorMessage(
    errors.subscription_fee?.message,
  )
  const redemptionError = useFieldErrorMessage(errors.redemption_fee?.message)

  return (
    <div className="grid gap-5">
      <Field name="subscription_fee" required error={subscriptionError}>
        <Controller
          name="subscription_fee"
          control={control}
          render={({ field }) => (
            <NumberInput
              id="subscription_fee"
              min={0}
              max={5}
              step={0.01}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              suffix="%"
            />
          )}
        />
      </Field>

      <Field name="redemption_fee" required error={redemptionError}>
        <Controller
          name="redemption_fee"
          control={control}
          render={({ field }) => (
            <NumberInput
              id="redemption_fee"
              min={0}
              max={11}
              step={0.01}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              suffix="%"
            />
          )}
        />
      </Field>

      <Field name="anti_dilution_lmt">
        <Controller
          name="anti_dilution_lmt"
          control={control}
          render={({ field }) => (
            <CheckboxGroup
              name="anti_dilution_lmt"
              values={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              options={ANTI_DILUTION_LMTS.map((value) => ({
                value,
                label: t(`fields:anti_dilution_lmt.options.${value}`),
              }))}
            />
          )}
        />
      </Field>

      {antiDilution.length === 0 ? (
        <AdvisoryNotice>{t('common:advisories.antiDilutionRecommended')}</AdvisoryNotice>
      ) : null}
    </div>
  )
}
