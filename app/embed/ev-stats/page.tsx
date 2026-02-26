import { prisma } from '@/lib/prisma'
import EmbedEvStatsClient from './client'

export const revalidate = 3600 // revalidate hourly

export default async function EmbedEvStatsPage() {
  const [totalVehicles, countryStats, topByRange, topByEfficiency] = await Promise.all([
    prisma.vehicle.count(),
    prisma.vehicle.groupBy({
      by: ['country'],
      _count: true,
      orderBy: { _count: { country: 'desc' } },
    }),
    prisma.vehicle.findMany({
      where: { rangeKm: { not: null } },
      orderBy: { rangeKm: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        rangeKm: true,
        country: true,
      },
    }),
    prisma.vehicle.findMany({
      where: { efficiencyKwhPer100km: { not: null, gt: 0 } },
      orderBy: { efficiencyKwhPer100km: 'asc' },
      take: 5,
      select: {
        id: true,
        name: true,
        efficiencyKwhPer100km: true,
        country: true,
      },
    }),
  ])

  const countryFlags: Record<string, string> = {
    SG: '🇸🇬', MY: '🇲🇾', TH: '🇹🇭', ID: '🇮🇩', VN: '🇻🇳', PH: '🇵🇭',
  }

  const stats = {
    totalVehicles,
    countryCounts: countryStats.map((c) => ({
      country: c.country,
      flag: countryFlags[c.country] || '',
      count: c._count,
    })),
    topRange: topByRange.map((v) => ({
      name: v.name,
      range: v.rangeKm,
      country: v.country,
      flag: countryFlags[v.country] || '',
    })),
    topEfficiency: topByEfficiency.map((v) => ({
      name: v.name,
      efficiency: v.efficiencyKwhPer100km,
      country: v.country,
      flag: countryFlags[v.country] || '',
    })),
  }

  return <EmbedEvStatsClient stats={stats} />
}
