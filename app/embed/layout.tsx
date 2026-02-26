import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'battery.mom — Embed Widget',
  robots: { index: false, follow: false },
}

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-transparent`}>
        <div className="p-4">
          {children}
          <div className="mt-4 pt-3 border-t border-gray-200 text-center">
            <a
              href="https://battery.mom"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-emerald-600 transition-colors"
            >
              Powered by battery.mom
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
