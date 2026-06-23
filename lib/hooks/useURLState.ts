'use client'

import { useCallback, useEffect, useRef } from 'react'

type ParamDef = {
  key: string
  /** Current value */
  value: string | number | boolean
  /** Default value — if current matches default, param is omitted from URL */
  defaultValue: string | number | boolean
  /** Setter to call when URL has a value on mount */
  setter: (v: any) => void
  /** Type hint for parsing the URL string back into the correct type */
  type?: 'string' | 'number' | 'boolean'
}

/**
 * Syncs an array of param definitions to the URL query string.
 *
 * - On mount: reads URL params and calls each setter if the param exists.
 * - On change: debounces and writes all non-default values to the URL.
 *
 * Usage:
 *   useURLState([
 *     { key: 'country', value: country, defaultValue: 'MY', setter: setCountry, type: 'string' },
 *     { key: 'solar', value: solarSizeKw, defaultValue: 10, setter: setSolarSizeKw, type: 'number' },
 *   ])
 */
export function useURLState(params: ParamDef[], debounceMs = 300) {
  const hasHydrated = useRef(false)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  // On mount — read URL and hydrate state
  useEffect(() => {
    if (hasHydrated.current) return
    hasHydrated.current = true

    if (typeof window === 'undefined') return

    const searchParams = new URLSearchParams(window.location.search)
    let hadAnyParam = false

    for (const param of params) {
      const urlValue = searchParams.get(param.key)
      if (urlValue === null) continue

      hadAnyParam = true

      const type = param.type || (typeof param.defaultValue === 'number' ? 'number' : typeof param.defaultValue === 'boolean' ? 'boolean' : 'string')

      switch (type) {
        case 'number': {
          const num = Number(urlValue)
          if (!isNaN(num)) param.setter(num)
          break
        }
        case 'boolean':
          param.setter(urlValue === 'true' || urlValue === '1')
          break
        default:
          param.setter(urlValue)
      }
    }

    // If we hydrated from URL, don't re-write immediately
    if (hadAnyParam) {
      // Small delay to let React process state updates before we start watching for changes
      setTimeout(() => {}, 50)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only on mount

  // On value change — debounce and write to URL
  const serialised = params.map(p => `${p.key}=${p.value}`).join('&')

  useEffect(() => {
    // Skip the first render (hydration is handling it)
    if (!hasHydrated.current) return

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      if (typeof window === 'undefined') return

      const searchParams = new URLSearchParams()

      for (const param of params) {
        // Only add non-default values
        if (String(param.value) !== String(param.defaultValue)) {
          searchParams.set(param.key, String(param.value))
        }
      }

      const qs = searchParams.toString()
      const newUrl = qs
        ? `${window.location.pathname}?${qs}`
        : window.location.pathname

      // Only update if different to avoid infinite loops
      if (newUrl !== `${window.location.pathname}${window.location.search}`) {
        window.history.replaceState(null, '', newUrl)
      }
    }, debounceMs)

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialised, debounceMs])
}

/**
 * Returns current URL search params as a shareable link.
 */
export function getShareableLink(): string {
  if (typeof window === 'undefined') return ''
  return window.location.href
}

/**
 * Copies the current URL to clipboard and returns success status.
 */
export async function copyShareLink(): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(getShareableLink())
    return true
  } catch {
    return false
  }
}
