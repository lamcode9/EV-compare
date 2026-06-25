'use client'

import SectionError from '@/components/SectionError'

export default function ScoreboardError(props: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <SectionError {...props} section="the scoreboard" />
}
