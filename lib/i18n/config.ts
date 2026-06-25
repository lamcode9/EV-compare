// i18n configuration — single source of truth for which locales the site
// supports. This is *groundwork*: it establishes the locale list, types, and
// metadata so UI strings can be translated incrementally. It does NOT yet add
// locale-prefixed routing (`/[lang]/...`) — adopting that is the next step and
// is documented in docs/i18n-groundwork.html.

export const locales = ['en', 'ms', 'id', 'th', 'vi'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

// Display metadata for a language switcher. `label` is the language's endonym
// (its name in its own language) so it reads naturally in the picker.
export interface LocaleMeta {
  code: Locale
  label: string
  englishLabel: string
  flag: string
  /** Text direction. All currently supported locales are left-to-right. */
  dir: 'ltr' | 'rtl'
}

export const localeMeta: Record<Locale, LocaleMeta> = {
  en: { code: 'en', label: 'English', englishLabel: 'English', flag: '🇬🇧', dir: 'ltr' },
  ms: { code: 'ms', label: 'Bahasa Melayu', englishLabel: 'Malay', flag: '🇲🇾', dir: 'ltr' },
  id: { code: 'id', label: 'Bahasa Indonesia', englishLabel: 'Indonesian', flag: '🇮🇩', dir: 'ltr' },
  th: { code: 'th', label: 'ไทย', englishLabel: 'Thai', flag: '🇹🇭', dir: 'ltr' },
  vi: { code: 'vi', label: 'Tiếng Việt', englishLabel: 'Vietnamese', flag: '🇻🇳', dir: 'ltr' },
}
