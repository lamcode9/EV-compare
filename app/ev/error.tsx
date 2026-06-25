'use client'

import SectionError from '@/components/SectionError'

export default function EvError(props: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <SectionError {...props} section="EV comparison" />
}
