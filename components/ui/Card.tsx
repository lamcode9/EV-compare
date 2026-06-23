import type { ReactNode } from 'react'
import { cn } from './cn'

type Tone = 'paper' | 'warm' | 'ink'

const tones: Record<Tone, string> = {
  paper: 'bg-paper-100 border-ink/10',
  warm: 'bg-paper-200 border-ink/10',
  ink: 'bg-ink text-paper border-white/10',
}

/** Consistent surface: one radius, one border treatment, one shadow. */
export function Card({
  tone = 'paper',
  className,
  children,
}: {
  tone?: Tone
  className?: string
  children: ReactNode
}) {
  return <div className={cn('rounded-card border shadow-card', tones[tone], className)}>{children}</div>
}
