export default function SectionSkeleton({ rows = 3, showHeader = true }: { rows?: number; showHeader?: boolean }) {
  return (
    <div className="animate-pulse space-y-4">
      {showHeader && (
        <>
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-100 rounded w-2/3" />
        </>
      )}
      <div className="space-y-3 mt-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-xl h-24" />
        ))}
      </div>
    </div>
  )
}

export function CardGridSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-xl h-48" />
        ))}
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="animate-pulse bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-4 py-3 flex gap-4 border-b border-gray-100">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-4 bg-gray-100 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="animate-pulse bg-white border border-gray-200 rounded-xl p-6">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
      <div className="h-64 bg-gray-100 rounded-lg" />
    </div>
  )
}

export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="animate-pulse grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
          <div className="h-4 bg-gray-100 rounded w-3/4" />
        </div>
      ))}
    </div>
  )
}
