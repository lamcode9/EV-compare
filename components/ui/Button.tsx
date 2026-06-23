import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from './cn'

type Variant = 'primary' | 'ghost' | 'ink'

const variants: Record<Variant, string> = {
  primary: 'bg-brand-500 text-white hover:bg-brand-600',
  ghost: 'border border-ink/15 text-ink hover:bg-ink/5',
  ink: 'bg-ink text-paper hover:bg-ink-800',
}

/** Link-styled call to action. One button geometry across the system. */
export function Button({
  href,
  variant = 'primary',
  className,
  children,
}: {
  href: string
  variant?: Variant
  className?: string
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-pill px-5 py-2.5 text-sm font-semibold transition-colors',
        variants[variant],
        className
      )}
    >
      {children}
    </Link>
  )
}
