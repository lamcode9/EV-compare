import type { Metadata } from 'next'
import ScoreboardClient from './page-client'

export const metadata: Metadata = {
  title: 'Adoption Scoreboard — battery.mom',
  description:
    'Country-by-country rankings for EV adoption, charging infrastructure, solar capacity, and battery storage penetration across Southeast Asia.',
  openGraph: {
    title: 'SEA Adoption Scoreboard — battery.mom',
    description: 'Compare EV adoption, charging infra, solar, and BESS across 6 Southeast Asian countries.',
    url: 'https://battery.mom/scoreboard',
    siteName: 'battery.mom',
    type: 'website',
  },
}

export default function ScoreboardPage() {
  return <ScoreboardClient />
}
