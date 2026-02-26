'use client'

import { useState } from 'react'
import Link from 'next/link'
import InfoTooltip from '@/components/InfoTooltip'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'
import ResponsiveContainer from '@/components/ResponsiveContainer'

// ── Real data (latest available as of early 2025) ─────────────────────

type CountryCode = 'SG' | 'MY' | 'TH' | 'ID' | 'VN' | 'PH'

interface CountryData {
  code: CountryCode
  name: string
  flag: string
  population: number // millions
  evAdoptionRate: number // % of new car sales (2024)
  totalEvs: number // cumulative BEVs on road
  chargingStations: number // public charger points
  chargersPerMillion: number // public chargers per million people
  solarCapacityGw: number // installed solar PV (GW)
  bessPenetrationPct: number // % of solar installs with home battery
  policyGrade: string // A-F
  evSalesGrowth: number // YoY % growth 2023→2024
  topSellingEv: string
  electricityTariff: string // residential rate summary
  evIncentives: string
}

const COUNTRIES: CountryData[] = [
  {
    code: 'TH',
    name: 'Thailand',
    flag: '🇹🇭',
    population: 72,
    evAdoptionRate: 11.2,
    totalEvs: 128000,
    chargingStations: 6800,
    chargersPerMillion: 94,
    solarCapacityGw: 5.2,
    bessPenetrationPct: 3,
    policyGrade: 'A',
    evSalesGrowth: 67,
    topSellingEv: 'BYD Atto 3',
    electricityTariff: '฿4.59/kWh',
    evIncentives: '฿70K-150K subsidy, excise tax cut to 2%',
  },
  {
    code: 'SG',
    name: 'Singapore',
    flag: '🇸🇬',
    population: 5.9,
    evAdoptionRate: 8.5,
    totalEvs: 22000,
    chargingStations: 5400,
    chargersPerMillion: 915,
    solarCapacityGw: 1.1,
    bessPenetrationPct: 8,
    policyGrade: 'A-',
    evSalesGrowth: 42,
    topSellingEv: 'Tesla Model 3',
    electricityTariff: 'S$0.315/kWh',
    evIncentives: '$45K ARF rebate, VES rebate up to $25K',
  },
  {
    code: 'MY',
    name: 'Malaysia',
    flag: '🇲🇾',
    population: 34,
    evAdoptionRate: 2.8,
    totalEvs: 38000,
    chargingStations: 3200,
    chargersPerMillion: 94,
    solarCapacityGw: 3.1,
    bessPenetrationPct: 2,
    policyGrade: 'B+',
    evSalesGrowth: 120,
    topSellingEv: 'Tesla Model Y',
    electricityTariff: 'RM0.474/kWh',
    evIncentives: 'Zero import duty & excise to 2027, road tax exemption',
  },
  {
    code: 'VN',
    name: 'Vietnam',
    flag: '🇻🇳',
    population: 100,
    evAdoptionRate: 3.1,
    totalEvs: 48000,
    chargingStations: 3000,
    chargersPerMillion: 30,
    solarCapacityGw: 18.5,
    bessPenetrationPct: 1,
    policyGrade: 'B',
    evSalesGrowth: 55,
    topSellingEv: 'VinFast VF e34',
    electricityTariff: '₫2,135/kWh',
    evIncentives: '50% registration fee reduction, 0% luxury tax to 2027',
  },
  {
    code: 'ID',
    name: 'Indonesia',
    flag: '🇮🇩',
    population: 278,
    evAdoptionRate: 1.4,
    totalEvs: 45000,
    chargingStations: 2500,
    chargersPerMillion: 9,
    solarCapacityGw: 0.6,
    bessPenetrationPct: 0.5,
    policyGrade: 'B',
    evSalesGrowth: 85,
    topSellingEv: 'Wuling Air ev',
    electricityTariff: 'Rp1,750/kWh',
    evIncentives: 'Rp80M purchase subsidy, 0% luxury tax, reduced PKB',
  },
  {
    code: 'PH',
    name: 'Philippines',
    flag: '🇵🇭',
    population: 117,
    evAdoptionRate: 0.6,
    totalEvs: 8000,
    chargingStations: 800,
    chargersPerMillion: 7,
    solarCapacityGw: 2.8,
    bessPenetrationPct: 1,
    policyGrade: 'C+',
    evSalesGrowth: 110,
    topSellingEv: 'BYD Dolphin',
    electricityTariff: '₱12.30/kWh',
    evIncentives: 'EVIDA Act: 0% tariff, priority registration, HOV access',
  },
]

// Rank metrics (pre-sorted by evAdoptionRate above)
const METRICS = [
  { key: 'evAdoptionRate' as const, label: 'EV Adoption Rate', unit: '%', desc: 'Share of new car sales that are BEVs (2024)' },
  { key: 'totalEvs' as const, label: 'Total EVs', unit: '', desc: 'Cumulative battery EVs on the road' },
  { key: 'chargersPerMillion' as const, label: 'Chargers/1M people', unit: '', desc: 'Public charging points per million population' },
  { key: 'solarCapacityGw' as const, label: 'Solar PV (GW)', unit: 'GW', desc: 'Total installed solar photovoltaic capacity' },
  { key: 'bessPenetrationPct' as const, label: 'BESS Penetration', unit: '%', desc: 'Share of solar installs with home battery storage' },
  { key: 'evSalesGrowth' as const, label: 'EV Sales Growth', unit: '% YoY', desc: 'Year-over-year BEV sales growth (2023→2024)' },
]

type MetricKey = typeof METRICS[number]['key']

function rankCountries(key: MetricKey): CountryData[] {
  return [...COUNTRIES].sort((a, b) => (b[key] as number) - (a[key] as number))
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toLocaleString()
}

const GRADE_COLORS: Record<string, string> = {
  'A': 'bg-emerald-100 text-emerald-800',
  'A-': 'bg-emerald-50 text-emerald-700',
  'B+': 'bg-blue-100 text-blue-800',
  'B': 'bg-blue-50 text-blue-700',
  'C+': 'bg-amber-100 text-amber-800',
  'C': 'bg-amber-50 text-amber-700',
}

export default function ScoreboardPage() {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('evAdoptionRate')
  const [selectedCountry, setSelectedCountry] = useState<CountryCode | null>(null)

  const ranked = rankCountries(selectedMetric)
  const metricInfo = METRICS.find((m) => m.key === selectedMetric)!

  // Radar data for selected country
  const radarData = selectedCountry
    ? METRICS.map((m) => {
        const values = COUNTRIES.map((c) => c[m.key] as number)
        const max = Math.max(...values)
        const country = COUNTRIES.find((c) => c.code === selectedCountry)!
        return {
          metric: m.label,
          value: max > 0 ? Math.round(((country[m.key] as number) / max) * 100) : 0,
        }
      })
    : null

  // Bar chart data for selected metric
  const barData = ranked.map((c) => ({
    name: c.flag + ' ' + c.code,
    value: c[selectedMetric] as number,
  }))

  return (
    <main className="min-h-screen pt-12 md:pt-14">
      <section className="container mx-auto px-4 pt-12 pb-16 max-w-7xl">
        {/* Header */}
        <div className="max-w-2xl mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Adoption Scoreboard <InfoTooltip content="Ranks six Southeast Asian countries across EV adoption, charging infrastructure, solar capacity, and battery storage metrics. Data sourced from national transport registries, IEA, IRENA, and BloombergNEF. Updated monthly." />
          </h1>
          <p className="mt-3 text-lg text-gray-600 leading-relaxed">
            Country-by-country rankings for the energy transition across Southeast Asia — EVs, charging, solar, and battery storage.
          </p>
          <p className="mt-2 text-xs text-gray-400">
            Last updated: February 2025 · Sources: national transport registries, IRENA, IEA, BloombergNEF
          </p>
        </div>

        {/* Metric selector */}
        <div className="flex flex-wrap gap-2 mb-8">
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => setSelectedMetric(m.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedMetric === m.key
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Ranking Table + Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Ranking table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">{metricInfo.label}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{metricInfo.desc}</p>
            </div>
            <div className="divide-y divide-gray-100">
              {ranked.map((c, i) => {
                const value = c[selectedMetric] as number
                const max = ranked[0][selectedMetric] as number
                const pct = max > 0 ? (value / max) * 100 : 0
                return (
                  <button
                    key={c.code}
                    onClick={() => setSelectedCountry(c.code)}
                    className={`w-full flex items-center gap-4 px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                      selectedCountry === c.code ? 'bg-emerald-50' : ''
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      i === 0 ? 'bg-emerald-100 text-emerald-700'
                        : i === 1 ? 'bg-blue-100 text-blue-700'
                          : i === 2 ? 'bg-amber-100 text-amber-700'
                            : 'bg-gray-100 text-gray-500'
                    }`}>
                      {i + 1}
                    </span>
                    <span className="text-xl">{c.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">{c.name}</div>
                      <div className="relative h-1.5 bg-gray-100 rounded-full mt-1">
                        <div
                          className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 tabular-nums">
                      {typeof value === 'number' && value >= 1000 ? formatNum(value) : value}
                      {metricInfo.unit ? <span className="text-xs text-gray-400 ml-0.5">{metricInfo.unit}</span> : null}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Bar chart */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{metricInfo.label} by country</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={60} />
                <Tooltip formatter={(v: number) => `${typeof v === 'number' && v >= 1000 ? formatNum(v) : v} ${metricInfo.unit}`} />
                <Bar dataKey="value" fill="#10b981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Country detail + radar */}
        {selectedCountry && (() => {
          const c = COUNTRIES.find((x) => x.code === selectedCountry)!
          return (
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{c.flag}</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{c.name}</h3>
                  <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${GRADE_COLORS[c.policyGrade] || 'bg-gray-100 text-gray-600'}`}>
                    Policy grade: {c.policyGrade}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">EV adoption <InfoTooltip content="Percentage of all new cars sold in 2024 that were battery electric vehicles (BEVs). Does not include plug-in hybrids (PHEVs). Higher = faster transition to electric transport." /></div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">{c.evAdoptionRate}%</div>
                    <div className="text-xs text-gray-500">of new sales</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total EVs</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">{formatNum(c.totalEvs)}</div>
                    <div className="text-xs text-gray-500">on the road</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Charger density <InfoTooltip content="Number of public EV charging points per million people. Higher density means less range anxiety — there's always a charger nearby. Singapore leads SEA with 915; the global average is ~200." /></div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">{c.chargersPerMillion}</div>
                    <div className="text-xs text-gray-500">per million people</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Solar capacity</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">{c.solarCapacityGw} GW</div>
                    <div className="text-xs text-gray-500">installed PV</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">EV growth <InfoTooltip content="Year-over-year change in BEV sales from 2023 to 2024. Growth rates above 50% indicate rapidly accelerating markets. Malaysia's 120% growth was the highest in SEA." /></div>
                    <div className="text-2xl font-bold text-emerald-700 mt-1">+{c.evSalesGrowth}%</div>
                    <div className="text-xs text-gray-500">YoY 2023→2024</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Top seller</div>
                    <div className="text-lg font-bold text-gray-900 mt-1">{c.topSellingEv}</div>
                    <div className="text-xs text-gray-500">best-selling BEV</div>
                  </div>
                </div>

                {/* Radar */}
                {radarData && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Relative performance (vs SEA peers) <InfoTooltip content="Each metric is normalised to the best-performing SEA country (= 100%). This radar chart shows how the selected country stacks up across all dimensions simultaneously. A larger polygon means stronger overall performance." /></h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                          name={c.name}
                          dataKey="value"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.2}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* Extra info */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Residential tariff</div>
                  <div className="text-sm text-gray-700">{c.electricityTariff}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Key EV incentives</div>
                  <div className="text-sm text-gray-700">{c.evIncentives}</div>
                </div>
              </div>
            </div>
          )
        })()}

        {/* Quick-glance comparison table */}
        <div className="bg-white border border-gray-200 rounded-xl mb-10">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">At a glance</h3>
          </div>
          <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-2.5 font-medium text-gray-500">Country</th>
                  <th className="text-right px-4 py-2.5 font-medium text-gray-500">EV %</th>
                  <th className="text-right px-4 py-2.5 font-medium text-gray-500">Total EVs</th>
                  <th className="text-right px-4 py-2.5 font-medium text-gray-500">Chargers/1M</th>
                  <th className="text-right px-4 py-2.5 font-medium text-gray-500">Solar GW</th>
                  <th className="text-right px-4 py-2.5 font-medium text-gray-500">Growth %</th>
                  <th className="text-center px-4 py-2.5 font-medium text-gray-500">Policy <InfoTooltip content="An editorial grade (A-F) reflecting the strength of each country's EV and clean energy policies: subsidies, tax breaks, charging mandates, and manufacturing incentives. 'A' = aggressive pro-EV policy." /></th>
                </tr>
              </thead>
              <tbody>
                {COUNTRIES.map((c) => (
                  <tr key={c.code} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-medium text-gray-900">
                      <span className="mr-2">{c.flag}</span>
                      {c.name}
                    </td>
                    <td className="text-right px-4 py-2.5 tabular-nums">{c.evAdoptionRate}%</td>
                    <td className="text-right px-4 py-2.5 tabular-nums">{formatNum(c.totalEvs)}</td>
                    <td className="text-right px-4 py-2.5 tabular-nums">{c.chargersPerMillion}</td>
                    <td className="text-right px-4 py-2.5 tabular-nums">{c.solarCapacityGw}</td>
                    <td className="text-right px-4 py-2.5 tabular-nums text-emerald-700 font-medium">+{c.evSalesGrowth}%</td>
                    <td className="text-center px-4 py-2.5">
                      <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${GRADE_COLORS[c.policyGrade] || 'bg-gray-100 text-gray-600'}`}>
                        {c.policyGrade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sources & CTA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Data sources</h3>
            <ul className="text-xs text-gray-500 space-y-1.5">
              <li>• National transport/vehicle registration databases</li>
              <li>• IEA Global EV Data Explorer (2024)</li>
              <li>• IRENA Renewable Capacity Statistics</li>
              <li>• BloombergNEF EV Market Outlook</li>
              <li>• ASEAN Centre for Energy reports</li>
              <li>• Government incentive program publications</li>
            </ul>
            <p className="text-xs text-gray-400 mt-3">
              Numbers are estimates compiled from multiple sources. Some figures are annualised from partial-year data. Updated monthly.
            </p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-emerald-900 mb-2">Explore the tools</h3>
              <p className="text-sm text-emerald-800">
                Use our calculators to see what these numbers mean for your own energy costs and EV savings.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link
                href="/ev"
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
              >
                Compare EVs
              </Link>
              <Link
                href="/calculators"
                className="inline-flex items-center px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Calculators
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
