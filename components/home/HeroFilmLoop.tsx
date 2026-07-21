'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * The homepage overture's stage: the film's first-light loop playing
 * full-bleed behind the hero (storyboard §04, T1). Layers under the existing
 * hero scrim + grain, above the static poster — so the page is complete if
 * the clip is missing, slow, or reduced-motion turns it off, and the scrim
 * math stays identical to the poster treatment (opacity-matched).
 */
export default function HeroFilmLoop() {
  const ref = useRef<HTMLVideoElement | null>(null)
  const [ready, setReady] = useState(false)
  const [off, setOff] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setOff(true)
    // A cached clip can finish loading before React attaches onLoadedData —
    // the event never fires and the stage would stay dark. Check directly.
    if (ref.current && ref.current.readyState >= 2) setReady(true)
  }, [])

  // Play only while the hero is on screen.
  useEffect(() => {
    const video = ref.current
    if (!video || !ready) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.1 }
    )
    io.observe(video)
    return () => io.disconnect()
  }, [ready])

  if (off) return null

  return (
    <video
      ref={ref}
      src="/sunrise/first-light.mp4"
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden
      onLoadedData={() => setReady(true)}
      onError={() => setOff(true)}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
        ready ? 'opacity-[0.74]' : 'opacity-0'
      }`}
    />
  )
}
