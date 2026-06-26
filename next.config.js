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
        // Security headers for all routes except embeds.
        // Framing is locked to self + the Lamonade portfolio (which embeds the
        // full site as a live preview). CSP frame-ancestors supersedes the old
        // X-Frame-Options: DENY in all modern browsers and, unlike XFO, supports
        // an allowlist of origins — so XFO is dropped here rather than kept
        // alongside (XFO DENY would otherwise still block the allowed frames).
        source: '/((?!embed).*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://lamonade.xyz https://*.lamonade.xyz http://localhost:3000;",
          },
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
