import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contributors — battery.mom',
  description: 'The data sources, tools, and acknowledgements behind battery.mom.',
  alternates: { canonical: '/contributors' },
}

interface DataSource {
  name: string
  description: string
  url: string
}

const TOOLS: { name: string; purpose: string; url: string }[] = [
  { name: 'Next.js', purpose: 'React framework', url: 'https://nextjs.org' },
  { name: 'Tailwind CSS', purpose: 'Styling', url: 'https://tailwindcss.com' },
  { name: 'Prisma', purpose: 'Database ORM', url: 'https://prisma.io' },
  { name: 'Neon', purpose: 'Serverless PostgreSQL', url: 'https://neon.tech' },
  { name: 'Vercel', purpose: 'Hosting & deployment', url: 'https://vercel.com' },
  { name: 'Recharts', purpose: 'Data visualisation', url: 'https://recharts.org' },
  { name: 'Grok (xAI)', purpose: 'Data seeding & research assistance', url: 'https://x.ai' },
]

const DATA_SOURCES: DataSource[] = [
  {
    name: 'OneMotoring (Singapore)',
    description: 'Official vehicle registration and pricing data for Singapore',
    url: 'https://onemotoring.lta.gov.sg',
  },
  {
    name: 'MAA (Malaysia)',
    description: 'Malaysian Automotive Association — vehicle sales and registration data',
    url: 'https://www.maa.org.my',
  },
  {
    name: 'Gaikindo (Indonesia)',
    description: 'Association of Indonesia Automotive Industries — sales data',
    url: 'https://www.gaikindo.or.id',
  },
  {
    name: 'EV Database',
    description: 'European EV specifications and range data (WLTP)',
    url: 'https://ev-database.org',
  },
  {
    name: 'IEA Global Energy Review',
    description: 'International Energy Agency — current global EV sales and policy context',
    url: 'https://www.iea.org/reports/global-energy-review-2026/technology-electric-vehicles',
  },
  {
    name: 'IRENA',
    description: 'International Renewable Energy Agency — BESS cost and deployment data',
    url: 'https://www.irena.org',
  },
  {
    name: 'BloombergNEF',
    description: 'Battery price index and energy storage market data',
    url: 'https://about.bnef.com',
  },
  {
    name: 'Manufacturer websites',
    description: 'Official specs and pricing from Tesla, BYD, Hyundai, etc.',
    url: '#',
  },
]

export default function ContributorsPage() {
  return (
    <main className="min-h-screen pt-12 md:pt-14">
      <section className="container mx-auto px-4 pt-12 pb-16 max-w-4xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Contributors</h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            The public sources, tools, and references behind battery.mom&apos;s battery, solar, and energy-transition data.
          </p>
        </div>

        {/* Data Sources */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Data Sources
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {DATA_SOURCES.map((source, i) => (
              <div
                key={source.name}
                className={`px-5 py-4 flex items-start justify-between gap-4 ${
                  i < DATA_SOURCES.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div>
                  <h3 className="font-medium text-gray-900 text-sm">{source.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{source.description}</p>
                </div>
                {source.url !== '#' && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex-shrink-0"
                  >
                    Visit
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Built With */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            Built With
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {TOOLS.map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-sm transition-all"
              >
                <h3 className="font-semibold text-gray-900 text-sm">{tool.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{tool.purpose}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Contribute */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Want to contribute?</h2>
          <p className="text-gray-600 mb-4 max-w-lg mx-auto">
            Whether you have data, expertise, or just a correction — we welcome contributions.
            This project is better because of the community around it.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/suggest-correction"
              className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors text-sm"
            >
              Suggest Correction
            </Link>
            <Link
              href="/contact"
              className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-emerald-300 transition-colors text-sm"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
