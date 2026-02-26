import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Calculators — battery.mom',
  description:
    'Free energy transition calculators — zero-bill battery sizing, shared residential BESS ROI, EV vs ICE total cost of ownership, solar payback, and more.',
}

const CALCULATORS = [
  {
    title: 'Zero-Bill Home Calculator',
    description:
      'Size a solar + battery system for your home. Find out if you can zero your electricity bill using real tariffs, real BESS products, and your actual household load.',
    href: '/bess/home',
    status: 'live' as const,
    category: 'Battery Storage',
  },
  {
    title: 'Shared Residential BESS',
    description:
      'Model a community solar + battery system for condos and apartments. See per-unit savings, developer ROI, payback periods, and bulk discount impacts.',
    href: '/bess/shared-residential',
    status: 'live' as const,
    category: 'Battery Storage',
  },
  {
    title: 'EV vs ICE — Total Cost of Ownership',
    description:
      'Compare the 5-year and 10-year cost of owning an electric vehicle versus a petrol equivalent — fuel, maintenance, depreciation, and incentives included.',
    href: '/calculators/ev-vs-ice',
    status: 'live' as const,
    category: 'Electric Vehicles',
  },
  {
    title: 'Solar Payback Calculator',
    description:
      'Enter your roof size, local solar yield, and electricity tariff to get an accurate payback period and 25-year savings projection.',
    href: '/calculators/solar-payback',
    status: 'live' as const,
    category: 'Solar',
  },
  {
    title: 'EV Charging Cost Calculator',
    description:
      'Estimate your monthly and annual charging costs based on your EV\'s battery, local electricity rates, and daily driving distance.',
    href: '/calculators/ev-charging-cost',
    status: 'live' as const,
    category: 'Electric Vehicles',
  },
]

export default function CalculatorsPage() {
  return (
    <main className="min-h-screen pt-12 md:pt-14">
      <section className="container mx-auto px-4 pt-12 pb-16 max-w-7xl">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Calculators
          </h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            Free, no-login tools to help you make faster decisions on EVs, solar, and battery storage — using real data from your country.
          </p>
        </div>

        {/* All Calculators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CALCULATORS.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-emerald-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">
                  {calc.category}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                {calc.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{calc.description}</p>
              <div className="mt-4 flex items-center text-emerald-600 text-sm font-medium">
                Open calculator
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
