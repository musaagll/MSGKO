import type { Metadata } from 'next'
import { InstagramPage } from './instagram-page'
import { SITE_URL } from '@/lib/site'
import { BASE_OPEN_GRAPH } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Instagram — MSGKO Knight Online',
  description: 'MSGKO Instagram reels. Knight Online asas ve okçu kısa videoları. @msgclip hesabını takip et.',
  alternates: { canonical: `${SITE_URL}/instagram` },
  openGraph: {
    ...BASE_OPEN_GRAPH,
    title: 'Instagram — MSGKO Knight Online',
    description: 'Knight Online kısa videoları ve reels. @msgclip',
    url: `${SITE_URL}/instagram`,
  },
}

export default function Page() {
  return <InstagramPage />
}
