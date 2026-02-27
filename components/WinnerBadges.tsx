'use client'

import { useMemo } from 'react'
import { Vehicle } from '@/types/vehicle'
import { calculateCostPerKm, getAcceleration0To100Kmh } from '@/lib/utils'

/* ── Badge definitions ───────────────────────────────────────── */

export interface Badge {
  id: string
  label: string
  icon: string
  color: string        // Tailwind text color
  bgColor: string      // Tailwind bg color
  borderColor: string   // Tailwind border color
}

const BADGE_DEFS: Badge[] = [
  { id: 'best-range',      label: 'Best Range',       icon: '🛣️', color: 'text-emerald-700', bgColor: 'bg-emerald-50',  borderColor: 'border-emerald-200' },
  { id: 'most-efficient',  label: 'Most Efficient',   icon: '⚡',  color: 'text-blue-700',    bgColor: 'bg-blue-50',     borderColor: 'border-blue-200' },
  { id: 'best-value',      label: 'Best Value',       icon: '💰',  color: 'text-amber-700',   bgColor: 'bg-amber-50',    borderColor: 'border-amber-200' },
  { id: 'biggest-battery', label: 'Biggest Battery',  icon: '🔋',  color: 'text-purple-700',  bgColor: 'bg-purple-50',   borderColor: 'border-purple-200' },
  { id: 'fastest-charge',  label: 'Fastest Charge',   icon: '⚡',  color: 'text-cyan-700',    bgColor: 'bg-cyan-50',     borderColor: 'border-cyan-200' },
  { id: 'most-powerful',   label: 'Most Powerful',    icon: '💪',  color: 'text-red-700',     bgColor: 'bg-red-50',      borderColor: 'border-red-200' },
  { id: 'quickest',        label: 'Quickest',         icon: '🏎️', color: 'text-orange-700',  bgColor: 'bg-orange-50',   borderColor: 'border-orange-200' },
  { id: 'cheapest',        label: 'Most Affordable',  icon: '🏷️', color: 'text-green-700',   bgColor: 'bg-green-50',    borderColor: 'border-green-200' },
]

/* ── Badge computation ───────────────────────────────────────── */

export type VehicleBadges = Map<string, Badge[]> // vehicleId → badges

export function computeBadges(vehicles: Vehicle[]): VehicleBadges {
  if (vehicles.length < 2) return new Map()

  const result: VehicleBadges = new Map()
  vehicles.forEach(v => result.set(v.id, []))

  const findBadge = (id: string) => BADGE_DEFS.find(b => b.id === id)!

  // Best Range
  const ranges = vehicles.map(v => ({ id: v.id, val: v.rangeKm ?? 0 })).filter(v => v.val > 0)
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

  // Best Value (lowest cost per km)
  const costs = vehicles.map(v => {
    const cost = (v.batteryCapacityKwh && v.rangeKm) ? calculateCostPerKm(v.country, v.batteryCapacityKwh, v.rangeKm) : null
    return { id: v.id, val: cost ?? Infinity }
  }).filter(v => v.val < Infinity)
  if (costs.length > 0) {
    const best = Math.min(...costs.map(c => c.val))
    costs.filter(c => c.val === best).forEach(c => result.get(c.id)!.push(findBadge('best-value')))
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
          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full border
            ${badge.bgColor} ${badge.borderColor} ${badge.color}
            ${size === 'sm' ? 'text-[9px]' : 'text-[10px]'} font-semibold whitespace-nowrap
            transition-transform hover:scale-105`}
          title={badge.label}
        >
          <span>{badge.icon}</span>
          <span>{badge.label}</span>
        </span>
      ))}
      {extra > 0 && (
        <span className="text-[9px] text-gray-400 self-center">+{extra}</span>
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
          className={`inline-flex items-center gap-0.5 px-1 py-0 rounded-full border
            ${badge.bgColor} ${badge.borderColor} ${badge.color}
            text-[8px] font-semibold whitespace-nowrap`}
          title={badge.label}
        >
          <span className="text-[7px]">{badge.icon}</span>
          <span>{badge.label}</span>
        </span>
      ))}
      {badges.length > 2 && (
        <span className="text-[8px] text-gray-400">+{badges.length - 2}</span>
      )}
    </div>
  )
}
