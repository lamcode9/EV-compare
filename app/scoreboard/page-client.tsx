'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
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
  AreaChart,
  Area,
} from 'recharts'
import ResponsiveContainer from '@/components/ResponsiveContainer'

// ── Types ──────────────────────────────────────────────────────

type CountryCode = 'SG' | 'MY' | 'TH' | 'ID' | 'VN' | 'PH'

interface CountryData {
  code: CountryCode
  name: string
  flag: string
  population: number
  evAdoptionRate: number
  totalEvs: number
  chargingStations: number
  chargersPerMillion: number
  solarCapacityGw: number
  bessPenetrationPct: number
  policyGrade: string
  evSalesGrowth: number
  topSellingEv: string
  electricityTariff: string
  evIncentives: string
  // Previous-period data for trend arrows (simulated 6 months prior)
  prev: {
    evAdoptionRate: number
    totalEvs: number
    chargersPerMillion: number
    solarCapacityGw: number
    bessPenetrationPct: number
    evSalesGrowth: number
  }
  // Historical data for sparklines (2021–2024)
  historical: {
    evAdoptionRate: number[]
    totalEvs: number[]
    chargersPerMillion: number[]
    solarCapacityGw: number[]
    bessPenetrationPct: number[]
    evSalesGrowth: number[]
  }
  // Economic snapshot
  gdpPerCapita: number       // USD
  electricityCostUsd: number  // USD per kWh
  avgEvPriceUsd: number       // average BEV price
  avgAnnualIncomeUsd: number  // average annual income
}

// ── Data ───────────────────────────────────────────────────────

const COUNTRIES: CountryData[] = [
  {
    code: 'TH', name: 'Thailand', flag: '🇹🇭', population: 72,
    evAdoptionRate: 11.2, totalEvs: 128000, chargingStations: 6800, chargersPerMillion: 94,
    solarCapacityGw: 5.2, bessPenetrationPct: 3, policyGrade: 'A', evSalesGrowth: 67,
    topSellingEv: 'BYD Atto 3', electricityTariff: '฿4.59/kWh',
    evIncentives: '฿70K-150K subsidy, excise tax cut to 2%',
    prev: { evAdoptionRate: 9.8, totalEvs: 95000, chargersPerMillion: 78, solarCapacityGw: 4.8, bessPenetrationPct: 2.4, evSalesGrowth: 72 },
    historical: {
      evAdoptionRate: [1.2, 3.5, 7.8, 11.2],
      totalEvs: [9000, 28000, 76000, 128000],
      chargersPerMillion: [18, 35, 58, 94],
      solarCapacityGw: [3.0, 3.6, 4.3, 5.2],
      bessPenetrationPct: [0.5, 1.0, 1.8, 3.0],
      evSalesGrowth: [180, 220, 95, 67],
    },
    gdpPerCapita: 7066, electricityCostUsd: 0.13, avgEvPriceUsd: 28000, avgAnnualIncomeUsd: 8200,
  },
  {
    code: 'SG', name: 'Singapore', flag: '🇸🇬', population: 5.9,
    evAdoptionRate: 8.5, totalEvs: 22000, chargingStations: 5400, chargersPerMillion: 915,
    solarCapacityGw: 1.1, bessPenetrationPct: 8, policyGrade: 'A-', evSalesGrowth: 42,
    topSellingEv: 'Tesla Model 3', electricityTariff: 'S$0.315/kWh',
    evIncentives: '$45K ARF rebate, VES rebate up to $25K',
    prev: { evAdoptionRate: 7.2, totalEvs: 16500, chargersPerMillion: 780, solarCapacityGw: 1.0, bessPenetrationPct: 6.5, evSalesGrowth: 48 },
    historical: {
      evAdoptionRate: [0.8, 2.1, 5.4, 8.5],
      totalEvs: [2500, 6800, 14500, 22000],
      chargersPerMillion: [280, 450, 650, 915],
      solarCapacityGw: [0.5, 0.7, 0.9, 1.1],
      bessPenetrationPct: [2.0, 3.5, 5.0, 8.0],
      evSalesGrowth: [90, 160, 78, 42],
    },
    gdpPerCapita: 65233, electricityCostUsd: 0.22, avgEvPriceUsd: 62000, avgAnnualIncomeUsd: 58000,
  },
  {
    code: 'MY', name: 'Malaysia', flag: '🇲🇾', population: 34,
    evAdoptionRate: 2.8, totalEvs: 38000, chargingStations: 3200, chargersPerMillion: 94,
    solarCapacityGw: 3.1, bessPenetrationPct: 2, policyGrade: 'B+', evSalesGrowth: 120,
    topSellingEv: 'Tesla Model Y', electricityTariff: 'RM0.474/kWh',
    evIncentives: 'Zero import duty & excise to 2027, road tax exemption',
    prev: { evAdoptionRate: 1.8, totalEvs: 18000, chargersPerMillion: 65, solarCapacityGw: 2.7, bessPenetrationPct: 1.5, evSalesGrowth: 95 },
    historical: {
      evAdoptionRate: [0.2, 0.6, 1.3, 2.8],
      totalEvs: [1200, 4500, 15000, 38000],
      chargersPerMillion: [8, 22, 45, 94],
      solarCapacityGw: [1.4, 1.9, 2.4, 3.1],
      bessPenetrationPct: [0.3, 0.7, 1.1, 2.0],
      evSalesGrowth: [150, 280, 180, 120],
    },
    gdpPerCapita: 12570, electricityCostUsd: 0.10, avgEvPriceUsd: 35000, avgAnnualIncomeUsd: 11500,
  },
  {
    code: 'VN', name: 'Vietnam', flag: '🇻🇳', population: 100,
    evAdoptionRate: 3.1, totalEvs: 48000, chargingStations: 3000, chargersPerMillion: 30,
    solarCapacityGw: 18.5, bessPenetrationPct: 1, policyGrade: 'B', evSalesGrowth: 55,
    topSellingEv: 'VinFast VF e34', electricityTariff: '₫2,135/kWh',
    evIncentives: '50% registration fee reduction, 0% luxury tax to 2027',
    prev: { evAdoptionRate: 2.4, totalEvs: 32000, chargersPerMillion: 22, solarCapacityGw: 17.8, bessPenetrationPct: 0.8, evSalesGrowth: 60 },
    historical: {
      evAdoptionRate: [0.1, 0.5, 1.6, 3.1],
      totalEvs: [800, 5200, 25000, 48000],
      chargersPerMillion: [2, 8, 16, 30],
      solarCapacityGw: [5.0, 9.5, 14.0, 18.5],
      bessPenetrationPct: [0.1, 0.3, 0.5, 1.0],
      evSalesGrowth: [120, 350, 95, 55],
    },
    gdpPerCapita: 4163, electricityCostUsd: 0.08, avgEvPriceUsd: 22000, avgAnnualIncomeUsd: 5400,
  },
  {
    code: 'ID', name: 'Indonesia', flag: '🇮🇩', population: 278,
    evAdoptionRate: 1.4, totalEvs: 45000, chargingStations: 2500, chargersPerMillion: 9,
    solarCapacityGw: 0.6, bessPenetrationPct: 0.5, policyGrade: 'B', evSalesGrowth: 85,
    topSellingEv: 'Wuling Air ev', electricityTariff: 'Rp1,750/kWh',
    evIncentives: 'Rp80M purchase subsidy, 0% luxury tax, reduced PKB',
    prev: { evAdoptionRate: 0.9, totalEvs: 28000, chargersPerMillion: 6, solarCapacityGw: 0.4, bessPenetrationPct: 0.3, evSalesGrowth: 70 },
    historical: {
      evAdoptionRate: [0.05, 0.2, 0.6, 1.4],
      totalEvs: [500, 3500, 18000, 45000],
      chargersPerMillion: [1, 3, 5, 9],
      solarCapacityGw: [0.1, 0.2, 0.35, 0.6],
      bessPenetrationPct: [0.05, 0.1, 0.2, 0.5],
      evSalesGrowth: [60, 200, 120, 85],
    },
    gdpPerCapita: 4788, electricityCostUsd: 0.09, avgEvPriceUsd: 25000, avgAnnualIncomeUsd: 5100,
  },
  {
    code: 'PH', name: 'Philippines', flag: '🇵🇭', population: 117,
    evAdoptionRate: 0.6, totalEvs: 8000, chargingStations: 800, chargersPerMillion: 7,
    solarCapacityGw: 2.8, bessPenetrationPct: 1, policyGrade: 'C+', evSalesGrowth: 110,
    topSellingEv: 'BYD Dolphin', electricityTariff: '₱12.30/kWh',
    evIncentives: 'EVIDA Act: 0% tariff, priority registration, HOV access',
    prev: { evAdoptionRate: 0.3, totalEvs: 4200, chargersPerMillion: 4, solarCapacityGw: 2.3, bessPenetrationPct: 0.6, evSalesGrowth: 80 },
    historical: {
      evAdoptionRate: [0.03, 0.1, 0.3, 0.6],
      totalEvs: [200, 1000, 3500, 8000],
      chargersPerMillion: [0.5, 1, 3, 7],
      solarCapacityGw: [1.0, 1.5, 2.0, 2.8],
      bessPenetrationPct: [0.1, 0.2, 0.5, 1.0],
      evSalesGrowth: [40, 150, 130, 110],
    },
    gdpPerCapita: 3905, electricityCostUsd: 0.18, avgEvPriceUsd: 30000, avgAnnualIncomeUsd: 4500,
  },
]

// ── Metrics ────────────────────────────────────────────────────

const METRICS = [
  { key: 'evAdoptionRate' as const, label: 'EV Adoption Rate', unit: '%', desc: 'Share of new car sales that are BEVs (2024)' },
  { key: 'totalEvs' as const, label: 'Total EVs', unit: '', desc: 'Cumulative battery EVs on the road' },
  { key: 'chargersPerMillion' as const, label: 'Chargers/1M people', unit: '', desc: 'Public charging points per million population' },
  { key: 'solarCapacityGw' as const, label: 'Solar PV (GW)', unit: 'GW', desc: 'Total installed solar photovoltaic capacity' },
  { key: 'bessPenetrationPct' as const, label: 'BESS Penetration', unit: '%', desc: 'Share of solar installs with home battery storage' },
  { key: 'evSalesGrowth' as const, label: 'EV Sales Growth', unit: '% YoY', desc: 'Year-over-year BEV sales growth (2023→2024)' },
]

type MetricKey = typeof METRICS[number]['key']
type SortField = MetricKey | 'name' | 'readinessScore' | 'policyGrade'
type SortDir = 'asc' | 'desc'

// ── Helpers ────────────────────────────────────────────────────

const GRADE_SCORE: Record<string, number> = {
  'A': 100, 'A-': 90, 'B+': 80, 'B': 70, 'B-': 60, 'C+': 50, 'C': 40, 'D': 20,
}

const GRADE_COLORS: Record<string, string> = {
  'A': 'bg-emerald-100 text-emerald-800',
  'A-': 'bg-emerald-50 text-emerald-700',
  'B+': 'bg-blue-100 text-blue-800',
  'B': 'bg-blue-50 text-blue-700',
  'B-': 'bg-blue-50 text-blue-600',
  'C+': 'bg-amber-100 text-amber-800',
  'C': 'bg-amber-50 text-amber-700',
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toLocaleString()
}

/** Compute Country Readiness Score (0–100) */
function computeReadinessScore(country: CountryData, all: CountryData[]): number {
  const maxAdoption = Math.max(...all.map(c => c.evAdoptionRate))
  const maxChargers = Math.max(...all.map(c => c.chargersPerMillion))
  const maxGrowth = Math.max(...all.map(c => c.evSalesGrowth))
  const maxSolar = Math.max(...all.map(c => c.solarCapacityGw))
  const maxBess = Math.max(...all.map(c => c.bessPenetrationPct))

  const adoption = maxAdoption > 0 ? (country.evAdoptionRate / maxAdoption) * 100 : 0
  const chargers = maxChargers > 0 ? (country.chargersPerMillion / maxChargers) * 100 : 0
  const growth = maxGrowth > 0 ? (country.evSalesGrowth / maxGrowth) * 100 : 0
  const solar = maxSolar > 0 ? (country.solarCapacityGw / maxSolar) * 100 : 0
  const bess = maxBess > 0 ? (country.bessPenetrationPct / maxBess) * 100 : 0
  const policy = GRADE_SCORE[country.policyGrade] ?? 50

  return Math.round(
    adoption * 0.25 +
    chargers * 0.20 +
    growth * 0.20 +
    solar * 0.15 +
    bess * 0.10 +
    policy * 0.10
  )
}

/** Score ring colours */
function getScoreColor(score: number): string {
  if (score >= 75) return '#10b981'
  if (score >= 55) return '#f59e0b'
  if (score >= 35) return '#f97316'
  return '#ef4444'
}

/** Trend arrow helper */
function TrendBadge({ current, previous }: { current: number; previous: number }) {
  if (previous === 0) return null
  const delta = current - previous
  const pct = Math.round((delta / previous) * 100)
  if (Math.abs(pct) < 1) return <span className="text-[9px] text-gray-400 ml-1">→</span>
  const up = delta > 0
  return (
    <span className={`inline-flex items-center text-[9px] font-semibold ml-1 ${up ? 'text-emerald-600' : 'text-red-500'}`}>
      {up ? '↑' : '↓'}{Math.abs(pct)}%
    </span>
  )
}

/** Mini score ring (SVG) */
function ScoreRing({ score, size = 52, strokeWidth = 4, medal }: { score: number; size?: number; strokeWidth?: number; medal?: 'gold' | 'silver' | 'bronze' | null }) {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - score / 100)
  const color = medal === 'gold' ? '#eab308' : medal === 'silver' ? '#9ca3af' : medal === 'bronze' ? '#d97706' : getScoreColor(score)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold" style={{ color }}>{score}</span>
      </div>
    </div>
  )
}

// ── Historical & Benchmark Data ────────────────────────────────

const HISTORICAL_YEARS = [2021, 2022, 2023, 2024]

/** Global & regional benchmarks for context banner */
const BENCHMARKS: Record<string, { sea: number; us: number; global: number; eu: number; china: number; unit: string; label: string }> = {
  evAdoptionRate: { sea: 4.6, us: 9.8, global: 18, eu: 24, china: 38, unit: '%', label: 'EV Adoption Rate' },
  chargersPerMillion: { sea: 192, us: 555, global: 450, eu: 800, china: 1200, unit: '', label: 'Chargers per 1M People' },
  evSalesGrowth: { sea: 80, us: 11, global: 35, eu: 22, china: 25, unit: '% YoY', label: 'EV Sales Growth' },
}

/** Detailed metric info for deep-dive modal */
const METRIC_DETAILS: Record<MetricKey, { definition: string; methodology: string; source: string }> = {
  evAdoptionRate: {
    definition: 'The share of new passenger vehicle registrations in 2024 that were battery electric vehicles (BEVs), excluding plug-in hybrids.',
    methodology: 'BEV registrations ÷ total new car registrations × 100. Based on full-year 2024 data where available, otherwise annualised from H1 2024.',
    source: 'National transport registries, IEA Global EV Data Explorer 2024',
  },
  totalEvs: {
    definition: 'Cumulative number of battery electric vehicles (BEVs) registered and on the road as of December 2024.',
    methodology: 'Running total of BEV registrations minus estimated scrapped/deregistered vehicles. Cross-referenced with national fleet census data.',
    source: 'National transport registries, BloombergNEF',
  },
  chargersPerMillion: {
    definition: 'Number of publicly accessible EV charging points per million population, including Level 2 (AC) and DC fast chargers.',
    methodology: 'Total public charger count ÷ (population in millions). Includes chargers listed in national databases and major networks (PlusPetrol, Shell Recharge, etc.).',
    source: 'ASEAN Centre for Energy, Open Charge Map, national utility databases',
  },
  solarCapacityGw: {
    definition: 'Total installed solar photovoltaic (PV) generation capacity in gigawatts, including utility-scale, commercial, and residential installations.',
    methodology: 'Sum of all grid-connected solar PV capacity as reported by national energy commissions and IRENA statistics.',
    source: 'IRENA Renewable Capacity Statistics 2024, national energy commissions',
  },
  bessPenetrationPct: {
    definition: 'Percentage of residential/commercial solar installations that include a battery energy storage system (BESS), typically lithium-ion.',
    methodology: 'BESS-paired solar installs ÷ total solar installs × 100. Based on installer surveys and utility interconnection data.',
    source: 'BloombergNEF, IRENA, national utility data',
  },
  evSalesGrowth: {
    definition: 'Year-over-year percentage change in BEV unit sales from 2023 to 2024.',
    methodology: '(2024 BEV sales − 2023 BEV sales) ÷ 2023 BEV sales × 100. Based on full-year registration data.',
    source: 'National transport registries, IEA Global EV Data Explorer 2024',
  },
}

/** Sparkline mini chart */
function Sparkline({ data, color = '#10b981', width = 80, height = 28 }: { data: number[]; color?: string; width?: number; height?: number }) {
  const chartData = HISTORICAL_YEARS.map((yr, i) => ({ year: yr, value: data[i] }))
  return (
    <ResponsiveContainer width={width} height={height}>
      <AreaChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <defs>
          <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={1.5} fill={`url(#spark-${color.replace('#', '')})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ── 3.3 Data Freshness ────────────────────────────────────────

const DATA_UPDATED_DATE = new Date('2025-02-15T00:00:00Z')

function DataFreshnessBadge() {
  const now = new Date()
  const diffMs = now.getTime() - DATA_UPDATED_DATE.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  let label: string
  let colorClass: string
  if (diffDays <= 7) {
    label = diffDays <= 1 ? 'Updated today' : `Updated ${diffDays}d ago`
    colorClass = 'bg-emerald-100 text-emerald-700'
  } else if (diffDays <= 30) {
    label = `Updated ${diffDays}d ago`
    colorClass = 'bg-emerald-50 text-emerald-600'
  } else if (diffDays <= 60) {
    label = `Updated ${Math.floor(diffDays / 7)}w ago`
    colorClass = 'bg-amber-100 text-amber-700'
  } else {
    const months = Math.floor(diffDays / 30)
    label = `Updated ${months}mo ago`
    colorClass = 'bg-red-100 text-red-700'
  }

  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${colorClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${diffDays <= 30 ? 'bg-emerald-500' : diffDays <= 60 ? 'bg-amber-500' : 'bg-red-500'}`} />
      {label}
    </span>
  )
}

// ── 3.1 Animated Count-Up Hook ─────────────────────────────────

function useCountUp(target: number, duration = 800, decimals = 0) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!ref.current || hasAnimated.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const start = performance.now()
          const animate = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            // easeOutQuart
            const ease = 1 - Math.pow(1 - progress, 4)
            setValue(parseFloat((ease * target).toFixed(decimals)))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration, decimals])

  return { value, ref }
}

/** Animated number display */
function AnimatedNum({ value, suffix = '', decimals = 0, large = false }: { value: number; suffix?: string; decimals?: number; large?: boolean }) {
  const { value: animated, ref } = useCountUp(value, 800, decimals)
  return (
    <span ref={ref}>
      {large && animated >= 1000 ? formatNum(animated) : animated.toFixed(decimals).replace(/\.0+$/, '')}{suffix}
    </span>
  )
}

// ── 3.4 Export Helpers ─────────────────────────────────────────

function exportTableCSV(scored: (CountryData & { readinessScore: number })[]) {
  const headers = ['Country', 'Code', 'Readiness Score', 'EV Adoption %', 'Total EVs', 'Chargers/1M', 'Solar GW', 'BESS %', 'EV Growth %', 'Policy Grade', 'GDP/Capita', 'Electricity $/kWh', 'Avg EV Price', 'Affordability Index']
  const rows = scored.map(c => [
    c.name, c.code, c.readinessScore, c.evAdoptionRate, c.totalEvs, c.chargersPerMillion,
    c.solarCapacityGw, c.bessPenetrationPct, c.evSalesGrowth, c.policyGrade,
    c.gdpPerCapita, c.electricityCostUsd, c.avgEvPriceUsd,
    (c.avgEvPriceUsd / c.avgAnnualIncomeUsd).toFixed(1),
  ])
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'battery-mom-scoreboard-data.csv'
  a.click()
  URL.revokeObjectURL(url)
}

function handlePrint() {
  window.print()
}

// ── Component ──────────────────────────────────────────────────

export default function ScoreboardPage() {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('evAdoptionRate')
  const [selectedCountry, setSelectedCountry] = useState<CountryCode | null>(null)
  const [sortField, setSortField] = useState<SortField>('readinessScore')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [compareA, setCompareA] = useState<CountryCode | null>(null)
  const [compareB, setCompareB] = useState<CountryCode | null>(null)
  const [metricModal, setMetricModal] = useState<MetricKey | null>(null)
  const [shareLoading, setShareLoading] = useState(false)
  const scorecardRef = useRef<HTMLDivElement>(null)

  // ── Computed scores ──────────────────────────────────────────
  const scored = useMemo(() =>
    COUNTRIES.map(c => ({ ...c, readinessScore: computeReadinessScore(c, COUNTRIES) }))
      .sort((a, b) => b.readinessScore - a.readinessScore),
  [])

  const top3 = scored.slice(0, 3)
  const metricInfo = METRICS.find(m => m.key === selectedMetric)!

  // ── Ranking by selected metric ───────────────────────────────
  const rankedByMetric = useMemo(() =>
    [...scored].sort((a, b) => (b[selectedMetric] as number) - (a[selectedMetric] as number)),
  [selectedMetric, scored])

  // ── Auto-generated headlines ─────────────────────────────────
  const headlines = useMemo(() => {
    const lines: string[] = []
    const byAdoption = [...scored].sort((a, b) => b.evAdoptionRate - a.evAdoptionRate)
    const byGrowth = [...scored].sort((a, b) => b.evSalesGrowth - a.evSalesGrowth)
    const byChargers = [...scored].sort((a, b) => b.chargersPerMillion - a.chargersPerMillion)
    const bySolar = [...scored].sort((a, b) => b.solarCapacityGw - a.solarCapacityGw)

    lines.push(`${byAdoption[0].flag} ${byAdoption[0].name} leads SEA with a ${byAdoption[0].evAdoptionRate}% EV adoption rate — ${(byAdoption[0].evAdoptionRate / byAdoption[byAdoption.length - 1].evAdoptionRate).toFixed(0)}× the lowest.`)
    lines.push(`${byGrowth[0].flag} ${byGrowth[0].name} saw the fastest growth at +${byGrowth[0].evSalesGrowth}% YoY, more than doubling last year's sales.`)

    if (byChargers[0].chargersPerMillion > byChargers[byChargers.length - 1].chargersPerMillion * 5) {
      lines.push(`${byChargers[0].flag} ${byChargers[0].name} has ${Math.round(byChargers[0].chargersPerMillion / byChargers[byChargers.length - 1].chargersPerMillion)}× more chargers per capita than ${byChargers[byChargers.length - 1].name}.`)
    }
    lines.push(`${bySolar[0].flag} ${bySolar[0].name} dominates solar with ${bySolar[0].solarCapacityGw} GW installed — ${(bySolar[0].solarCapacityGw / (scored.reduce((s, c) => s + c.solarCapacityGw, 0) / scored.length)).toFixed(0)}× the SEA average.`)

    // Momentum insight
    const biggestJump = [...scored].sort((a, b) => {
      const aD = a.evAdoptionRate - a.prev.evAdoptionRate
      const bD = b.evAdoptionRate - b.prev.evAdoptionRate
      return bD - aD
    })[0]
    const jump = biggestJump.evAdoptionRate - biggestJump.prev.evAdoptionRate
    if (jump > 0) {
      lines.push(`${biggestJump.flag} ${biggestJump.name} gained +${jump.toFixed(1)} percentage points in EV adoption — the biggest absolute jump in the region.`)
    }

    return lines
  }, [scored])

  // ── Sortable table ───────────────────────────────────────────
  const sortedForTable = useMemo(() => {
    const arr = [...scored]
    arr.sort((a, b) => {
      let av: number | string, bv: number | string
      if (sortField === 'name') { av = a.name; bv = b.name }
      else if (sortField === 'policyGrade') { av = GRADE_SCORE[a.policyGrade] ?? 0; bv = GRADE_SCORE[b.policyGrade] ?? 0 }
      else if (sortField === 'readinessScore') { av = a.readinessScore; bv = b.readinessScore }
      else { av = a[sortField] as number; bv = b[sortField] as number }
      if (typeof av === 'string' && typeof bv === 'string') return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number)
    })
    return arr
  }, [scored, sortField, sortDir])

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }, [sortField])

  // Best-in-class detection for table green highlight
  const bestValues = useMemo(() => {
    const b: Record<string, number> = {}
    for (const m of METRICS) {
      const vals = scored.map(c => c[m.key] as number)
      b[m.key] = Math.max(...vals)
    }
    b['readinessScore'] = Math.max(...scored.map(c => c.readinessScore))
    return b
  }, [scored])

  // ── Country detail radar ─────────────────────────────────────
  const radarData = selectedCountry
    ? METRICS.map(m => {
        const vals = COUNTRIES.map(c => c[m.key] as number)
        const max = Math.max(...vals)
        const country = COUNTRIES.find(c => c.code === selectedCountry)!
        return { metric: m.label, value: max > 0 ? Math.round(((country[m.key] as number) / max) * 100) : 0 }
      })
    : null

  // ── Side-by-side comparison ──────────────────────────────────
  const comparisonData = useMemo(() => {
    if (!compareA || !compareB) return null
    const a = scored.find(c => c.code === compareA)!
    const b = scored.find(c => c.code === compareB)!
    const radar = METRICS.map(m => {
      const max = Math.max(...scored.map(c => c[m.key] as number))
      return {
        metric: m.label,
        [a.name]: max > 0 ? Math.round(((a[m.key] as number) / max) * 100) : 0,
        [b.name]: max > 0 ? Math.round(((b[m.key] as number) / max) * 100) : 0,
      }
    })
    // Narrative deltas
    const narratives: string[] = []
    if (a.totalEvs !== b.totalEvs) {
      const [hi, lo] = a.totalEvs > b.totalEvs ? [a, b] : [b, a]
      narratives.push(`${hi.flag} ${hi.name} has ${(hi.totalEvs / lo.totalEvs).toFixed(1)}× more EVs on the road than ${lo.name}.`)
    }
    if (a.chargersPerMillion !== b.chargersPerMillion) {
      const [hi, lo] = a.chargersPerMillion > b.chargersPerMillion ? [a, b] : [b, a]
      narratives.push(`${hi.flag} ${hi.name} has ${(hi.chargersPerMillion / lo.chargersPerMillion).toFixed(1)}× the charger density of ${lo.name}.`)
    }
    if (a.evSalesGrowth !== b.evSalesGrowth) {
      const [hi, lo] = a.evSalesGrowth > b.evSalesGrowth ? [a, b] : [b, a]
      narratives.push(`${hi.flag} ${hi.name}'s EV sales grew ${hi.evSalesGrowth - lo.evSalesGrowth} percentage points faster YoY.`)
    }
    return { a, b, radar, narratives }
  }, [compareA, compareB, scored])

  // ── Bar chart for selected metric ────────────────────────────
  const barData = rankedByMetric.map(c => ({ name: c.flag + ' ' + c.code, value: c[selectedMetric] as number }))

  // ── Metric deep-dive insight ─────────────────────────────────
  const deepDiveInsight = useMemo(() => {
    if (!metricModal) return null
    const m = METRICS.find(x => x.key === metricModal)!
    const sorted = [...scored].sort((a, b) => (b[metricModal] as number) - (a[metricModal] as number))
    const best = sorted[0]
    const worst = sorted[sorted.length - 1]
    const avg = scored.reduce((s, c) => s + (c[metricModal] as number), 0) / scored.length
    const ratio = (worst[metricModal] as number) > 0 ? ((best[metricModal] as number) / (worst[metricModal] as number)).toFixed(1) : 'N/A'

    const lines: string[] = []
    lines.push(`${best.flag} ${best.name} leads the region in ${m.label.toLowerCase()} at ${typeof (best[metricModal] as number) === 'number' && (best[metricModal] as number) >= 1000 ? formatNum(best[metricModal] as number) : best[metricModal]}${m.unit ? ' ' + m.unit : ''}, which is ${ratio}× that of ${worst.name}.`)
    lines.push(`The SEA average is ${avg >= 1000 ? formatNum(avg) : avg.toFixed(1)}${m.unit ? ' ' + m.unit : ''}, suggesting significant room for improvement across the bloc.`)
    return { detail: METRIC_DETAILS[metricModal], chart: sorted, lines, metricInfo: m }
  }, [metricModal, scored])

  // ── Share country scorecard ──────────────────────────────────
  const handleShareScorecard = useCallback(async () => {
    if (!selectedCountry || !scorecardRef.current) return
    setShareLoading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(scorecardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
      })
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'))
      if (!blob) return

      // Try native share first, fall back to download
      if (navigator.share && navigator.canShare?.({ files: [new File([blob], 'scorecard.png', { type: 'image/png' })] })) {
        await navigator.share({
          title: `${COUNTRIES.find(c => c.code === selectedCountry)?.name} — Energy Scorecard`,
          files: [new File([blob], 'scorecard.png', { type: 'image/png' })],
        })
      } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `battery-mom-scorecard-${selectedCountry.toLowerCase()}.png`
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch {
      // User cancelled share or error
    } finally {
      setShareLoading(false)
    }
  }, [selectedCountry])

  // ── Render ───────────────────────────────────────────────────
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
          <p className="mt-2 flex items-center gap-2 text-xs text-gray-400">
            <DataFreshnessBadge /> Sources: national transport registries, IRENA, IEA, BloombergNEF
          </p>
        </div>

        {/* ─── 1.2 Top-3 Podium ─────────────────────────────────── */}
        <div className="mb-10">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Overall Readiness Ranking
            <InfoTooltip content="Composite score (0–100) combining EV adoption rate (25%), charger density (20%), EV sales growth (20%), solar capacity (15%), BESS penetration (10%), and policy grade (10%). All dimensions normalised to SEA best-in-class." />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {top3.map((c, i) => {
              const medal = (['gold', 'silver', 'bronze'] as const)[i]
              const medalEmoji = ['🥇', '🥈', '🥉'][i]
              const medalBorder = i === 0 ? 'border-yellow-300 bg-yellow-50/40' : i === 1 ? 'border-gray-300 bg-gray-50/40' : 'border-amber-300 bg-amber-50/30'
              return (
                <button
                  key={c.code}
                  onClick={() => setSelectedCountry(c.code)}
                  className={`relative rounded-xl border-2 p-5 text-left transition-all hover:shadow-lg ${medalBorder} ${selectedCountry === c.code ? 'ring-2 ring-emerald-400' : ''}`}
                >
                  <div className="absolute top-3 right-3 text-2xl">{medalEmoji}</div>
                  <div className="flex items-center gap-4">
                    <ScoreRing score={c.readinessScore} size={64} strokeWidth={5} medal={medal} />
                    <div>
                      <div className="text-2xl mb-0.5">{c.flag}</div>
                      <div className="text-lg font-bold text-gray-900">{c.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {c.evAdoptionRate}% adoption · +{c.evSalesGrowth}% growth
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200/60 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-xs font-bold text-gray-900"><AnimatedNum value={c.evAdoptionRate} suffix="%" decimals={1} /></div>
                      <div className="text-[9px] text-gray-400">EV %</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900"><AnimatedNum value={c.chargersPerMillion} /></div>
                      <div className="text-[9px] text-gray-400">Chrg/1M</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900"><AnimatedNum value={c.solarCapacityGw} suffix="" decimals={1} /></div>
                      <div className="text-[9px] text-gray-400">Solar GW</div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
          {/* Remaining countries mini row */}
          <div className="mt-3 flex flex-wrap gap-2">
            {scored.slice(3).map((c, i) => (
              <button
                key={c.code}
                onClick={() => setSelectedCountry(c.code)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-left hover:border-gray-300 ${selectedCountry === c.code ? 'border-emerald-300 bg-emerald-50/50' : 'border-gray-200 bg-white'}`}
              >
                <span className="text-xs font-medium text-gray-400">#{i + 4}</span>
                <ScoreRing score={c.readinessScore} size={32} strokeWidth={3} />
                <div>
                  <div className="text-sm font-semibold text-gray-800">{c.flag} {c.name}</div>
                  <div className="text-[10px] text-gray-400">{c.evAdoptionRate}% adoption</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ─── 1.4 Auto-Generated Headlines ─────────────────────── */}
        <div className="mb-10 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">📊 Key Headlines</h3>
          <ul className="space-y-2">
            {headlines.map((line, i) => (
              <li key={i} className="text-sm text-gray-200 leading-relaxed flex gap-2">
                <span className="text-emerald-400 font-bold shrink-0">•</span>
                {line}
              </li>
            ))}
          </ul>
        </div>

        {/* ─── 2.2 Regional Context Banner ──────────────────────── */}
        <div className="mb-10 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            🌏 How does Southeast Asia compare?
            <InfoTooltip content="SEA average calculated from the 6 Southeast Asian countries tracked. US, Global, EU, and China figures from IEA Global EV Outlook 2024 and BloombergNEF." />
          </h3>
          <p className="text-xs text-gray-500 mb-5">SEA average vs US and regional benchmarks for three key metrics.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(BENCHMARKS).map(([key, bm]) => {
              const max = Math.max(bm.sea, bm.us, bm.global, bm.eu, bm.china)
              const entries = [
                { label: 'SEA', value: bm.sea, color: 'bg-emerald-500', text: 'text-emerald-700' },
                { label: 'US', value: bm.us, color: 'bg-indigo-500', text: 'text-indigo-700' },
                { label: 'Global', value: bm.global, color: 'bg-gray-400', text: 'text-gray-600' },
                { label: 'EU', value: bm.eu, color: 'bg-blue-500', text: 'text-blue-700' },
                { label: 'China', value: bm.china, color: 'bg-red-400', text: 'text-red-700' },
              ]
              return (
                <div key={key} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-xs font-semibold text-gray-700 mb-3">{bm.label}</div>
                  <div className="space-y-2">
                    {entries.map(e => (
                      <div key={e.label} className="flex items-center gap-2">
                        <span className={`text-[10px] w-10 font-medium ${e.text}`}>{e.label}</span>
                        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${e.color} transition-all duration-500`}
                            style={{ width: `${max > 0 ? (e.value / max) * 100 : 0}%` }}
                          />
                        </div>
                        <span className={`text-xs font-semibold tabular-nums ${e.text} w-14 text-right`}>
                          {e.value >= 1000 ? formatNum(e.value) : e.value}{bm.unit ? bm.unit : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                  {bm.sea < bm.global && (
                    <p className="text-[10px] text-amber-600 mt-2">
                      SEA is {((bm.global - bm.sea) / bm.global * 100).toFixed(0)}% below the global average
                    </p>
                  )}
                  {bm.sea > bm.global && (
                    <p className="text-[10px] text-emerald-600 mt-2">
                      SEA outpaces the global average by {((bm.sea - bm.global) / bm.global * 100).toFixed(0)}%
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Metric selector */}
        <div className="flex flex-wrap gap-2 mb-8">
          {METRICS.map(m => (
            <div key={m.key} className="flex items-center">
              <button
                onClick={() => setSelectedMetric(m.key)}
                className={`px-3 py-1.5 rounded-l-lg text-sm font-medium transition-colors ${
                  selectedMetric === m.key ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {m.label}
              </button>
              <button
                onClick={() => setMetricModal(m.key)}
                className={`px-1.5 py-1.5 rounded-r-lg text-xs transition-colors border-l ${
                  selectedMetric === m.key ? 'bg-emerald-700 text-emerald-200 border-emerald-500 hover:bg-emerald-800' : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100 hover:text-gray-600'
                }`}
                title={`Deep dive: ${m.label}`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </button>
            </div>
          ))}
        </div>

        {/* Ranking Table + Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Ranking table with trend arrows */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">{metricInfo.label}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{metricInfo.desc}</p>
            </div>
            <div className="divide-y divide-gray-100">
              {rankedByMetric.map((c, i) => {
                const value = c[selectedMetric] as number
                const max = rankedByMetric[0][selectedMetric] as number
                const pct = max > 0 ? (value / max) * 100 : 0
                const prev = c.prev[selectedMetric as keyof CountryData['prev']] as number | undefined
                return (
                  <button
                    key={c.code}
                    onClick={() => setSelectedCountry(c.code)}
                    className={`w-full flex items-center gap-4 px-6 py-3 text-left hover:bg-gray-50 transition-colors ${selectedCountry === c.code ? 'bg-emerald-50' : ''}`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      i === 0 ? 'bg-emerald-100 text-emerald-700' : i === 1 ? 'bg-blue-100 text-blue-700' : i === 2 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                    }`}>{i + 1}</span>
                    <span className="text-xl">{c.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">{c.name}</div>
                      <div className="relative h-1.5 bg-gray-100 rounded-full mt-1">
                        <div className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 tabular-nums flex items-center">
                      {typeof value === 'number' && value >= 1000 ? formatNum(value) : value}
                      {metricInfo.unit ? <span className="text-xs text-gray-400 ml-0.5">{metricInfo.unit}</span> : null}
                      {prev !== undefined && <TrendBadge current={value} previous={prev} />}
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

        {/* Country detail */}
        {selectedCountry && (() => {
          const c = scored.find(x => x.code === selectedCountry)!
          const affordabilityIndex = (c.avgEvPriceUsd / c.avgAnnualIncomeUsd).toFixed(1)
          return (
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-10">
              {/* Header with share button */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{c.flag}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{c.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${GRADE_COLORS[c.policyGrade] || 'bg-gray-100 text-gray-600'}`}>
                      Policy grade: {c.policyGrade}
                    </span>
                    <span className="text-xs text-gray-400">Readiness: {c.readinessScore}/100</span>
                  </div>
                </div>
                <button
                  onClick={handleShareScorecard}
                  disabled={shareLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
                  title="Download country scorecard as PNG"
                >
                  {shareLoading ? (
                    <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  )}
                  Share
                </button>
                <ScoreRing score={c.readinessScore} size={56} strokeWidth={4} />
              </div>

              {/* ── Scorecard capture area ── */}
              <div ref={scorecardRef}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Stats with sparklines */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">EV adoption <InfoTooltip content="Percentage of all new cars sold in 2024 that were battery electric vehicles (BEVs)." /></div>
                        <Sparkline data={c.historical.evAdoptionRate} />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mt-1 flex items-center">
                        {c.evAdoptionRate}%
                        <TrendBadge current={c.evAdoptionRate} previous={c.prev.evAdoptionRate} />
                      </div>
                      <div className="text-xs text-gray-500">of new sales</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total EVs</div>
                        <Sparkline data={c.historical.totalEvs} color="#6366f1" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mt-1 flex items-center">
                        {formatNum(c.totalEvs)}
                        <TrendBadge current={c.totalEvs} previous={c.prev.totalEvs} />
                      </div>
                      <div className="text-xs text-gray-500">on the road</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Charger density <InfoTooltip content="Public EV charging points per million people. Singapore leads SEA with 915." /></div>
                        <Sparkline data={c.historical.chargersPerMillion} color="#f59e0b" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mt-1 flex items-center">
                        {c.chargersPerMillion}
                        <TrendBadge current={c.chargersPerMillion} previous={c.prev.chargersPerMillion} />
                      </div>
                      <div className="text-xs text-gray-500">per million people</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Solar capacity</div>
                        <Sparkline data={c.historical.solarCapacityGw} color="#eab308" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mt-1 flex items-center">
                        {c.solarCapacityGw} GW
                        <TrendBadge current={c.solarCapacityGw} previous={c.prev.solarCapacityGw} />
                      </div>
                      <div className="text-xs text-gray-500">installed PV</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">EV growth <InfoTooltip content="Year-over-year change in BEV sales from 2023 to 2024." /></div>
                        <Sparkline data={c.historical.evSalesGrowth} color="#ef4444" />
                      </div>
                      <div className="text-2xl font-bold text-emerald-700 mt-1">+{c.evSalesGrowth}%</div>
                      <div className="text-xs text-gray-500">YoY 2023→2024</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Top seller</div>
                      <div className="text-lg font-bold text-gray-900 mt-1">{c.topSellingEv}</div>
                      <div className="text-xs text-gray-500">best-selling BEV</div>
                    </div>
                  </div>
                  {radarData && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Relative performance (vs SEA peers) <InfoTooltip content="Each metric normalised to the best-performing SEA country (= 100%)." /></h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="#e5e7eb" />
                          <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar name={c.name} dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                {/* ─── 2.5 Economic Snapshot ──────────────────────────── */}
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                    💰 Economic Context
                    <InfoTooltip content="Economic indicators that affect EV adoption feasibility. Affordability Index = average EV price ÷ average annual income (lower = more affordable)." />
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50/60 rounded-lg p-3">
                      <div className="text-[10px] font-medium text-blue-600 uppercase">GDP per capita</div>
                      <div className="text-lg font-bold text-gray-900 mt-0.5">${c.gdpPerCapita.toLocaleString()}</div>
                    </div>
                    <div className="bg-amber-50/60 rounded-lg p-3">
                      <div className="text-[10px] font-medium text-amber-600 uppercase">Electricity cost</div>
                      <div className="text-lg font-bold text-gray-900 mt-0.5">${c.electricityCostUsd}/kWh</div>
                      <div className="text-[10px] text-gray-400">{c.electricityTariff}</div>
                    </div>
                    <div className="bg-purple-50/60 rounded-lg p-3">
                      <div className="text-[10px] font-medium text-purple-600 uppercase">Avg EV Price</div>
                      <div className="text-lg font-bold text-gray-900 mt-0.5">${c.avgEvPriceUsd.toLocaleString()}</div>
                    </div>
                    <div className={`rounded-lg p-3 ${parseFloat(affordabilityIndex) <= 2 ? 'bg-emerald-50/60' : parseFloat(affordabilityIndex) <= 4 ? 'bg-amber-50/60' : 'bg-red-50/60'}`}>
                      <div className={`text-[10px] font-medium uppercase ${parseFloat(affordabilityIndex) <= 2 ? 'text-emerald-600' : parseFloat(affordabilityIndex) <= 4 ? 'text-amber-600' : 'text-red-600'}`}>
                        Affordability Index
                      </div>
                      <div className="text-lg font-bold text-gray-900 mt-0.5">{affordabilityIndex}×</div>
                      <div className="text-[10px] text-gray-400">
                        {parseFloat(affordabilityIndex) <= 2 ? 'Affordable' : parseFloat(affordabilityIndex) <= 4 ? 'Moderate' : 'Expensive'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tariff & Incentives */}
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Key EV incentives</div>
                    <div className="text-sm text-gray-700">{c.evIncentives}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Avg. annual income</div>
                    <div className="text-sm text-gray-700">${c.avgAnnualIncomeUsd.toLocaleString()}</div>
                  </div>
                </div>

                {/* battery.mom branding for share image */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] text-gray-300">battery.mom · Southeast Asia Energy Scoreboard</span>
                  <span className="text-[10px] text-gray-300">Data: IEA, IRENA, BloombergNEF</span>
                </div>
              </div>
            </div>
          )
        })()}

        {/* ─── 1.5 Sortable At-a-Glance Table + 3.2 Mobile Cards + 3.4 Export ── */}
        <div className="bg-white border border-gray-200 rounded-xl mb-10 print:border-0 print:shadow-none">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">At a glance</h3>
              <p className="text-[10px] text-gray-400 mt-0.5 hidden md:block">Click column headers to sort · Green = best in class</p>
            </div>
            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={() => exportTableCSV(scored)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                CSV
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                Print
              </button>
            </div>
          </div>

          {/* ── 3.2 Mobile Card View (below md) ── */}
          <div className="md:hidden divide-y divide-gray-100">
            {sortedForTable.map(c => (
              <button
                key={c.code}
                onClick={() => setSelectedCountry(c.code)}
                className={`w-full p-4 text-left transition-colors ${selectedCountry === c.code ? 'bg-emerald-50' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{c.flag}</span>
                    <span className="text-sm font-bold text-gray-900">{c.name}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${GRADE_COLORS[c.policyGrade] || 'bg-gray-100 text-gray-600'}`}>{c.policyGrade}</span>
                  </div>
                  <ScoreRing score={c.readinessScore} size={36} strokeWidth={3} />
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <div className={`text-xs font-semibold tabular-nums ${c.evAdoptionRate === bestValues['evAdoptionRate'] ? 'text-emerald-700' : 'text-gray-900'}`}>
                      {c.evAdoptionRate}%
                    </div>
                    <div className="text-[9px] text-gray-400">EV %</div>
                  </div>
                  <div>
                    <div className={`text-xs font-semibold tabular-nums ${c.totalEvs === bestValues['totalEvs'] ? 'text-emerald-700' : 'text-gray-900'}`}>
                      {formatNum(c.totalEvs)}
                    </div>
                    <div className="text-[9px] text-gray-400">EVs</div>
                  </div>
                  <div>
                    <div className={`text-xs font-semibold tabular-nums ${c.chargersPerMillion === bestValues['chargersPerMillion'] ? 'text-emerald-700' : 'text-gray-900'}`}>
                      {c.chargersPerMillion}
                    </div>
                    <div className="text-[9px] text-gray-400">Chrg/1M</div>
                  </div>
                  <div>
                    <div className={`text-xs font-semibold tabular-nums ${c.evSalesGrowth === bestValues['evSalesGrowth'] ? 'text-emerald-700' : 'text-gray-900'}`}>
                      +{c.evSalesGrowth}%
                    </div>
                    <div className="text-[9px] text-gray-400">Growth</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* ── Desktop Table (md+) ── */}
          <div className="hidden md:block overflow-x-auto overflow-y-visible">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {[
                    { f: 'name' as SortField, label: 'Country' },
                    { f: 'readinessScore' as SortField, label: 'Score' },
                    { f: 'evAdoptionRate' as SortField, label: 'EV %' },
                    { f: 'totalEvs' as SortField, label: 'Total EVs' },
                    { f: 'chargersPerMillion' as SortField, label: 'Chrg/1M' },
                    { f: 'solarCapacityGw' as SortField, label: 'Solar GW' },
                    { f: 'evSalesGrowth' as SortField, label: 'Growth %' },
                    { f: 'policyGrade' as SortField, label: 'Policy' },
                  ].map(col => (
                    <th
                      key={col.f}
                      onClick={() => handleSort(col.f)}
                      className={`px-4 py-2.5 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none ${col.f === 'name' ? 'text-left' : 'text-right'} ${sortField === col.f ? 'text-emerald-700' : 'text-gray-500'}`}
                    >
                      {col.label}
                      {sortField === col.f && <span className="ml-0.5">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedForTable.map(c => (
                  <tr key={c.code} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2.5 font-medium text-gray-900">
                      <span className="mr-2">{c.flag}</span>{c.name}
                    </td>
                    <td className={`text-right px-4 py-2.5 tabular-nums font-semibold ${c.readinessScore === bestValues['readinessScore'] ? 'text-emerald-700 bg-emerald-50' : ''}`}>
                      {c.readinessScore}
                    </td>
                    <td className={`text-right px-4 py-2.5 tabular-nums ${c.evAdoptionRate === bestValues['evAdoptionRate'] ? 'text-emerald-700 bg-emerald-50 font-semibold' : ''}`}>
                      {c.evAdoptionRate}%
                      <TrendBadge current={c.evAdoptionRate} previous={c.prev.evAdoptionRate} />
                    </td>
                    <td className={`text-right px-4 py-2.5 tabular-nums ${c.totalEvs === bestValues['totalEvs'] ? 'text-emerald-700 bg-emerald-50 font-semibold' : ''}`}>
                      {formatNum(c.totalEvs)}
                    </td>
                    <td className={`text-right px-4 py-2.5 tabular-nums ${c.chargersPerMillion === bestValues['chargersPerMillion'] ? 'text-emerald-700 bg-emerald-50 font-semibold' : ''}`}>
                      {c.chargersPerMillion}
                    </td>
                    <td className={`text-right px-4 py-2.5 tabular-nums ${c.solarCapacityGw === bestValues['solarCapacityGw'] ? 'text-emerald-700 bg-emerald-50 font-semibold' : ''}`}>
                      {c.solarCapacityGw}
                    </td>
                    <td className={`text-right px-4 py-2.5 tabular-nums ${c.evSalesGrowth === bestValues['evSalesGrowth'] ? 'text-emerald-700 bg-emerald-50 font-semibold' : ''}`}>
                      +{c.evSalesGrowth}%
                    </td>
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

        {/* ─── 1.6 Side-by-Side Country Comparison ──────────────── */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-10">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Compare Two Countries</h3>
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Country A</label>
              <select
                value={compareA ?? ''}
                onChange={e => setCompareA(e.target.value as CountryCode || null)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value="">Select…</option>
                {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
              </select>
            </div>
            <div className="flex items-end pb-1 text-gray-400 font-bold">vs</div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Country B</label>
              <select
                value={compareB ?? ''}
                onChange={e => setCompareB(e.target.value as CountryCode || null)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value="">Select…</option>
                {COUNTRIES.filter(c => c.code !== compareA).map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
              </select>
            </div>
          </div>

          {comparisonData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Dual radar */}
              <div>
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart data={comparisonData.radar}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name={comparisonData.a.name} dataKey={comparisonData.a.name} stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
                    <Radar name={comparisonData.b.name} dataKey={comparisonData.b.name} stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Delta table + narratives */}
              <div>
                <table className="w-full text-sm mb-4">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-gray-500 font-medium">Metric</th>
                      <th className="text-right py-2 text-emerald-700 font-medium">{comparisonData.a.flag} {comparisonData.a.name}</th>
                      <th className="text-right py-2 text-indigo-700 font-medium">{comparisonData.b.flag} {comparisonData.b.name}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {METRICS.map(m => {
                      const av = comparisonData.a[m.key] as number
                      const bv = comparisonData.b[m.key] as number
                      const aWins = av > bv
                      return (
                        <tr key={m.key} className="border-b border-gray-100">
                          <td className="py-2 text-gray-700">{m.label}</td>
                          <td className={`text-right py-2 tabular-nums ${aWins ? 'font-semibold text-emerald-700' : 'text-gray-500'}`}>
                            {typeof av === 'number' && av >= 1000 ? formatNum(av) : av}{m.unit ? ` ${m.unit}` : ''}
                          </td>
                          <td className={`text-right py-2 tabular-nums ${!aWins ? 'font-semibold text-indigo-700' : 'text-gray-500'}`}>
                            {typeof bv === 'number' && bv >= 1000 ? formatNum(bv) : bv}{m.unit ? ` ${m.unit}` : ''}
                          </td>
                        </tr>
                      )
                    })}
                    <tr className="border-t-2 border-gray-200">
                      <td className="py-2 font-semibold text-gray-900">Readiness Score</td>
                      <td className={`text-right py-2 font-bold tabular-nums ${comparisonData.a.readinessScore >= comparisonData.b.readinessScore ? 'text-emerald-700' : 'text-gray-500'}`}>{comparisonData.a.readinessScore}</td>
                      <td className={`text-right py-2 font-bold tabular-nums ${comparisonData.b.readinessScore >= comparisonData.a.readinessScore ? 'text-indigo-700' : 'text-gray-500'}`}>{comparisonData.b.readinessScore}</td>
                    </tr>
                  </tbody>
                </table>

                {comparisonData.narratives.length > 0 && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-4">
                    <h4 className="text-xs font-bold text-blue-900 mb-2">💡 Comparison Insights</h4>
                    <ul className="space-y-1.5 text-xs text-blue-800">
                      {comparisonData.narratives.map((n, i) => <li key={i}>• {n}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {!comparisonData && (
            <p className="text-sm text-gray-400 text-center py-8">Select two countries above to see a side-by-side comparison.</p>
          )}
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
              <Link href="/ev" className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
                Compare EVs
              </Link>
              <Link href="/calculators" className="inline-flex items-center px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                Calculators
              </Link>
            </div>
          </div>
        </div>

        {/* ─── 2.4 Metric Deep-Dive Modal ───────────────────────── */}
        {metricModal && deepDiveInsight && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setMetricModal(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div
              className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
              onClick={e => e.stopPropagation()}
            >
              {/* Close */}
              <button onClick={() => setMetricModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <h3 className="text-lg font-bold text-gray-900 mb-1">{deepDiveInsight.metricInfo.label}</h3>
              <p className="text-xs text-gray-400 mb-5">{deepDiveInsight.metricInfo.desc}</p>

              {/* Definition, Methodology, Source */}
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Definition</h4>
                  <p className="text-sm text-gray-700">{deepDiveInsight.detail.definition}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">How it&apos;s calculated</h4>
                  <p className="text-sm text-gray-700">{deepDiveInsight.detail.methodology}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Data source</h4>
                  <p className="text-sm text-gray-500">{deepDiveInsight.detail.source}</p>
                </div>
              </div>

              {/* All-6-countries bar chart */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">All countries comparison</h4>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={deepDiveInsight.chart.map(c => ({
                    name: `${c.flag} ${c.code}`,
                    value: c[metricModal] as number,
                  }))} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={60} />
                    <Tooltip formatter={(v: number) => `${v >= 1000 ? formatNum(v) : v} ${deepDiveInsight.metricInfo.unit}`} />
                    <Bar dataKey="value" fill="#6366f1" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Historical trend for this metric */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Historical trend (2021–2024)</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={HISTORICAL_YEARS.map((yr, i) => {
                    const point: Record<string, string | number> = { year: yr.toString() }
                    COUNTRIES.forEach(c => { point[c.name] = c.historical[metricModal][i] })
                    return point
                  })}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    {COUNTRIES.map((c, i) => {
                      const colors = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
                      return (
                        <Area
                          key={c.code}
                          type="monotone"
                          dataKey={c.name}
                          stroke={colors[i]}
                          fill={colors[i]}
                          fillOpacity={0.08}
                          strokeWidth={1.5}
                        />
                      )
                    })}
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Auto-generated insight */}
              <div className="bg-indigo-50 border-l-4 border-indigo-400 rounded-r-lg p-4">
                <h4 className="text-xs font-bold text-indigo-900 mb-2">🔍 Key Insights</h4>
                <ul className="space-y-1.5 text-xs text-indigo-800">
                  {deepDiveInsight.lines.map((line, i) => <li key={i}>• {line}</li>)}
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
