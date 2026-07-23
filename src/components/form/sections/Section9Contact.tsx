import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { CONTACT_TITLES } from '@/constants/enums'
import type { FormValues } from '@/types/form'
import { useFieldErrorMessage } from '@/hooks/useFieldErrorMessage'
import { Field } from '@/components/ui/Field'
import { RadioGroup, TextInput } from '@/components/ui/Inputs'

export function Section9Contact() {
  const { t } = useTranslation(['fields', 'common'])
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<FormValues>()

  const errEmail = useFieldErrorMessage(errors.email?.message)
  const errAgreement = useFieldErrorMessage(errors.agreement?.message)

  return (
    <div className="grid gap-5">
      <Field name="title" required error={errors.title?.message}>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <RadioGroup
              name="title"
              layout="stack"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              options={CONTACT_TITLES.map((value) => ({
                value,
                label: t(`fields:title.options.${value}`),
              }))}
            />
          )}
        />
      </Field>

      <Field name="first_name" error={errors.first_name?.message}>
        <TextInput id="first_name" autoComplete="given-name" {...register('first_name')} />
      </Field>

      <Field name="last_name" error={errors.last_name?.message}>
        <TextInput id="last_name" autoComplete="family-name" {...register('last_name')} />
      </Field>

      <Field name="email" required error={errEmail}>
        <TextInput
          id="email"
          type="email"
          autoComplete="email"
          {...register('email')}
        />
      </Field>

      <Field name="company" error={errors.company?.message}>
        <TextInput id="company" autoComplete="organization" {...register('company')} />
      </Field>

      <Field name="agreement" required error={errAgreement}>
        <label className="inline-flex cursor-pointer items-start gap-3 text-sm text-ink">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer"
              style={{ accentColor: '#2563eb' }}
            {...register('agreement')}
          />
          <span>{t('fields:agreement.checkboxLabel')}</span>
        </label>
      </Field>
    </div>
  )
}
