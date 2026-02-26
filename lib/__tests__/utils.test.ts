import { describe, it, expect } from 'vitest'
import {
  formatPrice,
  getElectricityRate,
  calculateCostPerKm,
  convertKwToHp,
  getAcceleration0To100Kmh,
  formatValueOrNA,
  formatPriceOrNA,
  formatStringOrNA,
} from '@/lib/utils'

// ── formatPrice (Intl) ─────────────────────────────────────────────────

describe('formatPrice', () => {
  it('formats MYR correctly', () => {
    const result = formatPrice(50000, 'MY')
    expect(result).toContain('MYR')
    expect(result).toContain('50,000')
  })

  it('formats SGD correctly', () => {
    const result = formatPrice(1234, 'SG')
    expect(result).toContain('SGD')
  })

  it('formats IDR (high value)', () => {
    const result = formatPrice(500000000, 'ID')
    expect(result).toContain('IDR')
  })

  it('respects minimumFractionDigits', () => {
    const result = formatPrice(100, 'SG', 2)
    expect(result).toContain('100.00')
  })
})

// ── getElectricityRate ─────────────────────────────────────────────────

describe('getElectricityRate', () => {
  it('returns known rates for all 6 countries', () => {
    expect(getElectricityRate('SG')).toBe(0.50)
    expect(getElectricityRate('MY')).toBe(1.20)
    expect(getElectricityRate('ID')).toBe(3500)
    expect(getElectricityRate('TH')).toBe(6.50)
    expect(getElectricityRate('VN')).toBe(3500)
    expect(getElectricityRate('PH')).toBe(8.50)
  })

  it('returns rates > 0 for all countries', () => {
    for (const c of ['SG', 'MY', 'ID', 'PH', 'TH', 'VN'] as const) {
      expect(getElectricityRate(c)).toBeGreaterThan(0)
    }
  })
})

// ── calculateCostPerKm ────────────────────────────────────────────────

describe('calculateCostPerKm', () => {
  it('calculates cost per km correctly', () => {
    // Battery: 60 kWh, Range: 400 km, Rate: S$0.50/kWh
    // Cost per full charge: 60 * 0.50 = S$30
    // Cost per km: 30 / 400 = S$0.075
    const cost = calculateCostPerKm('SG', 60, 400)
    expect(cost).toBeCloseTo(0.075, 4)
  })

  it('returns 0 for zero range', () => {
    expect(calculateCostPerKm('MY', 60, 0)).toBe(0)
  })

  it('returns 0 for null battery capacity', () => {
    expect(calculateCostPerKm('MY', null, 400)).toBe(0)
  })

  it('returns 0 for undefined battery capacity', () => {
    expect(calculateCostPerKm('MY', undefined, 400)).toBe(0)
  })

  it('returns 0 for zero battery capacity', () => {
    expect(calculateCostPerKm('MY', 0, 400)).toBe(0)
  })

  it('returns 0 for negative range', () => {
    expect(calculateCostPerKm('MY', 60, -100)).toBe(0)
  })

  it('higher rate → higher cost per km', () => {
    const costSG = calculateCostPerKm('SG', 60, 400)
    const costMY = calculateCostPerKm('MY', 60, 400)
    // MY rate (1.20) > SG rate (0.50)
    expect(costMY).toBeGreaterThan(costSG)
  })
})

// ── convertKwToHp ──────────────────────────────────────────────────────

describe('convertKwToHp', () => {
  it('converts 100 kW to 134 hp', () => {
    expect(convertKwToHp(100)).toBe(134)
  })

  it('converts 150 kW to 201 hp', () => {
    expect(convertKwToHp(150)).toBe(201)
  })

  it('converts 0 kW to 0 hp', () => {
    expect(convertKwToHp(0)).toBe(0)
  })

  it('rounds to nearest integer', () => {
    // 1 kW = 1.341 hp → rounds to 1
    expect(convertKwToHp(1)).toBe(1)
    // 75 kW = 100.575 → rounds to 101
    expect(convertKwToHp(75)).toBe(101)
  })
})

// ── getAcceleration0To100Kmh ───────────────────────────────────────────

describe('getAcceleration0To100Kmh', () => {
  it('returns value when provided', () => {
    expect(getAcceleration0To100Kmh(7.5)).toBe(7.5)
  })

  it('returns null when null', () => {
    expect(getAcceleration0To100Kmh(null)).toBeNull()
  })

  it('returns null when undefined', () => {
    expect(getAcceleration0To100Kmh(undefined)).toBeNull()
  })
})

// ── formatValueOrNA ────────────────────────────────────────────────────

describe('formatValueOrNA', () => {
  it('returns "N/A" for null', () => {
    expect(formatValueOrNA(null)).toBe('N/A')
  })

  it('returns "N/A" for undefined', () => {
    expect(formatValueOrNA(undefined)).toBe('N/A')
  })

  it('returns string representation for a number', () => {
    expect(formatValueOrNA(42)).toBe('42')
  })

  it('applies custom formatter', () => {
    expect(formatValueOrNA(42, (v) => `${v} kg`)).toBe('42 kg')
  })

  it('handles zero', () => {
    expect(formatValueOrNA(0)).toBe('0')
  })
})

// ── formatPriceOrNA ────────────────────────────────────────────────────

describe('formatPriceOrNA', () => {
  it('returns "N/A" for null', () => {
    expect(formatPriceOrNA(null, 'MY')).toBe('N/A')
  })

  it('returns "N/A" for undefined', () => {
    expect(formatPriceOrNA(undefined, 'SG')).toBe('N/A')
  })

  it('formats price when value exists', () => {
    const result = formatPriceOrNA(50000, 'MY')
    expect(result).toContain('MYR')
    expect(result).toContain('50,000')
  })
})

// ── formatStringOrNA ───────────────────────────────────────────────────

describe('formatStringOrNA', () => {
  it('returns "N/A" for null', () => {
    expect(formatStringOrNA(null)).toBe('N/A')
  })

  it('returns "N/A" for undefined', () => {
    expect(formatStringOrNA(undefined)).toBe('N/A')
  })

  it('returns "N/A" for empty string', () => {
    expect(formatStringOrNA('')).toBe('N/A')
  })

  it('returns "N/A" for whitespace-only string', () => {
    expect(formatStringOrNA('   ')).toBe('N/A')
  })

  it('returns the string when non-empty', () => {
    expect(formatStringOrNA('Hello')).toBe('Hello')
  })
})
