import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import NewsletterSignup from '@/components/NewsletterSignup'

export const metadata: Metadata = {
  title: 'battery.mom - Battery and solar adoption data',
  description:
    'Independent data for tracking battery, solar, EV, and storage adoption across Southeast Asia and the wider energy transition.',
  alternates: { canonical: '/' },
}

const decisionPaths = [
  {
    eyebrow: 'Residential systems',
    title: 'Solar + battery economics',
    description:
      'Model tariffs, rooftop solar, storage size, EV charging load, bill impact, and payback using local assumptions.',
    href: '/bess/home',
    cta: 'Open planner',
  },
  {
    eyebrow: 'Transport batteries',
    title: 'EV battery and cost signals',
    description:
      'Compare local EV prices, usable range, efficiency, battery chemistry, charging, and ownership assumptions.',
    href: '/ev',
    cta: 'Open EV data',
  },
  {
    eyebrow: 'Building + grid storage',
    title: 'BESS across sectors',
    description:
      'Explore shared residential, commercial, and grid-scale storage for economics, peak demand, and deployment fit.',
    href: '/bess',
    cta: 'Open BESS desk',
  },
]

const trackingLayers = [
  {
    label: 'Deployment',
    metric: 'GWh / GW',
    title: 'Battery capacity in the real world',
    description: 'Stationary storage already online, annual battery additions, and where new capacity is being built.',
  },
  {
    label: 'Adoption',
    metric: 'Homes / EVs / sites',
    title: 'Who is actually using it',
    description: 'EV uptake, home batteries, shared residential systems, commercial storage, grid projects, and charging hubs.',
  },
  {
    label: 'Energy mix',
    metric: 'TWh',
    title: 'What storage is shifting',
    description: 'Battery deployment shown beside solar, wind, hydro, nuclear, coal, gas, and oil electricity generation.',
  },
  {
    label: 'Readiness',
    metric: 'Policy + price',
    title: 'Whether the market can scale',
    description: 'Tariffs, incentives, battery pricing, solar yield, charging density, payback, and source coverage.',
  },
]

const proofPoints = [
  'Monthly refresh rhythm',
  'Country-specific assumptions',
  'No ads, sponsors, or affiliate pressure',
  'Correction path for bad or stale data',
]

function ArrowIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  )
}

export default function Home() {
  return (
    <main className="home-page min-h-screen overflow-hidden bg-[#f4f0e8] pt-12 text-[#101512] md:pt-14">
      <section className="home-hero relative isolate min-h-[72svh] overflow-hidden bg-[#0b1110] text-[#f7f0e4]">
        <Image
          src="/images/home-energy-transition-map-poster.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="home-hero-poster object-cover object-center"
        />
        <div className="home-hero-scrim absolute inset-0" />
        <div className="home-grain absolute inset-0" />

        <div className="container relative z-10 mx-auto grid min-h-[72svh] max-w-7xl content-center px-4 py-14 sm:px-6 lg:px-8">
          <div className="home-hero-copy max-w-4xl">
            <div className="inline-flex items-center rounded-full border border-[#f7f0e4]/18 bg-[#0b1110]/45 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-[#ddf8ea] backdrop-blur-md">
              Independent adoption data
            </div>

            <h1 className="mt-7 max-w-3xl text-balance text-6xl font-black leading-[0.86] tracking-tight sm:text-7xl lg:text-8xl">
              battery.mom
            </h1>
            <p className="mt-6 max-w-2xl text-balance text-2xl font-extrabold leading-tight text-[#fff7e8] md:text-4xl">
              Track the battery and solar transition as it deploys.
            </p>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#d8d0c2] md:text-lg">
              A living view of storage GWh, solar buildout, EV adoption, BESS sectors, and the power mix behind them.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/scoreboard"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#f7f0e4] px-6 py-3 text-sm font-black text-[#101512] shadow-2xl shadow-black/30 transition hover:-translate-y-0.5 hover:bg-white sm:w-auto"
              >
                View adoption scoreboard
                <ArrowIcon />
              </Link>
              <Link
                href="/scoreboard/energy"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#f7f0e4]/22 bg-[#f7f0e4]/10 px-6 py-3 text-sm font-black text-[#f7f0e4] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-[#f7f0e4]/16 sm:w-auto"
              >
                Explore battery deployment
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f4f0e8] py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-[#16734a]">Pick the first question</p>
              <h2 className="mt-3 text-balance text-3xl font-black tracking-tight md:text-5xl">
                Track the transition from adoption data to system economics.
              </h2>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {decisionPaths.map((path, index) => (
                <Link
                  key={path.href}
                  href={path.href}
                  className="home-reveal group flex min-h-[22rem] flex-col justify-between rounded-lg border border-[#d8cfbf] bg-[#fffaf1] p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#9f8b68] hover:shadow-xl hover:shadow-[#2b1d0b]/10"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div>
                    <div className="mb-5 inline-flex rounded-full bg-[#101512] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#f7d18a]">
                      {path.eyebrow}
                    </div>
                    <h3 className="text-2xl font-black leading-tight tracking-tight">{path.title}</h3>
                    <p className="mt-4 text-sm leading-6 text-[#5f594f]">{path.description}</p>
                  </div>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-black text-[#16734a]">
                    {path.cta}
                    <ArrowIcon />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-method relative overflow-hidden bg-[#101512] py-16 text-[#f7f0e4] md:py-24">
        <div className="home-grain absolute inset-0 opacity-70" />
        <div className="container relative z-10 mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#60f0a8]">What we track</p>
            <h2 className="mt-3 text-balance text-3xl font-black tracking-tight md:text-5xl">
              The battery transition needs more than one number.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#cfc6b6]">
              battery.mom follows the shift from fossil-heavy electricity toward solar, storage, and electrified transport.
              The useful view is not just product specs. It is deployment, adoption, market readiness, and the power mix around it.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <Link
                href="/scoreboard/energy"
                className="rounded-lg border border-[#f7f0e4]/12 bg-[#f7f0e4]/7 p-4 transition hover:border-[#60f0a8]/50 hover:bg-[#f7f0e4]/10"
              >
                <div className="text-2xl font-black text-white">Energy</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-[#60f0a8]">global lens</div>
              </Link>
              <Link
                href="/scoreboard/bess"
                className="rounded-lg border border-[#f7f0e4]/12 bg-[#f7f0e4]/7 p-4 transition hover:border-[#60f0a8]/50 hover:bg-[#f7f0e4]/10"
              >
                <div className="text-2xl font-black text-white">BESS</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-[#60f0a8]">sector lens</div>
              </Link>
              <Link
                href="/scoreboard/ev"
                className="rounded-lg border border-[#f7f0e4]/12 bg-[#f7f0e4]/7 p-4 transition hover:border-[#60f0a8]/50 hover:bg-[#f7f0e4]/10"
              >
                <div className="text-2xl font-black text-white">EV</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-[#60f0a8]">transport lens</div>
              </Link>
              <Link
                href="/calculators"
                className="rounded-lg border border-[#f7f0e4]/12 bg-[#f7f0e4]/7 p-4 transition hover:border-[#60f0a8]/50 hover:bg-[#f7f0e4]/10"
              >
                <div className="text-2xl font-black text-white">ROI</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-[#60f0a8]">economics lens</div>
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {trackingLayers.map((layer, index) => (
              <article
                key={layer.title}
                className="home-reveal rounded-lg border border-[#f7f0e4]/12 bg-[#f7f0e4]/7 p-5 backdrop-blur-md"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#60f0a8]">{layer.label}</p>
                  <span className="rounded-full border border-[#f7f0e4]/14 px-2 py-1 text-[11px] font-black text-[#f7d18a]">
                    {layer.metric}
                  </span>
                </div>
                <h3 className="mt-7 text-2xl font-black leading-tight tracking-tight">{layer.title}</h3>
                <p className="mt-3 leading-7 text-[#cfc6b6]">{layer.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf1] py-16 md:py-24">
        <div className="container mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#16734a]">Why trust it</p>
            <h2 className="mt-3 text-balance text-3xl font-black tracking-tight md:text-5xl">
              Clear data beats confident sales talk.
            </h2>
            <p className="mt-5 text-base leading-7 text-[#5f594f]">
              battery.mom is deliberately plain about uncertainty. Prices change, incentives move, and product claims age. The point is to keep the assumptions visible.
            </p>
            <Link href="/about" className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#d8cfbf] px-5 py-3 text-sm font-black text-[#101512] transition hover:border-[#16734a] hover:bg-[#edf8ef]">
              Read the mission
              <ArrowIcon />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {proofPoints.map((point) => (
              <div key={point} className="home-reveal rounded-lg border border-[#d8cfbf] bg-[#f4f0e8] p-5">
                <div className="mb-4 h-1.5 w-14 rounded-full bg-[#60f0a8]" />
                <p className="text-xl font-black leading-snug">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#101512] py-16 text-[#f7f0e4] md:py-20">
        <div className="container mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#60f0a8]">Monthly data digest</p>
            <h2 className="mt-3 text-balance text-3xl font-black tracking-tight md:text-4xl">
              When the numbers move, you get the note.
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#cfc6b6]">
              EV launches, battery pricing, policy updates, calculator changes, and Southeast Asia adoption signals.
            </p>
          </div>
          <NewsletterSignup className="home-reveal bg-[#fffaf1] text-[#101512]" />
        </div>
      </section>
    </main>
  )
}
