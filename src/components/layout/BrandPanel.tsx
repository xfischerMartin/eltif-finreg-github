import { CheckBadgeIcon } from '@heroicons/react/24/solid'
import { useTranslation } from 'react-i18next'

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`inline-flex items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15 ${
          compact ? 'h-9 w-9' : 'h-11 w-11'
        }`}
        aria-hidden
      >
        <span
          className={`font-semibold tracking-tight text-white ${
            compact ? 'text-xs' : 'text-sm'
          }`}
        >
          FP
        </span>
      </span>
      <span
        className={`font-semibold tracking-tight text-white ${
          compact ? 'text-sm' : 'text-base'
        }`}
      >
        FINREG PARTNERS
      </span>
    </div>
  )
}

const CREDIBILITY_KEYS = [
  'landing.markers.eltif',
  'landing.markers.rts',
  'landing.markers.forms',
] as const

type BrandPanelProps = {
  /** When true, render only the compact mobile header. */
  mobileOnly?: boolean
}

/**
 * Navy brand panel.
 * Desktop: sticky viewport-height column (independent of form height).
 * Mobile: compact header above the form.
 */
export function BrandPanel({ mobileOnly = false }: BrandPanelProps) {
  const { t } = useTranslation('common')

  if (mobileOnly) {
    return (
      <aside className="relative bg-navy px-4 py-5 text-white">
        <BrandMark compact />
        <h1 className="mt-3 text-lg font-semibold tracking-tight text-white">
          {t('landing.headline')}
        </h1>
      </aside>
    )
  }

  return (
    <aside
      className="sticky top-0 flex h-dvh flex-col justify-between overflow-hidden bg-navy px-8 py-10 text-white xl:px-12 xl:py-14"
      style={{
        clipPath: 'polygon(0 0, 100% 0, calc(100% - 2.5rem) 100%, 0 100%)',
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-white/5 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-12 bottom-20 h-56 w-56 rounded-full bg-accent/20 blur-3xl"
      />

      <div className="relative z-10 max-w-sm pr-4">
        <BrandMark />

        <p className="mt-10 text-xs font-semibold tracking-[0.14em] text-white/55 uppercase">
          {t('landing.eyebrow')}
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-balance text-white xl:text-3xl">
          {t('landing.headline')}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-white/70">
          {t('landing.description')}
        </p>

        <ul className="mt-10 flex flex-col gap-3">
          {CREDIBILITY_KEYS.map((key) => (
            <li
              key={key}
              className="flex items-center gap-2.5 text-sm text-white/85"
            >
              <CheckBadgeIcon
                className="h-5 w-5 shrink-0 text-sky-400"
                aria-hidden
              />
              <span>{t(key)}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative z-10 text-xs text-white/40">{t('landing.footer')}</p>
    </aside>
  )
}
