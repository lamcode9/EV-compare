import type { Dictionary } from './dictionaries/en'

/** Recursively makes every field optional — locale files override only the keys
 *  they have translated; the rest fall back to English. */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

export type LocaleDictionary = DeepPartial<Dictionary>
