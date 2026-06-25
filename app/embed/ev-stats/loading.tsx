import { StatsSkeleton } from '@/components/Skeletons'

// Embed widget — minimal chrome. Shown while EV stats are aggregated from the
// database (Prisma count/groupBy/findMany). Keeps the iframe from flashing blank.
export default function EmbedEvStatsLoading() {
  return (
    <div className="space-y-4 p-4">
      <div className="animate-pulse h-6 bg-gray-200 rounded w-1/3" />
      <StatsSkeleton count={4} />
    </div>
  )
}
