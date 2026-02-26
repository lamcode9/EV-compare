import type { Country } from '@prisma/client'

// String-indexable map that still auto-completes Country keys
type CountryMap<V> = Record<Country, V> & Record<string, V | undefined>

// ── SEA country display names ──────────────────────────────────────────────
export const COUNTRY_NAMES: CountryMap<string> = {
  SG: 'Singapore',
  MY: 'Malaysia',
  ID: 'Indonesia',
  TH: 'Thailand',
  VN: 'Vietnam',
  PH: 'Philippines',
}

// ── Currency ISO codes ─────────────────────────────────────────────────────
export const CURRENCY_BY_COUNTRY: CountryMap<string> = {
  SG: 'SGD',
  MY: 'MYR',
  ID: 'IDR',
  PH: 'PHP',
  TH: 'THB',
  VN: 'VND',
}

// ── Currency display symbols ───────────────────────────────────────────────
export const CURRENCY_SYMBOLS: CountryMap<string> = {
  MY: 'RM',
  SG: 'S$',
  ID: 'Rp',
  TH: '฿',
  VN: '₫',
  PH: '₱',
}

// ── Country picker options (with flag emoji) ───────────────────────────────
export const COUNTRY_OPTIONS: { value: Country; label: string; flag: string }[] = [
  { value: 'SG', label: 'Singapore', flag: '🇸🇬' },
  { value: 'MY', label: 'Malaysia', flag: '🇲🇾' },
  { value: 'ID', label: 'Indonesia', flag: '🇮🇩' },
  { value: 'TH', label: 'Thailand', flag: '🇹🇭' },
  { value: 'VN', label: 'Vietnam', flag: '🇻🇳' },
  { value: 'PH', label: 'Philippines', flag: '🇵🇭' },
]

// ── Residential electricity tariff (local currency per kWh, 2025/2026) ─────
export const ELECTRICITY_TARIFF: Record<Country, number> = {
  MY: 0.474,
  SG: 0.315,
  ID: 1750,
  TH: 4.59,
  VN: 2135,
  PH: 12.30,
}

// ── CO₂ grid emission factor (kg CO₂ per kWh, average grid mix) ───────────
export const CO2_GRID_FACTOR: Record<Country, number> = {
  MY: 0.65,
  SG: 0.45,
  ID: 0.70,
  TH: 0.55,
  VN: 0.60,
  PH: 0.68,
}

// ── Currency formatting helpers ────────────────────────────────────────────

/** Format a number with currency symbol, e.g. "RM12,500" */
export function formatCurrency(amount: number, country: string, digits = 0): string {
  return `${CURRENCY_SYMBOLS[country] || ''}${amount.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`
}

/** Format a number in compact form: S$1.2M, Rp45.3B, RM12.5K */
export function formatCompact(amount: number, country: string): string {
  const sym = CURRENCY_SYMBOLS[country] || ''
  if (country === 'ID' || country === 'VN') {
    if (Math.abs(amount) >= 1_000_000_000) return `${sym}${(amount / 1_000_000_000).toFixed(1)}B`
    if (Math.abs(amount) >= 1_000_000) return `${sym}${(amount / 1_000_000).toFixed(1)}M`
  }
  if (Math.abs(amount) >= 1_000_000) return `${sym}${(amount / 1_000_000).toFixed(1)}M`
  if (Math.abs(amount) >= 1_000) return `${sym}${(amount / 1_000).toFixed(1)}K`
  return formatCurrency(amount, country)
}

/** Format price using Intl.NumberFormat with ISO currency code */
export function formatPrice(price: number, country: string, minimumFractionDigits = 0): string {
  const currency = CURRENCY_BY_COUNTRY[country] || 'USD'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits > 0 ? 2 : 0,
  }).format(price)
}
