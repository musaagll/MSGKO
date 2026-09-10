import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  devIndicators: false,
  compress: true,
  poweredByHeader: false,

  // ── 301 Redirect Sistemi ─────────────────────────────────────────────────
  // Eski URL'leri yeni yapıya yönlendir. SEO değeri korunur.
  async redirects() {
    return [
      // /kategoriler/* → /rehber/* (footer ve data.ts'deki eski linkler)
      {
        source: '/kategoriler/asas',
        destination: '/rehber/asas',
        permanent: true,
      },
      {
        source: '/kategoriler/okcu',
        destination: '/rehber/okcu',
        permanent: true,
      },
      {
        source: '/kategoriler/:slug',
        destination: '/rehber/:slug',
        permanent: true,
      },
      {
        source: '/kategoriler',
        destination: '/rehber',
        permanent: true,
      },
      // Potansiyel alternatif URL'ler
      {
        source: '/guide/:slug',
        destination: '/rehber/:slug',
        permanent: true,
      },
      {
        source: '/guides',
        destination: '/rehber',
        permanent: true,
      },
      {
        source: '/maps',
        destination: '/harita',
        permanent: true,
      },
      {
        source: '/maps/:slug',
        destination: '/harita/:slug',
        permanent: true,
      },
      {
        source: '/bosses',
        destination: '/boss',
        permanent: true,
      },
      {
        source: '/bosses/:slug',
        destination: '/boss/:slug',
        permanent: true,
      },
      {
        source: '/items',
        destination: '/item',
        permanent: true,
      },
      {
        source: '/items/:slug',
        destination: '/item/:slug',
        permanent: true,
      },
      {
        source: '/news',
        destination: '/haber',
        permanent: true,
      },
      {
        source: '/news/:slug',
        destination: '/haber/:slug',
        permanent: true,
      },
    ]
  },

  // ── HTTP Headers ─────────────────────────────────────────────────────────
  async headers() {
    return [
      {
        // GLB/GLTF model files — correct MIME types for Three.js
        source: '/assets/models/:path*',
        headers: [
          { key: 'Content-Type', value: 'model/gltf-binary' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Statik asset'ler için agresif önbellekleme
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.instagram.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://*.ytimg.com https://*.cdninstagram.com https://image.nttgame.com https://*.supabase.co https://pagead2.googlesyndication.com https://*.googleusercontent.com https://*.googlesyndication.com https://kobugda.com https://www.uskopazar.com",
              "media-src 'self' blob:",
              "frame-src https://www.youtube.com https://www.instagram.com https://googleads.g.doubleclick.net",
              "worker-src 'self' blob:",
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

  // ── Image Optimization ───────────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Supabase Storage
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // YouTube thumbnails
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
      // Knight Online resmi oyun görselleri
      {
        protocol: 'https',
        hostname: 'image.nttgame.com',
      },
    ],
  },
}

export default nextConfig
