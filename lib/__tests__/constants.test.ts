import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  formatCompact,
  formatPrice,
  CURRENCY_SYMBOLS,
  CURRENCY_BY_COUNTRY,
  COUNTRY_NAMES,
  COUNTRY_OPTIONS,
  ELECTRICITY_TARIFF,
  CO2_GRID_FACTOR,
} from '@/lib/constants'

// ── CURRENCY_SYMBOLS ───────────────────────────────────────────────────

describe('CURRENCY_SYMBOLS', () => {
  it('has all 6 SEA countries', () => {
    expect(CURRENCY_SYMBOLS.MY).toBe('RM')
    expect(CURRENCY_SYMBOLS.SG).toBe('S$')
    expect(CURRENCY_SYMBOLS.ID).toBe('Rp')
    expect(CURRENCY_SYMBOLS.TH).toBe('฿')
    expect(CURRENCY_SYMBOLS.VN).toBe('₫')
    expect(CURRENCY_SYMBOLS.PH).toBe('₱')
  })
})

// ── COUNTRY_NAMES ──────────────────────────────────────────────────────

describe('COUNTRY_NAMES', () => {
  it('returns full names for all countries', () => {
    expect(COUNTRY_NAMES.SG).toBe('Singapore')
    expect(COUNTRY_NAMES.MY).toBe('Malaysia')
    expect(COUNTRY_NAMES.ID).toBe('Indonesia')
    expect(COUNTRY_NAMES.TH).toBe('Thailand')
    expect(COUNTRY_NAMES.VN).toBe('Vietnam')
    expect(COUNTRY_NAMES.PH).toBe('Philippines')
  })
})

// ── COUNTRY_OPTIONS ────────────────────────────────────────────────────

describe('COUNTRY_OPTIONS', () => {
  it('has 6 entries', () => {
    expect(COUNTRY_OPTIONS).toHaveLength(6)
  })

  it('each entry has value, label, and flag', () => {
    for (const opt of COUNTRY_OPTIONS) {
      expect(opt.value).toBeTruthy()
      expect(opt.label).toBeTruthy()
      expect(opt.flag).toBeTruthy()
    }
  })
})

// ── ELECTRICITY_TARIFF ─────────────────────────────────────────────────

describe('ELECTRICITY_TARIFF', () => {
  it('has positive values for all countries', () => {
    for (const code of ['MY', 'SG', 'ID', 'TH', 'VN', 'PH'] as const) {
      expect(ELECTRICITY_TARIFF[code]).toBeGreaterThan(0)
    }
  })

  it('ID and VN have high rates (thousands of IDR/VND)', () => {
    expect(ELECTRICITY_TARIFF.ID).toBeGreaterThan(1000)
    expect(ELECTRICITY_TARIFF.VN).toBeGreaterThan(1000)
  })

  it('SG and MY have sub-1 rates', () => {
    expect(ELECTRICITY_TARIFF.SG).toBeLessThan(1)
    expect(ELECTRICITY_TARIFF.MY).toBeLessThan(1)
  })
})

// ── CO2_GRID_FACTOR ────────────────────────────────────────────────────

describe('CO2_GRID_FACTOR', () => {
  it('has values between 0 and 2 kg CO₂/kWh for all countries', () => {
    for (const code of ['MY', 'SG', 'ID', 'TH', 'VN', 'PH'] as const) {
      expect(CO2_GRID_FACTOR[code]).toBeGreaterThan(0)
      expect(CO2_GRID_FACTOR[code]).toBeLessThan(2)
    }
  })

  it('SG has lower CO₂ than coal-heavy countries (gas-dominant grid)', () => {
    expect(CO2_GRID_FACTOR.SG).toBeLessThan(CO2_GRID_FACTOR.ID)
    expect(CO2_GRID_FACTOR.SG).toBeLessThan(CO2_GRID_FACTOR.MY)
  })
})

// ── formatCurrency ─────────────────────────────────────────────────────

describe('formatCurrency', () => {
  it('formats Malaysian Ringgit', () => {
    expect(formatCurrency(12500, 'MY')).toBe('RM12,500')
  })

  it('formats Singapore Dollar', () => {
    expect(formatCurrency(1234, 'SG')).toBe('S$1,234')
  })

  it('formats Indonesian Rupiah', () => {
    expect(formatCurrency(15000000, 'ID')).toBe('Rp15,000,000')
  })

  it('formats Thai Baht', () => {
    expect(formatCurrency(45000, 'TH')).toBe('฿45,000')
  })

  it('formats Vietnamese Dong', () => {
    expect(formatCurrency(500000, 'VN')).toBe('₫500,000')
  })

  it('formats Philippine Peso', () => {
    expect(formatCurrency(75000, 'PH')).toBe('₱75,000')
  })

  it('handles decimal digits', () => {
    expect(formatCurrency(123.456, 'SG', 2)).toBe('S$123.46')
  })

  it('handles zero', () => {
    expect(formatCurrency(0, 'MY')).toBe('RM0')
  })

  it('handles unknown country gracefully', () => {
    const result = formatCurrency(100, 'XX')
    expect(result).toBe('100')
  })
})

// ── formatCompact ──────────────────────────────────────────────────────

describe('formatCompact', () => {
  it('formats millions as M', () => {
    expect(formatCompact(1200000, 'MY')).toBe('RM1.2M')
  })

  it('formats thousands as K', () => {
    expect(formatCompact(12500, 'SG')).toBe('S$12.5K')
  })

  it('formats small numbers normally', () => {
    expect(formatCompact(500, 'TH')).toBe('฿500')
  })

  it('formats billions for ID/VN', () => {
    expect(formatCompact(15000000000, 'ID')).toBe('Rp15.0B')
    expect(formatCompact(5000000000, 'VN')).toBe('₫5.0B')
  })

  it('formats millions for ID/VN', () => {
    expect(formatCompact(15000000, 'ID')).toBe('Rp15.0M')
  })
})

// ── formatPrice ────────────────────────────────────────────────────────

describe('formatPrice', () => {
  it('uses Intl.NumberFormat with correct currency code', () => {
    const result = formatPrice(1000, 'SG')
    expect(result).toContain('SGD')
  })

  it('falls back to USD for unknown country', () => {
    const result = formatPrice(100, 'XX')
    expect(result).toContain('$')
  })

  it('handles fraction digits', () => {
    const result = formatPrice(123.456, 'MY', 2)
    expect(result).toContain('123.46')
  })
})

// ── CURRENCY_BY_COUNTRY ────────────────────────────────────────────────

describe('CURRENCY_BY_COUNTRY', () => {
  it('maps to ISO currency codes', () => {
    expect(CURRENCY_BY_COUNTRY.SG).toBe('SGD')
    expect(CURRENCY_BY_COUNTRY.MY).toBe('MYR')
    expect(CURRENCY_BY_COUNTRY.ID).toBe('IDR')
    expect(CURRENCY_BY_COUNTRY.TH).toBe('THB')
    expect(CURRENCY_BY_COUNTRY.VN).toBe('VND')
    expect(CURRENCY_BY_COUNTRY.PH).toBe('PHP')
  })
})
