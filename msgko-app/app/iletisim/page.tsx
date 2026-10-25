import type { Metadata } from 'next'
import { IletisimPage } from './iletisim-page'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'İletişim — MSGKO Knight Online',
  description: 'MSGKO ile iletişime geç. Instagram @msgclip veya e-posta ile ulaşabilirsin.',
  alternates: { canonical: `${SITE_URL}/iletisim` },
  robots: { index: false, follow: true },
}

export default function Page() {
  return (
    <div className="container-site py-16 sm:py-24">
      <div className="text-center">
        <h1 className="display-md">İletişim</h1>
        <p className="mt-4 text-fg-3">Soru, öneri ve iş birlikleri için yazabilirsin.</p>
      </div>
      <div className="mt-10">
        <IletisimPage />
      </div>
    </div>
  )
}
