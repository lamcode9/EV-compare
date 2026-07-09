'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'

/**
 * Shared scroll primitives for the /sunrise scrollytelling page.
 * Native scroll only — no scroll-jacking. All listeners are passive and
 * rAF-throttled so the main thread stays free on low-end devices.
 */

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

/** 0 at top of the document, 1 when scrolled to the bottom. */
export function useScrollFraction(): number {
  const [fraction, setFraction] = useState(0)
  const ticking = useRef(false)
  useEffect(() => {
    const update = () => {
      ticking.current = false
      const max = document.documentElement.scrollHeight - window.innerHeight
      setFraction(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
    }
    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true
        requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return fraction
}

/**
 * Progress of one element through the viewport: 0 when its top reaches the
 * bottom edge of the viewport, 1 when its bottom reaches the top edge.
 * For tall pinned sections (e.g. `h-[300vh]` wrappers around a sticky stage)
 * this is the scrub timeline for the section's animation.
 */
export function useSectionProgress<T extends HTMLElement = HTMLDivElement>(): {
  ref: RefObject<T | null>
  progress: number
} {
  const ref = useRef<T | null>(null)
  const [progress, setProgress] = useState(0)
  const ticking = useRef(false)
  const active = useRef(false)

  useEffect(() => {
    const update = () => {
      ticking.current = false
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = rect.height + window.innerHeight
      const passed = window.innerHeight - rect.top
      setProgress(Math.min(1, Math.max(0, passed / total)))
    }
    const onScroll = () => {
      if (!active.current || ticking.current) return
      ticking.current = true
      requestAnimationFrame(update)
    }
    // Only pay for scroll work while the element is near the viewport.
    const io = new IntersectionObserver(
      ([entry]) => {
        active.current = entry.isIntersecting
        if (entry.isIntersecting) onScroll()
      },
      { rootMargin: '50% 0px 50% 0px' }
    )
    if (ref.current) io.observe(ref.current)
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return { ref, progress }
}

/** Latches true the first time the element enters the viewport. */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.25
): { ref: RefObject<T | null>; inView: boolean } {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return { ref, inView }
}

/** Linear interpolation helper for scroll-keyed animation. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/** Map progress through keyframe stops: ramp(p, 0.2, 0.4) → 0..1 inside that window. */
export function ramp(p: number, from: number, to: number): number {
  if (to <= from) return p >= to ? 1 : 0
  return Math.min(1, Math.max(0, (p - from) / (to - from)))
}
