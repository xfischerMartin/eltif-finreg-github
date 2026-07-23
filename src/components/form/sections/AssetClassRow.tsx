import {
  Controller,
  useFormContext,
  type FieldError,
  type Merge,
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ASSET_CLASSES } from '@/constants/enums'
import type { FormValues } from '@/types/form'
import { useFieldErrorMessage } from '@/hooks/useFieldErrorMessage'
import { Field } from '@/components/ui/Field'
import { MotionButton } from '@/components/ui/Motion'
import { NumberInput, SelectInput } from '@/components/ui/Inputs'

type RowErrors = Merge<
  FieldError,
  {
    asset_class?: FieldError
    amount?: FieldError
  }
>

type AssetClassRowProps = {
  index: number
  currencyLabel: string
  canRemove: boolean
  onRemove: () => void
  errors?: RowErrors
}

export function AssetClassRow({
  index,
  currencyLabel,
  canRemove,
  onRemove,
  errors,
}: AssetClassRowProps) {
  const { t } = useTranslation(['fields', 'common'])
  const { control } = useFormContext<FormValues>()
  const prefix = `asset_classes.${index}` as const

  const errClass = useFieldErrorMessage(errors?.asset_class?.message)
  const errAmount = useFieldErrorMessage(errors?.amount?.message)

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
        {t('common:repeater.assetClassLabel', { index: index + 1 })}
      </h3>

      <div className="mt-4 grid grid-cols-1 gap-5">
        <Field name="asset_class" required error={errClass}>
          <Controller
            name={`${prefix}.asset_class`}
            control={control}
            render={({ field }) => (
              <SelectInput
                id={`${prefix}.asset_class`}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder={t('common:select.placeholder')}
                options={ASSET_CLASSES.map((value) => ({
                  value,
                  label: t(`fields:asset_class.options.${value}`),
                }))}
              />
            )}
          />
        </Field>

        <Field name="asset_class_amount" required error={errAmount}>
          <Controller
            name={`${prefix}.amount`}
            control={control}
            render={({ field }) => (
              <NumberInput
                id={`${prefix}.amount`}
                min={0}
                step="any"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                suffix={currencyLabel}
              />
            )}
          />
        </Field>
      </div>

      {canRemove ? (
        <div className="mt-4">
          <MotionButton variant="ghost" onClick={onRemove} className="w-full">
            {t('common:repeater.removeAssetClass')}
          </MotionButton>
        </div>
      ) : null}
    </div>
  )
}
