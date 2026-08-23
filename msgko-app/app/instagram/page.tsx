import type { Metadata } from 'next'
import { InstagramPage } from './instagram-page'

export const metadata: Metadata = {
  title: 'Instagram — MSGKO Knight Online',
  description: 'MSGKO Instagram reels. Knight Online asas ve okçu kısa videoları. @msgclip hesabını takip et.',
  alternates: { canonical: 'https://msgko.net/instagram' },
  openGraph: {
    title: 'Instagram — MSGKO Knight Online',
    description: 'Knight Online kısa videoları ve reels. @msgclip',
    url: 'https://msgko.net/instagram',
  },
}

export default function Page() {
  return <InstagramPage />
}
