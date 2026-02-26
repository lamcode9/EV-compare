import Link from 'next/link'
import NewsletterSignup from '@/components/NewsletterSignup'

const siteName = "battery.mom"

export default function Footer() {
  return (
    <footer className="bg-[#0f0f0f] text-gray-500 mt-16 border-t border-gray-900/50">
      <div className="container mx-auto px-4 py-5 max-w-[1200px]">
        <div className="flex flex-col gap-2.5 text-center">
          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm mb-2">
            <Link href="/ev" className="text-gray-400 hover:text-emerald-400 transition-colors">
              EV Comparison
            </Link>
            <Link href="/bess" className="text-gray-400 hover:text-emerald-400 transition-colors">
              Battery Storage
            </Link>
            <Link href="/calculators" className="text-gray-400 hover:text-emerald-400 transition-colors">
              Calculators
            </Link>
            <Link href="/insights" className="text-gray-400 hover:text-emerald-400 transition-colors">
              Insights
            </Link>
            <Link href="/bess/case-studies" className="text-gray-400 hover:text-emerald-400 transition-colors">
              Case Studies
            </Link>
            <Link href="/bess/installers" className="text-gray-400 hover:text-emerald-400 transition-colors">
              Installers
            </Link>
            <Link href="/suggest-correction" className="text-gray-400 hover:text-emerald-400 transition-colors">
              Suggest Correction
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-emerald-400 transition-colors">
              Contact
            </Link>
            <Link href="/api-docs" className="text-gray-400 hover:text-emerald-400 transition-colors">
              API Docs
            </Link>
            <Link href="/embed-widgets" className="text-gray-400 hover:text-emerald-400 transition-colors">
              Embed Widgets
            </Link>
            <Link href="/contributors" className="text-gray-400 hover:text-emerald-400 transition-colors">
              Contributors
            </Link>
            <a href="/feed.xml" className="text-gray-400 hover:text-emerald-400 transition-colors">
              RSS
            </a>
          </div>

          {/* Newsletter */}
          <div className="pt-2 pb-1">
            <p className="text-xs text-gray-400 mb-2 font-medium">Monthly data digest — EV launches, price changes, policy updates</p>
            <NewsletterSignup variant="inline" />
          </div>

          {/* Data Sources - Single Row */}
          <p className="text-xs text-gray-500 leading-relaxed">
            This living database was originally seeded and continuously updated with the help of Grok (xAI) using real-time web search (Last full update: February 2026). All entries have been manually verified or corrected against primary sources. Prices and specifications may change. Always confirm with official sources.
          </p>
          
          {/* Subtle Line Separator */}
          <div className="border-t border-gray-700/40 pt-2.5">
            {/* Copyright - Single Row */}
            <p className="text-xs text-gray-500">
              © 2026 {siteName} is a{' '}
              <a 
                href="https://lamonade.xyz" 
                className="text-gray-500 hover:text-emerald-600 transition-colors inline-flex items-center gap-1"
              >
                Lamonade
                <svg 
                  className="w-3 h-3" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <ellipse cx="12" cy="12" rx="7" ry="9" fill="#FFEB3B" opacity="0.8"/>
                  <ellipse cx="12" cy="12" rx="6" ry="8" fill="#FFF59D" opacity="0.6"/>
                  <rect x="11" y="3" width="2" height="2" rx="1" fill="#424242"/>
                  <rect x="11" y="19" width="2" height="2" rx="1" fill="#424242"/>
                  <path d="M8 10 Q12 8 16 10" stroke="#424242" strokeWidth="1" fill="none" opacity="0.5"/>
                </svg>
              </a>
              {' '}project · All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

