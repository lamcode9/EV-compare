'use client'

import { useScrollFraction, usePrefersReducedMotion } from '../_lib/useScroll'

/**
 * Fixed top-right HUD that renders story scroll progress as a charging
 * battery glyph. Purely decorative — hidden from assistive tech.
 */
export default function BatteryHUD({ className }: { className?: string }) {
  const fraction = useScrollFraction()
  const reducedMotion = usePrefersReducedMotion()

  const percent = Math.round(fraction * 100)
  const isFull = fraction >= 0.99
  const visible = fraction >= 0.02 && fraction <= 0.985

  // Inner fill area of the battery glyph (inset from the 1.5px outline).
  const fillMaxWidth = 38
  const fillWidth = Math.max(0, Math.min(fillMaxWidth, fillMaxWidth * fraction))

  return (
    <div
      aria-hidden="true"
      className={`fixed right-4 top-[max(1rem,env(safe-area-inset-top))] z-40 pointer-events-none select-none flex items-center gap-1.5 ${
        reducedMotion ? '' : 'transition-opacity duration-300'
      } ${visible ? 'opacity-100' : 'opacity-0'} ${className ?? ''}`}
    >
      <span className="font-sans text-[11px] tabular-nums text-paper-300">
        {percent}%
      </span>
      <svg
        width="44"
        height="20"
        viewBox="0 0 44 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Battery body outline */}
        <rect
          x="1.5"
          y="1.5"
          width="37"
          height="17"
          rx="3.5"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-paper-300/40"
        />
        {/* Battery nub */}
        <rect
          x="39.5"
          y="6.5"
          width="3"
          height="7"
          rx="1"
          fill="currentColor"
          className="text-paper-300/40"
        />
        {/* Fill bar */}
        <rect x="4" y="4" width={fillWidth} height="12" rx="2" className="fill-brand-400" />
        {/* Subtle gold tint once the story is fully charged */}
        {isFull && (
          <rect x="4" y="4" width={fillWidth} height="12" rx="2" className="fill-gold opacity-30" />
        )}
      </svg>
    </div>
  )
}
