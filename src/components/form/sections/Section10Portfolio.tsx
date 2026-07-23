import { useMemo } from 'react'
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  emptyAssetClassRow,
  type FormValues,
} from '@/types/form'
import { calculatePortfolio } from '@/lib/portfolio/calculate'
import { useFieldErrorMessage } from '@/hooks/useFieldErrorMessage'
import { Field } from '@/components/ui/Field'
import { AdvisoryNotice } from '@/components/ui/AdvisoryNotice'
import { ReadOnlyValue } from '@/components/ui/ReadOnlyValue'
import { MotionButton } from '@/components/ui/Motion'
import { NumberInput } from '@/components/ui/Inputs'
import { AssetClassRow } from './AssetClassRow'

export function Section10Portfolio() {
  const { t } = useTranslation(['fields', 'common'])
  const {
    control,
    formState: { errors },
  } = useFormContext<FormValues>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'asset_classes',
  })

  const currency = useWatch({ control, name: 'fund_reference_currency' })
  const assetClasses = useWatch({ control, name: 'asset_classes' })
  const eltifCapital = useWatch({ control, name: 'eltif_capital' })
  const frequency = useWatch({ control, name: 'redemption_frequency' })
  const method = useWatch({ control, name: 'redemption_calibration_method' })
  const notice = useWatch({ control, name: 'redemption_notice_period' })

  const currencyLabel = currency || '—'
  const errCapital = useFieldErrorMessage(errors.eltif_capital?.message)
  const errNav = useFieldErrorMessage(errors.nav?.message)

  const metrics = useMemo(
    () =>
      calculatePortfolio({
        assetClasses: assetClasses ?? [],
        eltifCapital,
        redemptionFrequency: frequency,
        calibrationMethod: method,
        noticePeriod: notice,
      }),
    [assetClasses, eltifCapital, frequency, method, notice],
  )

  return (
    <div className="grid grid-cols-1 gap-5">
      {fields.map((field, index) => (
        <AssetClassRow
          key={field.id}
          index={index}
          currencyLabel={currencyLabel}
          canRemove={fields.length > 1}
          onRemove={() => remove(index)}
          errors={errors.asset_classes?.[index]}
        />
      ))}

      <MotionButton
        variant="dashed"
        onClick={() => append(emptyAssetClassRow())}
      >
        {t('common:repeater.addAssetClass')}
      </MotionButton>

      <Field name="eltif_capital" required error={errCapital}>
        <Controller
          name="eltif_capital"
          control={control}
          render={({ field }) => (
            <NumberInput
              id="eltif_capital"
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

      <Field name="nav" required error={errNav}>
        <Controller
          name="nav"
          control={control}
          render={({ field }) => (
            <NumberInput
              id="nav"
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

      <Field name="total_assets">
        <ReadOnlyValue
          value={metrics.total_assets.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
          suffix={currencyLabel}
        />
      </Field>

      <Field name="total_eligible_pct">
        <ReadOnlyValue
          value={
            metrics.total_eligible_pct !== null
              ? String(metrics.total_eligible_pct)
              : '—'
          }
          suffix="%"
        />
      </Field>

      {metrics.eligible_meets_55 === false ? (
        <AdvisoryNotice>
          {t('common:advisories.eligibleBelow55')}
        </AdvisoryNotice>
      ) : null}

      <Field name="avg_liquidity">
        <ReadOnlyValue
          value={
            metrics.avg_liquidity_pct !== null
              ? `${metrics.avg_liquidity_pct} % p.a. · ${metrics.avg_liquidity_windows} ${t('common:portfolio.windowsPerYear')}`
              : '—'
          }
        />
      </Field>
    </div>
  )
}
