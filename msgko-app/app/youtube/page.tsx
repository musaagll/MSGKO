import type { Metadata } from 'next'
import { YoutubePage } from './youtube-page'

export const metadata: Metadata = {
  title: 'YouTube — MSGKO Knight Online',
  description: 'MSGKO YouTube kanalı. Knight Online asas, okçu, farm ve PK eğitim videoları. musaagll tarafından hazırlanmış güncel içerikler.',
  alternates: { canonical: 'https://msgko.net/youtube' },
  openGraph: {
    title: 'YouTube — MSGKO Knight Online',
    description: 'Knight Online eğitim videoları. Asas, okçu, farm ve PK taktikleri.',
    url: 'https://msgko.net/youtube',
  },
}

export default function Page() {
  return <YoutubePage />
}
