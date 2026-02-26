'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CURRENCY_SYMBOLS as CURRENCY, COUNTRY_NAMES } from '@/lib/constants'

interface Vehicle {
  id: string
  name: string
  country: string
  batteryCapacityKwh: number | null
  rangeWltpKm: number | null
  rangeEpaKm: number | null
  efficiencyKwhPer100km: number | null
  basePriceLocalCurrency: number | null
  onTheRoadPriceLocalCurrency: number | null
  batteryTechnology: string | null
  chargingTimeDc0To80Min: number | null
  powerRatingKw: number | null
  acceleration0To100Kmh: number | null
  topSpeedKmh: number | null
}

export default function ShareComparisonClient() {
  const searchParams = useSearchParams()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const ids = searchParams.get('ids')?.split(',').filter(Boolean) || []

  useEffect(() => {
    if (ids.length === 0) {
      setLoading(false)
      setError('No vehicles specified. Add vehicle IDs to the URL like ?ids=id1,id2')
      return
    }

    async function fetchVehicles() {
      try {
        const results = await Promise.all(
          ids.map(async (id) => {
            const res = await fetch(`/api/vehicles/${id}`)
            if (!res.ok) return null
            return res.json()
          })
        )
        setVehicles(results.filter(Boolean))
      } catch {
        setError('Failed to load vehicles')
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const copyShareLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    alert('Link copied to clipboard!')
  }

  if (loading) {
    return (
      <main className="min-h-screen pt-12 md:pt-14">
        <section className="container mx-auto px-4 pt-12 pb-16 max-w-7xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-gray-100 rounded-xl" />
              ))}
            </div>
          </div>
        </section>
      </main>
    )
  }

  if (error || vehicles.length === 0) {
    return (
      <main className="min-h-screen pt-12 md:pt-14">
        <section className="container mx-auto px-4 pt-12 pb-16 max-w-7xl text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No vehicles found</h1>
          <p className="text-gray-600 mb-6">{error || 'The shared comparison link may have expired or the vehicles are no longer available.'}</p>
          <Link href="/ev" className="text-emerald-600 hover:text-emerald-700 font-medium">
            Browse all vehicles
          </Link>
        </section>
      </main>
    )
  }

  const specRows: { label: string; key: string; unit: string; format?: (v: Vehicle) => string }[] = [
    { label: 'Battery', key: 'batteryCapacityKwh', unit: 'kWh' },
    { label: 'Range (WLTP)', key: 'rangeWltpKm', unit: 'km' },
    { label: 'Range (EPA)', key: 'rangeEpaKm', unit: 'km' },
    { label: 'Efficiency', key: 'efficiencyKwhPer100km', unit: 'kWh/100km' },
    { label: 'DC Charging (0–80%)', key: 'chargingTimeDc0To80Min', unit: 'min' },
    { label: 'Power', key: 'powerRatingKw', unit: 'kW' },
    { label: '0–100 km/h', key: 'acceleration0To100Kmh', unit: 's' },
    { label: 'Top Speed', key: 'topSpeedKmh', unit: 'km/h' },
    { label: 'Chemistry', key: 'batteryTechnology', unit: '' },
    {
      label: 'Price',
      key: 'basePriceLocalCurrency',
      unit: '',
      format: (v) =>
        v.basePriceLocalCurrency
          ? `${CURRENCY[v.country] || ''}${v.basePriceLocalCurrency.toLocaleString()}`
          : '—',
    },
  ]

  return (
    <main className="min-h-screen pt-12 md:pt-14">
      <section className="container mx-auto px-4 pt-12 pb-16 max-w-7xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Link href="/ev" className="text-sm text-emerald-600 hover:text-emerald-700">
                EV Comparison
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-sm text-gray-500">Shared Comparison</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Comparing {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}
            </h1>
          </div>
          <button
            onClick={copyShareLink}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-emerald-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Copy link
          </button>
        </div>

        {/* Comparison Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-500 bg-gray-50 sticky left-0 min-w-[140px]">
                  Spec
                </th>
                {vehicles.map((v) => (
                  <th key={v.id} className="text-left px-4 py-3 font-semibold text-gray-900 min-w-[180px]">
                    <Link href={`/ev/${v.id}`} className="hover:text-emerald-600 transition-colors">
                      {v.name}
                    </Link>
                    <div className="text-xs text-gray-400 font-normal mt-0.5">
                      {COUNTRY_NAMES[v.country] || v.country}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specRows.map((row, i) => (
                <tr key={row.key} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className="px-4 py-3 font-medium text-gray-500 sticky left-0 bg-inherit">
                    {row.label}
                  </td>
                  {vehicles.map((v) => {
                    const rawVal = (v as unknown as Record<string, unknown>)[row.key]
                    let display: string
                    if (row.format) {
                      display = row.format(v)
                    } else if (rawVal == null) {
                      display = '—'
                    } else if (typeof rawVal === 'number') {
                      display = `${rawVal.toLocaleString()} ${row.unit}`
                    } else {
                      display = String(rawVal)
                    }
                    return (
                      <td key={v.id} className="px-4 py-3 text-gray-900">
                        {display}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link
            href="/ev"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Build your own comparison
          </Link>
        </div>
      </section>
    </main>
  )
}
