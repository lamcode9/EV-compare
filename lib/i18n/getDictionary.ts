// NOTE: server-only loader. Call from Server Components / route handlers and
// pass the resolved dictionary down to Client Components as a prop. (We avoid the
// `server-only` package to keep the dependency surface minimal.)
import { type Locale, defaultLocale } from './config'
import en, { type Dictionary } from './dictionaries/en'
import type { LocaleDictionary } from './types'

// Locale overrides are loaded lazily so only the requested language's strings
// are pulled into a given request's bundle.
const loaders: Record<Exclude<Locale, 'en'>, () => Promise<{ default: LocaleDictionary }>> = {
  ms: () => import('./dictionaries/ms'),
  id: () => import('./dictionaries/id'),
  th: () => import('./dictionaries/th'),
  vi: () => import('./dictionaries/vi'),
}

/** Deep-merge a partial locale dictionary over the English base so any
 *  untranslated key gracefully falls back to English. The dictionary is a tree
 *  of nested string maps (no arrays), so a plain recursive object merge suffices. */
function merge(base: Record<string, unknown>, override: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...base }
  for (const key of Object.keys(override)) {
    const o = override[key]
    const b = base[key]
    if (o === undefined) continue
    if (o && typeof o === 'object' && b && typeof b === 'object') {
      out[key] = merge(b as Record<string, unknown>, o as Record<string, unknown>)
    } else {
      out[key] = o
    }
  }
  return out
}

/**
 * Server-side dictionary loader. Returns the fully-resolved dictionary for a
 * locale (English values fill any gaps). Use in Server Components / route
 * handlers; pass the resolved object down to Client Components as a prop.
 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  if (locale === defaultLocale) return en
  const loader = loaders[locale as Exclude<Locale, 'en'>]
  if (!loader) return en
  const mod = await loader()
  return merge(
    en as unknown as Record<string, unknown>,
    mod.default as Record<string, unknown>
  ) as unknown as Dictionary
}
