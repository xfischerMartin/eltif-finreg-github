import { useTranslation } from 'react-i18next'
import type { SimulationResult } from '@/lib/redemption/simulate'

type SimulationResultsProps = {
  result: SimulationResult
  currency: string
  suspensionActive?: boolean
}

function formatAmount(n: number, currency: string) {
  return `${n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`
}

export function SimulationResults({
  result,
  currency,
  suspensionActive = false,
}: SimulationResultsProps) {
  const { t } = useTranslation('common')

  return (
    <div className="mt-4 w-full min-w-0 space-y-4">
      {suspensionActive ? (
        <p className="rounded-md bg-warning-bg px-3 py-2 text-xs text-warning-ink ring-1 ring-inset ring-amber-200/80">
          {t('simulation.suspensionActive')}
        </p>
      ) : null}
      <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-3">
        <div className="min-w-0 rounded-md bg-paper px-3 py-2 text-sm ring-1 ring-inset ring-gray-200">
          <p className="text-xs text-ink-muted">{t('simulation.maxPct')}</p>
          <p className="font-semibold tabular-nums">
            {result.max_redemption_pct} %
          </p>
        </div>
        <div className="min-w-0 rounded-md bg-paper px-3 py-2 text-sm ring-1 ring-inset ring-gray-200">
          <p className="text-xs text-ink-muted">{t('simulation.base')}</p>
          <p className="truncate font-semibold tabular-nums">
            {formatAmount(result.redemption_base, currency)}
          </p>
        </div>
        <div className="min-w-0 rounded-md bg-paper px-3 py-2 text-sm ring-1 ring-inset ring-gray-200">
          <p className="text-xs text-ink-muted">{t('simulation.capacity')}</p>
          <p className="truncate font-semibold tabular-nums">
            {formatAmount(result.capacity, currency)}
          </p>
        </div>
      </div>

      <h4 className="text-sm font-semibold text-ink">
        {t('simulation.resultsTitle')}
      </h4>

      {/* Horizontal scroll only — never expand the form column */}
      <div className="isolate w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain rounded-md ring-1 ring-inset ring-gray-200">
        <table className="w-max min-w-full border-collapse text-left text-xs sm:text-sm">
          <thead className="bg-gray-50 text-ink-muted">
            <tr>
              <th className="px-3 py-2 font-medium whitespace-nowrap">
                {t('simulation.dealingDate')}
              </th>
              <th className="px-3 py-2 font-medium whitespace-nowrap">
                {t('simulation.gross')}
              </th>
              <th className="px-3 py-2 font-medium whitespace-nowrap">
                {t('simulation.proRata')}
              </th>
              <th className="px-3 py-2 font-medium whitespace-nowrap">
                {t('simulation.remainder')}
              </th>
              <th className="px-3 py-2 font-medium whitespace-nowrap">
                {t('simulation.fee')}
              </th>
              <th className="px-3 py-2 font-medium whitespace-nowrap">
                {t('simulation.net')}
              </th>
              <th className="px-3 py-2 font-medium whitespace-nowrap">
                {t('simulation.paymentDate')}
              </th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {result.windows.map((w) => (
              <tr
                key={w.dealing_date + w.payment_date}
                className="border-t border-line"
              >
                <td className="px-3 py-2 whitespace-nowrap">{w.dealing_date}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {formatAmount(w.gross_accepted, currency)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {(w.pro_rata_factor * 100).toFixed(2)} %
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {formatAmount(w.remainder, currency)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {formatAmount(w.fee, currency)}
                </td>
                <td className="px-3 py-2 font-medium whitespace-nowrap">
                  {formatAmount(w.net_payout, currency)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">{w.payment_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex min-w-0 flex-wrap gap-4 text-sm">
        <p className="min-w-0">
          <span className="text-ink-muted">{t('simulation.totalNet')}: </span>
          <span className="font-semibold tabular-nums">
            {formatAmount(result.total_net_payout, currency)}
          </span>
        </p>
        {result.fully_executed && result.days_to_full_redemption !== null ? (
          <p>
            <span className="text-ink-muted">{t('simulation.daysToFull')}: </span>
            <span className="font-semibold tabular-nums">
              {result.days_to_full_redemption}
            </span>
          </p>
        ) : null}
        {!result.fully_executed ? (
          <p className="text-warning-ink">{t('simulation.notFullyExecuted')}</p>
        ) : null}
      </div>
    </div>
  )
}
