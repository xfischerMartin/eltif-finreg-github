import { useEffect } from 'react'
import {
  Controller,
  useFormContext,
  useWatch,
  type FieldError,
  type Merge,
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  CURRENCIES,
  DISTRIBUTION_FREQUENCIES,
  SHARE_CLASS_TYPES,
} from '@/constants/enums'
import type { FormValues } from '@/types/form'
import { useFieldErrorMessage } from '@/hooks/useFieldErrorMessage'
import { Field } from '@/components/ui/Field'
import { ConditionalReveal, MotionButton } from '@/components/ui/Motion'
import { NumberInput, RadioGroup, TextInput } from '@/components/ui/Inputs'

type RowErrors = Merge<
  FieldError,
  {
    share_class?: FieldError
    currency?: FieldError
    minimum_subscription_amount?: FieldError
    management_fee?: FieldError
    performance_fee?: FieldError
    distribution_frequency?: FieldError
  }
>

type ShareClassRowProps = {
  index: number
  canRemove: boolean
  onRemove: () => void
  errors?: RowErrors
}

export function ShareClassRow({
  index,
  canRemove,
  onRemove,
  errors,
}: ShareClassRowProps) {
  const { t } = useTranslation(['fields', 'common'])
  const { control, setValue, register } = useFormContext<FormValues>()

  const shareClass = useWatch({
    control,
    name: `share_classes.${index}.share_class`,
  })

  useEffect(() => {
    if (shareClass === 'accumulation') {
      setValue(`share_classes.${index}.distribution_frequency`, '')
    }
  }, [shareClass, index, setValue])

  const showDistributionFrequency = shareClass === 'distribution'
  const prefix = `share_classes.${index}` as const

  const errShareClass = useFieldErrorMessage(errors?.share_class?.message)
  const errCurrency = useFieldErrorMessage(errors?.currency?.message)
  const errMinSub = useFieldErrorMessage(
    errors?.minimum_subscription_amount?.message,
  )
  const errMgmtFee = useFieldErrorMessage(errors?.management_fee?.message)
  const errDistFreq = useFieldErrorMessage(
    errors?.distribution_frequency?.message,
  )

  return (
    <div
      role="group"
      aria-labelledby={`${prefix}-heading`}
      className="rounded-lg bg-gray-50 p-4 ring-1 ring-inset ring-gray-200 sm:p-5"
    >
      <h3
        id={`${prefix}-heading`}
        className="text-sm font-semibold text-ink"
      >
        {t('common:repeater.shareClassLabel', { index: index + 1 })}
      </h3>

      <div className="mt-4 grid grid-cols-1 gap-5">
        <Field name="share_class" required error={errShareClass}>
          <Controller
            name={`${prefix}.share_class`}
            control={control}
            render={({ field }) => (
              <RadioGroup
                name={`${prefix}.share_class`}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                layout="stack"
                options={SHARE_CLASS_TYPES.map((value) => ({
                  value,
                  label: t(`fields:share_class.options.${value}`),
                }))}
              />
            )}
          />
        </Field>

        <Field name="currency" required error={errCurrency}>
          <Controller
            name={`${prefix}.currency`}
            control={control}
            render={({ field }) => (
              <RadioGroup
                name={`${prefix}.currency`}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                options={CURRENCIES.map((value) => ({
                  value,
                  label: t(`fields:currency.options.${value}`),
                }))}
              />
            )}
          />
        </Field>

        <Field name="minimum_subscription_amount" required error={errMinSub}>
          <Controller
            name={`${prefix}.minimum_subscription_amount`}
            control={control}
            render={({ field }) => (
              <NumberInput
                id={`${prefix}.minimum_subscription_amount`}
                min={0}
                step="any"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
        </Field>

        <Field name="management_fee" required error={errMgmtFee}>
          <Controller
            name={`${prefix}.management_fee`}
            control={control}
            render={({ field }) => (
              <NumberInput
                id={`${prefix}.management_fee`}
                min={0}
                step={0.01}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                suffix="%"
              />
            )}
          />
        </Field>

        <Field name="performance_fee">
          <TextInput
            id={`${prefix}.performance_fee`}
            placeholder={t('fields:performance_fee.placeholder')}
            {...register(`${prefix}.performance_fee`)}
          />
        </Field>

        {showDistributionFrequency ? (
          <ConditionalReveal>
            <Field name="distribution_frequency" required error={errDistFreq}>
              <Controller
                name={`${prefix}.distribution_frequency`}
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    name={`${prefix}.distribution_frequency`}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    options={DISTRIBUTION_FREQUENCIES.map((value) => ({
                      value,
                      label: t(
                        `fields:distribution_frequency.options.${value}`,
                      ),
                    }))}
                  />
                )}
              />
            </Field>
          </ConditionalReveal>
        ) : null}
      </div>

      {canRemove ? (
        <div className="mt-4">
          <MotionButton variant="ghost" onClick={onRemove} className="w-full">
            {t('common:repeater.removeShareClass')}
          </MotionButton>
        </div>
      ) : null}
    </div>
  )
}
