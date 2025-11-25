'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Hero() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={`sticky top-0 z-50 py-3 px-20 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/60 backdrop-blur-md'
          : 'bg-transparent'
      }`}
      style={{
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
    >
      <div className="container mx-auto flex items-center gap-6" style={{ maxWidth: '90rem' }}>
        <Link
          href="/"
          className={`text-sm font-medium transition-colors ${
            isScrolled ? 'text-gray-700 hover:text-ev-primary' : 'text-black hover:text-ev-primary'
          }`}
        >
          EV
        </Link>
        <Link
          href="/bess"
          className={`text-sm font-medium transition-colors ${
            isScrolled ? 'text-gray-700 hover:text-ev-primary' : 'text-black hover:text-ev-primary'
          }`}
        >
          BESS
        </Link>
      </div>
    </div>
  )
}

