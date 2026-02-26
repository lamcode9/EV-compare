'use client'

import { useEffect, useState, type ReactNode } from 'react'

/**
 * Defers rendering of children until after hydration completes.
 * Use this to wrap browser-only components (e.g. recharts) that
 * produce different SSR vs client HTML, causing hydration mismatches.
 */
export default function ClientOnly({
  children,
  fallback = null,
}: {
  children: ReactNode
  fallback?: ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <>{fallback}</>
  return <>{children}</>
}
