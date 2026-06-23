import type { ReactNode } from 'react'
import { cn } from './cn'

type Tone = 'paper' | 'warm' | 'raised' | 'ink'
type Size = 'sm' | 'md' | 'lg'

const tones: Record<Tone, string> = {
  paper: 'bg-paper text-ink',
  warm: 'bg-paper-200 text-ink',
  raised: 'bg-paper-100 text-ink',
  ink: 'bg-ink text-paper',
}

const sizes: Record<Size, string> = {
  sm: 'py-12 sm:py-16',
  md: 'py-16 sm:py-24',
  lg: 'py-24 sm:py-32',
}

/** Vertical rhythm + surface tone. The only place section spacing is defined. */
export function Section({
  tone = 'paper',
  size = 'md',
  id,
  className,
  children,
}: {
  tone?: Tone
  size?: Size
  id?: string
  className?: string
  children: ReactNode
}) {
  return (
    <section id={id} className={cn(tones[tone], sizes[size], className)}>
      {children}
    </section>
  )
}
