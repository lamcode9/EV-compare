'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// 1. useCountUp — Animated number count-up with IntersectionObserver
// ─────────────────────────────────────────────────────────────────────────────

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4)
}

/**
 * Counts from 0 to `end` over `duration` ms when the element is in view.
 * Returns [ref, displayValue].
 */
export function useCountUp(
  end: number,
  duration = 800,
  decimals = 0
): [React.RefObject<HTMLElement | null>, string] {
  const ref = useRef<HTMLElement | null>(null)
  const [display, setDisplay] = useState('0')
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || hasAnimated.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return
        hasAnimated.current = true

        const start = performance.now()
        const animate = (now: number) => {
          const elapsed = now - start
          const progress = Math.min(elapsed / duration, 1)
          const value = end * easeOutQuart(progress)
          setDisplay(
            decimals > 0
              ? value.toFixed(decimals)
              : Math.round(value).toString()
          )
          if (progress < 1) requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration, decimals])

  return [ref, display]
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. AnimatedEntry — CSS-based entrance animation with IntersectionObserver
// ─────────────────────────────────────────────────────────────────────────────

type AnimationType = 'fade-up' | 'fade-in' | 'slide-in-left' | 'slide-in-right' | 'pop' | 'scale-up'

const ANIMATION_CLASSES: Record<AnimationType, { initial: string; animate: string }> = {
  'fade-up': {
    initial: 'opacity-0 translate-y-4',
    animate: 'opacity-100 translate-y-0',
  },
  'fade-in': {
    initial: 'opacity-0',
    animate: 'opacity-100',
  },
  'slide-in-left': {
    initial: 'opacity-0 -translate-x-4',
    animate: 'opacity-100 translate-x-0',
  },
  'slide-in-right': {
    initial: 'opacity-0 translate-x-4',
    animate: 'opacity-100 translate-x-0',
  },
  'pop': {
    initial: 'opacity-0 scale-90',
    animate: 'opacity-100 scale-100',
  },
  'scale-up': {
    initial: 'opacity-0 scale-95',
    animate: 'opacity-100 scale-100',
  },
}

interface AnimatedEntryProps {
  children: ReactNode
  animation?: AnimationType
  delay?: number       // ms
  duration?: number    // ms
  className?: string
  once?: boolean       // only animate once (default true)
}

export function AnimatedEntry({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 500,
  className = '',
  once = true,
}: AnimatedEntryProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!once || !hasAnimated.current)) {
          hasAnimated.current = true
          setIsVisible(true)
        } else if (!once && !entry.isIntersecting) {
          setIsVisible(false)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  const anim = ANIMATION_CLASSES[animation]

  return (
    <div
      ref={ref}
      className={`transform transition-all ${isVisible ? anim.animate : anim.initial} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. ProgressBarAnimated — Slide-in progress bar
// ─────────────────────────────────────────────────────────────────────────────

interface ProgressBarProps {
  percent: number       // 0-100
  color?: string        // Tailwind bg class or hex
  height?: string       // Tailwind height class
  delay?: number        // delay in ms
  className?: string
}

export function ProgressBarAnimated({
  percent,
  color = 'bg-emerald-500',
  height = 'h-2',
  delay = 0,
  className = '',
}: ProgressBarProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(Math.min(percent, 100)), delay)
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [percent, delay])

  return (
    <div ref={ref} className={`${height} bg-gray-100 rounded-full overflow-hidden ${className}`}>
      <div
        className={`${height} ${color} rounded-full transition-all duration-700 ease-out`}
        style={{ width: `${width}%` }}
      />
    </div>
  )
}
