import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { RAMP_UP_PERIODS, SFDR_CATEGORIES } from '@/constants/enums'
import type { FormValues } from '@/types/form'
import { useFieldErrorMessage } from '@/hooks/useFieldErrorMessage'
import { Field } from '@/components/ui/Field'
import {
  NumberInput,
  RadioGroup,
  SelectInput,
  TextArea,
  TextInput,
} from '@/components/ui/Inputs'

export function Section3Strategy() {
  const { t } = useTranslation(['fields', 'common'])
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<FormValues>()

  const errTatuea = useFieldErrorMessage(errors.strategy_tatuea?.message)
  const errIlseeia = useFieldErrorMessage(errors.strategy_ilseeia?.message)
  const errIlsuea = useFieldErrorMessage(errors.strategy_ilsuea?.message)

  return (
    <div className="grid gap-6">
      <Field name="strategy_ioas" error={errors.strategy_ioas?.message}>
        <TextArea id="strategy_ioas" {...register('strategy_ioas')} />
      </Field>

      <Field name="strategy_tatuea" error={errTatuea}>
        <Controller
          name="strategy_tatuea"
          control={control}
          render={({ field }) => (
            <NumberInput
              id="strategy_tatuea"
              min={1}
              max={45}
              step={0.1}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              suffix="%"
            />
          )}
        />
      </Field>

      <Field name="strategy_ilseeia" error={errIlseeia}>
        <Controller
          name="strategy_ilseeia"
          control={control}
          render={({ field }) => (
            <NumberInput
              id="strategy_ilseeia"
              min={1}
              max={20}
              step={0.1}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              suffix="%"
            />
          )}
        />
      </Field>

      <Field name="strategy_ilsuea" error={errIlsuea}>
        <Controller
          name="strategy_ilsuea"
          control={control}
          render={({ field }) => (
            <NumberInput
              id="strategy_ilsuea"
              min={1}
              max={10}
              step={0.1}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              suffix="%"
            />
          )}
        />
      </Field>

      <Field name="strategy_apac" error={errors.strategy_apac?.message}>
        <TextInput id="strategy_apac" {...register('strategy_apac')} />
      </Field>

      <Field
        name="strategy_ramp_up_period"
        error={errors.strategy_ramp_up_period?.message}
      >
        <Controller
          name="strategy_ramp_up_period"
          control={control}
          render={({ field }) => (
            <SelectInput
              id="strategy_ramp_up_period"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              placeholder={t('common:select.placeholder')}
              options={RAMP_UP_PERIODS.map((value) => ({
                value,
                label: t(`fields:strategy_ramp_up_period.options.${value}`),
              }))}
            />
          )}
        />
      </Field>

      <Field name="sfdr_category" error={errors.sfdr_category?.message}>
        <Controller
          name="sfdr_category"
          control={control}
          render={({ field }) => (
            <RadioGroup
              name="sfdr_category"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              options={SFDR_CATEGORIES.map((value) => ({
                value,
                label: t(`fields:sfdr_category.options.${value}`),
              }))}
            />
          )}
        />
      </Field>
    </div>
  )
}
