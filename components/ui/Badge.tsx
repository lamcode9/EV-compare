import type { ReactNode } from 'react'
import { cn } from './cn'

type Tone = 'brand' | 'neutral' | 'ink' | 'gold'

const tones: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-700 border-brand-200',
  neutral: 'bg-paper-200 text-ink-600 border-ink/10',
  ink: 'bg-ink text-paper border-transparent',
  gold: 'bg-gold-light/30 text-ink-700 border-gold/30',
}

/** Compact status/label pill. */
export function Badge({
  tone = 'neutral',
  className,
  children,
}: {
  tone?: Tone
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-1 text-xs font-medium',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  )
}
