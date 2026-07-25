'use client'

import { useId, useState } from 'react'

/**
 * Nine dated predictions (brief §08). Collapsed by default so Act V stays short.
 * Claims kept plain; figures unchanged.
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
    claim: 'Average lithium-ion pack price below $60/kWh',
    byWhen: 'Dec 2029',
    confidence: 70,
    resolvesVia: 'BNEF annual survey',
    wrongIf: 'Pack prices still at or above $60/kWh in the 2029 BNEF survey.',
  },
  {
    id: 2,
    claim: 'More than 1 TW of solar installed in one calendar year',
    byWhen: '2030',
    confidence: 60,
    resolvesVia: 'BNEF / IEA',
    wrongIf: 'No year through 2030 reaches 1 TW of solar installations.',
  },
  {
    id: 3,
    claim: 'Solar passes coal as the largest source of world electricity',
    byWhen: '2034',
    confidence: 65,
    resolvesVia: 'Ember Global Electricity Review',
    wrongIf: 'Solar has not passed coal by 2034.',
  },
  {
    id: 4,
    claim: 'More than 500 GWh of grid storage added in one year',
    byWhen: '2029',
    confidence: 70,
    resolvesVia: 'BNEF / IEA storage reports',
    wrongIf: 'Annual additions stay at or below 500 GWh by 2029.',
  },
  {
    id: 5,
    claim: 'No space solar system delivers ≥10 MW continuous to any earth grid (against us)',
    byWhen: '1 Jan 2035',
    confidence: 90,
    resolvesVia: 'Utility / operator records',
    wrongIf: 'Any system hits that threshold before the date.',
    againstOwnThesis: true,
  },
  {
    id: 6,
    claim: 'Published launch price below $500/kg to low Earth orbit (large vehicles)',
    byWhen: '2033',
    confidence: 50,
    resolvesVia: 'Public prices or contracts',
    wrongIf: 'No such price exists by 2033.',
  },
  {
    id: 7,
    claim: 'Data centers use more than 3% of world electricity',
    byWhen: '2030',
    confidence: 65,
    resolvesVia: 'IEA',
    wrongIf: 'Share stays at or below 3% by 2030.',
  },
  {
    id: 8,
    claim: 'A Southeast Asian solar+storage power contract below US$45/MWh',
    byWhen: '2031',
    confidence: 60,
    resolvesVia: 'Public tender or PPA',
    wrongIf: 'No such contract by 2031.',
  },
  {
    id: 9,
    claim: 'An orbital data center with ≥1 MW of IT load is operating (against us, low odds)',
    byWhen: '2033',
    confidence: 35,
    resolvesVia: 'Operator disclosure',
    wrongIf: 'None operating by 2033.',
    againstOwnThesis: true,
  },
] as const

export default function PredictionsLedger({
  className,
  intro,
}: {
  className?: string
  intro?: string
}) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <div className={className ?? ''}>
      {intro && <p className="max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg">{intro}</p>}

      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="mt-3 text-sm text-ink-700 underline underline-offset-2 hover:text-ink"
      >
        {open ? 'Hide list' : 'Show list'}
      </button>

      {open && (
        <ol id={panelId} className="mt-4 border-t border-ink-900/10">
          {PREDICTIONS.map((p) => (
            <li key={p.id} className="border-b border-ink-900/10 py-4">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-ink-500">
                <span className="tabular-nums text-ink">{p.confidence}%</span>
                <span>by {p.byWhen}</span>
                {p.againstOwnThesis && <span>against our own thesis</span>}
              </div>
              <p className="mt-1 text-base leading-relaxed text-ink">{p.claim}</p>
              <p className="mt-1 text-sm text-ink-500">Source: {p.resolvesVia}</p>
              <p className="mt-1 text-sm text-ink-600">Wrong if: {p.wrongIf}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
