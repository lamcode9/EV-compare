'use client'

import { useMemo } from 'react'
import { useVehicleStore } from '@/store/VehicleStore'
import { Vehicle } from '@/types/vehicle'
import EVScoreGauge from './EVScoreGauge'
import { formatPrice, getElectricRangeKm, isPHEV } from '@/lib/utils'

/* ── Quick-pick logic ────────────────────────────────────────── */

interface PickCategory {
  label: string
  icon: string
  description: string
  gradient: string
  selector: (vehicles: Vehicle[]) => Vehicle | null
}

const CATEGORIES: PickCategory[] = [
  {
    label: 'Best Range',
    icon: '🛣️',
    description: 'Go the furthest on a single charge',
    gradient: 'from-emerald-500 to-teal-600',
    selector: (vehicles) => {
      const sorted = vehicles
        .filter(v => {
          const range = getElectricRangeKm(v)
          return range !== null && range > 0
        })
        .sort((a, b) => (getElectricRangeKm(b) ?? 0) - (getElectricRangeKm(a) ?? 0))
      return sorted[0] ?? null
    },
  },
  {
    label: 'Best Value',
    icon: '💰',
    description: 'Most range per dollar spent',
    gradient: 'from-amber-500 to-orange-600',
    selector: (vehicles) => {
      const sorted = vehicles
        .filter(v => {
          const range = getElectricRangeKm(v)
          return v.basePriceLocalCurrency && range && range > 0 && v.basePriceLocalCurrency > 0
        })
        .sort((a, b) => {
          const aVal = (a.basePriceLocalCurrency ?? Infinity) / (getElectricRangeKm(a) ?? 1)
          const bVal = (b.basePriceLocalCurrency ?? Infinity) / (getElectricRangeKm(b) ?? 1)
          return aVal - bVal
        })
      return sorted[0] ?? null
    },
  },
  {
    label: 'Most Efficient',
    icon: '⚡',
    description: 'Lowest energy consumption per km',
    gradient: 'from-blue-500 to-indigo-600',
    selector: (vehicles) => {
      const sorted = vehicles
        .filter(v => v.efficiencyKwhPer100km && v.efficiencyKwhPer100km > 0)
        .sort((a, b) => (a.efficiencyKwhPer100km ?? Infinity) - (b.efficiencyKwhPer100km ?? Infinity))
      return sorted[0] ?? null
    },
  },
  {
    label: 'Fastest Charge',
    icon: '🔌',
    description: 'Quickest DC charge to 80%',
    gradient: 'from-cyan-500 to-blue-600',
    selector: (vehicles) => {
      const sorted = vehicles
        .filter(v => v.chargingTimeDc0To80Min && v.chargingTimeDc0To80Min > 0)
        .sort((a, b) => (a.chargingTimeDc0To80Min ?? Infinity) - (b.chargingTimeDc0To80Min ?? Infinity))
      return sorted[0] ?? null
    },
  },
  {
    label: 'Most Affordable',
    icon: '🏷️',
    description: 'Lowest starting price',
    gradient: 'from-rose-500 to-pink-600',
    selector: (vehicles) => {
      const sorted = vehicles
        .filter(v => v.basePriceLocalCurrency && v.basePriceLocalCurrency > 0)
        .sort((a, b) => (a.basePriceLocalCurrency ?? Infinity) - (b.basePriceLocalCurrency ?? Infinity))
      return sorted[0] ?? null
    },
  },
]

/* ── Component ───────────────────────────────────────────────── */

export default function QuickPickCards() {
  const { vehicles, addVehicle, isVehicleSelected, selectedVehicles, selectedCountry } = useVehicleStore()

  const availableVehicles = useMemo(() => {
    if (!selectedCountry) return []
    return vehicles.filter(v => v.country === selectedCountry && v.isAvailable)
  }, [vehicles, selectedCountry])

  const picks = useMemo(() => {
    if (availableVehicles.length < 3) return []
    return CATEGORIES.map(cat => ({
      ...cat,
      vehicle: cat.selector(availableVehicles),
    })).filter(p => p.vehicle !== null) as (PickCategory & { vehicle: Vehicle })[]
  }, [availableVehicles])

  if (picks.length === 0 || !selectedCountry) return null

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Quick Picks</h3>
        <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full cursor-help" title="Each pick is the #1 vehicle in a single measurable dimension — no composite scores or editorial choices. Best Range: highest WLTP electric-only range (km). Best Value: lowest price per km of range. Most Efficient: lowest kWh/100 km. Fastest Charge: shortest DC 0→80% time (min). Most Affordable: lowest base price. PHEVs use electric-only range.">
          single-metric leaders ℹ️
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {picks.map(({ label, icon, description, gradient, vehicle }) => {
          const selected = isVehicleSelected(vehicle.id)
          const full = selectedVehicles.length >= 4

          return (
            <button
              key={label}
              onClick={() => {
                if (!selected && !full) addVehicle(vehicle)
              }}
              disabled={selected || full}
              className={`relative overflow-hidden rounded-xl border transition-all text-left group
                ${selected
                  ? 'border-emerald-300 bg-emerald-50/50 cursor-default'
                  : full
                    ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md cursor-pointer'}`}
            >
              {/* Gradient accent bar */}
              <div className={`h-1 bg-gradient-to-r ${gradient}`} />

              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Category */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-sm">{icon}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        {label}
                      </span>
                    </div>

                    {/* Vehicle name */}
                    <div className="text-sm font-semibold text-gray-900 leading-snug truncate">
                      {vehicle.name}
                      {isPHEV(vehicle) && (
                        <span className="ml-1 text-[8px] font-medium text-violet-600 bg-violet-50 border border-violet-200 px-1 py-px rounded-full align-middle" title="Plug-in Hybrid / Series Hybrid — electric-only range shown">
                          PHEV
                        </span>
                      )}
                    </div>
                    {vehicle.modelTrim && (
                      <div className="text-[10px] text-gray-500 truncate">{vehicle.modelTrim}</div>
                    )}

                    {/* Key specs */}
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2 text-[10px] text-gray-600">
                      {getElectricRangeKm(vehicle) && (
                        <span>{getElectricRangeKm(vehicle)} km</span>
                      )}
                      {vehicle.efficiencyKwhPer100km && (
                        <span>{vehicle.efficiencyKwhPer100km} kWh/100km</span>
                      )}
                      {vehicle.basePriceLocalCurrency && (
                        <span className="font-medium text-gray-900">
                          {formatPrice(vehicle.basePriceLocalCurrency, vehicle.country)}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <div className="text-[9px] text-gray-400 mt-1.5">{description}</div>
                  </div>

                  {/* Score gauge */}
                  <div className="flex-shrink-0">
                    <EVScoreGauge
                      vehicle={vehicle}
                      allVehicles={availableVehicles}
                      size="sm"
                    />
                  </div>
                </div>

                {/* Action hint */}
                <div className="mt-3 pt-2 border-t border-gray-100 text-center">
                  {selected ? (
                    <span className="text-[10px] text-emerald-600 font-medium">✓ Added to comparison</span>
                  ) : full ? (
                    <span className="text-[10px] text-gray-400">Comparison full (4/4)</span>
                  ) : (
                    <span className="text-[10px] text-gray-500 group-hover:text-emerald-600 transition-colors font-medium">
                      Click to add to comparison →
                    </span>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
