import SectionSkeleton, { StatsSkeleton, ChartSkeleton } from '@/components/Skeletons'

// Shown while the vehicle is fetched from the database (Prisma findUnique).
// Mirrors the VehicleDetailClient layout: back link, title block, stat cards,
// then a chart/spec section.
export default function VehicleDetailLoading() {
  return (
    <main className="min-h-screen pt-12 md:pt-14">
      <section className="container mx-auto px-4 pt-12 pb-16 max-w-7xl">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-100 rounded w-24 mb-8" />
          <div className="h-10 bg-gray-200 rounded w-1/2 mb-3" />
          <div className="h-4 bg-gray-100 rounded w-1/3 mb-10" />
        </div>

        <StatsSkeleton count={4} />

        <div className="mt-10">
          <ChartSkeleton />
        </div>

        <div className="mt-10">
          <SectionSkeleton rows={3} />
        </div>
      </section>
    </main>
  )
}
