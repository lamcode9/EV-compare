'use client'

/**
 * Loading skeleton components for better UX
 */

export function VehicleCardSkeleton() {
  return (
    <div className="bg-paper-100 rounded-lg shadow-lg border border-ink/10 overflow-hidden animate-pulse">
      <div className="bg-gradient-to-r from-paper-200 to-paper-300 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-32 h-24 md:w-48 md:h-32 rounded-lg bg-ink/15" />
            <div>
              <div className="h-8 w-48 bg-ink/15 rounded mb-2" />
              <div className="h-6 w-32 bg-ink/15 rounded" />
            </div>
          </div>
          <div className="h-10 w-24 bg-ink/15 rounded-lg" />
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-6 w-32 bg-paper-300 rounded" />
              <div className="h-16 bg-paper-200 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SearchBoxSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="h-14 bg-paper-300 rounded-lg animate-pulse" />
    </div>
  )
}

export function ComparisonTableSkeleton() {
  return (
    <div className="mt-8 mb-12 bg-paper-100 rounded-lg shadow-lg border border-ink/10 overflow-hidden animate-pulse">
      <div className="bg-gradient-to-r from-paper-200 to-paper-300 p-6">
        <div className="h-8 w-64 bg-ink/15 rounded" />
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-paper-200">
                  <div className="h-4 w-24 bg-ink/15 rounded" />
                </th>
                {[...Array(3)].map((_, i) => (
                  <th key={i} className="px-4 py-3 bg-paper-200">
                    <div className="h-16 w-32 bg-ink/15 rounded mx-auto" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(8)].map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3">
                    <div className="h-4 w-32 bg-paper-300 rounded" />
                  </td>
                  {[...Array(3)].map((_, j) => (
                    <td key={j} className="px-4 py-3 text-center">
                      <div className="h-4 w-16 bg-paper-300 rounded mx-auto" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

