import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import NewsletterSignup from '@/components/NewsletterSignup'
import bessDataRaw from '@/data/BESS-Home-data.json'

export const metadata: Metadata = {
  title: 'battery.mom — Clear data for the energy transition.',
  description:
    'Independent, monthly-updated data on electric vehicles, battery storage, and solar — costs, payback times, and adoption rates across Southeast Asia and the world.',
  alternates: { canonical: '/' },
}

const bessData = Array.isArray(bessDataRaw) ? bessDataRaw : (bessDataRaw as any).default || []

async function getStats() {
  try {
    if (!process.env.DATABASE_URL) {
      return { vehicleCount: 150, countryCount: 6, bessCount: bessData.length }
    }
    const vehicleCount = await prisma.vehicle.count({ where: { isAvailable: true } })
    return { vehicleCount, countryCount: 6, bessCount: bessData.length }
  } catch {
    return { vehicleCount: 150, countryCount: 6, bessCount: bessData.length }
  }
}

const PILLARS = [
  {
    title: 'Electric Vehicles',
    description: 'Search, compare, and rank every EV available in Southeast Asia — range, efficiency, battery tech, and real local pricing.',
    href: '/ev',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0H21a.75.75 0 0 0 .75-.75v-3.375a.75.75 0 0 0-.225-.53l-3.75-3.75a.75.75 0 0 0-.53-.22H15V5.25A2.25 2.25 0 0 0 12.75 3h-6A2.25 2.25 0 0 0 4.5 5.25v8.25m11.25 0h3" />
      </svg>
    ),
    badge: null,
  },
  {
    title: 'Home Battery (BESS)',
    description: 'Size a solar + battery system for your home. See if you can zero your electricity bill — with real tariffs and real products.',
    href: '/bess/home',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    badge: null,
  },
  {
    title: 'Shared Residential',
    description: 'Model a shared solar + battery system for condos and apartments — see per-unit savings, payback, and ROI for developers.',
    href: '/bess/shared-residential',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    badge: null,
  },
  {
    title: 'Commercial BESS',
    description: 'Peak shaving, demand charge reduction, and revenue stacking for offices, retail, and factories.',
    href: '/bess/commercial',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008V7.5z" />
      </svg>
    ),
    badge: 'Coming Q2 2026',
  },
  {
    title: 'Grid & Industrial',
    description: 'Utility-scale BESS deployments, LCOE calculators, and policy trackers across Southeast Asia.',
    href: '/bess/grid',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    badge: 'Coming Q3 2026',
  },
  {
    title: 'Scoreboard',
    description: 'Country-by-country adoption rankings — EV sales, charging infrastructure, solar capacity, and BESS penetration.',
    href: '/scoreboard',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125z" />
      </svg>
    ),
    badge: 'Coming Q2 2026',
  },
]

const FEATURES = [
  {
    title: 'Live adoption scoreboards',
    description: 'Country-by-country rankings updated monthly with official government data.',
  },
  {
    title: 'Side-by-side comparisons',
    description: 'Compare EVs and batteries using local prices, incentives, and electricity tariffs.',
  },
  {
    title: 'Monthly-updated datasets',
    description: 'Every data point is verified against primary sources and refreshed every month.',
  },
  {
    title: 'Straightforward breakdowns',
    description: 'Real costs, real payback periods. No hype. No jargon. Just the numbers that matter.',
  },
]

export default async function Home() {
  const stats = await getStats()

  return (
    <main className="min-h-screen pt-12 md:pt-14">
      {/* Hero */}
      <section className="container mx-auto px-4 pt-16 pb-12 max-w-7xl">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1]">
            Clear data for the<br />energy transition.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
            Independent, monthly-updated data on electric vehicles, battery storage, and solar — costs, payback times, and adoption rates across Southeast Asia.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/ev"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-base shadow-sm"
            >
              Compare EVs
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/bess/home"
              className="inline-flex items-center px-6 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-base"
            >
              Size your battery
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Ribbon */}
      <section className="border-y border-gray-200 bg-gray-50/60">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="grid grid-cols-3 divide-x divide-gray-200">
            <div className="text-center px-4">
              <div className="text-2xl md:text-3xl font-bold text-gray-900">{stats.vehicleCount.toLocaleString()}+</div>
              <div className="text-sm text-gray-500 mt-1">EV trims tracked</div>
            </div>
            <div className="text-center px-4">
              <div className="text-2xl md:text-3xl font-bold text-gray-900">{stats.countryCount}</div>
              <div className="text-sm text-gray-500 mt-1">SEA countries</div>
            </div>
            <div className="text-center px-4">
              <div className="text-2xl md:text-3xl font-bold text-gray-900">{stats.bessCount}</div>
              <div className="text-sm text-gray-500 mt-1">BESS products</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Grid */}
      <section className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Explore the data</h2>
          <p className="mt-2 text-gray-600 text-lg">Tools and datasets for every stage of the energy transition.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PILLARS.map((pillar) => (
            <Link
              key={pillar.href}
              href={pillar.href}
              className="group relative bg-white border border-gray-200 rounded-xl p-6 hover:border-emerald-300 hover:shadow-md transition-all duration-200"
            >
              {pillar.badge && (
                <span className="absolute top-4 right-4 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5">
                  {pillar.badge}
                </span>
              )}
              <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                {pillar.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{pillar.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{pillar.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* What you'll find here */}
      <section className="bg-gray-50/60 border-y border-gray-200">
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">What you&apos;ll find here</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex gap-4">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-500 mt-2.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="container mx-auto px-4 py-12 max-w-7xl">
        <NewsletterSignup />
      </section>

      {/* Manifesto footer */}
      <section className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
            No ads. No sponsors. No affiliate links.
          </p>
          <p className="text-gray-600">
            Just clean, verified data updated every month so the transition can move as fast as possible.
          </p>
          <div className="mt-8">
            <Link
              href="/about"
              className="text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors"
            >
              Read our mission →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
