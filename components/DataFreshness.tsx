import { formatDistanceToNow } from 'date-fns'

interface DataFreshnessProps {
  lastUpdated: Date
  className?: string
}

export default function DataFreshness({ lastUpdated, className = '' }: DataFreshnessProps) {
  const timeAgo = formatDistanceToNow(lastUpdated, { addSuffix: true })

  // Determine freshness level
  const now = new Date()
  const daysSinceUpdate = Math.floor((now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24))

  let freshnessColor = 'text-brand-700 bg-brand-50'
  let freshnessText = 'Fresh'

  if (daysSinceUpdate > 90) {
    freshnessColor = 'text-red-700 bg-red-50'
    freshnessText = 'Outdated'
  } else if (daysSinceUpdate > 30) {
    freshnessColor = 'text-yellow-700 bg-yellow-50'
    freshnessText = 'Stale'
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${freshnessColor} ${className}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${
        daysSinceUpdate > 90 ? 'bg-red-500' :
        daysSinceUpdate > 30 ? 'bg-yellow-500' : 'bg-brand-500'
      }`} />
      <span>{freshnessText}</span>
      <span className="text-ink-600">•</span>
      <span className="text-ink-600">{timeAgo}</span>
    </div>
  )
}