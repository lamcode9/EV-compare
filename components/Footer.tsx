import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Energy SEA</h3>
            <p className="text-sm">
              Compare electric vehicles available across Southeast Asia. 
              Make informed decisions with comprehensive EV data.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Data Sources</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              This living database was originally seeded and continuously updated with the help of{' '}
              <span className="text-white font-medium">Grok (xAI)</span> using real-time web search + official manufacturer data across{' '}
              <span className="text-white font-medium">Southeast Asia (Nov 2025)</span>. All entries have been manually verified or corrected against primary sources.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>
            © {new Date().getFullYear()} Energy SEA. All rights reserved.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Prices and specifications are estimates. Always consult official dealers for current information.
          </p>
        </div>
      </div>
    </footer>
  )
}

