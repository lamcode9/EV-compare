'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../_lib/useScroll'
import type { FilmCelMeta } from '@/content/sunrise/script'

/**
 * SceneStage — the film's stage. One fixed, full-viewport layer that plays
 * each act's loop video full-bleed BEHIND the scrolling words, replacing the
 * framed FilmCel exhibits. The words live in the shot; the stage never boxes.
 *
 * Grammar (docs/one-cinematic-work-storyboard.html §01):
 * - Each scene cuts in as its anchor element approaches the upper third of
 *   the viewport — exactly while the act's title card choreographs — and
 *   hands off at the next anchor. Adjacent scenes crossfade through a brief
 *   dip to the canvas score (SunriseSky), which owns every gap and is the
 *   complete zero-asset fallback: a missing file simply leaves that scene
 *   on canvas.
 * - Elements marked data-stage-dim (optionally ="0.4" for partial) pull the
 *   stage down to reading light so charts and figures never sit on busy
 *   footage.
 * - A directional scrim (left column + floor) rides the stage for text
 *   contrast; it flips to a paper scrim for light-tone scenes. Grain lies
 *   over the footage so video and canvas read as one emulsion.
 * - Captions are film subtitles: small italic serif, bottom-right, in-frame.
 * - prefers-reduced-motion: full-bleed poster stills, same composition —
 *   the film becomes a photo essay, not a different page.
 *
 * Perf: only scenes within ~2 viewports mount media; opacity/play/pause are
 * driven directly on the elements from one rAF-throttled scroll handler, so
 * scrolling never re-renders React. Asset contract: /public/sunrise/
 * <asset>.mp4 + <asset>.jpg (see docs/sunrise-asset-prompts.html).
 */

export interface StageScene {
  cel: FilmCelMeta
  /** Element id where this shot cuts in. */
  start: string
  /** Element id where this shot hands off. Shared with the next scene's start → crossfade. */
  end: string
  tone?: 'dark' | 'light'
  /**
   * Shift the out-cut earlier by this fraction of a viewport, letting the
   * canvas score hold the frame before the next shot (e.g. the swarm hands
   * the sky back so "Then, morning." plays on the canvas dawn).
   */
  outBias?: number
}

interface Range {
  start: number
  end: number
}

interface DimZone {
  top: number
  bottom: number
  strength: number
}

const smooth01 = (t: number) => {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

/** Seeded-noise SVG tile — the same emulsion idea as the canvas grain. */
const GRAIN_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const DARK_SCRIM =
  'linear-gradient(90deg, rgba(9,11,8,0.82) 0%, rgba(9,11,8,0.58) 30%, rgba(9,11,8,0.18) 56%, rgba(9,11,8,0) 74%),' +
  'linear-gradient(0deg, rgba(9,11,8,0.62) 0%, rgba(9,11,8,0) 30%)'
const DARK_SCRIM_MOBILE = 'rgba(9,11,8,0.38)'
const LIGHT_SCRIM =
  'linear-gradient(90deg, rgba(251,247,238,0.9) 0%, rgba(251,247,238,0.62) 34%, rgba(251,247,238,0.16) 60%, rgba(251,247,238,0) 78%),' +
  'linear-gradient(0deg, rgba(251,247,238,0.66) 0%, rgba(251,247,238,0) 32%)'
const LIGHT_SCRIM_MOBILE = 'rgba(251,247,238,0.44)'

export default function SceneStage({ scenes }: { scenes: StageScene[] }) {
  const reduced = usePrefersReducedMotion()

  const [mounted, setMounted] = useState<boolean[]>(() => scenes.map(() => false))
  const [missing, setMissing] = useState<boolean[]>(() => scenes.map(() => false))
  const [subtitle, setSubtitle] = useState<{ text: string; tone: 'dark' | 'light' } | null>(null)

  const mediaEls = useRef<(HTMLVideoElement | HTMLImageElement | null)[]>([])
  const scrimDarkEl = useRef<HTMLDivElement | null>(null)
  const scrimLightEl = useRef<HTMLDivElement | null>(null)
  const grainEl = useRef<HTMLDivElement | null>(null)

  const ranges = useRef<(Range | null)[]>([])
  const dimZones = useRef<DimZone[]>([])
  const mountedRef = useRef(mounted)
  const missingRef = useRef(missing)
  const subtitleRef = useRef<string | null>(null)
  const ticking = useRef(false)
  mountedRef.current = mounted
  missingRef.current = missing

  const measure = useCallback(() => {
    const absTop = (id: string) => {
      const el = document.getElementById(id)
      return el ? el.getBoundingClientRect().top + window.scrollY : null
    }
    ranges.current = scenes.map((s) => {
      const start = absTop(s.start)
      const end = absTop(s.end)
      return start !== null && end !== null && end > start ? { start, end } : null
    })
    dimZones.current = Array.from(document.querySelectorAll<HTMLElement>('[data-stage-dim]')).map((el) => {
      const r = el.getBoundingClientRect()
      const top = r.top + window.scrollY
      const strength = parseFloat(el.dataset.stageDim || '')
      return { top, bottom: top + r.height, strength: Number.isFinite(strength) ? strength : 1 }
    })
  }, [scenes])

  const update = useCallback(() => {
    ticking.current = false
    const vh = window.innerHeight
    if (vh <= 0) return
    // The playhead: the line of the viewport the reader is actually reading.
    const P = window.scrollY + vh * 0.45
    // A cut spans 0.9vh and completes just past its anchor — i.e. while the
    // act's title card is choreographing across the middle of the screen.
    const cut = (anchorY: number) => smooth01((P - (anchorY - vh * 0.6)) / (vh * 0.9))

    let dim = 0
    for (const z of dimZones.current) {
      const feather = vh * 0.35
      const rise = smooth01((P - (z.top - vh * 0.25)) / feather)
      const fall = 1 - smooth01((P - (z.bottom - vh * 0.05)) / feather)
      dim = Math.max(dim, Math.min(rise, fall) * z.strength)
    }
    const readingLight = 1 - 0.7 * dim

    let darkPresence = 0
    let lightPresence = 0
    let topIdx = -1
    let topOp = 0
    const nextMounted: boolean[] = []

    for (let i = 0; i < scenes.length; i++) {
      const r = ranges.current[i]
      const dead = missingRef.current[i]
      const inWindow = !!r && P > r.start - vh * 2 && P < r.end + vh * 2
      nextMounted.push(inWindow && !dead)
      let op = 0
      if (r && !dead) {
        const outAnchor = r.end - (scenes[i].outBias ?? 0) * vh
        op = Math.min(cut(r.start), 1 - cut(outAnchor))
      }
      if (op > 0) {
        if (scenes[i].tone === 'light') lightPresence = Math.max(lightPresence, op)
        else darkPresence = Math.max(darkPresence, op)
        if (op > topOp) {
          topOp = op
          topIdx = i
        }
      }
      const el = mediaEls.current[i]
      if (el) {
        const finalOp = op * readingLight
        el.style.opacity = finalOp.toFixed(3)
        if ('play' in el) {
          if (finalOp > 0.04 && el.paused) el.play().catch(() => {})
          else if (finalOp <= 0.04 && !el.paused) el.pause()
        }
      }
    }

    if (scrimDarkEl.current) scrimDarkEl.current.style.opacity = darkPresence.toFixed(3)
    if (scrimLightEl.current) scrimLightEl.current.style.opacity = lightPresence.toFixed(3)
    if (grainEl.current) grainEl.current.style.opacity = (Math.max(darkPresence, lightPresence) * 0.5).toFixed(3)

    if (nextMounted.some((m, i) => m !== mountedRef.current[i])) setMounted(nextMounted)

    const caption = topIdx >= 0 && topOp > 0.55 ? scenes[topIdx].cel.caption : null
    if (caption !== subtitleRef.current) {
      subtitleRef.current = caption
      setSubtitle(caption ? { text: caption, tone: scenes[topIdx].tone ?? 'dark' } : null)
    }
  }, [scenes])

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(update)
    }
    const remeasure = () => {
      measure()
      onScroll()
    }
    remeasure()
    // Layout settles after fonts; re-measure once more for late shifts.
    document.fonts?.ready.then(remeasure).catch(() => {})
    const settle = window.setTimeout(remeasure, 900)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', remeasure, { passive: true })
    return () => {
      window.clearTimeout(settle)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', remeasure)
    }
  }, [measure, update])

  // Newly mounted media renders at opacity 0 — sync it before the next scroll.
  useEffect(() => {
    update()
  }, [mounted, missing, update])

  const markMissing = (i: number) =>
    setMissing((prev) => {
      if (prev[i]) return prev
      const next = [...prev]
      next[i] = true
      return next
    })

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      {scenes.map((s, i) => {
        if (!mounted[i] || missing[i]) return null
        const src = `/sunrise/${s.cel.asset}.mp4`
        const poster = `/sunrise/${s.cel.asset}.jpg`
        return reduced ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={s.cel.asset}
            ref={(el) => {
              mediaEls.current[i] = el
            }}
            src={poster}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: 0 }}
            onError={() => markMissing(i)}
          />
        ) : (
          <video
            key={s.cel.asset}
            ref={(el) => {
              mediaEls.current[i] = el
            }}
            src={src}
            poster={poster}
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: 0 }}
            onError={() => markMissing(i)}
          />
        )
      })}

      {/* Emulsion: grain over the footage so video and canvas match. */}
      <div
        ref={grainEl}
        className="absolute inset-0"
        style={{ opacity: 0, backgroundImage: GRAIN_URI, backgroundSize: '140px 140px', mixBlendMode: 'soft-light' }}
      />

      {/* Directional scrims: the reading column's contrast, never a card. */}
      <div ref={scrimDarkEl} className="absolute inset-0" style={{ opacity: 0 }}>
        <div className="absolute inset-0 hidden sm:block" style={{ background: DARK_SCRIM }} />
        <div className="absolute inset-0 sm:hidden" style={{ background: `${DARK_SCRIM_MOBILE}` }} />
        <div
          className="absolute inset-0 sm:hidden"
          style={{ background: 'linear-gradient(0deg, rgba(9,11,8,0.6) 0%, rgba(9,11,8,0) 34%)' }}
        />
      </div>
      <div ref={scrimLightEl} className="absolute inset-0" style={{ opacity: 0 }}>
        <div className="absolute inset-0 hidden sm:block" style={{ background: LIGHT_SCRIM }} />
        <div className="absolute inset-0 sm:hidden" style={{ background: LIGHT_SCRIM_MOBILE }} />
      </div>

      {/* Subtitle: the caption lives in the frame, like a film title.
          Desktop-only — on mobile the full-width column collides with it. */}
      <div className="absolute bottom-7 right-8 hidden sm:block">
        <p
          className={`text-right font-display text-xs italic transition-opacity duration-700 ${
            subtitle?.tone === 'light' ? 'text-ink-500/80' : 'text-paper-300/60'
          } ${subtitle ? 'opacity-100' : 'opacity-0'}`}
        >
          {subtitle?.text ?? ''}
        </p>
      </div>
    </div>
  )
}
