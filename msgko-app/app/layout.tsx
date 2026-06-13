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
    default: 'MSGKO — Knight Online Asas, Okçu, Farm ve PK Rehberi | msgko.net',
    template: '%s | MSGKO Knight Online Rehberi',
  },
  description:
    'Knight Online Türkçe rehber sitesi. Asas build, asas combo, asas skill dizilimi, asas PK taktikleri, okçu eğitim, okçu build, farm rehberi, warrior, mage, priest rehberi. 2025-2026 güncel meta. musaagll — msgko.net',
  keywords: [
    // Marka
    'msgko', 'msgko.net', 'MSG Knight Online', 'musaagll', 'msg ko',
    // Ana oyun
    'Knight Online', 'Knight Online Türkçe', 'Knight Online rehber',
    'Knight Online eğitim', 'Knight Online 2025', 'Knight Online 2026',
    'KO rehber', 'KO eğitim', 'knight online karakter rehberi',
    'knight online pvp', 'knight online skill', 'knight online build',
    'knight online stat dağılımı', 'knight online combo', 'knight online 2026 rehber',
    // Asas / Rogue
    'knight online asas', 'asas rehber', 'asas build', 'asas combo',
    'asas skill dizilimi', 'asas pk', 'asas nasıl oynanır', 'asas taktikleri',
    'asas teknikleri', 'asas eğitim', 'knight online rogue', 'rogue build',
    'asas item rehberi', 'asas stat', 'asas pvp',
    // Okçu / Archer
    'knight online okçu', 'okçu rehber', 'okçu build', 'okçu combo',
    'okçu skill dizilimi', 'okçu pk', 'okçu eğitim', 'knight online archer',
    'okçu item', 'okçu stat',
    // Warrior
    'knight online warrior', 'warrior rehber', 'warrior build',
    // Mage
    'knight online mage', 'mage rehber', 'mage build',
    // Priest
    'knight online priest', 'priest rehber', 'priest build',
    // Farm & genel
    'knight online farm', 'knight online farm rotası', 'knight online exp farm',
    'knight online pk taktikleri', 'knight online ws', 'knight online skill kombo',
    'knight online item rehberi', 'knight online guardian of 7 keys',
    'anahtar görevi human', 'knight online görev',
    // Video
    'knight online video', 'knight online youtube', 'knight online türkçe video',
    'knight online eğitim videosu',
  ],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: BASE_URL,
    siteName: 'MSGKO — Knight Online Rehberi',
    title: 'MSGKO — Knight Online Asas, Okçu, Farm ve PK Rehberi',
    description:
      'Türkiye\'nin en kapsamlı Knight Online rehber sitesi. Asas build, combo, okçu eğitim, warrior, mage, priest, farm rehberi ve PK taktikleri. 2025-2026 güncel meta.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MSGKO — Knight Online Rehber ve Eğitim Sitesi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@musaagll',
    creator: '@musaagll',
    title: 'MSGKO — Knight Online Asas & Okçu Eğitim Videoları',
    description:
      'Knight Online asas build, combo, okçu eğitim, farm rehberi ve PK taktikleri. musaagll — msgko.net',
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
    languages: { 'tr-TR': BASE_URL },
  },
  category: 'gaming',
  authors: [{ name: 'Musa Ağıl', url: BASE_URL }],
  creator: 'musaagll',
  publisher: 'MSGKO',
}

const jsonLd = [
  // Organization schema
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MSGKO',
    alternateName: ['MSG Knight Online', 'msgko.net', 'musaagll'],
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/logo.png`,
      width: 512,
      height: 512,
    },
    sameAs: [
      'https://www.youtube.com/@musaagll',
      'https://www.instagram.com/msgclip/',
    ],
    description: 'Knight Online Türkçe rehber ve eğitim platformu. Asas, okçu, warrior, mage, priest build ve taktik videoları.',
    foundingDate: '2025',
    inLanguage: 'tr',
  },
  // WebSite schema + SearchAction
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MSGKO — Knight Online Rehberi',
    alternateName: ['msgko.net', 'MSG Knight Online'],
    url: BASE_URL,
    description: 'Knight Online Türkçe rehber sitesi. Asas, okçu, warrior, mage, priest build, combo, farm ve PK taktikleri.',
    inLanguage: 'tr',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  },
  // Person schema
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Musa Ağıl',
    alternateName: 'musaagll',
    url: BASE_URL,
    image: `${BASE_URL}/logo.png`,
    sameAs: [
      'https://www.youtube.com/@musaagll',
      'https://www.instagram.com/msgclip/',
    ],
    description: 'Knight Online içerik üreticisi. Asas ve okçu karakter uzmanı. msgko.net kurucusu.',
    jobTitle: 'İçerik Üreticisi',
    knowsAbout: [
      'Knight Online', 'Asas', 'Rogue', 'Okçu', 'Archer',
      'PK taktikleri', 'Farm rehberi', 'Skill combo', 'Build rehberi',
    ],
  },
  // FAQPage schema
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Knight Online asas nasıl oynanır?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Knight Online asas karakteri hız ve combo odaklı bir DPS sınıfıdır. MSGKO\'da güncel asas build, skill dizilimi, stat dağılımı ve PK taktikleri video rehberlerine ulaşabilirsin.',
        },
      },
      {
        '@type': 'Question',
        name: 'Knight Online asas build 2025-2026 nedir?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Güncel asas build için STR/DEX dengesi önemlidir. Detaylı stat dağılımı, item önerileri ve skill dizilimi için msgko.net rehberlerini inceleyebilirsin.',
        },
      },
      {
        '@type': 'Question',
        name: 'Knight Online asas combo sırası nedir?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Asas combo; hızlı kill için skill sırasının doğru kullanılmasını gerektirir. MSGKO\'da profesyonel oyuncuların combo rehberleri video formatında mevcuttur.',
        },
      },
      {
        '@type': 'Question',
        name: 'Knight Online okçu build nedir?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Okçu için uzun menzilli DPS odaklı bir build tercih edilir. Güncel okçu build, skill dizilimi ve PK taktikleri için msgko.net\'i ziyaret edebilirsin.',
        },
      },
      {
        '@type': 'Question',
        name: 'Knight Online farm nasıl yapılır?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Knight Online farm için en verimli rotalar, exp alanları ve item drop bölgeleri MSGKO\'da video rehber formatında paylaşılmaktadır.',
        },
      },
      {
        '@type': 'Question',
        name: 'Knight Online warrior rehberi nerede?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Knight Online warrior build, stat dağılımı ve PK taktikleri için msgko.net rehberlerini takip edebilirsin.',
        },
      },
      {
        '@type': 'Question',
        name: 'Knight Online pvp nasıl yapılır?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'PK başarısı için karakter build, combo sırası ve map bilgisi kritiktir. MSGKO\'da her sınıf için PK taktik videoları mevcuttur.',
        },
      },
      {
        '@type': 'Question',
        name: 'MSGKO nedir?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'MSGKO (msgko.net), musaagll tarafından yönetilen Knight Online Türkçe rehber ve eğitim platformudur. Asas, okçu, warrior, mage ve priest için build, combo, farm ve PK rehberleri içermektedir.',
        },
      },
    ],
  },
  // VideoObject schema (öne çıkan videolar)
  {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: 'ZERO - NooaaH Culluk Asas WS İtemli Asas Movie 2026 | Knight Online',
    description: 'Knight Online asas PK ve WS taktikleri videosu. 2026 meta asas oynanışı.',
    thumbnailUrl: `https://i.ytimg.com/vi/61-BoM0df3E/hqdefault.jpg`,
    uploadDate: '2025-06-01',
    contentUrl: 'https://www.youtube.com/watch?v=61-BoM0df3E',
    embedUrl: 'https://www.youtube.com/embed/61-BoM0df3E',
    publisher: {
      '@type': 'Person',
      name: 'musaagll',
      url: 'https://www.youtube.com/@musaagll',
    },
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
