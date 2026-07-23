import { useTranslation } from 'react-i18next'
import { WIZARD_STEPS, type WizardStepId } from '@/constants/enums'

type ProgressStepperProps = {
  currentStepId: WizardStepId
}

/**
 * Responsive progress:
 * - <768px: condensed “Step N of 10” + bar (no 10-circle wrap)
 * - ≥768px: horizontally scrollable step strip when space is tight
 * - ≥1024px: full strip with connectors, typically fits without scroll
 */
export function ProgressStepper({ currentStepId }: ProgressStepperProps) {
  const { t } = useTranslation('common')
  const currentIndex = WIZARD_STEPS.indexOf(currentStepId)
  const progressPct = ((currentIndex + 1) / WIZARD_STEPS.length) * 100

  return (
    <nav aria-label={t('nav.progress')} className="w-full min-w-0">
      {/* Mobile / narrow: condensed */}
      <div className="md:hidden">
        <div className="flex min-w-0 items-baseline justify-between gap-3">
          <p className="shrink-0 text-sm font-semibold text-ink">
            {t('nav.stepOf', {
              current: currentIndex + 1,
              total: WIZARD_STEPS.length,
            })}
          </p>
          <p className="min-w-0 truncate text-right text-xs text-ink-muted">
            {t(`sections.${currentStepId}.title`)}
          </p>
        </div>
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-valuenow={currentIndex + 1}
          aria-valuemin={1}
          aria-valuemax={WIZARD_STEPS.length}
        >
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-200 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Tablet+: intentional overflow-x scroll when 10 steps don't fit */}
      <div className="hidden min-w-0 md:block">
        <div className="overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:thin]">
          <ol className="flex w-max min-w-full items-center gap-1.5 lg:w-full lg:gap-2">
            {WIZARD_STEPS.map((stepId, index) => {
              const done = index < currentIndex
              const active = index === currentIndex
              return (
                <li
                  key={stepId}
                  className="flex shrink-0 items-center gap-1.5 lg:min-w-0 lg:flex-1 lg:gap-2"
                >
                  <span
                    className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-200 ${
                      active
                        ? 'bg-accent text-paper shadow-sm'
                        : done
                          ? 'bg-ink text-paper'
                          : 'bg-line/80 text-ink-muted'
                    }`}
                    title={t(`sections.${stepId}.title`)}
                    aria-current={active ? 'step' : undefined}
                  >
                    {index + 1}
                  </span>
                  {index < WIZARD_STEPS.length - 1 ? (
                    <span
                      className={`hidden h-0.5 w-3 shrink-0 rounded-full lg:block lg:w-auto lg:min-w-0 lg:flex-1 ${
                        done ? 'bg-ink/30' : 'bg-line'
                      }`}
                      aria-hidden
                    />
                  ) : null}
                </li>
              )
            })}
          </ol>
        </div>
        <p className="mt-3 truncate text-xs text-ink-muted">
          {t('nav.stepOf', {
            current: currentIndex + 1,
            total: WIZARD_STEPS.length,
          })}
          {' · '}
          {t(`sections.${currentStepId}.title`)}
        </p>
      </div>
    </nav>
  )
}
