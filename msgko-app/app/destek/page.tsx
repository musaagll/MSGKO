import type { Metadata } from 'next'
import { DestekClient } from './destek-client'

export const metadata: Metadata = {
  title: 'Destek — MSGKO Knight Online',
  description:
    'MSGKO içeriklerini desteklemek için Kopazar, Bynogame ve Knightpin platformlarına ulaşabilirsiniz. Her destek yeni Knight Online rehber videoları için motivasyon kaynağıdır.',
  alternates: {
    canonical: 'https://msgko.net/destek',
  },
  openGraph: {
    title: 'Destek — MSGKO Knight Online Rehberi',
    description: 'MSGKO içeriklerini desteklemek için Kopazar, Bynogame ve Knightpin platformlarına ulaşabilirsiniz.',
    url: 'https://msgko.net/destek',
  },
}

export default function DestekPage() {
  return <DestekClient />
}
