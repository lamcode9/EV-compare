'use client'

import { useEffect, useState } from 'react'
import { useCountUp } from '@/lib/hooks/useAnimations'

/**
 * The film's big-number figure, on paper: hairline rule, huge Newsreader
 * numeral counting up in view, italic serif label. The homepage proof beat
 * shares this grammar with the story's data beats (storyboard §04 T2, §05).
 */
export default function BigFigure({ value, label }: { value: string; label: string }) {
  // Split "24×" / "885" / "41%" into count-up number + literal affixes.
  const m = value.match(/^([^0-9]*)(\d+(?:\.\d+)?)(.*)$/)
  const end = m ? parseFloat(m[2]) : 0
  const decimals = m && m[2].includes('.') ? m[2].split('.')[1].length : 0
  const [ref, display] = useCountUp(end, 1100, decimals)
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setReduced(true)
  }, [])

  return (
    <div className="border-t border-ink/15 pt-4">
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="font-display text-4xl font-medium tabular-nums tracking-tight text-ink sm:text-5xl"
      >
        {m && !reduced ? (
          <>
            {m[1]}
            {display}
            {m[3]}
          </>
        ) : (
          value
        )}
      </div>
      <p className="mt-2 font-display text-sm italic leading-snug text-ink-500">{label}</p>
    </div>
  )
}
