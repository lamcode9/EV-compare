'use client'

import { useEffect } from 'react'
import Link from 'next/link'

// Shared body for route-segment `error.tsx` files. Each section's error boundary
// renders this with its own label, so a failure in one section (e.g. a chart that
// throws) is contained and recoverable without taking down the whole app or
// dropping the user on the generic global error page.
export default function SectionError({
  error,
  reset,
  section,
}: {
  error: Error & { digest?: string }
  reset: () => void
  section: string
}) {
  useEffect(() => {
    console.error(`[${section}]`, error)
  }, [error, section])

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold text-red-600 mb-3">
          Couldn&apos;t load {section}
        </h1>
        <p className="text-ink-600 mb-8">
          {error.message ||
            'Something went wrong loading this section. Please try again.'}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-ev-primary text-white rounded-lg hover:bg-ev-primary/90 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-paper-300 text-ink-800 rounded-lg hover:bg-ink/15 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  )
}
