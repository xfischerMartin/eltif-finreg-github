import { useEffect, useMemo } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  CALIBRATION_METHODS,
  CARRY_POLICIES,
  NOTICE_PERIODS,
  REDEMPTION_FREQUENCIES,
  YES_NO,
  type CalibrationMethod,
  type NoticePeriod,
  type RedemptionFrequency,
} from '@/constants/enums'
import type { FormValues } from '@/types/form'
import { useFieldErrorMessage } from '@/hooks/useFieldErrorMessage'
import {
  isFrequencyMoreOftenThanQuarterly,
  isNoticeBelow3Months,
  lookupMaxRedemptionPct,
  lookupMinLiquidAssetsPct,
} from '@/lib/redemption/lookup'
import { simulateRedemptions } from '@/lib/redemption/simulate'
import { Field, FieldTooltip } from '@/components/ui/Field'
import { AdvisoryNotice } from '@/components/ui/AdvisoryNotice'
import { ReadOnlyValue } from '@/components/ui/ReadOnlyValue'
import { ConditionalReveal } from '@/components/ui/Motion'
import {
  NumberInput,
  RadioGroup,
  SelectInput,
  TextInput,
} from '@/components/ui/Inputs'
import { SimulationResults } from './SimulationResults'

export function Section8Redemptions() {
  const { t } = useTranslation(['fields', 'common'])
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<FormValues>()

  const method = useWatch({ control, name: 'redemption_calibration_method' })
  const frequency = useWatch({ control, name: 'redemption_frequency' })
  const notice = useWatch({ control, name: 'redemption_notice_period' })
  const liquid = useWatch({ control, name: 'liquid_assets_amount' })
  const cashflow = useWatch({ control, name: 'expected_cashflow_12m' })
  const cutOff = useWatch({ control, name: 'redemption_cut_off' })
  const paymentDays = useWatch({
    control,
    name: 'payment_of_redemption_proceeds',
  })
  const carryPolicy = useWatch({ control, name: 'carry_policy' })
  const redemptionFee = useWatch({ control, name: 'redemption_fee' })
  const currency = useWatch({ control, name: 'fund_reference_currency' })
  const simAmount = useWatch({ control, name: 'sim_investor_amount' })
  const simDate = useWatch({ control, name: 'sim_investor_request_date' })
  const simAggregate = useWatch({ control, name: 'sim_aggregate_demand' })
  const simCarry = useWatch({ control, name: 'sim_investor_chooses_carry' })
  const susEnabled = useWatch({ control, name: 'sim_suspension_enabled' })
  const susStart = useWatch({ control, name: 'sim_suspension_start' })
  const susDays = useWatch({ control, name: 'sim_suspension_days' })

  const errLiquid = useFieldErrorMessage(errors.liquid_assets_amount?.message)
  const errCashflow = useFieldErrorMessage(errors.expected_cashflow_12m?.message)
  const errCutOff = useFieldErrorMessage(errors.redemption_cut_off?.message)
  const errPayment = useFieldErrorMessage(
    errors.payment_of_redemption_proceeds?.message,
  )
  const errHolding = useFieldErrorMessage(errors.min_holding_period?.message)
  const errSimAmount = useFieldErrorMessage(errors.sim_investor_amount?.message)
  const errSimAggregate = useFieldErrorMessage(
    errors.sim_aggregate_demand?.message,
  )

  useEffect(() => {
    if (method === 'annex_ii') {
      setValue('redemption_notice_period', '')
    }
  }, [method, setValue])

  const showNotice = method === 'annex_i'
  const showMinLiquid = method === 'annex_ii'
  const currencyLabel = currency || '—'
  const selectPlaceholder = t('common:select.placeholder')

  const maxPct =
    method && frequency
      ? lookupMaxRedemptionPct({
          method: method as CalibrationMethod,
          frequency: frequency as RedemptionFrequency,
          noticePeriod:
            method === 'annex_i' && notice
              ? (notice as NoticePeriod)
              : null,
        })
      : null

  const minLiquid =
    method === 'annex_ii' && frequency
      ? lookupMinLiquidAssetsPct(frequency as RedemptionFrequency)
      : null

  const noticeAdvisory =
    method === 'annex_i' && isNoticeBelow3Months(notice || null)
  const frequencyAdvisory = isFrequencyMoreOftenThanQuarterly(frequency)

  const simulation = useMemo(() => {
    if (
      !method ||
      !frequency ||
      liquid === null ||
      cashflow === null ||
      cutOff === null ||
      paymentDays === null ||
      !carryPolicy ||
      simAmount === null ||
      !simDate ||
      simAggregate === null ||
      (method === 'annex_i' && !notice)
    ) {
      return null
    }

    return simulateRedemptions({
      method: method as CalibrationMethod,
      frequency: frequency as RedemptionFrequency,
      noticePeriod:
        method === 'annex_i' ? (notice as NoticePeriod) : null,
      liquidAssetsAmount: liquid,
      expectedCashflow12m: cashflow,
      redemptionCutOff: cutOff,
      paymentOfRedemptionProceeds: paymentDays,
      redemptionFeePct: redemptionFee ?? 0,
      carryPolicy,
      investorChoosesCarry: simCarry,
      investorRequestAmount: simAmount,
      investorRequestDate: simDate,
      aggregateDemand: simAggregate,
      suspension:
        susEnabled && susStart && susDays
          ? { startIso: susStart, days: susDays }
          : null,
    })
  }, [
    method,
    frequency,
    notice,
    liquid,
    cashflow,
    cutOff,
    paymentDays,
    carryPolicy,
    redemptionFee,
    simAmount,
    simDate,
    simAggregate,
    simCarry,
    susEnabled,
    susStart,
    susDays,
  ])

  return (
    <div className="grid gap-6">
      <Field
        name="redemption_calibration_method"
        required
        error={errors.redemption_calibration_method?.message}
      >
        <Controller
          name="redemption_calibration_method"
          control={control}
          render={({ field }) => (
            <SelectInput
              id="redemption_calibration_method"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              placeholder={selectPlaceholder}
              options={CALIBRATION_METHODS.map((value) => ({
                value,
                label: t(
                  `fields:redemption_calibration_method.options.${value}`,
                ),
              }))}
            />
          )}
        />
      </Field>

      <Field
        name="redemption_frequency"
        required
        error={errors.redemption_frequency?.message}
      >
        <Controller
          name="redemption_frequency"
          control={control}
          render={({ field }) => (
            <SelectInput
              id="redemption_frequency"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              placeholder={selectPlaceholder}
              options={REDEMPTION_FREQUENCIES.map((value) => ({
                value,
                label: t(`fields:redemption_frequency.options.${value}`),
              }))}
            />
          )}
        />
      </Field>

      {frequencyAdvisory ? (
        <AdvisoryNotice>
          {t('common:advisories.frequencyMoreOftenThanQuarterly')}
        </AdvisoryNotice>
      ) : null}

      {showNotice ? (
        <ConditionalReveal className="grid gap-6">
          <Field
            name="redemption_notice_period"
            required
            error={errors.redemption_notice_period?.message}
          >
            <Controller
              name="redemption_notice_period"
              control={control}
              render={({ field }) => (
                <SelectInput
                  id="redemption_notice_period"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder={selectPlaceholder}
                  options={NOTICE_PERIODS.map((value) => ({
                    value,
                    label: t(
                      `fields:redemption_notice_period.options.${value}`,
                    ),
                  }))}
                />
              )}
            />
          </Field>
          {noticeAdvisory ? (
            <AdvisoryNotice>
              {t('common:advisories.noticeBelow3Months')}
            </AdvisoryNotice>
          ) : null}
        </ConditionalReveal>
      ) : null}

      {showMinLiquid ? (
        <ConditionalReveal>
          <Field name="min_liquid_assets_pct">
            <ReadOnlyValue
              value={minLiquid !== null ? String(minLiquid) : '—'}
              suffix="%"
            />
          </Field>
        </ConditionalReveal>
      ) : null}

      <Field name="max_redemption_pct">
        <ReadOnlyValue
          value={maxPct !== null ? String(maxPct) : '—'}
          suffix="%"
        />
      </Field>

      <Field name="liquid_assets_amount" required error={errLiquid}>
        <Controller
          name="liquid_assets_amount"
          control={control}
          render={({ field }) => (
            <NumberInput
              id="liquid_assets_amount"
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

      <Field name="expected_cashflow_12m" required error={errCashflow}>
        <Controller
          name="expected_cashflow_12m"
          control={control}
          render={({ field }) => (
            <NumberInput
              id="expected_cashflow_12m"
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

      <Field name="redemption_cut_off" required error={errCutOff}>
        <Controller
          name="redemption_cut_off"
          control={control}
          render={({ field }) => (
            <NumberInput
              id="redemption_cut_off"
              min={1}
              max={29}
              step={1}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              suffix={t('fields:redemption_cut_off.unit')}
            />
          )}
        />
      </Field>

      <Field
        name="redemption_dealing_date"
        required
        error={errors.redemption_dealing_date?.message}
      >
        <TextInput
          id="redemption_dealing_date"
          placeholder={t('fields:redemption_dealing_date.placeholder')}
          {...register('redemption_dealing_date')}
        />
      </Field>

      <Field
        name="payment_of_redemption_proceeds"
        required
        error={errPayment}
      >
        <Controller
          name="payment_of_redemption_proceeds"
          control={control}
          render={({ field }) => (
            <NumberInput
              id="payment_of_redemption_proceeds"
              min={0}
              step={1}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              suffix={t('fields:payment_of_redemption_proceeds.unit')}
            />
          )}
        />
      </Field>

      <Field
        name="carry_policy"
        required
        error={errors.carry_policy?.message}
      >
        <Controller
          name="carry_policy"
          control={control}
          render={({ field }) => (
            <RadioGroup
              name="carry_policy"
              layout="stack"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              options={CARRY_POLICIES.map((value) => ({
                value,
                label: t(`fields:carry_policy.options.${value}`),
              }))}
            />
          )}
        />
      </Field>

      <Field name="min_holding_period" error={errHolding}>
        <Controller
          name="min_holding_period"
          control={control}
          render={({ field }) => (
            <NumberInput
              id="min_holding_period"
              min={0}
              step={1}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              suffix={t('fields:min_holding_period.unit')}
            />
          )}
        />
      </Field>

      <Field name="redemption_in_kind">
        <Controller
          name="redemption_in_kind"
          control={control}
          render={({ field }) => (
            <RadioGroup
              name="redemption_in_kind"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              options={YES_NO.map((value) => ({
                value,
                label: t(`fields:redemption_in_kind.options.${value}`),
              }))}
            />
          )}
        />
      </Field>

      <section className="min-w-0 rounded-lg bg-gray-50 p-4 ring-1 ring-inset ring-gray-200 sm:p-5">
        <div className="mb-4 flex items-start gap-1">
          <h3 className="text-lg font-semibold tracking-tight text-ink">
            {t('common:simulation.title')}
          </h3>
          <FieldTooltip fieldKey="redemptions_simulation" />
        </div>
        <p className="mb-4 text-sm text-ink-muted">
          {t('common:simulation.help')}
        </p>

        <div className="grid min-w-0 gap-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="sim_investor_amount"
              className="text-sm font-medium text-ink"
            >
              {t('common:simulation.investorAmount')}
              <span className="text-danger"> *</span>
            </label>
            <Controller
              name="sim_investor_amount"
              control={control}
              render={({ field }) => (
                <NumberInput
                  id="sim_investor_amount"
                  min={0}
                  step="any"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  suffix={currencyLabel}
                />
              )}
            />
            {errSimAmount ? (
              <p className="text-xs text-danger" role="alert">
                {errSimAmount}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="sim_investor_request_date"
              className="text-sm font-medium text-ink"
            >
              {t('common:simulation.investorDate')}
              <span className="text-danger"> *</span>
            </label>
            <TextInput
              id="sim_investor_request_date"
              type="date"
              {...register('sim_investor_request_date')}
            />
            {errors.sim_investor_request_date ? (
              <p className="text-xs text-danger" role="alert">
                {errors.sim_investor_request_date.message === 'required'
                  ? t('common:validation.required')
                  : errors.sim_investor_request_date.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="sim_aggregate_demand"
              className="text-sm font-medium text-ink"
            >
              {t('common:simulation.aggregateDemand')}
              <span className="text-danger"> *</span>
            </label>
            <Controller
              name="sim_aggregate_demand"
              control={control}
              render={({ field }) => (
                <NumberInput
                  id="sim_aggregate_demand"
                  min={0}
                  step="any"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  suffix={currencyLabel}
                />
              )}
            />
            <p className="text-xs text-ink-muted">
              {t('common:simulation.aggregateHint')}
            </p>
            {errSimAggregate ? (
              <p className="text-xs text-danger" role="alert">
                {errSimAggregate}
              </p>
            ) : null}
          </div>

          {carryPolicy === 'investor_choice' ? (
            <ConditionalReveal className="flex flex-col gap-2">
              <p className="text-sm font-medium text-ink">
                {t('common:simulation.investorChoiceLabel')}
              </p>
              <Controller
                name="sim_investor_chooses_carry"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    name="sim_investor_chooses_carry"
                    layout="stack"
                    value={field.value ? 'carry' : 'lapse'}
                    onChange={(value) => field.onChange(value === 'carry')}
                    onBlur={field.onBlur}
                    options={[
                      {
                        value: 'carry',
                        label: t('common:simulation.investorChoiceCarry'),
                      },
                      {
                        value: 'lapse',
                        label: t('common:simulation.investorChoiceLapse'),
                      },
                    ]}
                  />
                )}
              />
            </ConditionalReveal>
          ) : null}

          <label className="inline-flex cursor-pointer items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 shrink-0 cursor-pointer"
              style={{ accentColor: '#2563eb' }}
              {...register('sim_suspension_enabled')}
            />
            {t('common:simulation.suspensionToggle')}
          </label>

          {susEnabled ? (
            <ConditionalReveal className="grid gap-4">
              <p className="text-xs text-ink-muted">
                {t('common:simulation.suspensionHint')}
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="sim_suspension_start"
                    className="text-sm font-medium"
                  >
                    {t('common:simulation.suspensionStart')}
                  </label>
                  <TextInput
                    id="sim_suspension_start"
                    type="date"
                    {...register('sim_suspension_start')}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="sim_suspension_days"
                    className="text-sm font-medium"
                  >
                    {t('common:simulation.suspensionDays')}
                  </label>
                  <Controller
                    name="sim_suspension_days"
                    control={control}
                    render={({ field }) => (
                      <NumberInput
                        id="sim_suspension_days"
                        min={1}
                        step={1}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      />
                    )}
                  />
                </div>
              </div>
            </ConditionalReveal>
          ) : null}

          {simulation ? (
            <SimulationResults
              result={simulation}
              currency={currencyLabel}
              suspensionActive={Boolean(
                susEnabled && susStart && susDays && susDays > 0,
              )}
            />
          ) : (
            <p className="text-sm text-ink-muted">
              {t('common:simulation.incompleteConfig')}
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
