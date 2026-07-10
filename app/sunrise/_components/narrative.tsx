'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { ramp, useInView, useSectionProgress, usePrefersReducedMotion } from '../_lib/useScroll'
import type { ActMeta, BigNumberItem } from '@/content/sunrise/script'

/**
 * Narrative primitives for /sunrise — v2 editorial system.
 *
 * The design language is the site's own newsprint identity inverted for the
 * dark phases: hairline rules, big Newsreader figures, italic serif labels,
 * footnote-voiced sources. Deliberately absent: tracked-uppercase eyebrows,
 * stat cards, pill badges, glass panels, staggered reveal delays.
 */

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2)
  const reduced = usePrefersReducedMotion()
  const shown = inView || reduced
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${shown ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

/**
 * A giant-type moment whose entrance is scrubbed by scroll position rather
 * than fired once — the reader's hand drives it in.
 */
export function GiantLine({
  children,
  tone = 'paper',
  className = '',
}: {
  children: ReactNode
  tone?: 'paper' | 'gold' | 'ink'
  className?: string
}) {
  const { ref, progress } = useSectionProgress<HTMLDivElement>()
  const reduced = usePrefersReducedMotion()
  const t = reduced ? 1 : Math.min(1, Math.max(0, (progress - 0.12) / 0.26))
  const toneCls = { paper: 'text-paper', gold: 'text-gold', ink: 'text-ink' }[tone]
  return (
    <div ref={ref} className={`mx-auto max-w-4xl px-6 ${className}`}>
      <p
        className={`font-display text-4xl font-medium leading-[1.08] tracking-tight sm:text-6xl md:text-7xl ${toneCls}`}
        style={{ opacity: 0.08 + t * 0.92, transform: `translateY(${(1 - t) * 28}px)` }}
      >
        {children}
      </p>
    </div>
  )
}

/**
 * Act opener as a scrubbed title card — the reader's hand drives the
 * choreography in sequence: the rule draws itself, the era slides in along
 * it, the numeral and title rise from behind a baseline mask, and the
 * hearth line settles last. No fire-once fades.
 */
export function ActHeader({ act, id, tone = 'dark' }: { act: ActMeta; id: string; tone?: 'dark' | 'light' }) {
  const { ref, progress } = useSectionProgress<HTMLElement>()
  const reduced = usePrefersReducedMotion()
  const ease = (x: number) => 1 - Math.pow(1 - x, 3)
  const t = reduced ? 1 : ramp(progress, 0.12, 0.5)
  const rule = ease(ramp(t, 0, 0.4))
  const era = ease(ramp(t, 0.08, 0.45))
  const numeral = ease(ramp(t, 0.18, 0.62))
  const title = ease(ramp(t, 0.28, 0.8))
  const hearth = ease(ramp(t, 0.62, 1))
  const c =
    tone === 'dark'
      ? { era: 'text-paper-300/80', title: 'text-paper', hearth: 'text-paper-300/70', hearthWord: 'text-gold/80', rule: 'bg-gold/50' }
      : { era: 'text-ink-500', title: 'text-ink', hearth: 'text-ink-500', hearthWord: 'text-gold', rule: 'bg-gold/60' }
  return (
    <header ref={ref} id={id} className="mx-auto max-w-3xl scroll-mt-24 px-6">
      <div className="flex items-center gap-4">
        <span aria-hidden className={`h-px w-12 origin-left ${c.rule}`} style={{ transform: `scaleX(${rule})` }} />
        <span
          className={`font-display text-sm italic ${c.era}`}
          style={{ opacity: era, transform: `translateX(${(1 - era) * -12}px)` }}
        >
          {act.era}
        </span>
      </div>
      <div className="mt-5 flex items-start gap-5">
        {act.numeral && (
          /* shrink-0: overflow-hidden zeroes the automatic min-size, letting
             flex crush the mask below the glyphs' width (III → II). */
          <span aria-hidden className="shrink-0 overflow-hidden">
            <span
              className="block font-display text-5xl leading-none text-gold sm:text-6xl"
              style={{ transform: `translateY(${(1 - numeral) * 110}%)` }}
            >
              {act.numeral}
            </span>
          </span>
        )}
        {/* pb/-mb pair keeps the baseline mask from clipping descenders. */}
        <div className="-mb-2 overflow-hidden">
          <h2
            className={`pb-2 font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl ${c.title}`}
            style={{ transform: `translateY(${(1 - title) * 104}%)`, opacity: 0.2 + title * 0.8 }}
          >
            {act.title}
          </h2>
        </div>
      </div>
      <p
        className={`mt-4 font-display text-sm italic ${c.hearth}`}
        style={{ opacity: hearth, transform: `translateY(${(1 - hearth) * 8}px)` }}
      >
        <span className={c.hearthWord}>the hearth</span> — {act.hearth}
      </p>
    </header>
  )
}

export function Prose({ children, lead = false }: { children: ReactNode; lead?: boolean }) {
  return (
    <Reveal className="mx-auto max-w-3xl px-6">
      <p
        className={
          lead
            ? 'font-display text-2xl leading-snug text-paper sm:text-3xl'
            : 'text-base leading-relaxed text-paper-300 sm:text-lg'
        }
      >
        {children}
      </p>
    </Reveal>
  )
}

/**
 * The verified figures, set as an editorial ledger: hairline rules, huge
 * Newsreader numerals, italic labels with the source run in as a footnote.
 * One voice for every figure — the numbers are the color.
 */
export function BigNumbers({ items }: { items: BigNumberItem[] }) {
  return (
    <div className="mx-auto max-w-3xl px-6">
      {items.map((n) => (
        <Reveal key={n.label}>
          <div className="border-t border-paper/15 py-6 sm:py-8">
            <div className="font-display text-5xl font-medium tabular-nums tracking-tight text-paper sm:text-6xl md:text-7xl">
              {n.value}
            </div>
            <p className="mt-2 font-display text-base italic text-paper-300 sm:text-lg">
              {n.label}
              {n.sub && <span className="text-paper-300/60"> — {n.sub}</span>}
            </p>
          </div>
        </Reveal>
      ))}
      <div className="border-t border-paper/15" aria-hidden />
    </div>
  )
}

/** “Closer to home” — the Southeast Asia sub-anchor, as a ruled margin note. */
export function SeaInset({ children }: { children: ReactNode }) {
  return (
    <Reveal className="mx-auto max-w-3xl px-6">
      <aside className="border-l-2 border-brand-400/70 pl-5 sm:pl-6">
        <p className="text-base leading-relaxed text-paper-300 sm:text-lg">
          <span className="font-display italic text-brand-300">Closer to home — </span>
          {children}
        </p>
      </aside>
    </Reveal>
  )
}

/** Act I felt beat: press and hold to keep the ember alive. */
export function EmberHold({ caption }: { caption: string }) {
  const [held, setHeld] = useState(false)
  const [heat, setHeat] = useState(0) // 0..1
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => {
      setHeat((h) => Math.min(1, Math.max(0, h + (held ? 0.06 : -0.04))))
    }, 50)
    return () => window.clearInterval(id)
  }, [held, reduced])

  const glow = reduced ? 0.8 : 0.15 + heat * 0.85
  return (
    <Reveal className="mx-auto max-w-3xl px-6">
      <figure className="flex flex-col items-center py-4 text-center">
        <button
          type="button"
          aria-label="Hold to keep the ember alive"
          onPointerDown={() => setHeld(true)}
          onPointerUp={() => setHeld(false)}
          onPointerLeave={() => setHeld(false)}
          onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') setHeld(true) }}
          onKeyUp={() => setHeld(false)}
          className="relative h-24 w-24 touch-none select-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
        >
          <span
            aria-hidden
            className="absolute inset-0 rounded-full transition-transform duration-200"
            style={{
              background: `radial-gradient(circle, rgba(244,209,138,${glow}) 0%, rgba(224,163,60,${glow * 0.7}) 30%, rgba(122,59,16,${glow * 0.35}) 60%, transparent 75%)`,
              transform: `scale(${0.8 + glow * 0.5})`,
            }}
          />
          <span aria-hidden className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: `rgba(255,214,140,${0.35 + glow * 0.65})` }} />
        </button>
        <figcaption className="mt-4 max-w-sm font-display text-sm italic text-paper-300/80">
          {reduced ? caption : <>hold the ember — let go, and it dies. {caption}</>}
        </figcaption>
      </figure>
    </Reveal>
  )
}

/** Act II felt beat: the ~25 “energy servants” assemble as you watch. */
export function EnergyServants({ caption }: { caption: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4)
  const reduced = usePrefersReducedMotion()
  const [count, setCount] = useState(0)
  const total = 25

  useEffect(() => {
    if (!inView) return
    if (reduced) { setCount(total); return }
    let n = 0
    const id = window.setInterval(() => {
      n += 1
      setCount(n)
      if (n >= total) window.clearInterval(id)
    }, 90)
    return () => window.clearInterval(id)
  }, [inView, reduced])

  return (
    <div ref={ref} className="mx-auto max-w-3xl px-6">
      <figure className="border-y border-paper/15 py-6 sm:py-8">
        <div className="flex flex-wrap gap-2" aria-hidden>
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              className={`h-4 w-2.5 rounded-sm transition-all duration-300 ${i < count ? 'bg-gold/80' : 'bg-paper/10'}`}
              style={{ transitionDelay: reduced ? undefined : `${i * 20}ms`, clipPath: 'polygon(50% 0, 100% 30%, 80% 30%, 80% 100%, 20% 100%, 20% 30%, 0 30%)' }}
            />
          ))}
        </div>
        <div className="mt-5 flex items-baseline gap-3">
          <span className="font-display text-5xl tabular-nums text-paper sm:text-6xl">{count}</span>
          <span className="font-display text-base italic text-paper-300">invisible full-time human-equivalents, burning on your behalf</span>
        </div>
        <figcaption className="mt-3 text-sm leading-relaxed text-paper-300/80">{caption}</figcaption>
      </figure>
    </div>
  )
}

/** Interlude schematic: curves that held vs curves that broke. Stylized — labeled as such. */
export function CurvesHeldBroke({ note }: { note: string }) {
  const held = [
    { label: 'Solar PV −20.2%/dbl', d: 'M10,20 C60,30 120,70 190,96' },
    { label: 'Li-ion −18–19%/dbl', d: 'M10,32 C64,44 124,78 190,102' },
    { label: 'LEDs', d: 'M10,44 C66,56 130,86 190,108' },
  ]
  const broke = [
    { label: 'Nuclear (~3× up)', d: 'M10,96 C70,88 130,52 190,24' },
    { label: 'Launch (flat 40 yrs)', d: 'M10,70 L190,66' },
    { label: 'Concorde (to zero)', d: 'M10,60 C100,60 150,60 168,118' },
  ]
  return (
    <Reveal className="mx-auto max-w-4xl px-6">
      <figure className="border-y border-paper/15 py-6 sm:py-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-0 sm:divide-x sm:divide-paper/15">
          {[
            { title: 'curves that held', series: held, stroke: '#5DD9A6' },
            { title: 'curves that broke', series: broke, stroke: '#C0564A' },
          ].map((panel, i) => (
            <div key={panel.title} className={i === 0 ? 'sm:pr-8' : 'sm:pl-8'}>
              <div className="font-display text-base italic text-paper-300">{panel.title}</div>
              <svg viewBox="0 0 200 130" className="mt-3 w-full" role="img" aria-label={panel.title}>
                <line x1="10" y1="120" x2="190" y2="120" stroke="#E9E1CF" strokeOpacity="0.15" />
                <line x1="10" y1="10" x2="10" y2="120" stroke="#E9E1CF" strokeOpacity="0.15" />
                {panel.series.map((s) => (
                  <path key={s.label} d={s.d} fill="none" stroke={panel.stroke} strokeWidth="1.75" strokeLinecap="round" opacity="0.85" />
                ))}
              </svg>
              <ul className="mt-2 space-y-1">
                {panel.series.map((s) => (
                  <li key={s.label} className="text-xs text-paper-300">
                    <span aria-hidden className="mr-2 inline-block h-1.5 w-4 rounded-full align-middle" style={{ background: panel.stroke, opacity: 0.85 }} />
                    {s.label}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <figcaption className="mt-4 font-display text-xs italic text-paper-300/60">
          Stylized schematic — shapes indicative, rates as labeled. {note}
        </figcaption>
      </figure>
    </Reveal>
  )
}

/** Act IV: the receipts — a wire feed of dated events, not concept art. */
export function ReceiptsWall({ items, note }: { items: { date: string; event: string }[]; note: string }) {
  return (
    <div className="mx-auto max-w-3xl px-6">
      <ol className="border-t border-paper/15">
        {items.map((r) => (
          <Reveal key={r.event}>
            <li className="flex gap-4 border-b border-paper/15 py-4 sm:gap-6">
              <span className="w-24 shrink-0 pt-1 font-mono text-xs text-gold/90 sm:w-28">{r.date}</span>
              <span className="text-base leading-relaxed text-paper-100 sm:text-lg">{r.event}</span>
            </li>
          </Reveal>
        ))}
      </ol>
      <Reveal>
        <p className="mt-4 font-display text-sm italic text-paper-300/70">{note}</p>
      </Reveal>
    </div>
  )
}

/** Coda watermark — speculation, clearly labeled, in the footnote voice. */
export function SpeculationWatermark() {
  return (
    <div className="mx-auto max-w-3xl px-6">
      <p className="font-display text-sm italic text-gold/80">— informed speculation · undated by design —</p>
    </div>
  )
}
