'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Footer from '@/components/Footer'
import SunriseSky from './_components/SunriseSky'
import BatteryHUD from './_components/BatteryHUD'
import PowersOfTenLadder from './_components/PowersOfTenLadder'
import WrightLawChart from './_components/WrightLawChart'
import FlywheelDiagram from './_components/FlywheelDiagram'
import GatesBoard from './_components/GatesBoard'
import PredictionsLedger from './_components/PredictionsLedger'
import {
  ActHeader,
  BigNumbers,
  CurvesHeldBroke,
  EmberHold,
  EnergyServants,
  GiantLine,
  Prose,
  ReceiptsWall,
  Reveal,
  SeaInset,
  SpeculationWatermark,
} from './_components/narrative'
import {
  ACT_1, ACT_1_COPY,
  ACT_2, ACT_2_COPY,
  INTERLUDE, INTERLUDE_COPY,
  ACT_3, ACT_3_COPY,
  ACT_4, ACT_4_COPY,
  CODA, CODA_COPY,
  ACT_5, ACT_5_COPY,
} from '@/content/sunrise/script'

/**
 * The Long Sunrise — one continuous scroll from true black to the site's
 * paper daylight. The fixed <SunriseSky> canvas carries the dawn arc; the
 * sections below are paced so their document positions land on its keyframes
 * (hero+I ≈ 0–.12, II ≈ .14–.28, interlude ≈ .30–.40, III ≈ .42–.56,
 * IV ≈ .58–.70, coda/space ≈ .70–.84, V/morning→paper ≈ .86–1).
 * Act V flips to ink-on-paper type — the page hands off to the real site.
 */
/**
 * The sky canvas's dawn keyframes live at canonical story positions
 * (fire 0.02 … paper 1.0), but where each act lands in the document depends
 * on viewport-driven layout. Measure the act anchors and remap document
 * scroll → story progress piecewise-linearly so dawn always breaks on cue.
 */
const STORY_STOPS: [id: string, storyP: number][] = [
  ['fire', 0.02],
  ['combustion', 0.14],
  ['false-dawn', 0.3],
  ['sun-direct', 0.44],
  ['compounding', 0.58],
  ['swarm', 0.68],
  ['coda-end', 0.78],
  ['the-work', 0.88],
]

function useStoryRemap(): (f: number) => number {
  const [pairs, setPairs] = useState<[number, number][]>([[0, 0], [1, 1]])

  useEffect(() => {
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max <= 0) return
      const measured: [number, number][] = [[0, 0]]
      for (const [id, storyP] of STORY_STOPS) {
        const el = document.getElementById(id)
        if (!el) continue
        const f = (el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.4) / max
        measured.push([Math.min(1, Math.max(0, f)), storyP])
      }
      measured.push([1, 1])
      // Guard monotonicity so the interpolation below stays well-defined.
      for (let i = 1; i < measured.length; i++) {
        if (measured[i][0] <= measured[i - 1][0]) measured[i][0] = measured[i - 1][0] + 0.001
      }
      setPairs(measured)
    }
    measure()
    // Re-measure once fonts settle (they shift layout) and on resize.
    document.fonts?.ready.then(measure).catch(() => {})
    window.addEventListener('resize', measure, { passive: true })
    return () => window.removeEventListener('resize', measure)
  }, [])

  return useCallback(
    (f: number) => {
      let i = 1
      while (i < pairs.length - 1 && f > pairs[i][0]) i++
      const [f0, p0] = pairs[i - 1]
      const [f1, p1] = pairs[i]
      const t = f1 > f0 ? Math.min(1, Math.max(0, (f - f0) / (f1 - f0))) : 0
      return p0 + (p1 - p0) * t
    },
    [pairs]
  )
}

export default function SunriseClient() {
  const remap = useStoryRemap()
  return (
    <main className="relative bg-ink-900">
      <SunriseSky remap={remap} />
      {/* Everything below sits above the fixed sky canvas (z-0). */}
      <div className="relative z-10">
      <BatteryHUD />

      {/* Minimal chrome: wordmark that survives dark and light phases */}
      <Link
        href="/"
        className="fixed left-4 top-[max(1rem,env(safe-area-inset-top))] z-40 text-sm font-semibold tracking-tight text-white mix-blend-difference"
      >
        battery.mom
      </Link>

      {/* ── Hero ── */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="font-display text-base italic text-paper-300/70">battery.mom presents</p>
        <h1 className="mt-6 font-display text-6xl font-medium leading-[0.98] tracking-tight text-paper sm:text-8xl md:text-[7.5rem]">
          The Long Sunrise
        </h1>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-paper-300 sm:text-lg">
          Half a million years of energy — and the century that changes it.
          Every number sourced. Every prediction dated.
        </p>
        <div className="mt-16 flex flex-col items-center gap-3 text-paper-300/50" aria-hidden>
          <span className="font-display text-xs italic">scroll</span>
          <span className="block h-10 w-px bg-gradient-to-b from-paper-300/50 to-transparent" />
        </div>
      </section>

      {/* ── Act I · Fire ── */}
      <section className="space-y-14 py-28 sm:space-y-16 sm:py-36" aria-labelledby="fire">
        <ActHeader act={ACT_1} id="fire" />
        <Prose lead>{ACT_1_COPY.open}</Prose>
        {ACT_1_COPY.body.map((p) => (
          <Prose key={p.slice(0, 24)}>{p}</Prose>
        ))}
        <BigNumbers items={ACT_1_COPY.numbers} />
        <EmberHold caption={ACT_1_COPY.ember} />
        <SeaInset>{ACT_1_COPY.sea}</SeaInset>
      </section>

      {/* ── Act II · Combustion ── */}
      <section className="space-y-14 py-28 sm:space-y-16 sm:py-36" aria-labelledby="combustion">
        <ActHeader act={ACT_2} id="combustion" />
        <Prose lead>{ACT_2_COPY.open}</Prose>
        {ACT_2_COPY.body.map((p) => (
          <Prose key={p.slice(0, 24)}>{p}</Prose>
        ))}
        <BigNumbers items={ACT_2_COPY.numbers} />
        <EnergyServants caption={ACT_2_COPY.servants} />
        <SeaInset>{ACT_2_COPY.sea}</SeaInset>
      </section>

      {/* ── Interlude · The False Dawn ── */}
      <section className="space-y-14 py-28 sm:space-y-16 sm:py-36" aria-labelledby="false-dawn">
        <ActHeader act={INTERLUDE} id="false-dawn" />
        <Prose lead>{INTERLUDE_COPY.open}</Prose>
        {INTERLUDE_COPY.body.map((p) => (
          <Prose key={p.slice(0, 24)}>{p}</Prose>
        ))}
        <CurvesHeldBroke note={INTERLUDE_COPY.curvesNote} />
      </section>

      {/* ── Act III · The Sun, Direct ── */}
      <section className="space-y-14 py-28 sm:space-y-16 sm:py-36" aria-labelledby="sun-direct">
        <ActHeader act={ACT_3} id="sun-direct" />
        <Prose lead>{ACT_3_COPY.open}</Prose>
        <Prose>{ACT_3_COPY.body[0]}</Prose>
        <GiantLine>{ACT_3_COPY.pull}</GiantLine>
        {ACT_3_COPY.body.slice(1).map((p) => (
          <Prose key={p.slice(0, 24)}>{p}</Prose>
        ))}
        <BigNumbers items={ACT_3_COPY.numbers} />
        <div className="mx-auto max-w-5xl px-6">
          {/* Ruled scrim band (no glass): keeps axis text readable over the
              bright horizon without boxing the chart in a card. */}
          <div className="border-y border-paper/15 bg-ink-900/45 px-4 py-6 sm:px-8 sm:py-8">
            <WrightLawChart />
          </div>
        </div>
        <SeaInset>{ACT_3_COPY.sea}</SeaInset>
      </section>

      {/* ── Act IV · The Compounding Century ── */}
      <section className="space-y-14 py-28 sm:space-y-16 sm:py-36" aria-labelledby="compounding">
        <ActHeader act={ACT_4} id="compounding" />
        <Prose lead>{ACT_4_COPY.open}</Prose>
        <div className="mx-auto max-w-3xl px-6">
          <FlywheelDiagram className="mx-auto" />
        </div>
        {ACT_4_COPY.body.map((p) => (
          <Prose key={p.slice(0, 24)}>{p}</Prose>
        ))}
        <BigNumbers items={ACT_4_COPY.numbers} />
        <ReceiptsWall items={ACT_4_COPY.receipts} note={ACT_4_COPY.receiptsNote} />
      </section>

      {/* ── Coda · The Swarm ── */}
      <section className="space-y-14 py-28 sm:space-y-16 sm:py-36" aria-labelledby="swarm">
        <ActHeader act={CODA} id="swarm" />
        <SpeculationWatermark />
        <Prose lead>{CODA_COPY.open}</Prose>
        {CODA_COPY.body.map((p) => (
          <Prose key={p.slice(0, 24)}>{p}</Prose>
        ))}
        <PowersOfTenLadder />
        <div id="coda-end">
          <GiantLine tone="gold" className="text-center">
            <span className="italic">{CODA_COPY.line}</span>
          </GiantLine>
        </div>
      </section>

      {/* ── Act V · The Work — ink on paper: the dawn handoff ── */}
      <section className="space-y-14 pb-0 pt-28 sm:space-y-16 sm:pt-36" aria-labelledby="the-work">
        <GiantLine tone="ink">Then, morning.</GiantLine>
        <Reveal className="mx-auto max-w-3xl px-6">
          <header id="the-work" className="scroll-mt-24">
            <div className="flex items-center gap-4">
              <span aria-hidden className="h-px w-12 bg-gold/60" />
              <span className="font-display text-sm italic text-ink-500">{ACT_5.era}</span>
            </div>
            <div className="mt-5 flex items-start gap-5">
              <span aria-hidden className="font-display text-5xl leading-none text-gold sm:text-6xl">{ACT_5.numeral}</span>
              <h2 className="font-display text-4xl font-medium leading-[1.05] tracking-tight text-ink sm:text-6xl">
                {ACT_5.title}
              </h2>
            </div>
            <p className="mt-4 font-display text-sm italic text-ink-500">
              <span className="text-gold">the hearth</span> — {ACT_5.hearth}
            </p>
          </header>
        </Reveal>
        <Reveal className="mx-auto max-w-3xl px-6">
          <p className="font-display text-xl leading-relaxed text-ink-700 sm:text-2xl">{ACT_5_COPY.open}</p>
        </Reveal>
        <div className="mx-auto max-w-6xl px-6">
          <GatesBoard />
        </div>
        <div className="mx-auto max-w-4xl px-6">
          <h3 className="mb-6 font-display text-2xl font-medium text-ink sm:text-3xl">The predictions ledger</h3>
          <PredictionsLedger />
        </div>
        <Reveal className="mx-auto max-w-3xl px-6">
          <p className="text-base leading-relaxed text-ink-600 sm:text-lg">{ACT_5_COPY.closing}</p>
        </Reveal>

        {/* The landing: three real cards, powered on */}
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {ACT_5_COPY.cards.map((c) => (
              <Reveal key={c.href}>
                <Link
                  href={c.href}
                  className="block rounded-card border border-ink-900/10 bg-paper-100 p-6 shadow-card transition hover:shadow-raised"
                >
                  <div className="font-display text-sm italic text-brand-600">powered on</div>
                  <div className="mt-2 font-display text-xl font-medium text-ink">{c.title}</div>
                  <div className="mt-1 text-sm text-ink-500">{c.sub}</div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal className="mx-auto max-w-3xl px-6 pb-24 text-center">
          <p className="font-display text-2xl italic text-ink sm:text-3xl">{ACT_5_COPY.tagline}</p>
        </Reveal>

        <Footer />
      </section>
      </div>
    </main>
  )
}
