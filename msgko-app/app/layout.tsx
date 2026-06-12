import type { Metadata } from 'next'
import { Inter, Rajdhani } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ChatWidget } from '@/components/ui/ChatWidget'
import { ParticleBackground } from '@/components/ui/ParticleBackground'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const rajdhani = Rajdhani({
  subsets: ['latin'],
  variable: '--font-rajdhani',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const BASE_URL = 'https://msgko.net'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'MSGKO — Knight Online Gelişim Rehberi | msgko.net',
    template: '%s | MSGKO Knight Online',
  },
  description:
    'Türkiye\'nin en kapsamlı Knight Online rehber sitesi. Asas Okçu Priest Warrior oynanış, PK taktikleri, farm taktikleri, skill kombo videoları. msgko.net — MSG Knight Online gelişim platformu.',
  keywords: [
    // Marka
    'msgko',
    'msgko.net',
    'MSG Knight Online',
    'musaagll',
    // Oyun genel
    'Knight Online',
    'Knight Online Türkçe',
    'Knight Online rehber',
    'Knight Online eğitim',
    'Knight Online 2024',
    'Knight Online 2025',
    'KO rehber',
    'KO eğitim',
    // Sınıf bazlı
    'Knight Online Asas',
    'Knight Online Asas rehberi',
    'Knight Online Asas build',
    'Knight Online Asas PK',
    'Asas eğitim videosu',
    'Knight Online Rogue',
    'Knight Online Okçu',
    'Knight Online Okçu rehberi',
    'Knight Online Archer',
    'Okçu eğitim',
    // Oyun mekanikleri
    'Knight Online PK taktikleri',
    'Knight Online farm rotası',
    'Knight Online skill kombo',
    'Knight Online WS taktikleri',
    'Knight Online exp farm',
    // İçerik türü
    'Knight Online video',
    'Knight Online YouTube',
    'Knight Online Türkçe video',
  ],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: BASE_URL,
    siteName: 'MSGKO — Knight Online',
    title: 'MSGKO — Knight Online Asas & Okçu Eğitim Videoları',
    description:
      'Türkiye\'nin en kapsamlı Knight Online rehber sitesi. Asas ve Okçu build rehberleri, PK taktikleri, farm rotaları ve skill kombo videoları.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MSGKO — Knight Online Rehber Sitesi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@musaagll',
    title: 'MSGKO — Knight Online Asas & Okçu Eğitim Videoları',
    description:
      'Türkiye\'nin en kapsamlı Knight Online rehber sitesi. Asas ve Okçu build rehberleri, PK taktikleri ve farm rotaları.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  // Google Search Console doğrulama — ileride eklenebilir
  // verification: {
  //   google: 'BURAYA_GOOGLE_VERIFICATION_CODE',
  // },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'MSGKO — Knight Online',
  alternateName: ['msgko', 'MSG Knight Online', 'msgko.net'],
  url: BASE_URL,
  description:
    'Türkiye\'nin en kapsamlı Knight Online rehber sitesi. Asas ve Okçu build rehberleri, PK taktikleri, farm rotaları ve skill kombo videoları.',
  inLanguage: 'tr',
  publisher: {
    '@type': 'Person',
    name: 'Musa Ağıl',
    url: BASE_URL,
    sameAs: [
      'https://www.youtube.com/@musaagll',
      'https://www.instagram.com/msgclip/',
    ],
    image: `${BASE_URL}/logo.png`,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/ara?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${rajdhani.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#07070B] text-white antialiased">
        <ParticleBackground />
        <Navbar />
        {children}
        <Footer />
        <ChatWidget />
      </body>
    </html>
  )
}
