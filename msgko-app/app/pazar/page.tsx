import type { Metadata } from 'next'
import { PazarClient } from './pazar-client'
import { PageHero } from '@/components/ui/PageHero'
import { MARKET_PAGE_SIZE, MARKET_SERVERS } from '@/lib/market'
import { SITE_URL } from '@/lib/site'
import { BASE_OPEN_GRAPH } from '@/lib/seo'

const TITLE = 'Knight Online Canlı Pazar | Merchant Fiyatları | MSGKO'
const DESCRIPTION =
  'Knight Online canlı pazar: tüm sunucularda aktif merchant satış ve alış ilanları, item fiyatları ve 30 günlük fiyat geçmişi. Zero, Pandora, Agartha ve daha fazlası.'

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/pazar` },
  openGraph: {
    ...BASE_OPEN_GRAPH,
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/pazar`,
  },
}

export default function PazarPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Canlı Pazar', href: '/pazar' }]}
        eyebrow="Merchant İlanları"
        title="Canlı Pazar"
        description={
          <p>
            Knight Online sunucularındaki aktif satış ve alış ilanlarını tek ekranda gör. Bir item&apos;a tıklayarak son 30
            günün ortalama ve en düşük fiyatlarını incele; liste dakikada bir yenilenir.
          </p>
        }
      />
      <div className="container-site py-10 sm:py-14">
        <PazarClient servers={MARKET_SERVERS.map((s) => ({ code: s.code, label: s.label }))} pageSize={MARKET_PAGE_SIZE} />
        <p className="mt-10 text-sm text-fg-4">
          Pazar verileri enucuzgb.com üzerinden alınır ve bilgilendirme amaçlıdır. İlanlar oyun içinde değişmiş olabilir.
        </p>
      </div>
    </>
  )
}
