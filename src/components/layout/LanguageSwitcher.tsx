import { useTranslation } from 'react-i18next'
import { setAppLanguage } from '@/i18n'

/** Compact language toggle — Application UI segmented control. */
export function LanguageSwitcher() {
  const { t, i18n } = useTranslation('common')
  const current = (i18n.language?.startsWith('en') ? 'en' : 'cs') as
    | 'cs'
    | 'en'

  return (
    <div
      className="inline-flex rounded-lg bg-gray-100 p-0.5 ring-1 ring-gray-900/5"
      role="group"
      aria-label={t('language.label')}
    >
      {(['cs', 'en'] as const).map((lng) => (
        <button
          key={lng}
          type="button"
          onClick={() => setAppLanguage(lng)}
          className={`min-h-8 cursor-pointer rounded-md px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
            current === lng
              ? 'bg-white text-ink shadow-sm ring-1 ring-gray-900/5'
              : 'text-ink-muted hover:text-ink'
          }`}
          aria-pressed={current === lng}
        >
          {t(`language.${lng}`)}
        </button>
      ))}
    </div>
  )
}
