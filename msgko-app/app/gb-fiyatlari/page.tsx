import type { Metadata } from 'next'
import { GbFiyatlariClient } from './gb-fiyatlari-client'
import { SITE_URL } from '@/lib/site'
import { BASE_OPEN_GRAPH } from '@/lib/seo'

const TITLE = 'Knight Online GB Fiyatları | En Ucuz GB | MSGKO'
const DESCRIPTION =
  'Knight Online tüm sunucularda anlık GB (Gold Bar) fiyatları. KnightPin, ByNoGame, KoPazar, Kabasakal ve daha fazlasını karşılaştır. En ucuz GB fiyatını bul.'

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/gb-fiyatlari` },
  openGraph: {
    ...BASE_OPEN_GRAPH,
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/gb-fiyatlari`,
  },
}

export default function GbFiyatlariPage() {
  return <GbFiyatlariClient />
}
