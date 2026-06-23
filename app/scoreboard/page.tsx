import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Scoreboards — battery.mom',
  description:
    'Battery.mom scoreboards for global battery deployment, EV adoption, and BESS adoption across sectors.',
  openGraph: {
    title: 'Scoreboards — battery.mom',
    description:
      'Track global battery deployment, EV adoption, and BESS adoption across homes, businesses, grids, and charging hubs.',
    url: 'https://battery.mom/scoreboard',
    siteName: 'battery.mom',
    type: 'website',
  },
}

const liveScoreboards = [
  {
    href: '/scoreboard/energy',
    eyebrow: 'World',
    title: 'Global Battery Deployment',
    description:
      'Stationary battery capacity deployed worldwide, annual battery power additions, and the wider electricity mix across solar, wind, hydro, nuclear, coal, gas, and oil.',
  },
  {
    href: '/scoreboard/ev',
    eyebrow: 'Southeast Asia',
    title: 'EV Adoption',
    description:
      'Electric-vehicle adoption by country, with charging buildout, sales growth, solar context, and policy support.',
  },
  {
    href: '/scoreboard/bess',
    eyebrow: 'By sector',
    title: 'BESS Adoption',
    description:
      'Stationary storage adoption across homes, shared residential buildings, commercial sites, grid projects, and EV charging hubs.',
  },
]

function ArrowIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  )
}

export default function ScoreboardHubPage() {
  return (
    <main className="min-h-screen bg-white pt-12 md:pt-14">
      <section className="container mx-auto max-w-7xl px-4 pb-16 pt-12">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">Scoreboards</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-gray-950 md:text-6xl">
            Track battery and solar adoption.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-gray-600">
            Follow how energy is shifting across storage, transport, buildings, and the grid with scoreboards built
            around real deployment, adoption, and market-readiness signals.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {liveScoreboards.map((scoreboard) => (
            <Link
              key={scoreboard.href}
              href={scoreboard.href}
              className="group flex min-h-[20rem] flex-col justify-between rounded-xl border border-gray-200 bg-gray-50 p-6 transition hover:-translate-y-1 hover:border-emerald-300 hover:bg-white hover:shadow-xl hover:shadow-gray-900/10"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                    {scoreboard.eyebrow}
                  </span>
                </div>
                <h2 className="mt-8 text-2xl font-black tracking-tight text-gray-950">{scoreboard.title}</h2>
                <p className="mt-4 text-sm leading-6 text-gray-600">{scoreboard.description}</p>
              </div>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-emerald-700">
                Open scoreboard
                <ArrowIcon />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
