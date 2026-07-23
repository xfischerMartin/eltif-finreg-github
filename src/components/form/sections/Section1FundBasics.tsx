import { useEffect } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { CURRENCIES, LEGAL_FORMS, YES_NO } from '@/constants/enums'
import type { FormValues } from '@/types/form'
import { Field } from '@/components/ui/Field'
import { ConditionalReveal } from '@/components/ui/Motion'
import { RadioGroup, SelectInput, TextInput } from '@/components/ui/Inputs'

export function Section1FundBasics() {
  const { t } = useTranslation(['fields', 'common'])
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<FormValues>()

  const legalForm = useWatch({ control, name: 'legal_form' })
  const selfManaged = useWatch({ control, name: 'self_managed' })

  useEffect(() => {
    if (legalForm === 'OPF') {
      setValue('self_managed', '')
      setValue('name_of_aifm', '')
    }
    if (legalForm === 'SICAV') {
      setValue('name_of_management_company', '')
    }
  }, [legalForm, setValue])

  useEffect(() => {
    if (selfManaged === 'yes') {
      setValue('name_of_aifm', '')
    }
  }, [selfManaged, setValue])

  const showSelfManaged = legalForm === 'SICAV'
  const showAifm = legalForm === 'SICAV' && selfManaged === 'no'
  const showManagementCompany = legalForm === 'OPF'
  const selectPlaceholder = t('common:select.placeholder')

  return (
    <div className="grid gap-6">
      <Field
        name="name_of_eltif"
        required
        error={errors.name_of_eltif?.message}
      >
        <TextInput
          id="name_of_eltif"
          autoComplete="organization"
          {...register('name_of_eltif')}
        />
      </Field>

      <Field name="legal_form" required error={errors.legal_form?.message}>
        <Controller
          name="legal_form"
          control={control}
          render={({ field }) => (
            <SelectInput
              id="legal_form"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              placeholder={selectPlaceholder}
              options={LEGAL_FORMS.map((value) => ({
                value,
                label: t(`fields:legal_form.options.${value}`),
              }))}
            />
          )}
        />
      </Field>

      {showSelfManaged ? (
        <ConditionalReveal>
          <Field
            name="self_managed"
            required
            error={errors.self_managed?.message}
          >
            <Controller
              name="self_managed"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  name="self_managed"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  options={YES_NO.map((value) => ({
                    value,
                    label: t(`fields:self_managed.options.${value}`),
                  }))}
                />
              )}
            />
          </Field>
        </ConditionalReveal>
      ) : null}

      {showAifm ? (
        <ConditionalReveal>
          <Field
            name="name_of_aifm"
            required
            error={errors.name_of_aifm?.message}
          >
            <TextInput id="name_of_aifm" {...register('name_of_aifm')} />
          </Field>
        </ConditionalReveal>
      ) : null}

      {showManagementCompany ? (
        <ConditionalReveal>
          <Field
            name="name_of_management_company"
            required
            error={errors.name_of_management_company?.message}
          >
            <TextInput
              id="name_of_management_company"
              {...register('name_of_management_company')}
            />
          </Field>
        </ConditionalReveal>
      ) : null}

      <Field
        name="name_of_investment_manager"
        error={errors.name_of_investment_manager?.message}
      >
        <TextInput
          id="name_of_investment_manager"
          {...register('name_of_investment_manager')}
        />
      </Field>

      <Field
        name="name_of_administrator"
        error={errors.name_of_administrator?.message}
      >
        <TextInput
          id="name_of_administrator"
          {...register('name_of_administrator')}
        />
      </Field>

      <Field
        name="name_of_depositary"
        required
        error={errors.name_of_depositary?.message}
      >
        <TextInput
          id="name_of_depositary"
          {...register('name_of_depositary')}
        />
      </Field>

      <Field
        name="fund_reference_currency"
        required
        error={errors.fund_reference_currency?.message}
      >
        <Controller
          name="fund_reference_currency"
          control={control}
          render={({ field }) => (
            <SelectInput
              id="fund_reference_currency"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              placeholder={selectPlaceholder}
              options={CURRENCIES.map((value) => ({
                value,
                label: t(`fields:fund_reference_currency.options.${value}`),
              }))}
            />
          )}
        />
      </Field>
    </div>
  )
}
