'use client'

import { useMemo } from 'react'
import { Vehicle } from '@/types/vehicle'
import { getAcceleration0To100Kmh, getRangeKm } from '@/lib/utils'

/* ── Badge definitions ───────────────────────────────────────── */

export interface Badge {
  id: string
  label: string
  icon: string
  tooltip: string      // Methodology explanation shown on hover
  color: string        // Tailwind text color
  bgColor: string      // Tailwind bg color
  borderColor: string   // Tailwind border color
}

const BADGE_DEFS: Badge[] = [
  { id: 'best-range',      label: 'Best Range',       icon: '🛣️', tooltip: 'Highest WLTP range (km). BEVs only.',                                           color: 'text-brand-700', bgColor: 'bg-brand-50',  borderColor: 'border-brand-200' },
  { id: 'most-efficient',  label: 'Most Efficient',   icon: '⚡',  tooltip: 'Lowest energy consumption (kWh per 100 km).',                                     color: 'text-blue-700',    bgColor: 'bg-blue-50',     borderColor: 'border-blue-200' },
  { id: 'best-value',      label: 'Best Value',       icon: '💰',  tooltip: 'Lowest purchase price per km of electric range. Metric: base price ÷ range.',     color: 'text-amber-700',   bgColor: 'bg-amber-50',    borderColor: 'border-amber-200' },
  { id: 'biggest-battery', label: 'Biggest Battery',  icon: '🔋',  tooltip: 'Highest usable battery capacity (kWh). Larger batteries may offer better longevity and V2L/V2H capability.', color: 'text-purple-700',  bgColor: 'bg-purple-50',   borderColor: 'border-purple-200' },
  { id: 'fastest-charge',  label: 'Fastest Charge',   icon: '⚡',  tooltip: 'Shortest DC fast-charge time from 0 to 80% (minutes).',                            color: 'text-cyan-700',    bgColor: 'bg-cyan-50',     borderColor: 'border-cyan-200' },
  { id: 'most-powerful',   label: 'Most Powerful',    icon: '💪',  tooltip: 'Highest motor output (kW). Higher power does not always mean faster 0-100.',       color: 'text-red-700',     bgColor: 'bg-red-50',      borderColor: 'border-red-200' },
  { id: 'quickest',        label: 'Quickest',         icon: '🏎️', tooltip: 'Fastest 0-100 km/h acceleration (seconds). Manufacturer-stated figures only.',     color: 'text-orange-700',  bgColor: 'bg-orange-50',   borderColor: 'border-orange-200' },
  { id: 'cheapest',        label: 'Most Affordable',  icon: '🏷️', tooltip: 'Lowest base price in local currency. Does not include on-the-road costs or rebates.', color: 'text-green-700',   bgColor: 'bg-green-50',    borderColor: 'border-green-200' },
]

/* ── Badge computation ───────────────────────────────────────── */

export type VehicleBadges = Map<string, Badge[]> // vehicleId → badges

export function computeBadges(vehicles: Vehicle[]): VehicleBadges {
  if (vehicles.length < 2) return new Map()

  const result: VehicleBadges = new Map()
  vehicles.forEach(v => result.set(v.id, []))

  const findBadge = (id: string) => BADGE_DEFS.find(b => b.id === id)!

  // Best Range
  const ranges = vehicles.map(v => ({ id: v.id, val: getRangeKm(v) ?? 0 })).filter(v => v.val > 0)
  if (ranges.length > 0) {
    const best = Math.max(...ranges.map(r => r.val))
    ranges.filter(r => r.val === best).forEach(r => result.get(r.id)!.push(findBadge('best-range')))
  }

  // Most Efficient (lower is better)
  const effs = vehicles.map(v => ({ id: v.id, val: v.efficiencyKwhPer100km ?? Infinity })).filter(v => v.val < Infinity && v.val > 0)
  if (effs.length > 0) {
    const best = Math.min(...effs.map(e => e.val))
    effs.filter(e => e.val === best).forEach(e => result.get(e.id)!.push(findBadge('most-efficient')))
  }

  // Best Value (lowest purchase price per km of electric range — same metric as QuickPicks)
  const values = vehicles.map(v => {
    const range = getRangeKm(v)
    const price = v.basePriceLocalCurrency
    return { id: v.id, val: (price && range && range > 0) ? price / range : Infinity }
  }).filter(v => v.val < Infinity)
  if (values.length > 0) {
    const best = Math.min(...values.map(c => c.val))
    values.filter(c => c.val === best).forEach(c => result.get(c.id)!.push(findBadge('best-value')))
  }

  // Biggest Battery
  const caps = vehicles.map(v => ({ id: v.id, val: v.batteryCapacityKwh ?? 0 })).filter(v => v.val > 0)
  if (caps.length > 0) {
    const best = Math.max(...caps.map(c => c.val))
    caps.filter(c => c.val === best).forEach(c => result.get(c.id)!.push(findBadge('biggest-battery')))
  }

  // Fastest Charge (lower is better)
  const charges = vehicles.map(v => ({ id: v.id, val: v.chargingTimeDc0To80Min ?? Infinity })).filter(v => v.val < Infinity && v.val > 0)
  if (charges.length > 0) {
    const best = Math.min(...charges.map(c => c.val))
    charges.filter(c => c.val === best).forEach(c => result.get(c.id)!.push(findBadge('fastest-charge')))
  }

  // Most Powerful
  const powers = vehicles.map(v => ({ id: v.id, val: v.powerRatingKw ?? 0 })).filter(v => v.val > 0)
  if (powers.length > 0) {
    const best = Math.max(...powers.map(p => p.val))
    powers.filter(p => p.val === best).forEach(p => result.get(p.id)!.push(findBadge('most-powerful')))
  }

  // Quickest (0-100, lower is better)
  const accels = vehicles.map(v => ({
    id: v.id,
    val: getAcceleration0To100Kmh(v.acceleration0To100Kmh, v.powerRatingKw, v.curbWeightKg) ?? Infinity
  })).filter(v => v.val < Infinity && v.val > 0)
  if (accels.length > 0) {
    const best = Math.min(...accels.map(a => a.val))
    accels.filter(a => a.val === best).forEach(a => result.get(a.id)!.push(findBadge('quickest')))
  }

  // Most Affordable (lowest base price)
  const prices = vehicles.map(v => ({ id: v.id, val: v.basePriceLocalCurrency ?? Infinity })).filter(v => v.val < Infinity && v.val > 0)
  if (prices.length > 0) {
    const best = Math.min(...prices.map(p => p.val))
    prices.filter(p => p.val === best).forEach(p => result.get(p.id)!.push(findBadge('cheapest')))
  }

  return result
}

/* ── Render components ───────────────────────────────────────── */

interface WinnerBadgesProps {
  badges: Badge[]
  maxShow?: number
  size?: 'sm' | 'md'
}

export default function WinnerBadges({ badges, maxShow = 3, size = 'sm' }: WinnerBadgesProps) {
  if (badges.length === 0) return null

  const shown = badges.slice(0, maxShow)
  const extra = badges.length - maxShow

  return (
    <div className="flex flex-wrap gap-1 justify-center">
      {shown.map((badge) => (
        <span
          key={badge.id}
          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full
            ${badge.bgColor} ${badge.color}
            ${size === 'sm' ? 'text-[9px]' : 'text-[10px]'} font-semibold whitespace-nowrap
            transition-transform hover:scale-105`}
          title={badge.tooltip}
        >
          <span>{badge.icon}</span>
          <span>{badge.label}</span>
        </span>
      ))}
      {extra > 0 && (
        <span className="text-[9px] text-ink-400 self-center">+{extra}</span>
      )}
    </div>
  )
}

/**
 * Inline badge for use inside comparison table header per vehicle column
 */
export function InlineBadgeRow({ badges }: { badges: Badge[] }) {
  if (badges.length === 0) return null
  return (
    <div className="flex flex-wrap gap-0.5 justify-center mt-1">
      {badges.slice(0, 2).map((badge) => (
        <span
          key={badge.id}
          className={`inline-flex items-center gap-0.5 px-1 py-0 rounded-full
            ${badge.bgColor} ${badge.color}
            text-[8px] font-semibold whitespace-nowrap`}
          title={badge.tooltip}
        >
          <span className="text-[7px]">{badge.icon}</span>
          <span>{badge.label}</span>
        </span>
      ))}
      {badges.length > 2 && (
        <span className="text-[8px] text-ink-400">+{badges.length - 2}</span>
      )}
    </div>
  )
}
