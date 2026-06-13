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
    'Türkiye\'nin en kapsamlı Knight Online rehber sitesi. Asas build, asas combo, asas skill dizilimi, asas PK taktikleri, okçu eğitim, farm rehberi ve skill videoları. msgko.net — musaagll Knight Online platformu.',
  keywords: [
    // Marka & site
    'msgko', 'msgko.net', 'msg', 'MSG Knight Online', 'musaagll',
    // Ana oyun
    'Knight Online', 'Knight Online Türkçe', 'Knight Online rehber',
    'Knight Online eğitim', 'Knight Online 2025', 'Knight Online 2026',
    'KO rehber', 'KO eğitim', 'mmorpg', 'ko',
    // Asas / Rogue
    'Knight Online asas', 'asas rehber', 'asas build', 'asas combo',
    'asas skill dizilimi', 'asas PK', 'asas nasıl oynanır', 'asas taktikleri',
    'asas teknikleri', 'asas eğitim', 'Knight Online rogue', 'rogue build',
    // Okçu / Archer
    'Knight Online okçu', 'okçu rehber', 'okçu build', 'okçu combo',
    'okçu skill dizilimi', 'okçu PK', 'okçu eğitim', 'Knight Online archer',
    // Farm & genel
    'Knight Online farm', 'Knight Online farm rotası', 'Knight Online exp farm',
    'Knight Online PK taktikleri', 'Knight Online WS', 'Knight Online skill kombo',
    'Knight Online guardian of 7 keys', 'anahtar görevi', 'knight online görev',
    // Video & içerik
    'Knight Online video', 'Knight Online YouTube', 'Knight Online Türkçe video',
    'knight online eğitim videosu',
  ],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: BASE_URL,
    siteName: 'MSGKO — Knight Online',
    title: 'MSGKO — Knight Online Asas, Okçu Eğitim ve Rehber Videoları',
    description:
      'Türkiye\'nin en kapsamlı Knight Online rehber sitesi. Asas build, asas combo, okçu eğitim, farm rehberi, PK taktikleri ve skill videoları.',
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
    creator: '@musaagll',
    title: 'MSGKO — Knight Online Asas & Okçu Eğitim Videoları',
    description:
      'Türkiye\'nin en kapsamlı Knight Online rehber sitesi. Asas build, combo, okçu eğitim, farm rehberi ve PK taktikleri.',
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
  category: 'gaming',
}

const jsonLd = [
  // WebSite schema
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MSGKO',
    alternateName: ['msgko.net', 'MSG Knight Online', 'musaagll'],
    url: BASE_URL,
    description: 'Türkiye\'nin en kapsamlı Knight Online rehber sitesi. Asas build, combo, okçu eğitim, farm rehberi ve PK taktikleri.',
    inLanguage: 'tr',
    publisher: {
      '@type': 'Person',
      name: 'Musa Ağıl',
      alternateName: 'musaagll',
      url: BASE_URL,
      sameAs: [
        'https://www.youtube.com/@musaagll',
        'https://www.instagram.com/msgclip/',
      ],
      image: `${BASE_URL}/logo.png`,
    },
  },
  // Person schema (musaagll)
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Musa Ağıl',
    alternateName: 'musaagll',
    url: BASE_URL,
    sameAs: [
      'https://www.youtube.com/@musaagll',
      'https://www.instagram.com/msgclip/',
      'https://msgko.net',
    ],
    description: 'Knight Online Asas ve Okçu oyuncu ve içerik üreticisi. msgko.net kurucusu.',
    knowsAbout: [
      'Knight Online', 'Asas', 'Okçu', 'PK taktikleri', 'farm rehberi', 'skill combo',
    ],
  },
  // FAQPage schema — arama sorgularına cevap
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Knight Online asas nasıl oynanır?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'MSGKO\'da Knight Online asas rehberleri, build önerileri, skill dizilimi ve PK taktikleri video eğitimleri bulunmaktadır.',
        },
      },
      {
        '@type': 'Question',
        name: 'Knight Online asas build nedir?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Asas build rehberi için msgko.net adresinde güncel stat ve item önerileri ile detaylı eğitim videoları mevcuttur.',
        },
      },
      {
        '@type': 'Question',
        name: 'Knight Online okçu eğitimi nerede bulunur?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'msgko.net\'te Knight Online okçu eğitim videoları, skill dizilimi ve PK rehberleri bulunmaktadır.',
        },
      },
      {
        '@type': 'Question',
        name: 'Knight Online farm nasıl yapılır?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Knight Online farm rotaları ve exp rehberleri msgko.net\'te video formatında paylaşılmaktadır.',
        },
      },
    ],
  },
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${rajdhani.variable}`}>
      <head>
        {jsonLd.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
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
