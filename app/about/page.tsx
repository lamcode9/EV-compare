import type { Metadata } from 'next'
import Link from 'next/link'
import { NextSteps } from '@/components/ui/NextSteps'

export const metadata: Metadata = {
  title: 'About - battery.mom',
  description: 'Independent EV comparison tool for Southeast Asia. Real numbers and data.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-paper pt-12 md:pt-14">
      <section className="container mx-auto px-4 pt-12 pb-16 max-w-7xl">
      <div className="max-w-4xl">
        {/* Hero Title */}
        <h1 className="font-display text-6xl md:text-7xl font-medium mb-10 text-ink tracking-tight">
          battery.mom
        </h1>

        {/* Intro */}
        <p className="text-xl md:text-2xl leading-relaxed text-ink-800 mb-10 font-medium">
          We&apos;re obsessed with one simple idea: <strong className="text-ev-primary font-bold">batteries are the new oil</strong>.
        </p>

        {/* Body */}
        <div className="space-y-6 text-ink-700 leading-relaxed text-lg">
          <p>
            In the next decade, lithium-ion (and the chemistries that come after it) will reshape transportation, homes, and entire electric grids. Electric vehicles are just the beginning. The real revolution happens when every home, business, and community can store its own energy — turning intermittent solar and wind into reliable, 24/7 power.
          </p>

          <p>
            That revolution is already happening faster than most people realise — but good, up-to-date information in one place is still surprisingly hard to find.
          </p>

          <p className="text-xl font-semibold text-ink">
            battery.mom exists to solve exactly that.
          </p>

          <p>
            We collect, verify, and publish the clearest possible numbers — real costs, real payback periods, real adoption rates, real policy changes — with a special focus on Southeast Asia and the rest of the planet.
          </p>

          <p>
            Our only job is to give homeowners, businesses, installers, and policymakers the data they actually need to make faster, better decisions.
          </p>

          <p className="text-lg font-semibold text-ink border-l-4 border-ev-primary pl-4 py-2 bg-paper-200 rounded-r">
            No sponsorships. No affiliate links. No ads. Ever.
          </p>

          <p>
            Just clean, updated data every month so the transition can move as quickly as possible.
          </p>
        </div>

        {/* What you'll find section */}
        <div className="mt-12 pt-8 border-t border-ink/10">
          <h2 className="text-2xl md:text-3xl font-bold text-ink mb-6">
            What you&apos;ll find here
          </h2>

          <ul className="space-y-4 text-ink-700 text-lg list-none p-0 m-0">
            <li className="flex items-start gap-3">
              <span className="text-ev-primary font-bold mt-1">•</span>
              <span>Live country-by-country adoption scoreboards and payback calculators</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-ev-primary font-bold mt-1">•</span>
              <span>Side-by-side comparisons of batteries and EVs using local prices and incentives</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-ev-primary font-bold mt-1">•</span>
              <span>Monthly-updated datasets and interactive maps</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-ev-primary font-bold mt-1">•</span>
              <span>Straightforward breakdowns for consumers and businesses</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-ev-primary font-bold mt-1">•</span>
              <span className="font-semibold text-ink">Zero hype. Just facts.</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-ink/10">
          <p className="text-ink-600 text-base">
            battery.mom is a <a href="https://lamonade.xyz" className="text-yellow-500 hover:text-yellow-600 font-semibold transition-colors underline decoration-2 underline-offset-2">Lamonade</a> project.
          </p>
          <p className="text-ink-600 text-base mt-2">
            Data starts now — full launch 2026.
          </p>
        </div>

      </div>
      </section>

      <NextSteps route="/about" />
    </main>
  )
}

