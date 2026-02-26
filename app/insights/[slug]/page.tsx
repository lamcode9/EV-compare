import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ARTICLES, getArticleBySlug } from '@/content/articles'

// Dynamic content imports
import LfpVsNmc from '@/content/lfp-vs-nmc-tropical-climates'
import ZeroBillMY from '@/content/can-13kwh-battery-zero-bill-malaysia'
import EvAdoption2024 from '@/content/ev-adoption-southeast-asia-2024-review'

const CONTENT_MAP: Record<string, React.ComponentType> = {
  'lfp-vs-nmc-tropical-climates': LfpVsNmc,
  'can-13kwh-battery-zero-bill-malaysia': ZeroBillMY,
  'ev-adoption-southeast-asia-2024-review': EvAdoption2024,
}

const CATEGORY_COLORS: Record<string, string> = {
  Explainer: 'bg-blue-50 text-blue-700 border-blue-200',
  'Market Data': 'bg-purple-50 text-purple-700 border-purple-200',
  'Deep Dive': 'bg-amber-50 text-amber-700 border-amber-200',
}

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return {}
  return {
    title: `${article.title} — battery.mom`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      url: `https://battery.mom/insights/${article.slug}`,
      siteName: 'battery.mom',
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author],
      tags: article.tags,
    },
  }
}

export default async function InsightArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  const Content = CONTENT_MAP[slug]
  if (!Content) notFound()

  return (
    <main className="min-h-screen pt-12 md:pt-14">
      <section className="container mx-auto px-4 pt-12 pb-16 max-w-3xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/insights" className="hover:text-emerald-600 transition-colors">Insights</Link>
          <span>/</span>
          <span className="text-gray-700 truncate">{article.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                CATEGORY_COLORS[article.category] || 'bg-gray-50 text-gray-700 border-gray-200'
              }`}
            >
              {article.category}
            </span>
            <span className="text-xs text-gray-400">{article.readingTime} min read</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
            {article.title}
          </h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">{article.description}</p>
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
            <span>{article.author}</span>
            <span>·</span>
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          </div>
        </header>

        {/* Article body */}
        <Content />

        {/* Tags */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* More articles */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">More from battery.mom</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ARTICLES.filter((a) => a.slug !== slug)
              .slice(0, 2)
              .map((a) => (
                <Link
                  key={a.slug}
                  href={`/insights/${a.slug}`}
                  className="group bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                >
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      CATEGORY_COLORS[a.category] || 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    {a.category}
                  </span>
                  <h4 className="text-sm font-semibold text-gray-900 mt-2 group-hover:text-emerald-700 transition-colors leading-snug">
                    {a.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{a.description}</p>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  )
}
