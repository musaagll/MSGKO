import type { Metadata } from 'next'
import { IletisimPage } from './iletisim-page'
import { PageHero } from '@/components/ui/PageHero'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'İletişim — MSGKO Knight Online',
  description: 'MSGKO ile iletişime geç. Instagram @msgclip veya e-posta ile ulaşabilirsin.',
  alternates: { canonical: `${SITE_URL}/iletisim` },
  robots: { index: false, follow: true },
}

export default function Page() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: 'Ana Sayfa', href: '/' }, { label: 'İletişim', href: '/iletisim' }]}
        eyebrow="Bize Ulaş"
        title="İletişim"
        description={<p>Soru, öneri ve iş birlikleri için buradayız.</p>}
      />
      <div className="container-site py-12 sm:py-16">
        <IletisimPage />
      </div>
    </>
  )
}
