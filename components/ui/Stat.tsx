import type { ReactNode } from 'react'
import { cn } from './cn'

/** A single big-number figure with label and optional footnote. */
export function Stat({
  value,
  label,
  sub,
  accent = false,
  className,
}: {
  value: ReactNode
  label: ReactNode
  sub?: ReactNode
  accent?: boolean
  className?: string
}) {
  return (
    <div className={className}>
      <div
        className={cn(
          'font-display text-4xl font-medium leading-none tracking-tight sm:text-5xl',
          accent ? 'text-brand-500' : 'text-current'
        )}
      >
        {value}
      </div>
      <div className="mt-2.5 text-sm font-medium opacity-80">{label}</div>
      {sub ? <div className="mt-1 text-xs leading-relaxed opacity-60">{sub}</div> : null}
    </div>
  )
}
