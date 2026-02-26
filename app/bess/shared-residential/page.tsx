'use client'

import { useEffect, useMemo, useState, useCallback, memo } from 'react'
import { Country, BESS } from '@/types/bess'
import { useVehicleStore } from '@/store/VehicleStore'
import { COUNTRY_NAMES, CURRENCY_SYMBOLS } from '@/lib/constants'
import CountrySelector from '@/components/CountrySelector'
import InfoTooltip from '@/components/InfoTooltip'
import { loadBESSData } from '@/lib/data-fetchers/bess-data'
import {
  SOLAR_YIELD_PER_KW,
  SOLAR_COST_PER_KW,
  ROOF_QUALITY_MULTIPLIERS,
  ELECTRICITY_TARIFFS,
  CO2_EMISSIONS_FACTOR,
} from '@/lib/utils/zero-bill-calculator'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts'
import ResponsiveContainer from '@/components/ResponsiveContainer'

type Mode = 'retrofit' | 'new'

const COUNTRY_DEFAULT_SALE_PRICE: Record<Country, number> = {
  MY: 680_000,
  SG: 1_100_000,
  ID: 3_200_000_000,
  TH: 8_000_000,
  VN: 5_500_000_000,
  PH: 9_000_000,
}

const COMMON_AREA_PRESETS = {
  Low: 80,
  Average: 140,
  High: 220,
}

const EXISTING_SOLAR_PRESETS = {
  None: 0,
  Small: 15,
  Large: 40,
}

const SOLAR_DENSITY_KW_PER_M2 = 0.17 // conservative, includes walkways + tilt spacing

const SMALL_CARD_SHADOW = 'shadow-[0_12px_45px_rgba(0,0,0,0.05)]'

function formatWithSymbol(amount: number, country: Country, digits: number = 0) {
  return `${CURRENCY_SYMBOLS[country]}${amount.toLocaleString('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })}`
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function getBulkDiscount(units: number) {
  if (units >= 300) return 0.25
  if (units >= 200) return 0.22
  if (units >= 120) return 0.18
  return 0.15
}

function InfoChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full">
      {label}
    </span>
  )
}

const MiniInfo = ({ title, copy }: { title: string; copy: string }) => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-start gap-2 text-xs text-gray-600">
    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-[10px] font-bold mt-0.5">
      i
    </div>
    <div className="space-y-0.5">
      <div className="font-semibold text-gray-800">{title}</div>
      <div className="leading-relaxed">{copy}</div>
    </div>
  </div>
)

const SnapshotCharts = memo(function SnapshotCharts({
  coverage,
  monthlySavings,
  baselineBill,
  paybackYears,
  co2Avoided,
  country,
}: {
  coverage: number
  monthlySavings: number
  baselineBill: number
  paybackYears: number
  co2Avoided: number
  country: Country
}) {
  const savingsData = [
    { name: 'Without', value: baselineBill },
    { name: 'With BESS', value: Math.max(0, baselineBill - monthlySavings) },
  ]

  const coverageData = [
    { name: 'Solar + Battery', value: Math.round(coverage * 100) },
    { name: 'Grid', value: Math.max(0, 100 - Math.round(coverage * 100)) },
  ]

  const paybackSeries = new Array(6).fill(0).map((_, idx) => {
    const year = idx * (Math.max(paybackYears, 1) / 5)
    const recovered = Math.min(100, (year / Math.max(paybackYears, 0.1)) * 100)
    return { year: `Y${idx}`, recovered }
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className={`bg-white border border-gray-200 rounded-xl p-4 ${SMALL_CARD_SHADOW}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Monthly bill</div>
            <div className="text-sm text-gray-600">Per participating household</div>
          </div>
          <InfoChip label="Live" />
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={savingsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => formatWithSymbol(v, country, 0)} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={`bg-white border border-gray-200 rounded-xl p-4 ${SMALL_CARD_SHADOW}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Energy mix</div>
            <div className="text-sm text-gray-600">Solar + battery coverage</div>
          </div>
          <InfoChip label={`${Math.round(coverage * 100)}%`} />
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={coverageData}
              innerRadius={48}
              outerRadius={70}
              paddingAngle={4}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {coverageData.map((_, idx) => (
                <Cell key={idx} fill={idx === 0 ? '#059669' : '#e5e7eb'} />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => `${v}%`} />
            <Legend verticalAlign="bottom" height={24} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className={`bg-white border border-gray-200 rounded-xl p-4 ${SMALL_CARD_SHADOW}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Payback glide</div>
            <div className="text-sm text-gray-600">Progress to breakeven</div>
          </div>
          <InfoChip label={`${paybackYears.toFixed(1)} yrs`} />
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={paybackSeries}>
            <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
            <Tooltip formatter={(v: number) => `${v.toFixed(0)}% recovered`} />
            <Line type="monotone" dataKey="recovered" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={`bg-white border border-gray-200 rounded-xl p-4 ${SMALL_CARD_SHADOW}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">CO₂ avoided</div>
            <div className="text-sm text-gray-600">Tonnes per year</div>
          </div>
          <InfoChip label={`${(co2Avoided / 1000).toFixed(1)} t`} />
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={[{ name: 'CO₂ avoided', value: co2Avoided / 1000 }]}>
            <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => `${v.toFixed(1)} t`} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#0ea5e9" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
})

const BatteryScatter = memo(function BatteryScatter({
  bessList,
  country,
  monthlySavingsPerHousehold,
}: {
  bessList: BESS[]
  country: Country
  monthlySavingsPerHousehold: number
}) {
  const data = useMemo(
    () =>
      bessList
        .filter((b) => b.isAvailable)
        .map((b) => {
          const price = b.priceLocalCurrency[country] || 0
          const cycles = b.warrantyCycles || 5000
          const paybackYears =
            monthlySavingsPerHousehold > 0 ? price / (monthlySavingsPerHousehold * 12) : 0
          const costPerKwhCycle =
            b.usableCapacityKwh > 0 && cycles > 0 ? price / (b.usableCapacityKwh * cycles) : 0
          return {
            name: b.name,
            price,
            cycles,
            paybackYears,
            costPerKwhCycle,
          }
        }),
    [bessList, country, monthlySavingsPerHousehold]
  )

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 mt-8">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm font-semibold text-gray-900">Battery payback vs cycles</div>
          <div className="text-xs text-gray-500">
            Hover to compare warranty cycles vs payback using current savings
          </div>
        </div>
        <InfoChip label="Interactive" />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid stroke="#f3f4f6" />
          <XAxis type="number" dataKey="cycles" name="Warranty cycles" tickFormatter={(v) => `${v}`} />
          <YAxis
            type="number"
            dataKey="paybackYears"
            name="Payback"
            tickFormatter={(v) => `${v.toFixed(1)}y`}
            domain={[0, 'dataMax']}
          />
          <ZAxis type="number" range={[60, 180]} dataKey="costPerKwhCycle" name="Cost per kWh-cycle" />
          <Tooltip
            cursor={{ strokeDasharray: '4 4' }}
            formatter={(value: number, name: string) => {
              if (name === 'paybackYears') return [`${value.toFixed(1)} years`, 'Payback']
              if (name === 'cycles') return [value, 'Warranty cycles']
              if (name === 'costPerKwhCycle') return [formatWithSymbol(value, country, 2), 'Cost per kWh-cycle']
              return value
            }}
            labelFormatter={() => ''}
            content={(props: any) => {
              const { active, payload } = props || {}
              if (!active || !payload?.length) return null
              const item = payload[0].payload
              return (
                <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg text-xs space-y-1">
                  <div className="font-semibold text-gray-900">{item.name}</div>
                  <div className="text-gray-700">Payback: {item.paybackYears.toFixed(1)} years</div>
                  <div className="text-gray-700">Warranty cycles: {item.cycles.toLocaleString()}</div>
                  <div className="text-gray-700">
                    Cost per kWh-cycle: {formatWithSymbol(item.costPerKwhCycle, country, 2)}
                  </div>
                </div>
              )
            }}
          />
          <Scatter data={data} fill="#059669" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
})

function SharedResidentialContent() {
  const { selectedCountry, setSelectedCountry } = useVehicleStore()
  const country = (selectedCountry || 'MY') as Country
  const [mode, setMode] = useState<Mode>('retrofit')
  const [bessList, setBessList] = useState<BESS[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [optimizeTarget, setOptimizeTarget] = useState<'savings' | 'solar'>('savings')

  // Retrofit inputs
  const [retroUnits, setRetroUnits] = useState(80)
  const [participation, setParticipation] = useState(80)
  const [retroRoofArea, setRetroRoofArea] = useState(1200)
  const [retroRoofQuality, setRetroRoofQuality] = useState<'Ideal' | 'Average' | 'Shaded'>('Ideal')
  const [retroCommonPreset, setRetroCommonPreset] = useState<'Low' | 'Average' | 'High'>('Average')
  const [retroCommonManual, setRetroCommonManual] = useState<number | null>(null)
  const [existingSolar, setExistingSolar] = useState<'None' | 'Small' | 'Large'>('None')
  const [retroBatteryId, setRetroBatteryId] = useState<string>('')
  const [retroBatteryQty, setRetroBatteryQty] = useState(6)

  // New development inputs
  const [newUnits, setNewUnits] = useState(150)
  const [unitPrice, setUnitPrice] = useState<number>(COUNTRY_DEFAULT_SALE_PRICE[country])
  const [newRoofArea, setNewRoofArea] = useState(2400)
  const [newRoofQuality, setNewRoofQuality] = useState<'Ideal' | 'Average' | 'Shaded'>('Average')
  const [newCommonPreset, setNewCommonPreset] = useState<'Low' | 'Average' | 'High'>('Average')
  const [newCommonManual, setNewCommonManual] = useState<number | null>(null)
  const [newBatteryId, setNewBatteryId] = useState<string>('')
  const [newBatteryQty, setNewBatteryQty] = useState(10)

  // Country sync
  useEffect(() => {
    if (!selectedCountry) setSelectedCountry('MY')
  }, [selectedCountry, setSelectedCountry])

  useEffect(() => {
    setIsLoading(true)
    try {
      setBessList(loadBESSData(country))
      setUnitPrice(COUNTRY_DEFAULT_SALE_PRICE[country])
    } finally {
      setIsLoading(false)
    }
  }, [country])

  const roofMultiplier = useCallback((quality: 'Ideal' | 'Average' | 'Shaded') => ROOF_QUALITY_MULTIPLIERS[quality], [])

  const getBatteryModel = useCallback(
    (id: string) => bessList.find((b) => b.id === id) || null,
    [bessList]
  )

  const getCommonLoad = useCallback(
    (preset: 'Low' | 'Average' | 'High', manual: number | null) => {
      if (manual && manual > 0) return manual
      return COMMON_AREA_PRESETS[preset]
    },
    []
  )

  const householdDailyLoad = useMemo(() => {
    // use 2025 day+night baseline per country
    const perCountry = {
      MY: 18,
      SG: 12,
      ID: 16,
      TH: 22,
      VN: 15,
      PH: 20,
    }
    return perCountry[country]
  }, [country])

  const retrofitOutputs = useMemo(() => {
    const participatingUnits = Math.max(1, Math.round((retroUnits * participation) / 100))
    const commonLoad = getCommonLoad(retroCommonPreset, retroCommonManual)
    const buildingDailyLoad = householdDailyLoad * participatingUnits + commonLoad
    const roofCapacityKw = Math.round(retroRoofArea * SOLAR_DENSITY_KW_PER_M2)
    const existingSolarKw = EXISTING_SOLAR_PRESETS[existingSolar]
    const baseTargetKw =
      optimizeTarget === 'solar'
        ? roofCapacityKw
        : Math.min(
            roofCapacityKw,
            (buildingDailyLoad / (SOLAR_YIELD_PER_KW[country] * roofMultiplier(retroRoofQuality))) * 1.05
          )
    const solarKwToAdd = Math.max(0, Math.round(baseTargetKw - existingSolarKw))
    const totalSolarKwForYield = solarKwToAdd + existingSolarKw
    const dailySolarGen =
      totalSolarKwForYield * SOLAR_YIELD_PER_KW[country] * roofMultiplier(retroRoofQuality)

    const selectedBattery = getBatteryModel(retroBatteryId)
    const batteryCapacity = selectedBattery ? selectedBattery.usableCapacityKwh * retroBatteryQty : 0
    const batteryCost = selectedBattery ? (selectedBattery.priceLocalCurrency[country] || 0) * retroBatteryQty : 0

    const solarCost = solarKwToAdd * SOLAR_COST_PER_KW[country]
    const discount = getBulkDiscount(retroUnits)
    const totalSystemCost = (solarCost + batteryCost) * (1 - discount)
    const costPerHousehold = totalSystemCost / participatingUnits

    const coverage = buildingDailyLoad > 0 ? clampNumber((dailySolarGen + batteryCapacity * 0.85) / buildingDailyLoad, 0, 1) : 0
    const monthlySavingsPerHousehold = householdDailyLoad * 30 * ELECTRICITY_TARIFFS[country] * coverage
    const paybackYears =
      monthlySavingsPerHousehold > 0 ? costPerHousehold / (monthlySavingsPerHousehold * 12) : 0
    const blackoutHours = buildingDailyLoad > 0 ? batteryCapacity / (buildingDailyLoad / 24) : 0
    const co2Avoided = dailySolarGen * 365 * CO2_EMISSIONS_FACTOR[country]
    const zeroBillDays = Math.round(coverage * 365 * 0.9)

    return {
      participatingUnits,
      commonLoad,
      buildingDailyLoad,
      solarKwToAdd,
      totalSolarKwForYield,
      dailySolarGen,
      batteryCapacity,
      totalSystemCost,
      costPerHousehold,
      monthlySavingsPerHousehold,
      paybackYears,
      blackoutHours,
      co2Avoided,
      zeroBillDays,
      coverage,
      recommendation: `Optimal: ${Math.round(totalSolarKwForYield)} kW solar + ${retroBatteryQty} × ${
        selectedBattery?.name || 'battery'
      }`,
      discount,
    }
  }, [
    country,
    existingSolar,
    getBatteryModel,
    getCommonLoad,
    householdDailyLoad,
    optimizeTarget,
    participation,
    retroBatteryId,
    retroBatteryQty,
    retroCommonManual,
    retroCommonPreset,
    retroRoofArea,
    retroRoofQuality,
    retroUnits,
    roofMultiplier,
  ])

  const newDevOutputs = useMemo(() => {
    const commonLoad = getCommonLoad(newCommonPreset, newCommonManual)
    const buildingDailyLoad = householdDailyLoad * newUnits + commonLoad
    const roofCapacityKw = Math.round(newRoofArea * SOLAR_DENSITY_KW_PER_M2)
    const baseTargetKw =
      optimizeTarget === 'solar'
        ? roofCapacityKw
        : Math.min(
            roofCapacityKw,
            (buildingDailyLoad / (SOLAR_YIELD_PER_KW[country] * roofMultiplier(newRoofQuality))) * 1.05
          )
    const solarKw = Math.max(20, Math.round(baseTargetKw))
    const dailySolarGen =
      solarKw * SOLAR_YIELD_PER_KW[country] * roofMultiplier(newRoofQuality)

    const selectedBattery = getBatteryModel(newBatteryId)
    const batteryCapacity = selectedBattery ? selectedBattery.usableCapacityKwh * newBatteryQty : 0
    const batteryCost = selectedBattery ? (selectedBattery.priceLocalCurrency[country] || 0) * newBatteryQty : 0

    const solarCost = solarKw * SOLAR_COST_PER_KW[country]
    const discount = getBulkDiscount(newUnits)
    const totalSystemCost = (solarCost + batteryCost) * (1 - discount)
    const addedCostPerUnit = totalSystemCost / newUnits

    const coverage =
      buildingDailyLoad > 0 ? clampNumber((dailySolarGen + batteryCapacity * 0.85) / buildingDailyLoad, 0, 1) : 0
    const monthlySavings = householdDailyLoad * 30 * ELECTRICITY_TARIFFS[country] * coverage
    const twentyYearSavings = monthlySavings * 12 * 20
    const paybackYears = monthlySavings > 0 ? addedCostPerUnit / (monthlySavings * 12) : 0

    const blackoutHours = buildingDailyLoad > 0 ? batteryCapacity / (buildingDailyLoad / 24) : 0
    const co2Avoided = dailySolarGen * 365 * CO2_EMISSIONS_FACTOR[country]
    const zeroBillDays = Math.round(coverage * 365 * 0.9)

    return {
      commonLoad,
      buildingDailyLoad,
      solarKw,
      dailySolarGen,
      batteryCapacity,
      totalSystemCost,
      addedCostPerUnit,
      priceIncreasePct: unitPrice > 0 ? (addedCostPerUnit / unitPrice) * 100 : 0,
      savings20Y: twentyYearSavings,
      savingsPctOfPrice: unitPrice > 0 ? (twentyYearSavings / unitPrice) * 100 : 0,
      paybackYears,
      monthlySavings,
      blackoutHours,
      co2Avoided,
      zeroBillDays,
      coverage,
      recommendation: `Optimal: ${Math.round(solarKw)} kW solar + ${newBatteryQty} × ${
        selectedBattery?.name || 'battery'
      }`,
      discount,
    }
  }, [
    country,
    getBatteryModel,
    getCommonLoad,
    householdDailyLoad,
    newBatteryId,
    newBatteryQty,
    newCommonManual,
    newCommonPreset,
    newRoofArea,
    newRoofQuality,
    newUnits,
    optimizeTarget,
    roofMultiplier,
    unitPrice,
  ])

  const activeOutputs = mode === 'retrofit' ? retrofitOutputs : newDevOutputs

  const loading = isLoading && bessList.length === 0

  const handleOptimize = useCallback(() => {
    setOptimizeTarget((prev) => (prev === 'savings' ? 'solar' : 'savings'))
  }, [])

  const renderBatterySelect = (value: string, onChange: (id: string) => void) => (
    <select
      className="w-full text-sm px-3 py-2 pr-8 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select battery model</option>
      {bessList.map((b) => (
        <option key={b.id} value={b.id}>
          {b.name}
        </option>
      ))}
    </select>
  )

  const renderRoofQualityButtons = (
    value: 'Ideal' | 'Average' | 'Shaded',
    onChange: (v: 'Ideal' | 'Average' | 'Shaded') => void
  ) => (
    <div className="grid grid-cols-3 gap-2">
      {(['Ideal', 'Average', 'Shaded'] as const).map((quality) => (
        <button
          key={quality}
          onClick={() => onChange(quality)}
          className={`px-3 py-2 rounded-lg border text-sm font-semibold transition-all ${
            value === quality
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400 hover:bg-emerald-50'
          }`}
        >
          {quality}
          <div className="text-xs opacity-80">
            {quality === 'Ideal' ? '100%' : quality === 'Average' ? '90%' : '75%'}
          </div>
        </button>
      ))}
    </div>
  )

  const renderCommonLoad = (
    preset: 'Low' | 'Average' | 'High',
    manual: number | null,
    setPreset: (v: 'Low' | 'Average' | 'High') => void,
    setManual: (v: number | null) => void
  ) => (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {(['Low', 'Average', 'High'] as const).map((level) => (
          <button
            key={level}
            onClick={() => setPreset(level)}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
              preset === level
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400 hover:bg-emerald-50'
            }`}
          >
            <div className="font-semibold">{level}</div>
            <div className="text-xs opacity-80">{COMMON_AREA_PRESETS[level]} kWh/day</div>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={manual ?? ''}
          onChange={(e) => setManual(e.target.value ? parseFloat(e.target.value) : null)}
          placeholder="Manual kWh/day"
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
        />
        <span className="text-xs text-gray-500">Optional</span>
      </div>
    </div>
  )

  const renderInputs = () => {
    const isRetrofit = mode === 'retrofit'
    const outputsForSection = isRetrofit ? retrofitOutputs : newDevOutputs
    const selectedBattery = getBatteryModel(isRetrofit ? retroBatteryId : newBatteryId)
    const batteryQty = isRetrofit ? retroBatteryQty : newBatteryQty
    const totalBatteryCapacity = selectedBattery ? selectedBattery.usableCapacityKwh * batteryQty : 0
    const solarPlannedKw = isRetrofit ? retrofitOutputs.totalSolarKwForYield : newDevOutputs.solarKw
    const roofAreaDisplay = isRetrofit ? `${retroRoofArea} m²` : `${newRoofArea} m²`

    return (
      <div className="space-y-6">
        {/* Power requirements */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-5 shadow-sm">
          <div>
            <div className="text-sm font-semibold text-gray-900">Power requirements</div>
            <p className="text-xs text-gray-500">
              {isRetrofit ? 'Participation, roof, and common loads' : 'Units, pricing, roof, and common loads'}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-900">Residential units</div>
                <InfoChip label={`${isRetrofit ? retroUnits : newUnits} units`} />
              </div>
              <input
                type="range"
                min={10}
                max={500}
                step={10}
                value={isRetrofit ? retroUnits : newUnits}
                onChange={(e) => (isRetrofit ? setRetroUnits(parseInt(e.target.value)) : setNewUnits(parseInt(e.target.value)))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>10</span>
                <span>500</span>
              </div>
            </div>

            {isRetrofit ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-900">Participation rate <InfoTooltip content="Percentage of households in the building that opt in to share the solar+battery system cost. Higher participation = lower cost per household. Typical range: 60-90% for retrofits." /></div>
                  <InfoChip label={`${participation}%`} />
                </div>
                <input
                  type="range"
                  min={30}
                  max={100}
                  step={5}
                  value={participation}
                  onChange={(e) => setParticipation(parseInt(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>30%</span>
                  <span>100%</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-900">Avg unit price</div>
                  <InfoChip label={formatWithSymbol(unitPrice, country, 0)} />
                </div>
                <input
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-900">Roof area</div>
                  <div className="text-xs text-gray-500">Solar-ready m²</div>
                </div>
                <InfoChip label={roofAreaDisplay} />
              </div>
              <input
                type="range"
                min={200}
                max={8000}
                step={100}
                value={isRetrofit ? retroRoofArea : newRoofArea}
                onChange={(e) =>
                  isRetrofit ? setRetroRoofArea(parseInt(e.target.value)) : setNewRoofArea(parseInt(e.target.value))
                }
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>200</span>
                <span>8000</span>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-gray-700 mb-2">Roof quality</div>
              {renderRoofQualityButtons(isRetrofit ? retroRoofQuality : newRoofQuality, isRetrofit ? setRetroRoofQuality : setNewRoofQuality)}
            </div>

            {isRetrofit && (
              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-900">Existing solar</div>
                <div className="grid grid-cols-3 gap-2">
                  {(['None', 'Small', 'Large'] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setExistingSolar(opt)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                        existingSolar === opt
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400 hover:bg-emerald-50'
                      }`}
                    >
                      {opt === 'None' ? 'None' : opt === 'Small' ? '<20 kW' : '>20 kW'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="text-sm font-semibold text-gray-900 mb-2">Common area load</div>
              {renderCommonLoad(
                isRetrofit ? retroCommonPreset : newCommonPreset,
                isRetrofit ? retroCommonManual : newCommonManual,
                isRetrofit ? setRetroCommonPreset : setNewCommonPreset,
                isRetrofit ? setRetroCommonManual : setNewCommonManual
              )}
            </div>
          </div>
        </div>

        {/* System setup */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-5 shadow-sm">
          <div>
            <div className="text-sm font-semibold text-gray-900">System setup</div>
            <p className="text-xs text-gray-500">Solar sizing and shared battery bank</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">Planned solar</div>
              <div className="text-base font-semibold text-emerald-700 tabular-nums">
                {Math.round(solarPlannedKw)} kW
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">Battery quantity</div>
              <div className="text-base font-semibold text-emerald-700 tabular-nums">{batteryQty} units</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">Total usable capacity</div>
              <div className="text-base font-semibold text-emerald-700 tabular-nums">
                {totalBatteryCapacity.toFixed(0)} kWh
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-1">Battery model</div>
              {renderBatterySelect(isRetrofit ? retroBatteryId : newBatteryId, isRetrofit ? setRetroBatteryId : setNewBatteryId)}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-1">Quantity</div>
              <input
                type="number"
                min={0}
                max={20}
                value={batteryQty}
                onChange={(e) =>
                  (isRetrofit ? setRetroBatteryQty : setNewBatteryQty)(clampNumber(parseInt(e.target.value) || 0, 0, 20))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderOutputs = () => {
    if (mode === 'retrofit') {
      return (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Total system cost <InfoTooltip content="Full installed cost of solar panels + shared battery bank, after applying the bulk discount. Split among all participating households. Larger buildings get bigger discounts (15-25% off)." /></div>
                  <div className="text-xs text-gray-500">
                    Includes {Math.round(retrofitOutputs.discount * 100)}% bulk discount
                  </div>
                </div>
                <div className="text-2xl font-bold text-emerald-700">
                  {formatWithSymbol(retrofitOutputs.totalSystemCost, country, 0)}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Cost per household <InfoTooltip content="Your share of the total system cost, divided equally among participating units. This is the one-off investment each household pays. With bulk discounts, it's 15-25% cheaper than installing individually." /></div>
                  <div className="text-xs text-gray-500">Participating units</div>
                </div>
                <div className="text-2xl font-bold text-emerald-700">
                  {formatWithSymbol(retrofitOutputs.costPerHousehold, country, 0)}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Monthly savings <InfoTooltip content="Estimated monthly electricity bill reduction per household. Calculated from: daily load × 30 days × local tariff × coverage percentage. Actual savings depend on your usage pattern and solar generation." /></div>
                  <div className="text-xs text-gray-500">Per participating household</div>
                </div>
                <div className="text-2xl font-bold text-emerald-700">
                  {formatWithSymbol(retrofitOutputs.monthlySavingsPerHousehold, country, 0)}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-gray-700">
                <span>Payback</span>
                <span className="font-semibold text-emerald-700">
                  {retrofitOutputs.paybackYears.toFixed(1)} years
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-gray-700">
                <span>Zero-bill days / year</span>
                <span className="font-semibold">{retrofitOutputs.zeroBillDays} days</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Blackout protection <InfoTooltip content="How many hours the shared battery bank can power the entire building during a grid outage, based on average building load (all participating units + common areas). Essential loads only would last ~3× longer." /></div>
                  <div className="text-xs text-gray-500">Whole building runtime</div>
                </div>
                <div className="text-2xl font-bold text-emerald-700">
                  {retrofitOutputs.blackoutHours.toFixed(1)} hrs
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-gray-700">
                <span>CO₂ avoided</span>
                <span className="font-semibold">
                  {Math.round(retrofitOutputs.co2Avoided).toLocaleString()} kg/yr
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-gray-700">
                <span>Recommendation</span>
                <span className="font-semibold text-emerald-700 text-right">
                  {retrofitOutputs.recommendation}
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Added cost / unit</div>
                <div className="text-xs text-gray-500">
                  Includes {Math.round(newDevOutputs.discount * 100)}% bulk discount
                </div>
              </div>
              <div className="text-2xl font-bold text-emerald-700">
                {formatWithSymbol(newDevOutputs.addedCostPerUnit, country, 0)}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">% price uplift</div>
                <div className="text-xs text-gray-500">On sale price</div>
              </div>
              <div className="text-2xl font-bold text-emerald-700">
                {newDevOutputs.priceIncreasePct.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">20-year savings</div>
                <div className="text-xs text-gray-500">Per buyer</div>
              </div>
              <div className="text-2xl font-bold text-emerald-700">
                {formatWithSymbol(newDevOutputs.savings20Y, country, 0)}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-gray-700">
              <span>Savings as % of price</span>
              <span className="font-semibold text-emerald-700">
                {newDevOutputs.savingsPctOfPrice.toFixed(1)}%
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-gray-700">
              <span>Payback from move-in</span>
              <span className="font-semibold">{newDevOutputs.paybackYears.toFixed(1)} years</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Blackout protection</div>
                <div className="text-xs text-gray-500">Whole building runtime</div>
              </div>
              <div className="text-2xl font-bold text-emerald-700">
                {newDevOutputs.blackoutHours.toFixed(1)} hrs
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-gray-700">
              <span>Zero-bill days / year</span>
              <span className="font-semibold">{newDevOutputs.zeroBillDays} days</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-gray-700">
              <span>CO₂ avoided</span>
              <span className="font-semibold">
                {Math.round(newDevOutputs.co2Avoided).toLocaleString()} kg/yr
              </span>
            </div>
            <div className="mt-2 text-sm text-emerald-700 font-semibold text-right">
              {newDevOutputs.recommendation}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen pt-12 md:pt-14 bg-white">
      <section className="container mx-auto px-4 pt-12 pb-16 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Make Your Condo or Apartment 80–100 % Self-Powered
            </h1>
            <span className="px-2 py-1 text-[11px] font-semibold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
              New
            </span>
          </div>
          <CountrySelector />
        </div>
        <p className="text-lg text-gray-700">
          Instantly size the ideal shared solar + battery system for your building. Switch between retrofit and new
          development models — see cost per unit, payback, blackout hours, and zero-bill days in real time.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-3 bg-gray-100 border border-gray-200 rounded-full px-2 py-1">
            <button
              onClick={() => setMode('retrofit')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                mode === 'retrofit'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-gray-700 hover:text-emerald-700'
              }`}
            >
              Retrofit (existing building)
            </button>
            <button
              onClick={() => setMode('new')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                mode === 'new'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-gray-700 hover:text-emerald-700'
              }`}
            >
              New Development (pre-construction)
            </button>
          </div>

          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-2">
            <span className="text-xs font-semibold text-gray-700">Optimize</span>
            <button
              onClick={handleOptimize}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              {optimizeTarget === 'savings' ? 'Maximize Savings' : 'Maximize Solar'}
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[5fr_4fr] gap-6">
          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm font-semibold text-gray-900">Inputs</div>
                  <div className="text-xs text-gray-500">
                    {mode === 'retrofit'
                      ? 'Participation, roof, existing solar, batteries'
                      : 'Units, sale price, roof, batteries'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <InfoChip label={loading ? 'Loading…' : 'Real-time'} />
                  <InfoChip label={COUNTRY_NAMES[country]} />
                </div>
              </div>
              {renderInputs()}
            </div>

            <MiniInfo
              title="Accurate 2025 tariffs + dailyCycle logic"
              copy="Solar yield, tariff escalation, and battery coverage mirror the /bess/home model for Southeast Asia. Discounts scale with unit count."
            />
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm font-semibold text-gray-900">Live Outputs</div>
                  <div className="text-xs text-gray-500">
                    Auto-updates when you move any slider or toggle
                  </div>
                </div>
                <InfoChip label={mode === 'retrofit' ? 'Retrofit' : 'New build'} />
              </div>
              {renderOutputs()}
            </div>

            <SnapshotCharts
              coverage={activeOutputs.coverage}
              monthlySavings={
                mode === 'retrofit' ? retrofitOutputs.monthlySavingsPerHousehold : newDevOutputs.monthlySavings
              }
              baselineBill={householdDailyLoad * 30 * ELECTRICITY_TARIFFS[country]}
              paybackYears={activeOutputs.paybackYears}
              co2Avoided={activeOutputs.co2Avoided}
              country={country}
            />
          </div>
        </div>

        <BatteryScatter
          bessList={bessList}
          country={country}
          monthlySavingsPerHousehold={
            mode === 'retrofit' ? retrofitOutputs.monthlySavingsPerHousehold : newDevOutputs.monthlySavings
          }
        />

        <div className="mt-8 flex flex-wrap gap-3">
          <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors">
            Share Design
          </button>
          <button className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-800 font-semibold hover:bg-gray-50 transition-colors">
            Download PDF
          </button>
        </div>

        <div className="mt-6 text-[12px] text-gray-500 leading-relaxed border-t border-gray-200 pt-4">
          *New-build pricing includes 15–25 % bulk discount. Buyers save full electricity bill from day one — savings
          often exceed added cost within 7 years. Retrofit assumes cost split among participating units. Data updated
          monthly.*
        </div>
      </section>
    </main>
  )
}

export default function SharedResidentialPage() {
  return (
    <SharedResidentialContent />
  )
}
