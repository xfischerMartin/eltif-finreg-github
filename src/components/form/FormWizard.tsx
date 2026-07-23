import { useState } from 'react'
import {
  FormProvider,
  useForm,
  useWatch,
  type FieldPath,
  type FieldValues,
  type UseFormClearErrors,
  type UseFormSetError,
} from 'react-hook-form'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { WIZARD_STEPS, type WizardStepId } from '@/constants/enums'
import { defaultFormValues, type FormValues } from '@/types/form'
import { section1Schema } from '@/schemas/section1'
import { section2Schema } from '@/schemas/section2'
import { section3Schema } from '@/schemas/section3'
import { section4Schema } from '@/schemas/section4'
import { section5Schema } from '@/schemas/section5'
import { section6Schema } from '@/schemas/section6'
import { section7Schema } from '@/schemas/section7'
import { section8Schema } from '@/schemas/section8'
import { section9Schema } from '@/schemas/section9'
import { section10Schema } from '@/schemas/section10'
import {
  buildSubmitPayload,
  submitTermSheet,
} from '@/lib/api/submit'
import { ProgressStepper } from '@/components/layout/ProgressStepper'
import { StepNav } from '@/components/layout/StepNav'
import { MOTION } from '@/components/ui/Motion'
import { Section1FundBasics } from '@/components/form/sections/Section1FundBasics'
import { Section2Duration } from '@/components/form/sections/Section2Duration'
import { Section3Strategy } from '@/components/form/sections/Section3Strategy'
import { Section4InvestorsLeverage } from '@/components/form/sections/Section4InvestorsLeverage'
import { Section5ShareClasses } from '@/components/form/sections/Section5ShareClasses'
import { Section6Fees } from '@/components/form/sections/Section6Fees'
import { Section7Subscriptions } from '@/components/form/sections/Section7Subscriptions'
import { Section8Redemptions } from '@/components/form/sections/Section8Redemptions'
import { Section10Portfolio } from '@/components/form/sections/Section10Portfolio'
import { Section9Contact } from '@/components/form/sections/Section9Contact'

function applyZodIssues<T extends FieldValues>(
  setError: UseFormSetError<T>,
  issues: Array<{ path: PropertyKey[]; message: string }>,
) {
  for (const issue of issues) {
    if (issue.path.length === 0) continue
    const path = issue.path.join('.') as FieldPath<T>
    setError(path, {
      type: 'manual',
      message: issue.message,
    })
  }
}

async function validateStep(
  stepId: WizardStepId,
  values: FormValues,
  setError: UseFormSetError<FormValues>,
  clearErrors: UseFormClearErrors<FormValues>,
): Promise<boolean> {
  clearErrors()

  if (stepId === 'fund') {
    const result = section1Schema.safeParse(values)
    if (!result.success) {
      applyZodIssues(setError, result.error.issues)
      return false
    }
    return true
  }

  if (stepId === 'duration') {
    const result = section2Schema.safeParse({
      duration: values.duration,
      duration_limited_to: values.duration_limited_to,
    })
    if (!result.success) {
      applyZodIssues(setError, result.error.issues)
      return false
    }
    return true
  }

  if (stepId === 'strategy') {
    const result = section3Schema.safeParse({
      strategy_ioas: values.strategy_ioas,
      strategy_tatuea: values.strategy_tatuea,
      strategy_ilseeia: values.strategy_ilseeia,
      strategy_ilsuea: values.strategy_ilsuea,
      strategy_apac: values.strategy_apac,
      strategy_ramp_up_period: values.strategy_ramp_up_period,
      sfdr_category: values.sfdr_category,
    })
    if (!result.success) {
      applyZodIssues(setError, result.error.issues)
      return false
    }
    return true
  }

  if (stepId === 'leverage') {
    const result = section4Schema.safeParse({
      target_investors: values.target_investors,
      leverage_borrowing_amount: values.leverage_borrowing_amount,
      leverage_borrowing_maturity: values.leverage_borrowing_maturity,
      leverage_aifmd_commitment_method: values.leverage_aifmd_commitment_method,
      leverage_aifmd_gross_method: values.leverage_aifmd_gross_method,
    })
    if (!result.success) {
      applyZodIssues(setError, result.error.issues)
      return false
    }
    return true
  }

  if (stepId === 'shareClasses') {
    const result = section5Schema.safeParse({
      share_classes: values.share_classes,
    })
    if (!result.success) {
      applyZodIssues(setError, result.error.issues)
      return false
    }
    return true
  }

  if (stepId === 'fees') {
    const result = section6Schema.safeParse({
      subscription_fee: values.subscription_fee,
      redemption_fee: values.redemption_fee,
      anti_dilution_lmt: values.anti_dilution_lmt,
    })
    if (!result.success) {
      applyZodIssues(setError, result.error.issues)
      return false
    }
    return true
  }

  if (stepId === 'subscriptions') {
    const result = section7Schema.safeParse({
      subscription_frequency: values.subscription_frequency,
      subscription_cut_off_time: values.subscription_cut_off_time,
      subscription_payment_date: values.subscription_payment_date,
      nav_calculation_date: values.nav_calculation_date,
    })
    if (!result.success) {
      applyZodIssues(setError, result.error.issues)
      return false
    }
    return true
  }

  if (stepId === 'redemptions') {
    const result = section8Schema.safeParse({
      redemption_calibration_method: values.redemption_calibration_method,
      redemption_frequency: values.redemption_frequency,
      redemption_notice_period: values.redemption_notice_period,
      liquid_assets_amount: values.liquid_assets_amount,
      expected_cashflow_12m: values.expected_cashflow_12m,
      redemption_cut_off: values.redemption_cut_off,
      redemption_dealing_date: values.redemption_dealing_date,
      payment_of_redemption_proceeds: values.payment_of_redemption_proceeds,
      carry_policy: values.carry_policy,
      min_holding_period: values.min_holding_period,
      redemption_in_kind: values.redemption_in_kind,
      sim_investor_amount: values.sim_investor_amount,
      sim_investor_request_date: values.sim_investor_request_date,
      sim_aggregate_demand: values.sim_aggregate_demand,
      sim_investor_chooses_carry: values.sim_investor_chooses_carry,
      sim_suspension_enabled: values.sim_suspension_enabled,
      sim_suspension_start: values.sim_suspension_start,
      sim_suspension_days: values.sim_suspension_days,
    })
    if (!result.success) {
      applyZodIssues(setError, result.error.issues)
      return false
    }
    return true
  }

  if (stepId === 'portfolio') {
    const result = section10Schema.safeParse({
      asset_classes: values.asset_classes,
      eltif_capital: values.eltif_capital,
      nav: values.nav,
    })
    if (!result.success) {
      applyZodIssues(setError, result.error.issues)
      return false
    }
    return true
  }

  if (stepId === 'contact') {
    const result = section9Schema.safeParse({
      title: values.title,
      last_name: values.last_name,
      first_name: values.first_name,
      email: values.email,
      company: values.company,
      agreement: values.agreement,
    })
    if (!result.success) {
      applyZodIssues(setError, result.error.issues)
      return false
    }
    return true
  }

  return true
}

export function FormWizard() {
  const { t, i18n } = useTranslation('common')
  const reduceMotion = useReducedMotion()
  const [stepIndex, setStepIndex] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)
  const currentStepId = WIZARD_STEPS[stepIndex]
  const isLastStep = stepIndex === WIZARD_STEPS.length - 1

  const methods = useForm<FormValues>({
    defaultValues: defaultFormValues,
    mode: 'onBlur',
  })

  const agreement = useWatch({
    control: methods.control,
    name: 'agreement',
  })

  const goNext = async () => {
    setSubmitError(null)

    if (isLastStep && !methods.getValues('agreement')) {
      methods.setError('agreement', {
        type: 'manual',
        message: 'required',
      })
      return
    }

    const valid = await validateStep(
      currentStepId,
      methods.getValues(),
      methods.setError,
      methods.clearErrors,
    )
    if (!valid) return

    if (!isLastStep) {
      setStepIndex((i) => i + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setSubmitting(true)
    setSubmitSuccess(null)
    try {
      const locale = i18n.language?.startsWith('en') ? 'en' : 'cs'
      const payload = buildSubmitPayload(methods.getValues(), locale)
      const result = await submitTermSheet(payload)
      setSubmitSuccess(
        result.referenceId
          ? t('submit.successWithRef', { id: result.referenceId })
          : result.message || t('submit.success'),
      )
    } catch (err) {
      // Keep technical details out of the UI; log for debugging.
      console.error('Term sheet submit failed', err)
      setSubmitError(t('submit.errorBody'))
    } finally {
      setSubmitting(false)
    }
  }

  const goBack = () => {
    setSubmitError(null)
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const stepContent = (() => {
    switch (currentStepId) {
      case 'fund':
        return <Section1FundBasics />
      case 'duration':
        return <Section2Duration />
      case 'strategy':
        return <Section3Strategy />
      case 'leverage':
        return <Section4InvestorsLeverage />
      case 'shareClasses':
        return <Section5ShareClasses />
      case 'fees':
        return <Section6Fees />
      case 'subscriptions':
        return <Section7Subscriptions />
      case 'redemptions':
        return <Section8Redemptions />
      case 'portfolio':
        return <Section10Portfolio />
      case 'contact':
        return <Section9Contact />
      default:
        return null
    }
  })()

  return (
    <FormProvider {...methods}>
      <div className="w-full min-w-0">
        <ProgressStepper currentStepId={currentStepId} />

        <div className="mt-6 border-b border-line pb-5 sm:mt-8">
          <h2 className="text-base font-semibold tracking-tight text-ink sm:text-lg">
            {t(`sections.${currentStepId}.title`)}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-muted">
            {t(`sections.${currentStepId}.description`)}
          </p>
        </div>

        {/* Overflow visible: focus rings must not clip; page bleed handled by AppShell */}
        <div className="relative mt-6 min-w-0 sm:mt-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentStepId}
              className="w-full min-w-0"
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: MOTION.ease }}
            >
              {stepContent}
            </motion.div>
          </AnimatePresence>
        </div>

        {submitSuccess ? (
          <div
            role="status"
            className="mt-6 rounded-lg bg-success/10 px-3.5 py-3 text-sm text-success ring-1 ring-success/20"
          >
            {submitSuccess}
          </div>
        ) : null}

        {submitError ? (
          <div
            role="alert"
            className="mt-6 rounded-lg bg-danger/5 px-3.5 py-3 text-sm text-danger ring-1 ring-danger/15"
          >
            <p className="font-medium">{t('submit.errorTitle')}</p>
            <p className="mt-1">{submitError}</p>
          </div>
        ) : null}

        {!submitSuccess ? (
          <StepNav
            canGoBack={stepIndex > 0}
            isLastStep={isLastStep}
            onBack={goBack}
            onContinue={() => void goNext()}
            submitting={submitting}
            consentRequired={isLastStep}
            consentGiven={Boolean(agreement)}
          />
        ) : null}
      </div>
    </FormProvider>
  )
}
