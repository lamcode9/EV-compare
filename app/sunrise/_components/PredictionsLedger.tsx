'use client'

import { useInView, usePrefersReducedMotion } from '../_lib/useScroll'

/**
 * The Predictions Ledger — nine dated, falsifiable predictions the site puts
 * its name on. Content extracted verbatim from
 * docs/cinematic-vision-brief.html §08. The brief's table gives claim,
 * "resolves via" source, and confidence, but no separate falsification-
 * criterion column; each `wrongIf` below is the direct logical negation of
 * the claim, reusing only the figures and dates already stated verbatim in
 * the brief — nothing new is asserted.
 */

interface Prediction {
  id: number
  claim: string
  byWhen: string
  confidence: number
  resolvesVia: string
  wrongIf: string
  /** Predictions the brief flags as deliberately betting against the site's own thesis. */
  againstOwnThesis?: boolean
}

const PREDICTIONS: readonly Prediction[] = [
  {
    id: 1,
    claim: 'Li-ion pack prices (global volume-weighted avg) fall below $60/kWh by the 2029 survey',
    byWhen: 'Dec 2029',
    confidence: 70,
    resolvesVia: 'BNEF annual survey, Dec 2029',
    wrongIf: 'Pack prices remain at or above $60/kWh at the 2029 BNEF survey.',
  },
  {
    id: 2,
    claim: 'Global annual solar installations exceed 1 TW(dc) in a single year by 2030',
    byWhen: '2030',
    confidence: 60,
    resolvesVia: 'BNEF / IEA annual figures',
    wrongIf: 'No calendar year through 2030 reaches 1 TW(dc) of installations.',
  },
  {
    id: 3,
    claim: 'Solar becomes the largest single source of world electricity (annual TWh, passing coal) by 2034',
    byWhen: '2034',
    confidence: 65,
    resolvesVia: 'Ember Global Electricity Review',
    wrongIf: 'Solar has not passed coal as the largest annual electricity source by 2034.',
  },
  {
    id: 4,
    claim: 'Annual grid-scale storage additions exceed 500 GWh globally by 2029',
    byWhen: '2029',
    confidence: 70,
    resolvesVia: 'BNEF / IEA storage reports',
    wrongIf: 'Annual storage additions stay at or below 500 GWh by 2029.',
  },
  {
    id: 5,
    claim:
      'Against ourselves: no space-based solar system delivers ≥10 MW continuous to any terrestrial grid before Jan 1, 2035',
    byWhen: 'Jan 1, 2035',
    confidence: 90,
    resolvesVia: 'Public utility / operator records',
    wrongIf: 'Any space-based solar system delivers ≥10 MW continuous to a terrestrial grid before Jan 1, 2035.',
    againstOwnThesis: true,
  },
  {
    id: 6,
    claim: 'A commercially published launch price below $500/kg (LEO, >50 t class) exists by 2033',
    byWhen: '2033',
    confidence: 50,
    resolvesVia: 'Public price lists / signed contracts',
    wrongIf: 'No commercially published launch price below $500/kg (LEO, >50 t class) exists by 2033.',
  },
  {
    id: 7,
    claim: 'Datacenters exceed 3% of global electricity by 2030 (from ~1.7% in 2025)',
    byWhen: '2030',
    confidence: 65,
    resolvesVia: 'IEA electricity reports',
    wrongIf: 'Datacenter share of global electricity stays at or below 3% by 2030.',
  },
  {
    id: 8,
    claim: 'A Southeast Asian market signs a utility-scale solar+storage PPA below US$45/MWh by 2031',
    byWhen: '2031',
    confidence: 60,
    resolvesVia: 'Public tender / PPA disclosures',
    wrongIf: 'No Southeast Asian market signs a utility-scale solar+storage PPA below US$45/MWh by 2031.',
  },
  {
    id: 9,
    claim: 'Sub-50% on our own thesis: an operational orbital datacenter with ≥1 MW of IT load by 2033',
    byWhen: '2033',
    confidence: 35,
    resolvesVia: 'Operator disclosure / observation',
    wrongIf: 'No operational orbital datacenter with ≥1 MW of IT load exists by 2033.',
    againstOwnThesis: true,
  },
] as const

function PredictionRow({ prediction }: { prediction: Prediction }) {
  const { ref, inView } = useInView<HTMLLIElement>(0.15)
  const reducedMotion = usePrefersReducedMotion()

  return (
    <li
      ref={ref}
      className={`border-t border-ink-900/10 py-6 first:border-t-0 sm:py-7 ${
        reducedMotion
          ? ''
          : `transition-all duration-700 ease-out ${
              inView ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`
      }`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
        <div className="flex items-baseline gap-4 md:w-28 md:flex-shrink-0 md:flex-col md:items-start md:gap-1">
          <span
            className="font-display text-4xl tabular-nums text-gold sm:text-5xl"
            aria-label={`${prediction.confidence} percent confidence`}
          >
            {prediction.confidence}%
          </span>
          <span className="font-display text-sm italic text-ink-500">
            no. {prediction.id}
            {prediction.againstOwnThesis ? ' — against our own thesis' : ''}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-base leading-relaxed text-ink sm:text-lg">{prediction.claim}</p>

          <p className="mt-3 text-sm text-ink-500">
            by {prediction.byWhen} · resolves via {prediction.resolvesVia}
          </p>

          <p className="mt-2 text-sm leading-relaxed text-ink-600">
            <span className="font-medium text-ink">wrong if</span> {prediction.wrongIf}
          </p>
        </div>
      </div>
    </li>
  )
}

export default function PredictionsLedger({ className }: { className?: string }) {
  return (
    <div className={className ?? ''}>
      <p className="font-display text-sm italic text-ink-600">
        Dated, falsifiable, and kept on the page even when wrong. Graded annually.
      </p>

      <ul className="mt-6 border-b border-ink-900/10">
        {PREDICTIONS.map((prediction) => (
          <PredictionRow key={prediction.id} prediction={prediction} />
        ))}
      </ul>

      <p className="mt-6 text-xs text-ink-500">
        First grading: annually each January.
      </p>
    </div>
  )
}
