'use client'

import { useMemo } from 'react'
import { Vehicle } from '@/types/vehicle'

/* ── Scoring engine ──────────────────────────────────────────── */

export interface ScoreBreakdown {
  total: number
  range: number
  efficiency: number
  value: number
  charging: number
  battery: number
}

/**
 * Compute the battery.mom Score for a vehicle relative to its comparison set.
 *
 * Every dimension is a simple percentile rank within the current country's
 * available vehicles — no editorial weights or opinions on battery chemistry.
 *
 *   Range        25 %   (higher km = better)
 *   Efficiency   25 %   (lower kWh/100 km = better)
 *   Value        20 %   (lower price ÷ range = better)
 *   Charging     15 %   (lower DC 0→80 % minutes = better)
 *   Battery      15 %   (higher usable kWh = better)
 *
 * Returns 0–100 score and per-dimension breakdown.
 */
export function computeScore(vehicle: Vehicle, allVehicles: Vehicle[]): ScoreBreakdown {
  const ranges = allVehicles.map(v => v.rangeKm ?? 0).filter(v => v > 0)
  const efficiencies = allVehicles.map(v => v.efficiencyKwhPer100km ?? Infinity).filter(v => v < Infinity && v > 0)
  const chargeTimes = allVehicles.map(v => v.chargingTimeDc0To80Min ?? Infinity).filter(v => v < Infinity && v > 0)
  const capacities = allVehicles.map(v => v.batteryCapacityKwh ?? 0).filter(v => v > 0)
  const pricePerKms = allVehicles
    .map(v => (v.basePriceLocalCurrency && v.rangeKm && v.rangeKm > 0) ? v.basePriceLocalCurrency / v.rangeKm : Infinity)
    .filter(v => v < Infinity)

  const maxRange = ranges.length > 0 ? Math.max(...ranges) : 1
  const minEff = efficiencies.length > 0 ? Math.min(...efficiencies) : 1
  const minCharge = chargeTimes.length > 0 ? Math.min(...chargeTimes) : 1
  const maxCapacity = capacities.length > 0 ? Math.max(...capacities) : 1
  const minPricePerKm = pricePerKms.length > 0 ? Math.min(...pricePerKms) : 1

  // Range score (0–100): higher km = better
  const rangeScore = vehicle.rangeKm && vehicle.rangeKm > 0
    ? Math.min(100, (vehicle.rangeKm / maxRange) * 100)
    : 0

  // Efficiency score (lower is better)
  const effScore = vehicle.efficiencyKwhPer100km && vehicle.efficiencyKwhPer100km > 0
    ? Math.min(100, (minEff / vehicle.efficiencyKwhPer100km) * 100)
    : 0

  // Value score (lower price-per-km-range is better)
  const vehiclePricePerKm = (vehicle.basePriceLocalCurrency && vehicle.rangeKm && vehicle.rangeKm > 0)
    ? vehicle.basePriceLocalCurrency / vehicle.rangeKm
    : Infinity
  const valueScore = vehiclePricePerKm < Infinity
    ? Math.min(100, (minPricePerKm / vehiclePricePerKm) * 100)
    : 0

  // Charging score (lower is better)
  const chargingScore = vehicle.chargingTimeDc0To80Min && vehicle.chargingTimeDc0To80Min > 0
    ? Math.min(100, (minCharge / vehicle.chargingTimeDc0To80Min) * 100)
    : 0

  // Battery score: purely usable capacity relative to the set
  const batteryScore = vehicle.batteryCapacityKwh && vehicle.batteryCapacityKwh > 0
    ? Math.min(100, (vehicle.batteryCapacityKwh / maxCapacity) * 100)
    : 0

  // Weighted total
  const total = Math.round(
    rangeScore * 0.25 +
    effScore * 0.25 +
    valueScore * 0.20 +
    chargingScore * 0.15 +
    batteryScore * 0.15
  )

  return {
    total: Math.max(0, Math.min(100, total)),
    range: Math.round(rangeScore),
    efficiency: Math.round(effScore),
    value: Math.round(valueScore),
    charging: Math.round(chargingScore),
    battery: Math.round(batteryScore),
  }
}

/* ── Gauge component ─────────────────────────────────────────── */

interface EVScoreGaugeProps {
  vehicle: Vehicle
  allVehicles: Vehicle[]
  size?: 'sm' | 'md' | 'lg'
  showBreakdown?: boolean
  color?: string
}

const SIZE_CONFIG = {
  sm: { dim: 64, stroke: 5, fontSize: 'text-sm', labelSize: 'text-[8px]' },
  md: { dim: 88, stroke: 6, fontSize: 'text-lg', labelSize: 'text-[9px]' },
  lg: { dim: 120, stroke: 8, fontSize: 'text-2xl', labelSize: 'text-xs' },
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#10b981' // emerald-500
  if (score >= 60) return '#f59e0b' // amber-500
  if (score >= 40) return '#f97316' // orange-500
  return '#ef4444' // red-500
}

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Exceptional'
  if (score >= 80) return 'Excellent'
  if (score >= 70) return 'Very Good'
  if (score >= 60) return 'Good'
  if (score >= 50) return 'Average'
  if (score >= 40) return 'Below Avg'
  return 'Poor'
}

const SCORE_METHODOLOGY = [
  { dim: 'Range', weight: '25%', detail: 'km vs. best in set' },
  { dim: 'Efficiency', weight: '25%', detail: 'kWh/100 km vs. best in set' },
  { dim: 'Value', weight: '20%', detail: 'price ÷ range vs. best in set' },
  { dim: 'Charging', weight: '15%', detail: 'DC 0→80% min vs. best in set' },
  { dim: 'Battery', weight: '15%', detail: 'usable kWh vs. best in set' },
]

export default function EVScoreGauge({ vehicle, allVehicles, size = 'md', showBreakdown = false, color }: EVScoreGaugeProps) {
  const score = useMemo(() => computeScore(vehicle, allVehicles), [vehicle, allVehicles])
  const config = SIZE_CONFIG[size]

  const radius = (config.dim - config.stroke) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (score.total / 100) * circumference
  const dashOffset = circumference - progress
  const scoreColor = color ?? getScoreColor(score.total)

  const BREAKDOWN = [
    { label: 'Range', value: score.range, weight: '25%', icon: '🛣️' },
    { label: 'Efficiency', value: score.efficiency, weight: '25%', icon: '⚡' },
    { label: 'Value', value: score.value, weight: '20%', icon: '💰' },
    { label: 'Charging', value: score.charging, weight: '15%', icon: '🔌' },
    { label: 'Battery', value: score.battery, weight: '15%', icon: '🔋' },
  ]

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Circular gauge */}
      <div className="relative" style={{ width: config.dim, height: config.dim }}>
        <svg width={config.dim} height={config.dim} className="transform -rotate-90">
          {/* Background track */}
          <circle
            cx={config.dim / 2}
            cy={config.dim / 2}
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={config.stroke}
          />
          {/* Progress arc */}
          <circle
            cx={config.dim / 2}
            cy={config.dim / 2}
            r={radius}
            fill="none"
            stroke={scoreColor}
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${config.fontSize} font-bold`} style={{ color: scoreColor }}>
            {score.total}
          </span>
          <span className={`${config.labelSize} text-gray-400 font-medium leading-none`}>
            / 100
          </span>
        </div>
      </div>

      {/* Label */}
      <div className={`${config.labelSize} font-semibold text-center`} style={{ color: scoreColor }}>
        {getScoreLabel(score.total)}
      </div>

      {/* Breakdown bars + methodology */}
      {showBreakdown && (
        <div className="w-full mt-2 space-y-1.5">
          {BREAKDOWN.map(({ label, value, weight, icon }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="text-[10px] w-3 text-center">{icon}</span>
              <span className="text-[10px] text-gray-500 w-14 truncate" title={`Weight: ${weight}`}>{label}</span>
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${value}%`,
                    backgroundColor: getScoreColor(value),
                  }}
                />
              </div>
              <span className="text-[10px] font-medium text-gray-600 w-6 text-right">{value}</span>
            </div>
          ))}

          {/* Methodology disclosure */}
          <details className="mt-2 group">
            <summary className="text-[10px] text-gray-400 cursor-pointer hover:text-gray-600 transition-colors select-none flex items-center gap-1">
              <svg className="w-3 h-3 text-gray-400 group-open:rotate-90 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              How is this scored?
            </summary>
            <div className="mt-1.5 pl-4 text-[10px] text-gray-400 space-y-1 border-l border-gray-100">
              <p>Each dimension compares this vehicle to the best in its country. A score of 100 means it leads that category; 50 means it&apos;s halfway to the leader.</p>
              <table className="w-full text-left">
                <tbody>
                  {SCORE_METHODOLOGY.map(({ dim, weight, detail }) => (
                    <tr key={dim}>
                      <td className="pr-2 font-medium text-gray-500">{dim}</td>
                      <td className="pr-2 text-gray-400">{weight}</td>
                      <td className="text-gray-400">{detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-gray-400">No editorial opinions. No brand preferences. Pure data ranking within the current comparison set.</p>
            </div>
          </details>
        </div>
      )}
    </div>
  )
}
