'use client'

import { Vehicle } from '@/types/vehicle'
import type { Country } from '@prisma/client'
import EVScoreGauge, { computeScore } from './EVScoreGauge'
import { computeBadges, InlineBadgeRow } from './WinnerBadges'
import { formatPrice } from '@/lib/utils'

function getLabel(v: Vehicle) {
  return v.modelTrim ? `${v.name} ${v.modelTrim}` : v.name
}

const SPEC_GROUPS = [
  {
    title: 'Battery & Range',
    icon: '🔋',
    specs: [
      { label: 'Battery', key: 'batteryCapacityKwh' as const, unit: 'kWh', format: (v: number) => `${v} kWh` },
      { label: 'Chemistry', key: 'batteryTechnology' as const, unit: '', format: (v: string) => v },
      { label: 'Range', key: 'rangeKm' as const, unit: 'km', format: (v: number) => `${v} km` },
      { label: 'Warranty', key: 'batteryWarranty' as const, unit: '', format: (v: string) => v },
    ],
  },
  {
    title: 'Performance',
    icon: '⚡',
    specs: [
      { label: 'Power', key: 'powerRatingKw' as const, unit: 'kW', format: (v: number) => `${v} kW` },
      { label: 'Torque', key: 'torqueNm' as const, unit: 'Nm', format: (v: number) => `${v} Nm` },
      { label: 'Top Speed', key: 'topSpeedKmh' as const, unit: 'km/h', format: (v: number) => `${v} km/h` },
      { label: 'Efficiency', key: 'efficiencyKwhPer100km' as const, unit: 'kWh/100km', format: (v: number) => `${v} kWh/100km` },
    ],
  },
  {
    title: 'Charging',
    icon: '🔌',
    specs: [
      { label: 'DC 0-80%', key: 'chargingTimeDc0To80Min' as const, unit: 'min', format: (v: number) => `${v} min` },
      { label: 'V2L/V2H', key: 'hasBidirectional' as const, unit: '', format: (v: boolean) => v ? '✅ Yes' : '❌ No' },
      { label: 'OTA Updates', key: 'otaUpdates' as const, unit: '', format: (v: string) => v },
    ],
  },
]

interface Props {
  vehicles: Vehicle[]
}

export default function MobileComparisonCards({ vehicles }: Props) {
  if (vehicles.length === 0) return null

  const badgeMap = computeBadges(vehicles)

  return (
    <div className="md:hidden space-y-4">
      {vehicles.map((vehicle, idx) => {
        const score = computeScore(vehicle, vehicles)
        const badges = badgeMap.get(vehicle.id) ?? []
        
        return (
          <div
            key={vehicle.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            {/* Header with score + name */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 flex items-center gap-3">
              <EVScoreGauge vehicle={vehicle} allVehicles={vehicles} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-gray-900 truncate">{vehicle.name}</div>
                {vehicle.modelTrim && (
                  <div className="text-[10px] text-gray-500 truncate">{vehicle.modelTrim}</div>
                )}
                <InlineBadgeRow badges={badges} />
              </div>
              {vehicle.basePriceLocalCurrency && (
                <div className="text-sm font-bold text-emerald-700 shrink-0">
                  {formatPrice(vehicle.basePriceLocalCurrency, vehicle.country)}
                </div>
              )}
            </div>

            {/* Key stats grid */}
            <div className="grid grid-cols-3 border-b border-gray-100">
              <div className="px-3 py-2.5 text-center border-r border-gray-100">
                <div className="text-sm font-bold text-gray-900">{vehicle.rangeKm ?? '—'}</div>
                <div className="text-[9px] text-gray-400">km range</div>
              </div>
              <div className="px-3 py-2.5 text-center border-r border-gray-100">
                <div className="text-sm font-bold text-gray-900">{vehicle.batteryCapacityKwh ?? '—'}</div>
                <div className="text-[9px] text-gray-400">kWh battery</div>
              </div>
              <div className="px-3 py-2.5 text-center">
                <div className="text-sm font-bold text-gray-900">{vehicle.efficiencyKwhPer100km ?? '—'}</div>
                <div className="text-[9px] text-gray-400">kWh/100km</div>
              </div>
            </div>

            {/* Spec groups */}
            <div className="divide-y divide-gray-100">
              {SPEC_GROUPS.map(group => (
                <details key={group.title} className="group">
                  <summary className="px-4 py-2.5 flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
                    <span className="text-xs">{group.icon}</span>
                    <span className="text-xs font-semibold text-gray-700 flex-1">{group.title}</span>
                    <svg className="w-3.5 h-3.5 text-gray-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-4 pb-3 space-y-1.5">
                    {group.specs.map(spec => {
                      const val = vehicle[spec.key as keyof Vehicle]
                      const display = val != null && val !== '' 
                        ? (spec.format as (v: any) => string)(val)
                        : 'N/A'
                      return (
                        <div key={spec.label} className="flex justify-between items-center">
                          <span className="text-[11px] text-gray-500">{spec.label}</span>
                          <span className="text-[11px] font-medium text-gray-900">{display}</span>
                        </div>
                      )
                    })}
                  </div>
                </details>
              ))}
            </div>

            {/* Score breakdown mini-bar */}
            <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-100">
              <div className="text-[9px] font-medium text-gray-500 mb-1.5">Score Breakdown</div>
              <div className="grid grid-cols-5 gap-1">
                {[
                  { label: 'Range', val: score.range },
                  { label: 'Effic.', val: score.efficiency },
                  { label: 'Value', val: score.value },
                  { label: 'Charge', val: score.charging },
                  { label: 'Battery', val: score.battery },
                ].map(d => (
                  <div key={d.label} className="text-center">
                    <div className="h-10 bg-gray-200 rounded-full overflow-hidden flex flex-col-reverse">
                      <div
                        className="rounded-full transition-all"
                        style={{
                          height: `${d.val}%`,
                          backgroundColor: d.val >= 70 ? '#10b981' : d.val >= 40 ? '#f59e0b' : '#ef4444',
                        }}
                      />
                    </div>
                    <div className="text-[8px] text-gray-400 mt-0.5">{d.label}</div>
                    <div className="text-[9px] font-bold text-gray-700">{d.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
