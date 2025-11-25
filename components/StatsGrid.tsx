'use client'

import { Vehicle } from '@/types/vehicle'
import {
  estimateBatteryCapacityFromWeight,
  getElectricityRate,
  estimateCostPerKm,
} from '@/lib/utils'

interface StatsGridProps {
  vehicle: Vehicle
  selectedOptions: string[]
  onToggleOption: (name: string) => void
}

const batteryTechColors: Record<string, string> = {
  NMC: '#10b981',
  LFP: '#3b82f6',
  SolidState: '#8b5cf6',
  Other: '#6b7280',
}

const formatLocalPrice = (price: number, country: 'SG' | 'MY', digits: number = 0) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: country === 'SG' ? 'SGD' : 'MYR',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(price)

const formatCostPerKm = (value: number, country: 'SG' | 'MY') =>
  formatLocalPrice(value, country, 2)

const getInsurancePremium = (basePrice: number) => Math.round(basePrice * 0.03)
const getGovFees = (country: 'SG' | 'MY') => (country === 'SG' ? 18000 : 9000)

// Convert kW to horsepower (1 kW ≈ 1.341 hp)
const convertKwToHp = (kw: number): number => {
  return Math.round(kw * 1.341)
}

// Convert 0-100 km/h to 0-60 mph (0-100 km/h ≈ 0-62.14 mph, very close to 0-60)
// For practical purposes, 0-100 km/h time is essentially the same as 0-60 mph
const convert0To100KmhTo0To60Mph = (time0To100Kmh: number): number => {
  // 0-100 km/h is very close to 0-60 mph (actually 0-62.14 mph)
  // The difference is negligible for display purposes, so we use it directly
  return time0To100Kmh
}

// Estimate 0-60 time based on power-to-weight ratio (fallback when API data not available)
const estimate0To60Time = (powerKw: number, weightKg: number): number => {
  const powerToWeight = powerKw / (weightKg / 1000) // kW per ton
  // Rough estimation: higher power-to-weight ratio = faster 0-60
  // This is a simplified model and actual times vary based on many factors
  if (powerToWeight >= 200) return 3.0 // Very high performance
  if (powerToWeight >= 150) return 4.0
  if (powerToWeight >= 100) return 5.5
  if (powerToWeight >= 70) return 7.0
  if (powerToWeight >= 50) return 9.0
  return 11.0 // Lower performance
}

export default function StatsGrid({ vehicle, selectedOptions, onToggleOption }: StatsGridProps) {
  const batteryCapacityEstimate = estimateBatteryCapacityFromWeight(vehicle.batteryWeightKg)
  const totalRebates = vehicle.rebates.reduce((sum, rebate) => sum + rebate.amount, 0)
  const selectedOptionsTotal = vehicle.optionPrices
    .filter((option) => selectedOptions.includes(option.name))
    .reduce((sum, option) => sum + option.price, 0)
  
  const powerHp = convertKwToHp(vehicle.powerRatingKw)
  // Use actual 0-100 km/h data from API if available, otherwise estimate
  const zeroToSixtyTime = vehicle.acceleration0To100Kmh
    ? convert0To100KmhTo0To60Mph(vehicle.acceleration0To100Kmh)
    : estimate0To60Time(vehicle.powerRatingKw, vehicle.curbWeightKg)

  const insurancePremium = getInsurancePremium(vehicle.basePriceLocalCurrency)
  const governmentFees = getGovFees(vehicle.country)

  const dynamicOtr =
    vehicle.basePriceLocalCurrency +
    selectedOptionsTotal +
    insurancePremium +
    governmentFees -
    totalRebates

  const costPerKm = estimateCostPerKm(
    vehicle.country,
    vehicle.batteryWeightKg,
    vehicle.rangeKm
  )

  const chargingRangePerHour =
    vehicle.chargingTimeDc0To80Min > 0
      ? Math.round(
          (vehicle.rangeKm * 0.8) /
            (vehicle.chargingTimeDc0To80Min / 60)
        )
      : null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Battery Insights */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">🔋 Battery Insights</h3>
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Battery Weight</div>
            <div className="text-2xl font-bold text-ev-primary">{vehicle.batteryWeightKg} kg</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Vehicle Weight</div>
            <div className="text-2xl font-bold text-gray-800">{vehicle.curbWeightKg} kg</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Battery Capacity (est.)</div>
            <div className="text-2xl font-bold text-ev-primary">
              {batteryCapacityEstimate} kWh
            </div>
          </div>
        </div>
      </div>

      {/* Performance */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">⚡ Performance</h3>
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Power Rating</div>
            <div className="text-2xl font-bold text-ev-secondary">{vehicle.powerRatingKw} kW</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Horsepower</div>
            <div className="text-2xl font-bold text-ev-secondary">{powerHp} hp</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">0-60 Performance</div>
            <div className="text-2xl font-bold text-ev-secondary">{zeroToSixtyTime.toFixed(1)}s</div>
          </div>
        </div>
      </div>

      {/* Efficiency & Range */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">📊 Efficiency & Range</h3>
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Efficiency</div>
            <div className="text-2xl font-bold text-gray-900">
              {vehicle.efficiencyKwhPer100km} kWh/100km
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Range (WLTP | EPA)</div>
            <div className="text-2xl font-bold text-gray-900">
              {vehicle.rangeWltpKm ?? vehicle.rangeKm} km | {vehicle.rangeEpaKm ?? Math.round((vehicle.rangeWltpKm ?? vehicle.rangeKm) * 0.75)} km
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Cost / km</div>
            <div className="text-2xl font-bold text-ev-primary">
              {formatCostPerKm(costPerKm, vehicle.country)}
            </div>
          </div>
        </div>
      </div>

      {/* Costs */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">💰 Costs</h3>
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Base Price</div>
            <div className="text-xl font-bold text-gray-800">
              {formatLocalPrice(vehicle.basePriceLocalCurrency, vehicle.country)}
            </div>
          </div>

          {vehicle.optionPrices.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">Options</div>
              <div className="space-y-2">
                {vehicle.optionPrices.map((option) => (
                  <label key={option.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-ev-primary focus:ring-ev-primary"
                        checked={selectedOptions.includes(option.name)}
                        onChange={() => onToggleOption(option.name)}
                      />
                      <span className="text-gray-700">{option.name}</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {formatLocalPrice(option.price, vehicle.country)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="bg-ev-primary/10 rounded-lg p-4 border-2 border-ev-primary space-y-2">
            <div className="text-sm text-gray-600 flex justify-between">
              <span>Base + Selected Options</span>
              <span className="font-semibold text-gray-900">
                {formatLocalPrice(
                  vehicle.basePriceLocalCurrency + selectedOptionsTotal,
                  vehicle.country
                )}
              </span>
            </div>
            <div className="text-sm text-gray-600 flex justify-between">
              <span>Insurance Premium</span>
              <span className="font-semibold text-gray-900">
                {formatLocalPrice(insurancePremium, vehicle.country)}
              </span>
            </div>
            <div className="text-sm text-gray-600 flex justify-between">
              <span>Gov / Ownership Fees</span>
              <span className="font-semibold text-gray-900">
                {formatLocalPrice(governmentFees, vehicle.country)}
              </span>
            </div>
            {totalRebates > 0 && (
              <div className="text-sm text-green-700 flex justify-between">
                <span>Rebates</span>
                <span>-{formatLocalPrice(totalRebates, vehicle.country)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-ev-primary/40 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Dynamic OTR Price</div>
                <div className="text-xs text-gray-500">Includes insurance + permits</div>
              </div>
              <div className="text-2xl font-bold text-ev-primary">
                {formatLocalPrice(dynamicOtr, vehicle.country)}
              </div>
            </div>
          </div>

          {vehicle.rebates.length > 0 && (
            <details className="bg-green-50 rounded-lg p-4">
              <summary className="text-sm font-medium text-green-800 cursor-pointer">
                Rebates ({vehicle.rebates.length})
              </summary>
              <ul className="mt-2 space-y-2 text-sm">
                {vehicle.rebates.map((rebate) => (
                  <li key={rebate.name} className="text-green-700">
                    <div className="font-medium">{rebate.name}</div>
                    <div className="text-xs text-green-600">{rebate.description}</div>
                    <div className="font-semibold">
                {formatLocalPrice(rebate.amount, vehicle.country)}
                    </div>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </div>

      {/* Technology */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">🔬 Technology</h3>
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Battery Manufacturer</div>
            <div className="text-lg font-bold text-gray-800">{vehicle.batteryManufacturer}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Battery Technology</div>
            <div
              className="text-lg font-bold inline-block px-3 py-1 rounded-full text-white"
              style={{ backgroundColor: batteryTechColors[vehicle.batteryTechnology] || batteryTechColors.Other }}
            >
              {vehicle.batteryTechnology}
            </div>
          </div>
        </div>
      </div>

      {/* Charging */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">🔌 Charging</h3>
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">DC Fast Charge (0-80%)</div>
            <div className="text-2xl font-bold text-ev-accent">{vehicle.chargingTimeDc0To80Min} min</div>
            {/* Visual progress bar for charging speed */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-ev-accent h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (80 / vehicle.chargingTimeDc0To80Min) * 100)}%`,
                  }}
                  role="progressbar"
                  aria-valuenow={vehicle.chargingTimeDc0To80Min}
                  aria-valuemin={0}
                  aria-valuemax={60}
                  aria-label={`Charging speed: ${vehicle.chargingTimeDc0To80Min} minutes to 80%`}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {vehicle.chargingTimeDc0To80Min <= 20
                  ? '⚡ Very Fast'
                  : vehicle.chargingTimeDc0To80Min <= 35
                  ? '⚡ Fast'
                  : '⚡ Moderate'}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 space-y-1">
            <div className="text-sm text-gray-600 mb-1">Charging Capabilities</div>
            <div className="text-sm font-medium text-gray-800">{vehicle.chargingCapabilities}</div>
            {chargingRangePerHour && (
              <div className="text-xs text-gray-600">
                ~{chargingRangePerHour} km of range per hour on DC fast charge
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

