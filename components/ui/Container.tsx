import type { ReactNode } from 'react'
import { cn } from './cn'

type Width = 'prose' | 'default' | 'wide' | 'full'

const widths: Record<Width, string> = {
  prose: 'max-w-2xl', // reading column
  default: 'max-w-5xl',
  wide: 'max-w-6xl',
  full: 'max-w-7xl',
}

/** Single source of truth for horizontal layout: consistent max-width + gutters. */
export function Container({
  width = 'default',
  className,
  children,
}: {
  width?: Width
  className?: string
  children: ReactNode
}) {
  return <div className={cn('mx-auto w-full px-5 sm:px-8', widths[width], className)}>{children}</div>
}
