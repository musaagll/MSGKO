import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  devIndicators: false,

  // Güvenlik header'ları
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Supabase Storage
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // YouTube thumbnails — tüm subdomain'ler
      {
        protocol: 'https',
        hostname: '*.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      // Instagram CDN
      {
        protocol: 'https',
        hostname: '*.cdninstagram.com',
      },
    ],
  },

  // Bundle analyzer için (opsiyonel)
  // webpack: (config) => config,
}

export default nextConfig
