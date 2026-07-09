'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

/**
 * Renders the site chrome (Header + Footer) for every route EXCEPT the
 * iframe embed widgets under `/embed/*`, which must be chrome-free so they
 * blend into third-party host pages. `usePathname()` is available during SSR
 * for app-router client components, so the correct branch is server-rendered
 * — no chrome flash on hydration.
 *
 * Note: `/embed-widgets` (the gallery page that hands out embed codes) is a
 * normal site page and intentionally keeps its chrome — `startsWith('/embed/')`
 * does not match it.
 */
export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isEmbed = pathname === '/embed' || pathname?.startsWith('/embed/')
  // /sunrise is the cinematic scrollytelling experience: it carries its own
  // minimal chrome (wordmark + battery HUD) and renders the Footer itself at
  // the end of its dawn arc, so the standard Header/Footer must not wrap it.
  const isSunrise = pathname === '/sunrise'

  if (isEmbed || isSunrise) {
    // Bare: the route supplies its own wrapper/chrome.
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-paper">
      <Header />
      {children}
      <Footer />
    </div>
  )
}
