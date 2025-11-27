'use client'

import { Vehicle } from '@/types/vehicle'
import type { Country } from '@prisma/client'
import { useState } from 'react'
import {
  estimateBatteryCapacityFromWeight,
  estimateCostPerKm,
  convertKwToHp,
  getAcceleration0To100Kmh,
  formatValueOrNA,
  formatPriceOrNA,
  formatStringOrNA,
  getElectricityRate,
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

const CURRENCY_BY_COUNTRY: Record<Country, string> = {
  SG: 'SGD',
  MY: 'MYR',
  ID: 'IDR',
  PH: 'PHP',
  TH: 'THB',
  VN: 'VND',
}

const formatLocalPrice = (price: number, country: Country, digits: number = 0) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: CURRENCY_BY_COUNTRY[country] || 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(price)

const formatCostPerKm = (value: number, country: Country) =>
  formatLocalPrice(value, country, 2)

/**
 * Info box component explaining Cost / km calculation
 */
function CostPerKmInfoBox({ 
  costPerKm, 
  country, 
  batteryWeightKg, 
  rangeKm 
}: { 
  costPerKm: number | null
  country: Country
  batteryWeightKg: number | null
  rangeKm: number | null | undefined
}) {
  const [isOpen, setIsOpen] = useState(false)

  if (costPerKm === null || batteryWeightKg === null || !rangeKm) return null

  const batteryCapacity = estimateBatteryCapacityFromWeight(batteryWeightKg)
  const electricityRate = getElectricityRate(country)
  const costPerFullCharge = batteryCapacity * electricityRate

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Show cost per km calculation details"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          {/* Info Box */}
          <div className="absolute left-0 top-6 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-20">
            <div className="text-xs font-semibold text-gray-900 mb-3">Cost / km Calculation</div>
            
            <div className="space-y-2 text-xs text-gray-700">
              <div>
                <div className="font-medium text-gray-900 mb-1">Formula:</div>
                <div className="bg-gray-50 p-2 rounded font-mono text-[10px]">
                  Cost/km = (Battery Capacity × Electricity Rate) ÷ Range
                </div>
              </div>
              
              <div className="pt-2 border-t border-gray-100">
                <div className="font-medium text-gray-900 mb-1.5">Key Assumptions:</div>
                <ul className="space-y-1.5 text-gray-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span>Battery capacity: <span className="font-medium">{batteryCapacity} kWh</span> (estimated from {batteryWeightKg} kg @ 6.5 kg/kWh)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span>Electricity rate: <span className="font-medium">{formatLocalPrice(electricityRate, country, 2)}/kWh</span> (avg fast-charger)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span>Range: <span className="font-medium">{rangeKm} km</span></span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span>Cost per full charge: <span className="font-medium">{formatLocalPrice(costPerFullCharge, country, 2)}</span></span>
                  </li>
                </ul>
              </div>
              
              <div className="pt-2 border-t border-gray-100 text-[10px] text-gray-500">
                <div className="font-medium text-gray-700 mb-0.5">Note:</div>
                <div>Rates vary by location and charging method. Home charging may be cheaper.</div>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="mt-3 text-xs text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  )
}

/**
 * Get official manufacturer website URL based on vehicle name and country
 */
const getOfficialWebsiteUrl = (vehicleName: string, country: Country): string | null => {
  const nameLower = vehicleName.toLowerCase()
  
  if (nameLower.includes('tesla')) {
    return country === 'SG' ? 'https://www.tesla.com/en_sg' : 'https://www.tesla.com/en_my'
  }
  if (nameLower.includes('byd')) {
    return country === 'SG' ? 'https://www.byd.com/sg' : 'https://www.byd.com/my'
  }
  if (nameLower.includes('hyundai') || nameLower.includes('ioniq')) {
    return country === 'SG' ? 'https://www.hyundai.com.sg' : 'https://www.hyundai.com.my'
  }
  if (nameLower.includes('kia') || nameLower.includes('ev6')) {
    return country === 'SG' ? 'https://www.kia.com.sg' : 'https://www.kia.com.my'
  }
  
  return null
}

export default function StatsGrid({ vehicle, selectedOptions, onToggleOption }: StatsGridProps) {
  const batteryCapacityEstimate = vehicle.batteryWeightKg 
    ? estimateBatteryCapacityFromWeight(vehicle.batteryWeightKg)
    : null
  const selectedOptionsTotal = vehicle.optionPrices
    .filter((option) => selectedOptions.includes(option.name))
    .reduce((sum, option) => sum + option.price, 0)

  const powerHp = vehicle.powerRatingKw ? convertKwToHp(vehicle.powerRatingKw) : null
  // Use actual 0-100 km/h data from API if available, otherwise null
  const acceleration0To100Kmh = getAcceleration0To100Kmh(
    vehicle.acceleration0To100Kmh,
    vehicle.powerRatingKw,
    vehicle.curbWeightKg
  )

  const totalPrice = vehicle.basePriceLocalCurrency !== null && vehicle.basePriceLocalCurrency !== undefined
    ? vehicle.basePriceLocalCurrency + selectedOptionsTotal
    : null

  const costPerKm = (vehicle.batteryWeightKg && vehicle.rangeKm)
    ? estimateCostPerKm(
    vehicle.country,
    vehicle.batteryWeightKg,
    vehicle.rangeKm
  )
    : null

  const chargingRangePerMinute =
    (vehicle.chargingTimeDc0To80Min && vehicle.chargingTimeDc0To80Min > 0 && vehicle.rangeKm)
      ? (vehicle.rangeKm * 0.8) / vehicle.chargingTimeDc0To80Min
      : null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Performance */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide pb-2 border-b border-gray-200">Performance</h3>
        <div className="bg-gray-50/50 rounded-lg p-4 space-y-4 border border-gray-100">
          <div className="pb-3 border-b border-gray-100 last:border-0 last:pb-0">
            <div className="text-xs text-gray-500 mb-1.5">Power</div>
            <div className="text-sm font-medium text-gray-900">
              {formatValueOrNA(vehicle.powerRatingKw, (v) => `${v} kW`)}
            </div>
          </div>
          <div className="pb-3 border-b border-gray-100 last:border-0 last:pb-0">
            <div className="text-xs text-gray-500 mb-1.5">Horsepower</div>
            <div className="text-sm font-medium text-gray-900">
              {formatValueOrNA(powerHp, (v) => `${v} hp`)}
            </div>
          </div>
          <div className="pb-3 border-b border-gray-100 last:border-0 last:pb-0">
            <div className="text-xs text-gray-500 mb-1.5">0-100 km/h</div>
            <div className="text-sm font-medium text-gray-900">
              {formatValueOrNA(acceleration0To100Kmh, (v) => `${v.toFixed(1)}s`)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1.5">Top Speed</div>
            <div className="text-sm font-medium text-gray-900">
              {formatValueOrNA(vehicle.topSpeedKmh, (v) => `${v} km/h`)}
            </div>
          </div>
        </div>
      </div>

      {/* Battery */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide pb-2 border-b border-gray-200">Battery</h3>
        <div className="bg-gray-50/50 rounded-lg p-4 space-y-4 border border-gray-100">
          <div className="pb-3 border-b border-gray-100 last:border-0 last:pb-0">
            <div className="text-xs text-gray-500 mb-1.5">Battery Capacity</div>
            <div className="text-sm font-medium text-gray-900">
              {formatValueOrNA(batteryCapacityEstimate, (v) => `${v} kWh`)}
            </div>
          </div>
          <div className="pb-3 border-b border-gray-100 last:border-0 last:pb-0">
            <div className="text-xs text-gray-500 mb-1.5">Battery Manufacturer</div>
            <div className="text-sm font-medium text-gray-900 flex items-center gap-2 flex-wrap">
              {vehicle.batteryManufacturer ? (
                <>
                  <span>{vehicle.batteryManufacturer}</span>
                  {vehicle.batteryTechnology && (
                    <span className="text-xs text-gray-600 px-2 py-0.5 bg-gray-200 rounded-md">
                      {vehicle.batteryTechnology}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-gray-500">N/A</span>
              )}
            </div>
          </div>
          <div className="pb-3 border-b border-gray-100 last:border-0 last:pb-0">
            <div className="text-xs text-gray-500 mb-1.5">Charger Power Rating</div>
            <div className="text-sm font-medium text-gray-900">
              {vehicle.chargingCapabilities 
                ? formatStringOrNA(vehicle.chargingCapabilities.replace(/DC\s+Fast\s+Charge/gi, 'DC').replace(/Fast\s+Charge/gi, '').replace(/Up\s+to/gi, '').replace(/\s+/g, ' ').trim())
                : 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1.5">Battery Warranty</div>
            <div className="text-sm font-medium text-gray-900">
              {formatStringOrNA(vehicle.batteryWarranty)}
            </div>
          </div>
        </div>
      </div>

      {/* Efficiency & Range */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide pb-2 border-b border-gray-200">Efficiency & Range</h3>
        <div className="bg-gray-50/50 rounded-lg p-4 space-y-4 border border-gray-100">
          <div className="pb-3 border-b border-gray-100 last:border-0 last:pb-0">
            <div className="text-xs text-gray-500 mb-1.5">Efficiency</div>
            <div className="text-sm font-medium text-gray-900">
              {formatValueOrNA(vehicle.efficiencyKwhPer100km, (v) => `${v} kWh/100km`)}
            </div>
          </div>
          <div className="pb-3 border-b border-gray-100 last:border-0 last:pb-0">
            <div className="text-xs text-gray-500 mb-1.5">Range (WLTP | EPA)</div>
            <div className="text-sm font-medium text-gray-900">
              {formatValueOrNA(vehicle.rangeWltpKm ?? vehicle.rangeKm, (v) => `${v} km`)} <span className="text-gray-400">|</span> {formatValueOrNA(vehicle.rangeEpaKm, (v) => `${v} km`)}
            </div>
          </div>
          <div className="pb-3 border-b border-gray-100 last:border-0 last:pb-0">
            <div className="text-xs text-gray-500 mb-1.5">Charging Speed</div>
            <div className="text-sm font-medium text-gray-900">
              {formatValueOrNA(vehicle.chargingTimeDc0To80Min, (v) => `${v} min`)}
              {chargingRangePerMinute && (
                <span className="text-xs text-gray-500 ml-2">
                  (~{chargingRangePerMinute.toFixed(1)} km/min)
                </span>
              )}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1.5 flex items-center gap-1.5">
              <span>Cost / km</span>
              <CostPerKmInfoBox 
                costPerKm={costPerKm}
                country={vehicle.country}
                batteryWeightKg={vehicle.batteryWeightKg}
                rangeKm={vehicle.rangeKm ?? vehicle.rangeWltpKm ?? vehicle.rangeEpaKm}
              />
            </div>
            <div className="text-sm font-medium text-gray-900">
              {costPerKm !== null ? formatCostPerKm(costPerKm, vehicle.country) : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Costs */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide pb-2 border-b border-gray-200">Pricing</h3>
        <div className="bg-gray-50/50 rounded-lg p-4 space-y-4 border border-gray-100">
          <div className="pb-3 border-b border-gray-100">
            <div className="text-xs text-gray-500 mb-1.5">Base Price</div>
            <div className="text-sm font-medium text-gray-900">
              {formatPriceOrNA(vehicle.basePriceLocalCurrency, vehicle.country)}
            </div>
          </div>

          {vehicle.optionPrices.length > 0 && (
            <div className="pb-3 border-b border-gray-100">
              <div className="text-xs text-gray-500 mb-1.5">Options</div>
              <div className="space-y-1">
                {vehicle.optionPrices.map((option) => (
                  <label key={option.name} className="flex items-center justify-between text-xs cursor-pointer py-0.5 px-1.5 rounded hover:bg-white/50 transition-colors">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-gray-900 focus:ring-gray-500 w-3 h-3"
                        checked={selectedOptions.includes(option.name)}
                        onChange={() => onToggleOption(option.name)}
                      />
                      <span className="text-gray-700">{option.name}</span>
                    </div>
                    <span className="text-gray-900 text-xs font-medium">
                      {formatLocalPrice(option.price, vehicle.country)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="pt-3 border-t-2 border-gray-200 bg-white/50 rounded-md p-3">
            <div className="flex items-center justify-between mb-1">
              <div>
                <div className="text-xs text-gray-500 mb-0.5">Total Price</div>
                <div className="text-xs text-gray-400">Base price + selected options</div>
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {totalPrice !== null ? formatLocalPrice(totalPrice, vehicle.country) : 'N/A'}
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100">
              * Excludes government fees, taxes, and rebates
            </div>
          </div>

          {getOfficialWebsiteUrl(vehicle.name, vehicle.country) && (
            <a
              href={getOfficialWebsiteUrl(vehicle.name, vehicle.country) || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-gray-600 hover:text-gray-900 transition-colors pt-2 border-t border-gray-100"
            >
              Official Website →
            </a>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide pb-2 border-b border-gray-200">Features</h3>
        <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-100">
          {vehicle.technologyFeatures ? (
            <div className="text-sm text-gray-700 leading-relaxed">
              {(() => {
                // Clean the entire string first (before splitting) to handle commas inside parentheses
                let cleaned = vehicle.technologyFeatures
                
                // Remove parentheses containing currency codes with prices
                cleaned = cleaned.replace(/\s*\([^)]*?(?:RM|SGD|MYR|USD|EUR|GBP|IDR|PHP|THB|VND)\s*\d+[,\d\s]*\s*(?:option|Option|OPTION)?[^)]*?\)\s*/gi, '')
                
                // Remove any parentheses containing numbers followed by "option"
                cleaned = cleaned.replace(/\s*\([^)]*?\d+[,\d\s]+\s*(?:option|Option|OPTION)[^)]*?\)\s*/gi, '')
                
                // Split, trim, and filter
                const features = cleaned
                  .split(',')
                  .map((f) => f.trim())
                  .filter((f) => f.length > 0)
                
                return features.map((feature, index, array) => (
                  <span key={index}>
                    {feature}
                    {index < array.length - 1 && (
                      <span className="text-gray-400 mx-2 font-light">|</span>
                    )}
                  </span>
                ))
              })()}
            </div>
          ) : (
            <span className="text-sm text-gray-500">N/A</span>
          )}
        </div>
      </div>
    </div>
  )
}

