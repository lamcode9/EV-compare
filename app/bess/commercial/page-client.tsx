'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import InfoTooltip from '@/components/InfoTooltip'
import type { Country } from '@/types/bess'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts'
import ResponsiveContainer from '@/components/ResponsiveContainer'

// ── Country data ──────────────────────────────────────────────────────

const COUNTRIES: { value: Country; label: string; flag: string }[] = [
  { value: 'MY', label: 'Malaysia', flag: '🇲🇾' },
  { value: 'SG', label: 'Singapore', flag: '🇸🇬' },
  { value: 'ID', label: 'Indonesia', flag: '🇮🇩' },
  { value: 'TH', label: 'Thailand', flag: '🇹🇭' },
  { value: 'VN', label: 'Vietnam', flag: '🇻🇳' },
  { value: 'PH', label: 'Philippines', flag: '🇵🇭' },
]

const CURRENCY: Record<Country, string> = {
  MY: 'RM', SG: 'S$', ID: 'Rp', TH: '฿', VN: '₫', PH: '₱',
}

// Commercial electricity tariff (local currency / kWh, blended C&I rate)
const TARIFF: Record<Country, number> = {
  MY: 0.509, SG: 0.285, ID: 1450, TH: 4.18, VN: 1920, PH: 10.80,
}

// Maximum demand charge (local currency / kW / month)
const DEMAND_CHARGE: Record<Country, number> = {
  MY: 45.10, SG: 12.68, ID: 48000, TH: 220, VN: 62000, PH: 520,
}

// Peak hours
const PEAK_HOURS: Record<Country, string> = {
  MY: '08:00–22:00', SG: '09:00–23:00', ID: '17:00–22:00',
  TH: '09:00–22:00', VN: '09:30–11:30 & 17:00–20:00', PH: '08:00–21:00',
}

// BESS cost per kWh (commercial-grade LFP, installed)
const BESS_COST_PER_KWH: Record<Country, number> = {
  MY: 1200, SG: 900, ID: 3500000, TH: 7200, VN: 5200000, PH: 14000,
}

// Inverter/PCS cost per kW
const PCS_COST_PER_KW: Record<Country, number> = {
  MY: 600, SG: 450, ID: 1800000, TH: 3600, VN: 2600000, PH: 7000,
}

// Annual O&M (% of capex)
const ANNUAL_OM_PCT = 0.015
// Battery degradation
const DEGRADATION_PER_YEAR = 0.02
// System lifespan
const SYSTEM_LIFE = 15
// Charging/discharging efficiency
const ROUND_TRIP_EFF = 0.88

// Use-case presets
type UseCase = 'office' | 'retail' | 'factory' | 'datacentre'

interface UseCasePreset {
  label: string
  icon: string
  peakDemandKw: number
  avgLoadKw: number
  peakHours: number
  description: string
}

const USE_CASE_PRESETS: Record<UseCase, UseCasePreset> = {
  office: {
    label: 'Office',
    icon: '🏢',
    peakDemandKw: 150,
    avgLoadKw: 80,
    peakHours: 8,
    description: 'M–F daytime peaks from HVAC and lighting. Weekend demand drops 60%+.',
  },
  retail: {
    label: 'Retail',
    icon: '🏬',
    peakDemandKw: 200,
    avgLoadKw: 120,
    peakHours: 10,
    description: 'Extended operating hours, heavy cooling loads, consistent 7-day demand.',
  },
  factory: {
    label: 'Factory',
    icon: '🏭',
    peakDemandKw: 500,
    avgLoadKw: 350,
    peakHours: 12,
    description: 'High baseload, motor start-up spikes. Demand charges are typically the biggest line item.',
  },
  datacentre: {
    label: 'Data Centre',
    icon: '🖥️',
    peakDemandKw: 1000,
    avgLoadKw: 850,
    peakHours: 24,
    description: 'Near-flat 24/7 load. UPS replacement and grid backup are primary battery use cases.',
  },
}

// Commercial BESS products for comparison
interface CommercialBESS {
  name: string
  chemistry: string
  capacityKwh: number
  powerKw: number
  cycles: number
  warrantyYears: number
  footprintM2: number
}

const BESS_PRODUCTS: CommercialBESS[] = [
  { name: 'BYD BatteryBox C-Series', chemistry: 'LFP', capacityKwh: 100, powerKw: 50, cycles: 6000, warrantyYears: 10, footprintM2: 1.2 },
  { name: 'Tesla Megapack', chemistry: 'LFP', capacityKwh: 3916, powerKw: 1937, cycles: 7000, warrantyYears: 15, footprintM2: 9.5 },
  { name: 'BYD MC Cube', chemistry: 'LFP', capacityKwh: 372, powerKw: 186, cycles: 6000, warrantyYears: 15, footprintM2: 4.2 },
  { name: 'Sungrow PowerTitan', chemistry: 'LFP', capacityKwh: 2752, powerKw: 1254, cycles: 8000, warrantyYears: 15, footprintM2: 8.0 },
  { name: 'CATL EnerC', chemistry: 'LFP', capacityKwh: 280, powerKw: 125, cycles: 10000, warrantyYears: 15, footprintM2: 2.8 },
  { name: 'Samsung SDI E3', chemistry: 'NMC', capacityKwh: 156, powerKw: 78, cycles: 4000, warrantyYears: 10, footprintM2: 1.5 },
  { name: 'Huawei LUNA Commercial', chemistry: 'LFP', capacityKwh: 200, powerKw: 100, cycles: 6000, warrantyYears: 10, footprintM2: 1.8 },
]

// Case studies
interface CaseStudy {
  title: string
  location: string
  type: string
  systemSize: string
  result: string
  saving: string
}

const CASE_STUDIES: CaseStudy[] = [
  {
    title: 'Shopping Mall Peak Shaving',
    location: 'Bangkok, Thailand',
    type: 'Retail',
    systemSize: '500 kWh / 250 kW',
    result: 'Reduced monthly max demand charge by 35%',
    saving: '฿1.2M/year',
  },
  {
    title: 'Manufacturing Plant Load Shifting',
    location: 'Johor, Malaysia',
    type: 'Factory',
    systemSize: '1 MWh / 500 kW',
    result: 'Avoided RM480K/year in demand surcharges',
    saving: 'RM480K/year',
  },
  {
    title: 'Office Complex Solar + Storage',
    location: 'Singapore',
    type: 'Office',
    systemSize: '200 kWh / 100 kW + 80 kWp solar',
    result: 'Self-consumption rate from 35% to 82%',
    saving: 'S$65K/year',
  },
]

// ── Helpers ───────────────────────────────────────────────────────────

function fmt(n: number, country: Country, digits = 0): string {
  return `${CURRENCY[country]}${n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`
}

function fmtShort(n: number, country: Country): string {
  if (country === 'ID' || country === 'VN') {
    if (Math.abs(n) >= 1e9) return `${CURRENCY[country]}${(n / 1e9).toFixed(1)}B`
    if (Math.abs(n) >= 1e6) return `${CURRENCY[country]}${(n / 1e6).toFixed(1)}M`
    if (Math.abs(n) >= 1e3) return `${CURRENCY[country]}${(n / 1e3).toFixed(0)}K`
  }
  if (Math.abs(n) >= 1e6) return `${CURRENCY[country]}${(n / 1e6).toFixed(1)}M`
  if (Math.abs(n) >= 1e3) return `${CURRENCY[country]}${(n / 1e3).toFixed(1)}K`
  return fmt(n, country)
}

// ── Component ─────────────────────────────────────────────────────────

export default function CommercialBESSClient() {
  const [country, setCountry] = useState<Country>('MY')
  const [useCase, setUseCase] = useState<UseCase>('office')
  const [peakDemandKw, setPeakDemandKw] = useState(150)
  const [targetReductionPct, setTargetReductionPct] = useState(30)
  const [peakDurationHrs, setPeakDurationHrs] = useState(4)

  // Sync presets when use-case changes
  const applyPreset = (uc: UseCase) => {
    setUseCase(uc)
    setPeakDemandKw(USE_CASE_PRESETS[uc].peakDemandKw)
    setPeakDurationHrs(Math.min(USE_CASE_PRESETS[uc].peakHours, 8))
  }

  // ── Calculation ─────────────────────────────────────────────────────
  const results = useMemo(() => {
    const demandCharge = DEMAND_CHARGE[country]
    const tariff = TARIFF[country]
    const bessPerKwh = BESS_COST_PER_KWH[country]
    const pcsPerKw = PCS_COST_PER_KW[country]

    // Shaved demand
    const shavedKw = peakDemandKw * (targetReductionPct / 100)
    const newPeakKw = peakDemandKw - shavedKw

    // Battery sizing
    const requiredKwh = Math.ceil(shavedKw * peakDurationHrs / ROUND_TRIP_EFF)
    const requiredKw = Math.ceil(shavedKw / ROUND_TRIP_EFF)

    // Capex
    const batteryCost = requiredKwh * bessPerKwh
    const pcsCost = requiredKw * pcsPerKw
    const installationPct = 0.12
    const totalCapex = (batteryCost + pcsCost) * (1 + installationPct)

    // Annual savings
    const demandSavings = shavedKw * demandCharge * 12
    // Energy arbitrage (charge off-peak, discharge peak — ~15% tariff spread)
    const arbitrageSpread = 0.15
    const dailyArbitrageKwh = requiredKwh * 0.6 // 60% of capacity used for arbitrage
    const arbitrageSavings = dailyArbitrageKwh * tariff * arbitrageSpread * 365

    const totalAnnualSavings = demandSavings + arbitrageSavings
    const annualOm = totalCapex * ANNUAL_OM_PCT

    // Year-by-year
    let cumCashflow = -totalCapex
    let paybackYear: number | null = null
    const yearlyData: { year: string; savings: number; cumulative: number }[] = []
    let totalSavings = 0

    for (let y = 1; y <= SYSTEM_LIFE; y++) {
      const degradation = Math.pow(1 - DEGRADATION_PER_YEAR, y - 1)
      const yearlySavings = totalAnnualSavings * degradation
      const netCashflow = yearlySavings - annualOm
      cumCashflow += netCashflow
      totalSavings += netCashflow

      if (!paybackYear && cumCashflow >= 0) paybackYear = y

      yearlyData.push({
        year: `Y${y}`,
        savings: Math.round(netCashflow),
        cumulative: Math.round(cumCashflow),
      })
    }

    const roi = totalCapex > 0 ? (totalSavings / totalCapex) * 100 : 0

    // Load profile chart (24hr)
    const loadProfile = Array.from({ length: 24 }, (_, h) => {
      const preset = USE_CASE_PRESETS[useCase]
      const baseLoad = preset.avgLoadKw * 0.6
      let load = baseLoad
      // Peak hours simulation
      if (h >= 8 && h <= 17) load = preset.avgLoadKw + (preset.peakDemandKw - preset.avgLoadKw) * Math.sin(((h - 8) / 9) * Math.PI)
      if (h >= 18 && h <= 21) load = preset.avgLoadKw * 0.8
      
      const batteryDischarge = load > newPeakKw ? Math.min(load - newPeakKw, shavedKw) : 0
      const gridLoad = load - batteryDischarge

      return {
        hour: `${h.toString().padStart(2, '0')}:00`,
        'Original load': Math.round(load),
        'With BESS': Math.round(gridLoad),
        'Battery discharge': Math.round(batteryDischarge),
      }
    })

    return {
      shavedKw: Math.round(shavedKw),
      newPeakKw: Math.round(newPeakKw),
      requiredKwh,
      requiredKw,
      totalCapex: Math.round(totalCapex),
      demandSavingsAnnual: Math.round(demandSavings),
      arbitrageSavingsAnnual: Math.round(arbitrageSavings),
      totalAnnualSavings: Math.round(totalAnnualSavings),
      annualOm: Math.round(annualOm),
      paybackYear,
      roi: Math.round(roi),
      totalSavings15: Math.round(totalSavings),
      yearlyData,
      loadProfile,
    }
  }, [country, useCase, peakDemandKw, targetReductionPct, peakDurationHrs])

  return (
    <main className="min-h-screen pt-12 md:pt-14">
      <section className="container mx-auto px-4 pt-12 pb-16 max-w-7xl">
        {/* Header */}
        <div className="max-w-2xl mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Commercial BESS <InfoTooltip content="BESS = Battery Energy Storage System. A commercial BESS is a large battery (100 kWh to several MWh) installed at a business to reduce electricity costs by shaving peak demand, shifting energy to cheaper off-peak hours, and providing backup power." />
          </h1>
          <p className="mt-3 text-lg text-gray-600 leading-relaxed">
            Size a commercial battery system for peak shaving, demand charge reduction, and energy arbitrage — with real tariffs across Southeast Asia.
          </p>
        </div>

        {/* Use-case selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {(Object.entries(USE_CASE_PRESETS) as [UseCase, UseCasePreset][]).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              className={`text-left p-4 rounded-xl border transition-all ${
                useCase === key
                  ? 'bg-emerald-50 border-emerald-300 shadow-sm'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">{preset.icon}</div>
              <div className="text-sm font-semibold text-gray-900">{preset.label}</div>
              <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{preset.description}</div>
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value as Country)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.flag} {c.label}</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">Peak hours: {PEAK_HOURS[country]}</p>
            </div>

            {/* Peak demand */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Current peak demand <InfoTooltip content="The highest power draw (in kW) your building records in any 15-30 minute interval during a billing period. Utilities charge extra for high peak demand because it forces them to keep expensive 'peaker' generators on standby. Reducing your peak can cut this charge significantly." /></label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={50}
                  max={2000}
                  step={25}
                  value={peakDemandKw}
                  onChange={(e) => setPeakDemandKw(Number(e.target.value))}
                  className="flex-1 accent-emerald-600"
                />
                <span className="text-sm font-medium text-gray-900 w-16 text-right">{peakDemandKw} kW</span>
              </div>
            </div>

            {/* Target reduction */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Target peak reduction <InfoTooltip content="How much of your peak demand you want the battery to 'shave off'. A 30% reduction means if your peak is 150 kW, the battery absorbs 45 kW during peaks so the grid only sees 105 kW. Higher reduction = bigger battery needed." /></label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={10}
                  max={60}
                  step={5}
                  value={targetReductionPct}
                  onChange={(e) => setTargetReductionPct(Number(e.target.value))}
                  className="flex-1 accent-emerald-600"
                />
                <span className="text-sm font-medium text-gray-900 w-10 text-right">{targetReductionPct}%</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Shave {results.shavedKw} kW → {results.newPeakKw} kW</p>
            </div>

            {/* Peak duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Peak discharge duration <InfoTooltip content="How many hours the battery needs to sustain peak shaving each day. Longer duration = larger battery capacity needed. Most commercial peaks last 2-4 hours; factories may need 6-8 hours." /></label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={1}
                  value={peakDurationHrs}
                  onChange={(e) => setPeakDurationHrs(Number(e.target.value))}
                  className="flex-1 accent-emerald-600"
                />
                <span className="text-sm font-medium text-gray-900 w-12 text-right">{peakDurationHrs}h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Battery size <InfoTooltip content="The recommended battery capacity (kWh) and power converter size (kW PCS). Sized based on: shaved kW × peak hours ÷ round-trip efficiency (88%). The PCS (Power Conversion System) converts between AC grid power and DC battery storage." /></div>
            <div className="text-xl font-bold text-gray-900">{results.requiredKwh} kWh</div>
            <div className="text-xs text-gray-500 mt-0.5">{results.requiredKw} kW PCS</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Total capex <InfoTooltip content="Total upfront cost: battery cells + PCS (power converter) + 12% installation labour/wiring/commissioning. This is the all-in investment before any savings begin." /></div>
            <div className="text-xl font-bold text-gray-900">{fmtShort(results.totalCapex, country)}</div>
            <div className="text-xs text-gray-500 mt-0.5">Battery + PCS + install</div>
          </div>
          <div className={`rounded-xl p-5 border ${
            results.paybackYear && results.paybackYear <= 6
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-white border-gray-200'
          }`}>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Payback <InfoTooltip content="Years until cumulative savings cover the capex investment, accounting for 2% annual battery degradation and 1.5% annual O&M costs. After payback, the system generates net positive returns for its remaining life." /></div>
            <div className="text-xl font-bold text-gray-900">
              {results.paybackYear ? `${results.paybackYear} years` : '15+ years'}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">{results.roi}% ROI over {SYSTEM_LIFE}yr</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Annual savings</div>
            <div className="text-xl font-bold text-emerald-700">{fmtShort(results.totalAnnualSavings, country)}</div>
            <div className="text-xs text-gray-500 mt-0.5">net of {fmtShort(results.annualOm, country)} O&M</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Load profile */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Daily load profile: {USE_CASE_PRESETS[useCase].label}</h3>
            <p className="text-xs text-gray-500 mb-4">Shows how BESS clips peak demand from the grid perspective</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={results.loadProfile} barGap={0}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="hour" tick={{ fontSize: 9 }} interval={3} />
                <YAxis tick={{ fontSize: 10 }} unit=" kW" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="With BESS" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Battery discharge" stackId="a" fill="#6366f1" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cumulative cashflow */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Cumulative cashflow</h3>
            <p className="text-xs text-gray-500 mb-4">{SYSTEM_LIFE}-year projection including O&M and degradation</p>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={results.yearlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="year" tick={{ fontSize: 10 }} interval={2} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => fmtShort(v, country)} />
                <Tooltip formatter={(v: number) => fmt(v, country)} />
                <Line type="monotone" dataKey="cumulative" stroke="#10b981" strokeWidth={2} dot={false} name="Net cashflow" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Savings breakdown */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Annual savings breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Demand charge reduction <InfoTooltip content="Monthly savings from reducing your recorded peak demand. Formula: shaved kW × demand charge rate × 12 months. This is typically the largest revenue stream for commercial BESS (40-60% of total savings)." /></div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{fmtShort(results.demandSavingsAnnual, country)}</div>
              <div className="text-xs text-gray-500 mt-0.5">
                {results.shavedKw} kW × {fmt(DEMAND_CHARGE[country], country)} × 12 months
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Energy arbitrage <InfoTooltip content="Savings from charging the battery during cheap off-peak hours and discharging during expensive peak hours. We assume a 15% tariff spread (peak vs off-peak) and 60% of battery capacity available for daily arbitrage." /></div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{fmtShort(results.arbitrageSavingsAnnual, country)}</div>
              <div className="text-xs text-gray-500 mt-0.5">Charge off-peak, discharge at peak tariff</div>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total over {SYSTEM_LIFE} years</div>
              <div className="text-2xl font-bold text-emerald-700 mt-1">{fmtShort(results.totalSavings15, country)}</div>
              <div className="text-xs text-gray-500 mt-0.5">Net of O&M and degradation</div>
            </div>
          </div>
        </div>

        {/* Revenue stacking explainer */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue stacking: why commercial BESS beats single-use <InfoTooltip content="Revenue stacking means using the same battery for multiple purposes (peak shaving + arbitrage + backup + grid services). Each additional use case adds incremental value without needing a bigger battery, improving the overall ROI by 30-60%." /></h3>
          <p className="text-sm text-gray-600 mb-6">
            A commercial battery isn&apos;t just peak shaving. By stacking multiple revenue streams, the same battery can earn 30–60% more than peak shaving alone.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Peak shaving', desc: 'Reduce max demand charges by 20–40%. The primary revenue stream in most SEA markets.', pct: '40–60%' },
              { title: 'Energy arbitrage', desc: 'Charge at off-peak rates (typically 30–50% cheaper), discharge during peak periods.', pct: '15–25%' },
              { title: 'Backup power', desc: 'Replace or supplement diesel generators. Avoids fuel cost + maintenance + noise.', pct: '10–15%' },
              { title: 'Grid services', desc: 'Frequency regulation and demand response payments (SG, TH markets most active).', pct: '5–15%' },
            ].map((s) => (
              <div key={s.title} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-900">{s.title}</h4>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">{s.pct}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* BESS product comparison */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Commercial BESS products (100+ kWh)</h3>
            <p className="text-xs text-gray-500 mt-0.5">Key specifications for the most widely deployed commercial battery systems in Southeast Asia</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-2.5 font-medium text-gray-500">Product</th>
                  <th className="text-center px-4 py-2.5 font-medium text-gray-500">Chemistry</th>
                  <th className="text-right px-4 py-2.5 font-medium text-gray-500">Capacity</th>
                  <th className="text-right px-4 py-2.5 font-medium text-gray-500">Power</th>
                  <th className="text-right px-4 py-2.5 font-medium text-gray-500">Cycles</th>
                  <th className="text-right px-4 py-2.5 font-medium text-gray-500">Warranty</th>
                  <th className="text-right px-4 py-2.5 font-medium text-gray-500">Footprint</th>
                </tr>
              </thead>
              <tbody>
                {BESS_PRODUCTS.map((p) => (
                  <tr key={p.name} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-medium text-gray-900">{p.name}</td>
                    <td className="text-center px-4 py-2.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        p.chemistry === 'LFP' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                      }`}>{p.chemistry}</span>
                    </td>
                    <td className="text-right px-4 py-2.5 tabular-nums">{p.capacityKwh.toLocaleString()} kWh</td>
                    <td className="text-right px-4 py-2.5 tabular-nums">{p.powerKw.toLocaleString()} kW</td>
                    <td className="text-right px-4 py-2.5 tabular-nums">{p.cycles.toLocaleString()}</td>
                    <td className="text-right px-4 py-2.5">{p.warrantyYears} yr</td>
                    <td className="text-right px-4 py-2.5">{p.footprintM2} m²</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Case studies */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Case studies</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CASE_STUDIES.map((cs) => (
              <div key={cs.title} className="bg-white border border-gray-200 rounded-xl p-5">
                <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded-full px-2.5 py-0.5">
                  {cs.type}
                </span>
                <h4 className="text-sm font-semibold text-gray-900 mt-3 mb-1">{cs.title}</h4>
                <p className="text-xs text-gray-500 mb-3">{cs.location}</p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">System</span>
                    <span className="font-medium text-gray-700">{cs.systemSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Result</span>
                    <span className="font-medium text-gray-700">{cs.result}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-gray-100">
                    <span className="text-gray-500">Annual saving</span>
                    <span className="font-bold text-emerald-700">{cs.saving}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assumptions + CTA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Key assumptions <InfoTooltip content="Commercial/industrial tariff rates (higher than residential). Demand charge = extra fee per kW of your peak load. Round-trip efficiency: 88% of energy stored is recovered (12% lost as heat). Battery degrades 2%/year." /></h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs text-gray-500">
              <div>C&I tariff: {fmt(TARIFF[country], country, 3)}/kWh</div>
              <div>Demand charge: {fmt(DEMAND_CHARGE[country], country)}/kW/mo</div>
              <div>BESS cost: {fmt(BESS_COST_PER_KWH[country], country)}/kWh</div>
              <div>Round-trip efficiency: {ROUND_TRIP_EFF * 100}%</div>
              <div>Degradation: {DEGRADATION_PER_YEAR * 100}%/year</div>
              <div>Annual O&M: {ANNUAL_OM_PCT * 100}% of capex</div>
              <div>System life: {SYSTEM_LIFE} years</div>
              <div>Peak hours: {PEAK_HOURS[country]}</div>
            </div>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-emerald-900 mb-2">Looking for home battery?</h3>
              <p className="text-sm text-emerald-800">
                For residential solar + battery sizing, use our dedicated home calculators.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link href="/bess/home" className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
                Home BESS Calculator
              </Link>
              <Link href="/bess/shared-residential" className="inline-flex items-center px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                Shared Residential
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
