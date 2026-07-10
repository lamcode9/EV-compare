'use client'

import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../_lib/useScroll'
import type { FilmCelMeta } from '@/content/sunrise/script'

/**
 * A loop-video "film cel" — each act's establishing shot.
 *
 * Asset contract: /public/sunrise/<asset>.mp4 (H.264, muted seamless loop)
 * with an optional /public/sunrise/<asset>.jpg poster. Generation prompts and
 * grade specs live in docs/sunrise-asset-prompts.html.
 *
 * Behavior:
 * - Renders NOTHING until the video reports loadeddata, so the page is
 *   complete with zero assets on disk — cels light up as files land.
 * - Loads one viewport ahead; plays only while on screen (battery-friendly).
 * - prefers-reduced-motion: shows the still poster instead (or nothing).
 * - Chrome is the page's editorial voice: hairline rules + italic caption.
 */
export default function FilmCel({
  cel,
  tone = 'dark',
  className = '',
}: {
  cel: FilmCelMeta
  tone?: 'dark' | 'light'
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [nearView, setNearView] = useState(false)
  const [state, setState] = useState<'loading' | 'ready' | 'missing'>('loading')

  // Begin loading one viewport ahead of the reader.
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearView(true)
          io.disconnect()
        }
      },
      { rootMargin: '100% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Play only while visible.
  useEffect(() => {
    if (state !== 'ready' || reduced) return
    const el = wrapRef.current
    const video = videoRef.current
    if (!el || !video) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [state, reduced])

  const src = `/sunrise/${cel.asset}.mp4`
  const poster = `/sunrise/${cel.asset}.jpg`
  const border = tone === 'dark' ? 'border-paper/15' : 'border-ink-900/15'
  const captionCls = tone === 'dark' ? 'text-paper-300/60' : 'text-ink-500/80'

  if (state === 'missing') return null

  return (
    <div ref={wrapRef} className={`mx-auto max-w-5xl px-6 ${className}`}>
      {nearView && (
        <figure
          className={state === 'ready' ? 'animate-[filmcel-in_1.2s_ease-out]' : 'hidden'}
          aria-hidden={state !== 'ready'}
        >
          <div className={`relative overflow-hidden border-y ${border} bg-ink-900`}>
            {reduced ? (
              // Reduced motion: the still frame carries the scene.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={poster}
                alt={cel.caption}
                className="aspect-video w-full object-cover"
                onLoad={() => setState('ready')}
                onError={() => setState('missing')}
              />
            ) : (
              <video
                ref={videoRef}
                src={src}
                poster={poster}
                muted
                loop
                playsInline
                preload="auto"
                className="aspect-video w-full object-cover"
                onLoadedData={() => setState('ready')}
                onError={() => setState('missing')}
              />
            )}
            {/* Vignette blends the cel into the scene instead of floating as a pasted rectangle. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                boxShadow:
                  tone === 'dark'
                    ? 'inset 0 0 140px 30px rgba(6,8,6,0.55)'
                    : 'inset 0 0 100px 20px rgba(17,21,15,0.25)',
              }}
            />
          </div>
          <figcaption className={`mt-3 text-center font-display text-xs italic ${captionCls}`}>
            {cel.caption}
          </figcaption>
        </figure>
      )}
    </div>
  )
}
