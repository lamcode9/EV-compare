import Link from 'next/link'

const siteName = 'battery.mom'

const footerLinks = [
  { href: '/scoreboard', label: 'Scoreboards' },
  { href: '/ev', label: 'EV comparison' },
  { href: '/bess', label: 'Battery storage' },
  { href: '/calculators', label: 'Calculators' },
  { href: '/insights', label: 'Insights' },
  { href: '/bess/case-studies', label: 'Case studies' },
  { href: '/suggest-correction', label: 'Suggest correction' },
  { href: '/contributors', label: 'Sources' },
  { href: '/contact', label: 'Contact' },
  { href: '/feed.xml', label: 'RSS', external: true },
]

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-ink/10 bg-paper text-ink-500">
      <div className="container mx-auto max-w-[1200px] px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="max-w-sm">
              <Link href="/" className="text-base font-bold text-ink transition-colors hover:text-brand-700">
                {siteName}
              </Link>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                Battery, solar, and energy adoption data. No ads, no sponsors, no affiliate pressure.
              </p>
            </div>

            <nav className="flex max-w-2xl flex-wrap gap-x-5 gap-y-2 text-sm md:justify-end" aria-label="Footer">
              {footerLinks.map((link) =>
                link.external ? (
                  <a key={link.href} href={link.href} className="text-ink-500 transition-colors hover:text-brand-700">
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.href} href={link.href} className="text-ink-500 transition-colors hover:text-brand-700">
                    {link.label}
                  </Link>
                )
              )}
            </nav>
          </div>

          <p className="max-w-4xl text-xs leading-5 text-ink-400">
            This living database is manually checked against primary sources where available. Prices, incentives,
            specifications, and deployment figures may change; always confirm with official sources.
          </p>

          <div className="flex flex-col gap-2 border-t border-ink/5 pt-4 text-xs text-ink-400 md:flex-row md:items-center md:justify-between">
            <p>© 2026 {siteName}. All rights reserved.</p>
            <p>Independent energy-transition data for humans making real-world decisions.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
