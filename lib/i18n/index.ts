// Public entry point for the i18n groundwork.
//
// Server usage:
//   import { getDictionary } from '@/lib/i18n'
//   const t = await getDictionary(locale)   // locale: Locale
//   <h1>{t.ev.pageTitle}</h1>
//
// Adopting locale-prefixed routing (`/[lang]/...`) and a language switcher is
// the next step — see docs/i18n-groundwork.html.

export { locales, defaultLocale, localeMeta, isLocale, type Locale, type LocaleMeta } from './config'
export { getDictionary } from './getDictionary'
export { default as enDictionary, type Dictionary } from './dictionaries/en'
export type { LocaleDictionary, DeepPartial } from './types'
