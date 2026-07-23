import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

export const MOTION = {
  duration: 0.2,
  ease: [0.22, 1, 0.36, 1] as const,
}

type ConditionalRevealProps = {
  children: ReactNode
  className?: string
}

export function ConditionalReveal({
  children,
  className = '',
}: ConditionalRevealProps) {
  const reduce = useReducedMotion()

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: MOTION.duration, ease: MOTION.ease }}
    >
      {children}
    </motion.div>
  )
}

type MotionButtonProps = HTMLMotionProps<'button'> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'dashed'
}

const buttonBase =
  'inline-flex min-h-10 w-full cursor-pointer items-center justify-center rounded-md px-3.5 py-2 text-sm font-semibold transition-[background-color,box-shadow,color,opacity,transform] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto'

const buttonVariants: Record<
  NonNullable<MotionButtonProps['variant']>,
  string
> = {
  primary:
    'bg-accent text-paper shadow-sm hover:bg-accent-hover disabled:bg-ink-muted',
  secondary:
    'bg-paper text-ink ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
  ghost:
    'bg-transparent font-medium text-ink-muted shadow-none hover:bg-gray-50 hover:text-ink',
  danger:
    'bg-transparent font-medium text-ink-muted shadow-none hover:bg-danger/5 hover:text-danger',
  dashed:
    'w-full bg-transparent font-medium text-ink-muted ring-1 ring-dashed ring-gray-300 hover:bg-accent/5 hover:text-accent hover:ring-accent/40',
}

export function MotionButton({
  variant = 'primary',
  className = '',
  children,
  disabled,
  ...props
}: MotionButtonProps) {
  const reduce = useReducedMotion()
  const lift = !reduce && !disabled

  return (
    <motion.button
      type="button"
      disabled={disabled}
      className={`${buttonBase} ${buttonVariants[variant]} ${className}`.trim()}
      whileHover={lift ? { y: -1 } : undefined}
      whileTap={lift ? { y: 0 } : undefined}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.button>
  )
}
