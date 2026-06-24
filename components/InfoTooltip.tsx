'use client'

import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface InfoTooltipProps {
  /** The tooltip explanation — plain text or rich JSX */
  content: ReactNode
  /** Optional bold title shown above the content */
  title?: string
  /** Optional: position preference */
  position?: 'top' | 'bottom' | 'left' | 'right'
  /** Optional: custom icon size */
  size?: 'sm' | 'md'
  /** Optional: custom class name */
  className?: string
}

export default function InfoTooltip({
  content,
  title,
  position = 'top',
  size = 'sm',
  className = '',
}: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState<{ top: number; left: number; placement: string }>({
    top: 0,
    left: 0,
    placement: position,
  })
  const tooltipRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return

    const trigger = triggerRef.current.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    const tooltipW = 320 // w-80 = 20rem = 320px
    const tooltipH = tooltipRef.current?.offsetHeight || 120

    let placement = position
    let top = 0
    let left = 0

    // Determine placement (flip if needed)
    if (position === 'top' && trigger.top - tooltipH - 8 < 0) placement = 'bottom'
    if (position === 'bottom' && trigger.bottom + tooltipH + 8 > vh) placement = 'top'
    if (position === 'left' && trigger.left - tooltipW - 8 < 0) placement = 'right'
    if (position === 'right' && trigger.right + tooltipW + 8 > vw) placement = 'left'

    // Calculate coordinates
    switch (placement) {
      case 'top':
        top = trigger.top - tooltipH - 8 + window.scrollY
        left = trigger.left + trigger.width / 2 - tooltipW / 2 + window.scrollX
        break
      case 'bottom':
        top = trigger.bottom + 8 + window.scrollY
        left = trigger.left + trigger.width / 2 - tooltipW / 2 + window.scrollX
        break
      case 'left':
        top = trigger.top + trigger.height / 2 - tooltipH / 2 + window.scrollY
        left = trigger.left - tooltipW - 8 + window.scrollX
        break
      case 'right':
        top = trigger.top + trigger.height / 2 - tooltipH / 2 + window.scrollY
        left = trigger.right + 8 + window.scrollX
        break
    }

    // Clamp to viewport edges
    left = Math.max(8, Math.min(left, vw - tooltipW - 8 + window.scrollX))

    setCoords({ top, left, placement })
  }, [position])

  useEffect(() => {
    if (isVisible) {
      updatePosition()
      // Re-position after render so we get the real tooltip height
      requestAnimationFrame(updatePosition)
    }
  }, [isVisible, updatePosition])

  // Close on outside click (mobile)
  useEffect(() => {
    if (!isVisible) return
    const handler = (e: MouseEvent | TouchEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node)
      ) {
        setIsVisible(false)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [isVisible])

  // Close on scroll/resize
  useEffect(() => {
    if (!isVisible) return
    const close = () => setIsVisible(false)
    window.addEventListener('scroll', close, { passive: true, capture: true })
    window.addEventListener('resize', close)
    return () => {
      window.removeEventListener('scroll', close, { capture: true } as EventListenerOptions)
      window.removeEventListener('resize', close)
    }
  }, [isVisible])

  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-[18px] h-[18px]'

  const arrowStyle: Record<string, string> = {
    top: 'left-1/2 -translate-x-1/2 -bottom-[11px] border-t-white border-x-transparent border-b-transparent',
    bottom: 'left-1/2 -translate-x-1/2 -top-[11px] border-b-white border-x-transparent border-t-transparent',
    left: '-right-[11px] top-1/2 -translate-y-1/2 border-l-white border-y-transparent border-r-transparent',
    right: '-left-[11px] top-1/2 -translate-y-1/2 border-r-white border-y-transparent border-l-transparent',
  }

  return (
    <span className={`relative inline-flex items-center ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsVisible(!isVisible)
        }}
        className="inline-flex items-center justify-center text-ink-400 hover:text-brand-600 transition-colors focus:outline-none focus:text-brand-600 cursor-help"
        aria-label="More information"
      >
        <svg
          className={iconSize}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            style={{ position: 'absolute', top: coords.top, left: coords.left }}
            className="z-[9999] pointer-events-auto"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
          >
            <div className="bg-paper-100 border border-ink/10 rounded-lg shadow-xl px-4 py-3 w-80 max-w-[90vw] whitespace-normal font-normal">
              {title && (
                <div className="text-xs font-semibold text-ink mb-2">{title}</div>
              )}
              <div className="text-xs text-ink-700 leading-relaxed space-y-1.5">
                {content}
              </div>
              {/* Arrow */}
              <div
                className={`absolute w-0 h-0 border-[6px] ${arrowStyle[coords.placement]} drop-shadow-sm`}
              />
            </div>
          </div>,
          document.body
        )}
    </span>
  )
}

/**
 * Inline helper: wraps a label with an InfoTooltip next to it
 */
export function LabelWithTooltip({
  label,
  tooltip,
  title,
  className = '',
  labelClassName = '',
  position,
}: {
  label: string
  tooltip: ReactNode
  title?: string
  className?: string
  labelClassName?: string
  position?: InfoTooltipProps['position']
}) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span className={labelClassName}>{label}</span>
      <InfoTooltip content={tooltip} title={title} position={position} />
    </span>
  )
}
