'use client'

import SectionError from '@/components/SectionError'

export default function BessError(props: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <SectionError {...props} section="batteries & storage" />
}
