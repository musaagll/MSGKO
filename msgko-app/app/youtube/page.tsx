import type { Metadata } from 'next'
import { YoutubePage } from './youtube-page'
import { SITE_URL } from '@/lib/site'
import { BASE_OPEN_GRAPH } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'YouTube — MSGKO Knight Online',
  description: 'MSGKO YouTube kanalı. Knight Online asas, okçu, farm ve PK eğitim videoları. musaagll tarafından hazırlanmış güncel içerikler.',
  alternates: { canonical: `${SITE_URL}/youtube` },
  openGraph: {
    ...BASE_OPEN_GRAPH,
    title: 'YouTube — MSGKO Knight Online',
    description: 'Knight Online eğitim videoları. Asas, okçu, farm ve PK taktikleri.',
    url: `${SITE_URL}/youtube`,
  },
}

export default function Page() {
  return <YoutubePage />
}
