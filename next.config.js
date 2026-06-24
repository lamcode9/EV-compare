/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production'

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
    ],
  },
  experimental: {
    // Tree-shake selected package barrel exports.
    optimizePackageImports: ['date-fns'],
  },
  webpack: (config, { isServer }) => {
    // Exclude undici from webpack processing to avoid private class fields parsing issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'undici': false,
      }
    }
    return config
  },
  async redirects() {
    return [
      {
        // The standalone "Scoreboards" hub is retired — its surfaces now live
        // under the "Big Picture" narrative front door. Children (/scoreboard/ev,
        // /scoreboard/energy, /scoreboard/bess) are unaffected.
        source: '/scoreboard',
        destination: '/state-of-battery-power',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      ...(isDev
        ? [
            {
              // Keep local reviews honest after UI copy changes.
              source: '/:path*',
              headers: [{ key: 'Clear-Site-Data', value: '"cache"' }],
            },
          ]
        : []),
      {
        // Security headers for all routes except embeds
        source: '/((?!embed).*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // Embed routes: allow iframing, but still secure
        source: '/embed/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Content-Security-Policy', value: "frame-ancestors *;" },
        ],
      },
      {
        // Cache images
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
