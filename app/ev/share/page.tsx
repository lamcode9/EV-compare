import type { Metadata } from 'next'
import ShareComparisonClient from './page-client'

export const metadata: Metadata = {
  title: 'Shared EV Comparison — battery.mom',
  description: 'View a shared electric vehicle comparison on battery.mom.',
}

export default function ShareComparisonPage() {
  return <ShareComparisonClient />
}
