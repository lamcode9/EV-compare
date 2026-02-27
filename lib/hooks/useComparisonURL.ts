'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useVehicleStore } from '@/store/VehicleStore'

/**
 * useComparisonURL — syncs selected vehicle IDs with URL search params
 *
 * URL format: /ev?compare=id1,id2,id3
 *
 * - On mount: reads `?compare=` param and hydrates selectedVehicles from store.vehicles
 * - On selection change: updates URL without full page reload
 * - Shareable links: users can copy the URL to share a specific comparison
 */
export function useComparisonURL() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { vehicles, selectedVehicles, addVehicle, clearAll } = useVehicleStore()
  const initialised = useRef(false)
  const isUpdatingUrl = useRef(false)

  // ── Hydrate from URL on first mount (once vehicles are loaded) ──
  useEffect(() => {
    if (initialised.current || vehicles.length === 0) return

    const compareParam = searchParams.get('compare')
    if (!compareParam) {
      initialised.current = true
      return
    }

    const ids = compareParam.split(',').filter(Boolean).slice(0, 4)
    if (ids.length === 0) {
      initialised.current = true
      return
    }

    // Clear existing selection and add vehicles from URL
    clearAll()
    // Use setTimeout to let clearAll settle before adding
    setTimeout(() => {
      ids.forEach(id => {
        const vehicle = vehicles.find(v => v.id === id)
        if (vehicle) addVehicle(vehicle)
      })
      initialised.current = true
    }, 0)
  }, [vehicles, searchParams, addVehicle, clearAll])

  // ── Update URL when selection changes ──
  useEffect(() => {
    if (!initialised.current) return
    if (isUpdatingUrl.current) {
      isUpdatingUrl.current = false
      return
    }

    const ids = selectedVehicles.map(v => v.id)
    const currentParam = searchParams.get('compare') ?? ''
    const newParam = ids.join(',')

    // Only update if actually changed
    if (currentParam === newParam) return

    isUpdatingUrl.current = true
    const params = new URLSearchParams(searchParams.toString())

    if (ids.length > 0) {
      params.set('compare', newParam)
    } else {
      params.delete('compare')
    }

    const qs = params.toString()
    const newUrl = qs ? `${pathname}?${qs}` : pathname
    router.replace(newUrl, { scroll: false })
  }, [selectedVehicles, searchParams, pathname, router])

  /**
   * Get a shareable URL for the current comparison
   */
  const getShareURL = (): string => {
    if (typeof window === 'undefined') return ''
    const ids = selectedVehicles.map(v => v.id).join(',')
    const base = `${window.location.origin}${pathname}`
    return ids ? `${base}?compare=${ids}` : base
  }

  return { getShareURL }
}
