import { useState } from 'react'
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
} from '@floating-ui/react'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import type { ReactNode } from 'react'

type FieldTooltipProps = {
  fieldKey: string
}

export function FieldTooltip({ fieldKey }: FieldTooltipProps) {
  const { t } = useTranslation('fields')
  const help = t(`${fieldKey}.help`)
  const [open, setOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'top',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
    ],
  })

  const hover = useHover(context, { move: false, delay: { open: 80, close: 60 } })
  const focus = useFocus(context)
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'tooltip' })
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ])

  return (
    <>
      <button
        type="button"
        ref={refs.setReference}
        className="ml-1 inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-ink-muted transition-colors duration-150 hover:bg-gray-100 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:h-5 sm:w-5"
        aria-label={help}
        {...getReferenceProps()}
      >
        <InformationCircleIcon className="h-4 w-4" aria-hidden />
      </button>
      {open ? (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className="z-50 w-64 rounded-md bg-navy px-3 py-2 text-left text-xs leading-relaxed font-normal text-paper ring-1 ring-white/10"
            {...getFloatingProps()}
          >
            {help}
          </div>
        </FloatingPortal>
      ) : null}
    </>
  )
}

type FieldProps = {
  name: string
  required?: boolean
  error?: string
  children: ReactNode
  htmlFor?: string
}

export function Field({ name, required, error, children, htmlFor }: FieldProps) {
  const { t } = useTranslation(['fields', 'common'])

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor ?? name}
        className="inline-flex flex-wrap items-center gap-x-0.5 text-sm font-medium text-ink"
      >
        <span>{t(`fields:${name}.label`)}</span>
        {required ? (
          <span className="text-danger" aria-hidden>
            *
          </span>
        ) : null}
        <FieldTooltip fieldKey={name} />
      </label>
      {children}
      {error ? (
        <p className="text-xs text-danger" role="alert">
          {error === 'required'
            ? t('common:validation.required')
            : error}
        </p>
      ) : null}
    </div>
  )
}
