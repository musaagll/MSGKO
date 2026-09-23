import type { Metadata } from 'next'
import { PazarClient } from './pazar-client'

export const metadata: Metadata = {
  title: 'Knight Online USKO Canlı Pazar | Zero, Destan, Oreads İlanları | MSGKO',
  description:
    'Knight Online USKO anlık pazar ilanları. Zero3, Zero4, Zero5, Destan2 ve Oreads2 sunucularında satılan itemların fiyatlarını karşılaştır, en ucuz ilanları bul.',
  alternates: {
    canonical: 'https://msgko.net/pazar',
  },
}

export default function PazarPage() {
  return <PazarClient />
}
