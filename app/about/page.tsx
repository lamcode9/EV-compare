import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About - Energy SEA',
  description: 'About Energy SEA',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-ev-primary">About Energy SEA</h1>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500 text-lg">
            Content coming soon...
          </p>
        </div>

        <div className="mt-8">
          <Link 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-ev-primary text-white rounded-lg hover:bg-ev-primary/90 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}

