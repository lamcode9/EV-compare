import { TableSkeleton } from '@/components/Skeletons'

// Shown while both vehicles are fetched in parallel (Prisma Promise.all).
// Mirrors the VehicleComparisonClient layout: title, two-up vehicle cards,
// then the comparison table.
export default function ComparisonLoading() {
  return (
    <main className="min-h-screen pt-12 md:pt-14">
      <section className="container mx-auto px-4 pt-12 pb-16 max-w-7xl">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-100 rounded w-24 mb-8" />
          <div className="h-10 bg-gray-200 rounded w-2/5 mb-10" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div className="bg-gray-100 rounded-xl h-40" />
            <div className="bg-gray-100 rounded-xl h-40" />
          </div>
        </div>

        <TableSkeleton rows={8} cols={3} />
      </section>
    </main>
  )
}
