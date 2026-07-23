import { useTranslation } from 'react-i18next'

type ReadOnlyValueProps = {
  value: string
  suffix?: string
}

export function ReadOnlyValue({ value, suffix }: ReadOnlyValueProps) {
  const { t } = useTranslation('common')

  return (
    <div className="rounded-md bg-gray-50 px-3 py-2.5 ring-1 ring-inset ring-gray-200">
      <p className="mb-0.5 text-[10px] font-semibold tracking-wider text-ink-muted uppercase">
        {t('computed.eyebrow')}
      </p>
      <p className="text-sm font-semibold tabular-nums text-ink">
        {value}
        {suffix ? (
          <span className="ml-1.5 text-xs font-normal text-ink-muted">
            {suffix}
          </span>
        ) : null}
      </p>
    </div>
  )
}
