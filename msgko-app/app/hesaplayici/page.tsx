import type { Metadata } from 'next'
import { HesaplayiciClient } from './hesaplayici-client'

export const metadata: Metadata = {
  title: 'Knight Online Build Hesaplayıcı — MSGKO',
  description:
    'Knight Online karakter build hesaplayıcısı. STR, DEX, INT, HP stat dağılımı, AP (Attack Power) hesaplama, silah ve buff seçimi ile en optimal build\'ini bul. Asas, okçu, warrior, mage, priest.',
  keywords: [
    'knight online build hesaplayıcı', 'knight online AP hesaplama', 'knight online stat hesaplayıcı',
    'knight online asas build', 'knight online okçu build', 'knight online warrior build',
    'knight online attack power', 'knight online STR DEX INT', 'ko build calculator',
    'knight online karakter build', 'knight online stat dağılımı hesaplama',
  ],
  alternates: { canonical: 'https://msgko.net/hesaplayici' },
  openGraph: {
    title: 'Knight Online Build Hesaplayıcı — MSGKO',
    description: 'Karakter stat dağılımı ve AP hesaplayıcısı. Asas, okçu, warrior, mage, priest için en optimal build.',
    url: 'https://msgko.net/hesaplayici',
  },
}

export default function HesaplayiciPage() {
  return <HesaplayiciClient />
}
