export interface Article {
  slug: string
  title: string
  description: string
  category: 'Explainer' | 'Market Data' | 'Deep Dive'
  publishedAt: string // ISO date
  readingTime: number // minutes
  author: string
  tags: string[]
}

export const ARTICLES: Article[] = [
  {
    slug: 'lfp-vs-nmc-tropical-climates',
    title: 'What is LFP vs NMC? Why battery chemistry matters in tropical climates',
    description:
      'A plain-English guide to the two dominant lithium-ion chemistries — LFP and NMC — and why Southeast Asia\'s heat makes the choice especially important for EVs and home batteries.',
    category: 'Explainer',
    publishedAt: '2025-02-15',
    readingTime: 8,
    author: 'battery.mom',
    tags: ['battery chemistry', 'LFP', 'NMC', 'thermal management', 'BESS'],
  },
  {
    slug: 'can-13kwh-battery-zero-bill-malaysia',
    title: 'Can a 13.5 kWh battery zero your electricity bill in Malaysia?',
    description:
      'We run the numbers on a typical Malaysian household pairing rooftop solar with a 13.5 kWh home battery — covering self-consumption, net metering, payback period, and the edge cases that trip people up.',
    category: 'Deep Dive',
    publishedAt: '2025-02-12',
    readingTime: 10,
    author: 'battery.mom',
    tags: ['Malaysia', 'home battery', 'zero bill', 'solar', 'net metering'],
  },
  {
    slug: 'ev-adoption-southeast-asia-2024-review',
    title: 'EV adoption in Southeast Asia: 2024 year in review',
    description:
      'A data-packed look at how EV sales, charging infrastructure, and policy evolved across SG, MY, TH, ID, VN, and PH in 2024 — plus what the trajectory looks like for 2025.',
    category: 'Market Data',
    publishedAt: '2025-02-08',
    readingTime: 12,
    author: 'battery.mom',
    tags: ['EV adoption', 'Southeast Asia', 'market data', '2024 review'],
  },
]

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug)
}

export function getArticlesByCategory(category: Article['category']): Article[] {
  return ARTICLES.filter((a) => a.category === category)
}
