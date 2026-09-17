import type { Metadata } from 'next'
import { GbFiyatlariClient } from './gb-fiyatlari-client'

export const metadata: Metadata = {
  title: 'Knight Online GB Fiyatları | En Ucuz GB | MSGKO',
  description:
    'Knight Online tüm sunucularda anlık GB (Gold Bar) fiyatları. KnightPin, ByNoGame, KoPazar, Kabasakal ve daha fazlasını karşılaştır. En ucuz GB fiyatını bul.',
  alternates: { canonical: 'https://msgko.net/gb-fiyatlari' },
}

export default function GbFiyatlariPage() {
  return <GbFiyatlariClient />
}
