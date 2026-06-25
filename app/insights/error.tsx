'use client'

import SectionError from '@/components/SectionError'

export default function InsightsError(props: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <SectionError {...props} section="insights" />
}
