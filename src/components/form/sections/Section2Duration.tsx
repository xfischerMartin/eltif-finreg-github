import { useEffect } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { DURATIONS } from '@/constants/enums'
import type { FormValues } from '@/types/form'
import { useFieldErrorMessage } from '@/hooks/useFieldErrorMessage'
import { Field } from '@/components/ui/Field'
import { ConditionalReveal } from '@/components/ui/Motion'
import { NumberInput, RadioGroup } from '@/components/ui/Inputs'

export function Section2Duration() {
  const { t } = useTranslation('fields')
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<FormValues>()

  const duration = useWatch({ control, name: 'duration' })
  const limitedError = useFieldErrorMessage(errors.duration_limited_to?.message)

  useEffect(() => {
    if (duration === 'undetermined') {
      setValue('duration_limited_to', null)
    }
  }, [duration, setValue])

  const showLimitedTo = duration === 'limited'

  return (
    <div className="grid gap-6">
      <Field name="duration" required error={errors.duration?.message}>
        <Controller
          name="duration"
          control={control}
          render={({ field }) => (
            <RadioGroup
              name="duration"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              options={DURATIONS.map((value) => ({
                value,
                label: t(`duration.options.${value}`),
              }))}
            />
          )}
        />
      </Field>

      {showLimitedTo ? (
        <ConditionalReveal>
          <Field name="duration_limited_to" required error={limitedError}>
            <Controller
              name="duration_limited_to"
              control={control}
              render={({ field }) => (
                <NumberInput
                  id="duration_limited_to"
                  min={1}
                  step={1}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  suffix={t('duration_limited_to.unit')}
                />
              )}
            />
          </Field>
        </ConditionalReveal>
      ) : null}
    </div>
  )
}
