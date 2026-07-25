'use client'

import { useId, useState } from 'react'
import { useInView, usePrefersReducedMotion } from '../_lib/useScroll'

/**
 * The Predictions Ledger — nine dated, falsifiable predictions.
 * Figures from docs/cinematic-vision-brief.html §08.
 * Act V presents this collapsed by default: trust without killing the landing.
 */

interface Prediction {
  id: number
  claim: string
  byWhen: string
  confidence: number
  resolvesVia: string
  wrongIf: string
  againstOwnThesis?: boolean
}

const PREDICTIONS: readonly Prediction[] = [
  {
    id: 1,
    claim: 'Average lithium-ion battery pack prices fall below $60 per kWh',
    byWhen: 'Dec 2029',
    confidence: 70,
    resolvesVia: 'BNEF annual survey, Dec 2029',
    wrongIf: 'Pack prices stay at or above $60/kWh in the 2029 BNEF survey.',
  },
  {
    id: 2,
    claim: 'The world installs more than 1 TW of solar in a single year',
    byWhen: '2030',
    confidence: 60,
    resolvesVia: 'BNEF / IEA annual figures',
    wrongIf: 'No year through 2030 reaches 1 TW of solar installations.',
  },
  {
    id: 3,
    claim: 'Solar becomes the world’s largest source of electricity, passing coal',
    byWhen: '2034',
    confidence: 65,
    resolvesVia: 'Ember Global Electricity Review',
    wrongIf: 'Solar has not passed coal as the largest annual electricity source by 2034.',
  },
  {
    id: 4,
    claim: 'New grid batteries exceed 500 GWh added in one year worldwide',
    byWhen: '2029',
    confidence: 70,
    resolvesVia: 'BNEF / IEA storage reports',
    wrongIf: 'Annual storage additions stay at or below 500 GWh by 2029.',
  },
  {
    id: 5,
    claim:
      'Against ourselves: no space solar system sends 10 MW or more of continuous power to any earth grid',
    byWhen: 'Jan 1, 2035',
    confidence: 90,
    resolvesVia: 'Public utility / operator records',
    wrongIf: 'Any space solar system delivers ≥10 MW continuous to a grid before that date.',
    againstOwnThesis: true,
  },
  {
    id: 6,
    claim: 'A public launch price below $500 per kg to low Earth orbit exists (large rockets)',
    byWhen: '2033',
    confidence: 50,
    resolvesVia: 'Public price lists / signed contracts',
    wrongIf: 'No commercial launch price below $500/kg to LEO is published by 2033.',
  },
  {
    id: 7,
    claim: 'Data centers use more than 3% of world electricity (from about 1.7% in 2025)',
    byWhen: '2030',
    confidence: 65,
    resolvesVia: 'IEA electricity reports',
    wrongIf: 'Data-center share stays at or below 3% by 2030.',
  },
  {
    id: 8,
    claim: 'A Southeast Asian market signs utility solar-plus-storage below US$45 per MWh',
    byWhen: '2031',
    confidence: 60,
    resolvesVia: 'Public tender / PPA disclosures',
    wrongIf: 'No such contract below $45/MWh is signed in SEA by 2031.',
  },
  {
    id: 9,
    claim: 'Against ourselves (low odds): an orbital data center with ≥1 MW of computer load is running',
    byWhen: '2033',
    confidence: 35,
    resolvesVia: 'Operator disclosure / observation',
    wrongIf: 'No orbital data center with ≥1 MW IT load is operating by 2033.',
    againstOwnThesis: true,
  },
] as const

function PredictionRow({ prediction }: { prediction: Prediction }) {
  const { ref, inView } = useInView<HTMLLIElement>(0.12)
  const reducedMotion = usePrefersReducedMotion()

  return (
    <li
      ref={ref}
      className={`border-t border-ink-900/10 py-5 first:border-t-0 sm:py-6 ${
        reducedMotion
          ? ''
          : `transition-all duration-700 ease-out ${
              inView ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-6">
        <div className="flex shrink-0 items-baseline gap-3 sm:w-24 sm:flex-col sm:gap-0.5">
          <span
            className="font-display text-3xl tabular-nums text-gold sm:text-4xl"
            aria-label={`${prediction.confidence} percent confidence`}
          >
            {prediction.confidence}%
          </span>
          <span className="font-display text-xs italic text-ink-500">
            #{prediction.id}
            {prediction.againstOwnThesis ? ' · against us' : ''}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-base leading-relaxed text-ink sm:text-[1.05rem]">{prediction.claim}</p>
          <p className="mt-2 text-sm text-ink-500">
            by {prediction.byWhen}
            <span className="text-ink-900/20"> · </span>
            checked via {prediction.resolvesVia}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
            <span className="font-medium text-ink">Wrong if </span>
            {prediction.wrongIf}
          </p>
        </div>
      </div>
    </li>
  )
}

export default function PredictionsLedger({
  className,
  intro,
}: {
  className?: string
  /** Optional lead from the page script. */
  intro?: string
}) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const againstCount = PREDICTIONS.filter((p) => p.againstOwnThesis).length

  return (
    <div className={className ?? ''}>
      {intro && (
        <p className="max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg">{intro}</p>
      )}

      {/* Quiet summary strip — trust without nine research rows on first paint */}
      <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-y border-ink-900/10 py-4">
        <span className="font-display text-3xl tabular-nums text-ink sm:text-4xl">
          {PREDICTIONS.length}
        </span>
        <span className="font-display text-base italic text-ink-600">
          dated bets · {againstCount} written against our own ideas · graded each January
        </span>
      </div>

      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="mt-4 font-display text-base italic text-brand-700 underline decoration-brand-400/50 underline-offset-4 transition hover:text-brand-600 hover:decoration-brand-500"
      >
        {open ? 'Hide the full list' : 'Read every bet'}
      </button>

      {open && (
        <div id={panelId} className="mt-2">
          <ul className="border-b border-ink-900/10">
            {PREDICTIONS.map((prediction) => (
              <PredictionRow key={prediction.id} prediction={prediction} />
            ))}
          </ul>
          <p className="mt-4 text-xs text-ink-500">
            Wrong calls stay visible. First grading: each January.
          </p>
        </div>
      )}
    </div>
  )
}
