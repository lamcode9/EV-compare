import { describe, it, expect } from 'vitest'
import { getDictionary } from '../getDictionary'
import { locales, isLocale, localeMeta } from '../config'
import en from '../dictionaries/en'

describe('i18n config', () => {
  it('every locale has display metadata', () => {
    for (const l of locales) {
      expect(localeMeta[l]).toBeTruthy()
      expect(localeMeta[l].code).toBe(l)
      expect(localeMeta[l].label.length).toBeGreaterThan(0)
    }
  })

  it('isLocale guards correctly', () => {
    expect(isLocale('ms')).toBe(true)
    expect(isLocale('xx')).toBe(false)
  })
})

describe('getDictionary', () => {
  it('returns the English base for the default locale', async () => {
    const t = await getDictionary('en')
    expect(t.nav.home).toBe('Home')
    expect(t).toEqual(en)
  })

  it('applies translated keys for a locale', async () => {
    const ms = await getDictionary('ms')
    expect(ms.nav.home).toBe('Laman Utama')
    expect(ms.common.search).toBe('Cari')
    const th = await getDictionary('th')
    expect(th.common.compare).toBe('เปรียบเทียบ')
  })

  it('falls back to English for untranslated keys', async () => {
    const ms = await getDictionary('ms')
    // bigPicture is not in the ms partial dictionary yet.
    expect(ms.nav.bigPicture).toBe(en.nav.bigPicture)
  })

  it('resolves a full dictionary (no missing keys) for every locale', async () => {
    const keysOf = (obj: Record<string, unknown>, prefix = ''): string[] =>
      Object.entries(obj).flatMap(([k, v]) =>
        v && typeof v === 'object'
          ? keysOf(v as Record<string, unknown>, `${prefix}${k}.`)
          : [`${prefix}${k}`]
      )
    const baseKeys = keysOf(en).sort()
    for (const l of locales) {
      const dict = await getDictionary(l)
      expect(keysOf(dict).sort()).toEqual(baseKeys)
    }
  })
})
