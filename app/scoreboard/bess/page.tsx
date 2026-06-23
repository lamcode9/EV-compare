import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ENERGY_DEPLOYMENT_SNAPSHOT,
  GLOBAL_BATTERY_POWER_ADDITIONS,
} from '@/data/energy-deployment-scoreboard'

export const metadata: Metadata = {
  title: 'BESS Adoption Scoreboard — battery.mom',
  description:
    'Sector-by-sector BESS adoption map for home, shared residential, commercial, grid-scale, and EV-charging storage markets.',
  openGraph: {
    title: 'BESS Adoption Scoreboard — battery.mom',
    description:
      'Track how battery energy storage adoption differs across home, commercial, shared residential, grid-scale, and EV charging sectors.',
    url: 'https://battery.mom/scoreboard/bess',
    siteName: 'battery.mom',
    type: 'website',
  },
}

const latestPower = GLOBAL_BATTERY_POWER_ADDITIONS[GLOBAL_BATTERY_POWER_ADDITIONS.length - 1]
const previousPower = GLOBAL_BATTERY_POWER_ADDITIONS[GLOBAL_BATTERY_POWER_ADDITIONS.length - 2]
const latestTotalGw = latestPower.utilityScaleGw + latestPower.behindMeterGw
const previousTotalGw = previousPower.utilityScaleGw + previousPower.behindMeterGw
const annualGrowthPct = ((latestTotalGw - previousTotalGw) / previousTotalGw) * 100

const sectors = [
  {
    name: 'Home solar + battery',
    stage: 'Early adopter',
    primaryMetric: 'Solar-plus-storage attachment rate',
    currentSignal:
      'Residential batteries become attractive where backup power, time-of-use tariffs, low export value, or zero-bill planning matter.',
    missingData:
      'Needs country-level utility interconnection records or installer survey data, split from standalone solar installs.',
  },
  {
    name: 'Shared residential',
    stage: 'Pilot / design',
    primaryMetric: 'Buildings with shared BESS or apartment-level storage',
    currentSignal:
      'Useful for condos and apartments where one battery can serve common loads, solar self-consumption, or backup needs.',
    missingData:
      'Needs building-level project registers and clear separation between common-area solar and tenant energy use.',
  },
  {
    name: 'Commercial + industrial',
    stage: 'Emerging procurement',
    primaryMetric: 'C&I sites using storage for demand, backup, or arbitrage',
    currentSignal:
      'Adoption is driven by peak demand charges, diesel replacement, backup requirements, and solar self-consumption economics.',
    missingData:
      'Needs project-level deployment data by sector: factories, offices, retail, data centres, warehouses, and campuses.',
  },
  {
    name: 'Grid / utility scale',
    stage: 'Fastest scaling',
    primaryMetric: 'MW / MWh connected to transmission and distribution grids',
    currentSignal:
      'Globally, utility-scale projects supply most new battery power capacity and are the clearest source-backed adoption signal today.',
    missingData:
      'Needs country-specific project pipelines, commissioning dates, duration, owner, offtake structure, and co-located solar or wind status.',
  },
  {
    name: 'EV charging + depots',
    stage: 'Emerging',
    primaryMetric: 'Charging hubs buffered by stationary storage',
    currentSignal:
      'Batteries can reduce grid connection size, smooth fast-charging peaks, and pair charging depots with cheaper solar energy.',
    missingData:
      'Needs charging-site disclosures: storage size, charger load, utilisation, tariff structure, and solar co-location.',
  },
]

const sourceBoundaries = [
  'EV battery packs are tracked separately from stationary BESS.',
  'BESS is storage capacity in GW and GWh, not an electricity generation source.',
  'Country rankings need sector-level interconnection or project data before they are useful.',
]

function formatGw(value: number) {
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })} GW`
}

function formatGwh(value: number) {
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 0 })} GWh`
}

function ScoreboardNav() {
  const links = [
    { href: '/scoreboard', label: 'Scoreboard home', active: false },
    { href: '/scoreboard/ev', label: 'EV adoption', active: false },
    { href: '/scoreboard/bess', label: 'BESS adoption', active: true },
    { href: '/scoreboard/energy', label: 'Global battery deployment', active: false },
  ]

  return (
    <nav className="mb-8 flex flex-wrap gap-2 text-sm" aria-label="Scoreboard views">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={
            link.active
              ? 'rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 font-semibold text-brand-700'
              : 'rounded-full border border-ink/10 bg-paper-100 px-3 py-1.5 font-semibold text-ink-600 hover:border-brand-200 hover:text-brand-700'
          }
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}

export default function BessAdoptionScoreboardPage() {
  return (
    <main className="min-h-screen bg-paper pt-12 md:pt-14">
      <section className="container mx-auto max-w-7xl px-4 pb-16 pt-10 md:pt-12">
        <ScoreboardNav />

        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex rounded-full bg-paper-200 px-3 py-1 text-xs font-semibold text-ink-600">
              Stationary storage by sector
            </div>
            <h1 className="font-display text-4xl font-medium text-ink md:text-6xl">BESS Adoption Scoreboard</h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-600">
              Track stationary storage across homes, shared residential buildings, commercial sites,
              utility-scale projects, and EV charging hubs.
            </p>
          </div>
          <div className="rounded-card border border-ink/10 bg-ink p-5 text-white shadow-sm">
            <div className="text-xs font-semibold uppercase text-brand-300">Global anchor</div>
            <div className="mt-3 text-3xl font-bold">{formatGwh(ENERGY_DEPLOYMENT_SNAPSHOT.batteryCumulativeDisplayGwh)}</div>
            <p className="mt-2 text-sm leading-relaxed text-paper-300">
              Estimated stationary battery energy capacity now deployed worldwide, shown alongside sector-specific
              adoption signals below.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-card border border-ink/10 bg-brand-50/40 p-5">
            <div className="text-xs font-semibold uppercase text-brand-700">2025 battery power build</div>
            <div className="mt-3 text-3xl font-bold text-ink">{formatGw(latestTotalGw)}</div>
            <p className="mt-2 text-sm text-ink-600">Utility-scale plus behind-the-meter additions.</p>
          </article>
          <article className="rounded-card border border-ink/10 bg-paper-100 p-5">
            <div className="text-xs font-semibold uppercase text-ink-500">Utility-scale share</div>
            <div className="mt-3 text-3xl font-bold text-ink">
              {Math.round((latestPower.utilityScaleGw / latestTotalGw) * 100)}%
            </div>
            <p className="mt-2 text-sm text-ink-600">{formatGw(latestPower.utilityScaleGw)} of new 2025 power additions.</p>
          </article>
          <article className="rounded-card border border-ink/10 bg-paper-100 p-5">
            <div className="text-xs font-semibold uppercase text-ink-500">YoY build growth</div>
            <div className="mt-3 text-3xl font-bold text-ink">+{annualGrowthPct.toFixed(0)}%</div>
            <p className="mt-2 text-sm text-ink-600">Growth in annual stationary battery power additions from 2024 to 2025.</p>
          </article>
        </div>

        <section className="mt-10">
          <div className="mb-5 max-w-3xl">
            <h2 className="text-xl font-bold text-ink">Sector adoption map</h2>
            <p className="mt-2 text-sm leading-6 text-ink-600">
              Compare where stationary storage is gaining traction first, and where data coverage is still too thin
              for confident country rankings.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {sectors.map((sector) => (
              <article key={sector.name} className="rounded-card border border-ink/10 bg-paper-100 p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-ink">{sector.name}</h3>
                  <span className="rounded-full bg-paper-200 px-2.5 py-1 text-[11px] font-semibold text-ink-600">
                    {sector.stage}
                  </span>
                </div>
                <div className="mt-4 rounded-lg bg-paper-200 p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">Primary metric to track</div>
                  <p className="mt-1 text-sm font-semibold text-ink">{sector.primaryMetric}</p>
                </div>
                <p className="mt-4 text-sm leading-6 text-ink-600">{sector.currentSignal}</p>
                <div className="mt-4 border-t border-ink/5 pt-4">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">Data gap</div>
                  <p className="mt-1 text-sm leading-6 text-ink-600">{sector.missingData}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-card border border-ink/10 bg-paper-200 p-6">
          <h2 className="text-lg font-bold text-ink">Rules for this scoreboard</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {sourceBoundaries.map((boundary) => (
              <div key={boundary} className="rounded-lg bg-paper-100 p-4 text-sm leading-6 text-ink-600">
                {boundary}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}
