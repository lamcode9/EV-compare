'use client'

import SectionError from '@/components/SectionError'

export default function CalculatorsError(props: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <SectionError {...props} section="the calculators" />
}
