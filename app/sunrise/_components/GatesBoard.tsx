'use client'

import { useInView, usePrefersReducedMotion } from '../_lib/useScroll'

/**
 * "The Work" — the six gates between here and the energy-abundant future.
 * Content extracted verbatim from docs/cinematic-vision-brief.html §07.
 * Status (open / straining / bottleneck / unscored) is this component's own
 * qualitative read of each gate's prose — the brief itself scores five gates
 * and explicitly declines to score the sixth ("this gate has no dial we can
 * read"), which is honored here as `unscored` rather than invented.
 */

type GateStatus = 'open' | 'straining' | 'bottleneck' | 'unscored'

interface Gate {
  id: number
  name: string
  isInstall?: boolean
  /** One-line definition, verbatim from the brief's gate subtitle. */
  subtitle: string
  status: GateStatus
  statusLabel: string
  /** Key stat(s) from the brief, rendered in tabular-nums. */
  stat: string
  /** Full supporting sentence(s), verbatim from the brief. */
  detail: string
  /** "Closer to home — SEA" inset, verbatim clause from the brief. Only some gates have one. */
  sea?: string
}

const GATES: readonly Gate[] = [
  {
    id: 1,
    name: 'Make',
    subtitle: 'TWh manufacturing',
    status: 'open',
    statusLabel: 'Flowing',
    stat: '1.59 TWh produced / >4 TWh nameplate',
    detail:
      "Capacity already outruns demand 2.5×. The gate isn’t building factories; it’s absorbing their output. Chemistry diversity (LFP, sodium-ion) hedges lithium.",
  },
  {
    id: 2,
    name: 'Connect',
    subtitle: 'grids & queues',
    status: 'bottleneck',
    statusLabel: 'Bottleneck',
    stat: '~2.3 TW stalled (median >4 yrs)',
    detail:
      'Wires and paperwork now bind more than physics.',
    sea: 'ASEAN cross-border interconnects barely begun; Vietnamese curtailment wasting built capacity.',
  },
  {
    id: 3,
    name: 'Feed',
    subtitle: 'materials & recycling',
    status: 'straining',
    statusLabel: 'Straining',
    stat: 'By the 2040s: retired packs → primary mine',
    detail:
      'Silver thrifting, copper metallization, sodium-ion — the materials floor is real but bendable. The loop must close.',
  },
  {
    id: 4,
    name: 'Install',
    isInstall: true,
    subtitle: 'the human part',
    status: 'bottleneck',
    statusLabel: 'Bottleneck',
    stat: '~$2.8/W (US) vs ~$1/W (Australia) — same hardware',
    detail:
      'Permitting, financing, labor, and policy whiplash are choices, not physics. This gate is battery.mom’s direct mission — and the story’s moral.',
    sea: "Vietnam's FiT cliff: policy whiplash, not physics.",
  },
  {
    id: 5,
    name: 'Lift',
    subtitle: 'cheap orbit',
    status: 'bottleneck',
    statusLabel: 'Bottleneck',
    stat: '<$200/kg is the stated crossover',
    detail:
      'Orbital compute is real but gated on $/kg, radiators, and rad-tolerant silicon. Beam-to-ground stays speculative until the OTPS math changes — we say so.',
  },
  {
    id: 6,
    name: 'Trust',
    subtitle: 'dependable automation',
    status: 'unscored',
    statusLabel: 'Not scored',
    stat: 'No progress meter, by design',
    detail:
      'Unlike the others, this gate has no dial we can read. The compounding loop assumes grids, factories, and machines that reliably do what we intend — stated as a dependency, linked to the serious literature, not scored.',
  },
] as const

const STATUS_STYLES: Record<GateStatus, string> = {
  open: 'bg-brand-500',
  straining: 'bg-gold',
  bottleneck: 'bg-[#C0564A]',
  unscored: 'bg-ink-400',
}

function GateCard({ gate }: { gate: Gate }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2)
  const reducedMotion = usePrefersReducedMotion()
  const statusDot = STATUS_STYLES[gate.status]

  return (
    <div
      ref={ref}
      className={`relative rounded-card border border-ink-900/10 bg-paper-100 p-5 shadow-card sm:p-6 ${
        gate.isInstall ? 'before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:rounded-t-card before:bg-gold' : ''
      } ${
        reducedMotion
          ? ''
          : `transition-all duration-700 ease-out ${
              inView ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`
      }`}
    >
      <span className="font-display text-sm italic text-ink-500">Gate {gate.id}</span>

      <h3 className="mt-1 font-display text-2xl text-ink">
        {gate.name}
        {gate.isInstall && (
          <span aria-label="the human gate" className="ml-1.5 text-gold">
            &#9733;
          </span>
        )}
      </h3>
      <p className="mt-0.5 text-sm text-ink-500">{gate.subtitle}</p>

      <p className="mt-3 flex items-center gap-2 text-sm italic text-ink-600">
        <span aria-hidden="true" className={`inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full ${statusDot}`} />
        {gate.statusLabel}
      </p>

      <p className="mt-4 text-base tabular-nums text-ink">{gate.stat}</p>

      <p className="mt-3 text-sm leading-relaxed text-ink-600">{gate.detail}</p>

      {gate.sea && (
        <p className="mt-4 border-l-2 border-brand-400/70 pl-4 text-sm leading-relaxed text-ink-600">
          <span className="font-display italic text-brand-600">Closer to home — </span>
          {gate.sea}
        </p>
      )}
    </div>
  )
}

export default function GatesBoard({ className }: { className?: string }) {
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 ${className ?? ''}`}>
      {GATES.map((gate) => (
        <GateCard key={gate.id} gate={gate} />
      ))}
    </div>
  )
}
