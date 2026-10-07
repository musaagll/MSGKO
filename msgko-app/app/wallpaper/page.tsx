import type { Metadata } from 'next'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageHero } from '@/components/ui/PageHero'
import { WallpaperClient } from './wallpaper-client'
import { getWallpapers } from '@/lib/wallpapers'
import { SECTION_ART } from '@/lib/class-meta'
import { SITE_URL as BASE_URL } from '@/lib/site'

// Liste sunucuda üretilir; yeni yüklenen duvar kağıtları 5 dakika içinde görünür
export const revalidate = 300

export const metadata: Metadata = {
  title: { absolute: 'Knight Online Wallpaper — Ücretsiz HD Duvar Kağıtları | MSGKO' },
  description:
    'Knight Online duvar kağıtları — ücretsiz indir. PC ve telefon için HD Knight Online wallpaper. Asas, okçu ve tüm karakterler için özel tasarım MSGKO duvar kağıtları.',
  keywords: [
    'knight online wallpaper', 'knight online duvar kağıdı', 'knight online arka plan',
    'knight online masaüstü wallpaper', 'knight online hd wallpaper', 'knight online 4k wallpaper',
    'knight online background', 'msgko wallpaper', 'ücretsiz knight online wallpaper',
    'knight online telefon wallpaper', 'knight online asas wallpaper', 'knight online okçu wallpaper',
  ],
  alternates: {
    canonical: `${BASE_URL}/wallpaper`,
  },
  openGraph: {
    title: 'Knight Online Wallpaper — Ücretsiz HD Duvar Kağıtları | MSGKO',
    description: 'Ücretsiz Knight Online duvar kağıtları. PC ve telefon için HD wallpaper. MSGKO özel tasarım.',
    url: `${BASE_URL}/wallpaper`,
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Knight Online Wallpaper — MSGKO',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Knight Online Wallpaper — Ücretsiz HD Duvar Kağıtları | MSGKO',
    description: 'Ücretsiz Knight Online HD duvar kağıtları. PC ve telefon için. msgko.net',
    images: [`${BASE_URL}/opengraph-image`],
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Ana Sayfa',
      item: BASE_URL,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Knight Online Wallpaper',
      item: `${BASE_URL}/wallpaper`,
    },
  ],
}

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Knight Online Wallpaper — MSGKO',
  description: 'Ücretsiz Knight Online duvar kağıtları. PC ve telefon için HD wallpaper.',
  url: `${BASE_URL}/wallpaper`,
  isPartOf: { '@type': 'WebSite', url: BASE_URL, name: 'MSGKO — Knight Online Rehber ve Eğitim Sitesi' },
  breadcrumb: breadcrumbSchema,
  inLanguage: 'tr',
}

export default async function WallpaperPage() {
  const wallpapers = await getWallpapers()

  return (
    <>
      <JsonLd data={webPageSchema} />

      <PageHero
        breadcrumbs={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Knight Online Wallpaper', href: '/wallpaper' }]}
        eyebrow="Duvar Kağıtları"
        art={{ src: SECTION_ART.wallpaper, position: '60% 40%' }}
        title={<span lang="en">Knight Online Wallpaper</span>}
        description={
          <p>
            PC ve telefon için ücretsiz, yüksek çözünürlüklü Knight Online duvar kağıtları. Asas, okçu, warrior, mage
            ve priest karakterleri için özel tasarımlar — büyütmek için tıkla, tek dokunuşla indir.
          </p>
        }
      />

      <section aria-label="Duvar kağıdı galerisi" className="container-site py-10 sm:py-14">
        <WallpaperClient wallpapers={wallpapers} />
      </section>
    </>
  )
}
