import type { Metadata } from 'next'
import { IletisimPage } from './iletisim-page'

export const metadata: Metadata = {
  title: 'İletişim — MSGKO Knight Online',
  description: 'MSGKO ile iletişime geç. Instagram @msgclip veya e-posta ile ulaşabilirsin.',
  alternates: { canonical: 'https://msgko.net/iletisim' },
  robots: { index: false, follow: true },
}

export default function Page() {
  return <IletisimPage />
}
