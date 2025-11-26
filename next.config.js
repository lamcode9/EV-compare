/** @type {import('next').NextConfig} */
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
  typescript: {
    // Skip type checking during build (we do it in CI/local)
    ignoreBuildErrors: false,
  },
  webpack: (config, { isServer }) => {
    // Exclude undici from webpack processing to avoid private class fields parsing issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'undici': false,
      }
    }
    // Exclude scripts folder from webpack compilation
    config.module.rules.push({
      test: /\.ts$/,
      include: /scripts/,
      use: {
        loader: 'ignore-loader',
      },
    })
    return config
  },
}

module.exports = nextConfig

