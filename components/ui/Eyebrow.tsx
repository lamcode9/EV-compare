import type { ReactNode } from 'react'
import { cn } from './cn'

/** Small uppercase kicker that sits above a heading. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('text-xs font-semibold uppercase tracking-[0.2em] text-brand-600', className)}>
      {children}
    </p>
  )
}
