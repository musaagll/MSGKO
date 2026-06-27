import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  devIndicators: false,

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
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.instagram.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://*.ytimg.com https://*.cdninstagram.com https://image.nttgame.com https://*.supabase.co https://pagead2.googlesyndication.com https://*.googleusercontent.com https://*.googlesyndication.com",
              "media-src 'self' blob:",
              "frame-src https://www.youtube.com https://www.instagram.com https://googleads.g.doubleclick.net",
              "connect-src 'self' https://*.supabase.co https://www.googleapis.com https://www.instagram.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
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
