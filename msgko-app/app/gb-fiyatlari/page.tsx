import type { Metadata } from 'next'
import { GbFiyatlariClient } from './gb-fiyatlari-client'
import { PageHero } from '@/components/ui/PageHero'
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
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: 'Ana Sayfa', href: '/' }, { label: 'GB Fiyatları', href: '/gb-fiyatlari' }]}
        eyebrow="Anlık Fiyatlar"
        title="GB Fiyatları"
        description={
          <p>
            Knight Online Gold Bar fiyatlarını sunucu sunucu, sitelere göre karşılaştır. En ucuz satış ve en yüksek alış
            fiyatı otomatik işaretlenir; liste her 5 dakikada bir yenilenir.
          </p>
        }
      />
      <div className="container-site py-10 sm:py-14">
        <GbFiyatlariClient />
        <p className="mt-10 text-sm text-fg-4">
          Fiyat verileri ucuzagb.com üzerinden alınır ve bilgilendirme amaçlıdır. Satın almadan önce fiyatı ilgili sitede kontrol et.
        </p>
      </div>
    </>
  )
}
