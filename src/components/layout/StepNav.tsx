import { useTranslation } from 'react-i18next'
import { MotionButton } from '@/components/ui/Motion'

type StepNavProps = {
  canGoBack: boolean
  isLastStep: boolean
  onBack: () => void
  onContinue: () => void
  submitting?: boolean
  /** When true (last step), submit stays disabled until GDPR consent. */
  consentRequired?: boolean
  consentGiven?: boolean
}

export function StepNav({
  canGoBack,
  isLastStep,
  onBack,
  onContinue,
  submitting = false,
  consentRequired = false,
  consentGiven = false,
}: StepNavProps) {
  const { t } = useTranslation('common')
  const submitBlocked = isLastStep && consentRequired && !consentGiven
  const continueDisabled = submitting || submitBlocked

  return (
    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
      <MotionButton
        variant="secondary"
        onClick={onBack}
        disabled={!canGoBack}
        className="w-full sm:w-auto"
      >
        {t('nav.back')}
      </MotionButton>
      <MotionButton
        variant="primary"
        onClick={onContinue}
        disabled={continueDisabled}
        aria-disabled={continueDisabled}
        title={
          submitBlocked ? t('nav.submitRequiresConsent') : undefined
        }
        className="w-full sm:min-w-40 sm:w-auto"
      >
        {submitting
          ? t('submit.submitting')
          : isLastStep
            ? t('nav.submit')
            : t('nav.continue')}
      </MotionButton>
    </div>
  )
}
