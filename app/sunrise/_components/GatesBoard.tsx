'use client'

import { useInView, usePrefersReducedMotion } from '../_lib/useScroll'

/**
 * "The Work" — the six gates between here and the energy-abundant future.
 * Facts trace to docs/cinematic-vision-brief.html §07. Copy is plain-speech
 * (v5): same numbers and statuses, no brief jargon.
 * Status (open / straining / bottleneck / unscored): five gates scored; the
 * sixth is deliberately `unscored` — no inventing a progress meter.
 */

type GateStatus = 'open' | 'straining' | 'bottleneck' | 'unscored'

interface Gate {
  id: number
  name: string
  isInstall?: boolean
  /** Plain one-line what this gate is. */
  subtitle: string
  status: GateStatus
  statusLabel: string
  /** Key stat(s), tabular-nums. */
  stat: string
  /** Supporting sentence anyone can follow. */
  detail: string
  /** "Closer to home — SEA" inset. Only some gates have one. */
  sea?: string
}

const GATES: readonly Gate[] = [
  {
    id: 1,
    name: 'Make',
    subtitle: 'Build enough batteries',
    status: 'open',
    statusLabel: 'Flowing',
    stat: '1.59 TWh made last year · factories can do >4 TWh',
    detail:
      'We can already build more batteries than the world is buying — about 2.5× spare factory capacity. The hard part is not more plants. It is putting the cells we make into cars, homes, and grids. Different chemistries (including iron-based and sodium) also reduce the risk of depending on one metal.',
  },
  {
    id: 2,
    name: 'Connect',
    subtitle: 'Hook projects to the grid',
    status: 'bottleneck',
    statusLabel: 'Bottleneck',
    stat: '~2.3 TW waiting in line · median wait >4 years',
    detail:
      'Solar farms and batteries often sit idle not because the tech failed, but because the wires are full and the permits are slow. Paperwork and grid queues now slow us more than the physics of power.',
    sea: 'Southeast Asia has barely started linking national grids. In Vietnam, some built solar still cannot be fully used when the network is congested.',
  },
  {
    id: 3,
    name: 'Feed',
    subtitle: 'Materials and recycling',
    status: 'straining',
    statusLabel: 'Straining',
    stat: 'By the 2040s, old batteries can rival new mining',
    detail:
      'Panels and packs need metals and minerals. Designers are already using less silver and copper where they can, and testing chemistries that skip scarce metals. There is a real floor to how cheap cells can get — but recycling closed loops will matter more every decade.',
  },
  {
    id: 4,
    name: 'Install',
    isInstall: true,
    subtitle: 'The human part — your roof, your street',
    status: 'bottleneck',
    statusLabel: 'Bottleneck',
    stat: '~$2.8/W in the US vs ~$1/W in Australia — same panels',
    detail:
      'Permits, loans, skilled installers, and sudden policy changes decide the real price more than the panel factory does. Same hardware, very different bills. This is the gate people control — and the reason battery.mom exists.',
    sea: "Vietnam's 2020 solar crash: the subsidy ended overnight. Policy whiplash, not bad panels.",
  },
  {
    id: 5,
    name: 'Lift',
    subtitle: 'Cheap enough to reach orbit',
    status: 'bottleneck',
    statusLabel: 'Bottleneck',
    stat: 'Under ~$200 per kg to orbit is the stated crossover',
    detail:
      'Computers in space are no longer science fiction — but cost per kilogram to launch, heat rejection, and radiation-hard chips still limit how far this goes. Sending space solar down to Earth as a power beam is still much more expensive than making power on the ground. We say that plainly.',
  },
  {
    id: 6,
    name: 'Trust',
    subtitle: 'Machines that do what we intend',
    status: 'unscored',
    statusLabel: 'Not scored',
    stat: 'No progress meter — on purpose',
    detail:
      'The whole loop assumes grids, factories, and software that keep working as designed. Unlike the other gates, we have no honest number that tracks this. So we name the dependency and refuse to fake a score.',
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
