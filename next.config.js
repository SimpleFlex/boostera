/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['assets.coingecko.com'],
    unoptimized: true,
  },
  // Disable the missing suspense warning for build (temporary)
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = nextConfig
