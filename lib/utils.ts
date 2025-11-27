import type { Country } from '@prisma/client'

const CURRENCY_BY_COUNTRY: Record<Country, string> = {
  SG: 'SGD',
  MY: 'MYR',
  ID: 'IDR',
  PH: 'PHP',
  TH: 'THB',
  VN: 'VND',
}

export function formatPrice(price: number, country: Country, minimumFractionDigits: number = 0): string {
  const currency = CURRENCY_BY_COUNTRY[country] || 'USD'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits > 0 ? 2 : 0,
  }).format(price)
}

// EV charging rates per kWh for DC fast chargers in Southeast Asia (2025)
// These are typical commercial fast-charging rates, not residential rates
const ELECTRICITY_RATE_BY_COUNTRY: Record<Country, number> = {
  SG: 0.50, // SGD per kWh (typical DC fast charger: $0.45-$0.55/kWh)
  MY: 1.20, // MYR per kWh (typical DC fast charger: RM1.00-RM1.40/kWh)
  ID: 3500, // IDR per kWh (typical DC fast charger: 3,000-4,000 IDR/kWh)
  PH: 8.50, // PHP per kWh (typical DC fast charger: 7.50-9.50 PHP/kWh)
  TH: 6.50, // THB per kWh (typical DC fast charger: 6.00-7.00 THB/kWh)
  VN: 3500, // VND per kWh (typical DC fast charger: 3,000-4,000 VND/kWh)
}

/**
 * Get electricity rate for EV charging in the specified country
 * Returns rate in local currency per kWh for DC fast charging
 */
export function getElectricityRate(country: Country): number {
  return ELECTRICITY_RATE_BY_COUNTRY[country] || 0.40 // Default fallback
}

/**
 * Calculate cost per km using actual battery capacity
 */
export function calculateCostPerKm(
  country: Country,
  batteryCapacityKwh: number | null | undefined,
  rangeKm: number
): number {
  if (!rangeKm || rangeKm <= 0) return 0
  if (!batteryCapacityKwh || batteryCapacityKwh <= 0) return 0
  
  const costPerFullCharge = batteryCapacityKwh * getElectricityRate(country)
  return costPerFullCharge / rangeKm
}

/**
 * Convert kilowatts to horsepower (1 kW ≈ 1.341 hp)
 */
export function convertKwToHp(kw: number): number {
  return Math.round(kw * 1.341)
}

/**
 * Get acceleration value, using API data if available, otherwise return null
 */
export function getAcceleration0To100Kmh(
  acceleration0To100Kmh: number | null | undefined,
  _powerKw?: number | null | undefined,
  _weightKg?: number | null | undefined
): number | null {
  return acceleration0To100Kmh ?? null
}

/**
 * Format value as "N/A" if null/undefined, otherwise format the number
 */
export function formatValueOrNA(
  value: number | null | undefined,
  formatter?: (val: number) => string
): string {
  if (value === null || value === undefined) return 'N/A'
  return formatter ? formatter(value) : String(value)
}

/**
 * Format price as "N/A" if null/undefined
 */
export function formatPriceOrNA(
  price: number | null | undefined,
  country: Country
): string {
  if (price === null || price === undefined) return 'N/A'
  return formatPrice(price, country)
}

/**
 * Format string as "N/A" if null/undefined/empty
 */
export function formatStringOrNA(value: string | null | undefined): string {
  if (!value || value.trim() === '') return 'N/A'
  return value
}

