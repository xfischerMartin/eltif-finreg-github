import type { ReactNode } from 'react'

type AdvisoryNoticeProps = {
  children: ReactNode
}

export function AdvisoryNotice({ children }: AdvisoryNoticeProps) {
  return (
    <div
      role="status"
      className="rounded-md bg-warning-bg px-3.5 py-2.5 text-sm text-warning-ink ring-1 ring-inset ring-amber-200/80"
    >
      {children}
    </div>
  )
}
