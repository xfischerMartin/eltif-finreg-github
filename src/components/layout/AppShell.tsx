import type { ReactNode } from 'react'
import { BrandPanel } from './BrandPanel'
import { LanguageSwitcher } from './LanguageSwitcher'

type AppShellProps = {
  children: ReactNode
}

/**
 * 35/65 landing shell: viewport-locked navy panel + independently scrolling form column.
 * Stacks below lg (1024px): compact navy header, then form card.
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-dvh min-w-0 bg-surface lg:flex">
      {/* Left: 35% — sticky viewport height, independent of form content height */}
      <div className="hidden lg:block lg:w-[35%] lg:shrink-0 lg:grow-0">
        <BrandPanel />
      </div>

      <div className="lg:hidden">
        <BrandPanel mobileOnly />
      </div>

      {/* Right: 65% — only this column grows/scrolls with form content */}
      <div className="relative flex min-h-dvh min-w-0 flex-1 flex-col overflow-x-clip bg-surface lg:w-[65%]">
        <div className="sticky top-0 z-20 flex items-center justify-end bg-surface/90 px-4 pt-4 backdrop-blur-sm sm:px-6 lg:px-8 lg:pt-6">
          <LanguageSwitcher />
        </div>

        <main className="flex min-w-0 flex-1 items-start justify-center px-4 py-6 sm:px-6 lg:px-8 lg:py-10 xl:px-10">
          <div className="w-full min-w-0 max-w-2xl">
            <div className="min-w-0 rounded-xl bg-paper p-5 ring-1 ring-gray-900/5 sm:p-7 lg:p-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
