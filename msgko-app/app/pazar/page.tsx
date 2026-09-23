import type { Metadata } from 'next'
import Script from 'next/script'
import { PazarClient } from './pazar-client'
import { buildMetadata, buildBreadcrumbSchema, BASE_URL } from '@/lib/seo'
import { createClient } from '@/lib/supabase/server'
import { CHANNELS } from '@/lib/pazar-types'
import type { MarketListing, PazarResponse } from '@/lib/pazar-types'

export const metadata: Metadata = buildMetadata({
  title: 'Knight Online USKO Pazar | Zero, Destan, Pandora, Agartha Item ─░lanlar─▒ | MSGKO',
  description:
    'Knight Online USKO anl─▒k pazar ilanlar─▒. Zero, Destan, Pandora ve Agartha sunucular─▒nda sat─▒lan item\'lar─▒n fiyatlar─▒n─▒ kar┼ş─▒la┼şt─▒r, en ucuz ilanlar─▒ bul.',
  canonical: `${BASE_URL}/pazar`,
  keywords: [],
  ogType: 'website',
})

const breadcrumbs = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'USKO Pazar', href: '/pazar' },
]

const schemas = [buildBreadcrumbSchema(breadcrumbs)]

// raw_data parse ÔÇö route.ts'deki ile ayn─▒ mant─▒k
function parseRaw(item: MarketListing & { raw_data?: string | null }): MarketListing {
  let img_url: string | null        = null
  let loc_x: number | null          = null
  let loc_z: number | null          = null
  let item_details: string | null   = null
  let listed_date: string | null    = null
  let original_price: number | null = null
  try {
    if (item.raw_data) {
      const r        = JSON.parse(item.raw_data)
      img_url        = r.img_url         ?? null
      loc_x          = r.loc_x           ?? null
      loc_z          = r.loc_z           ?? null
      item_details   = r.item_details    ?? null
      listed_date    = r.listed_date     ?? null
      original_price = r.original_price  ?? null
    }
  } catch { /* ignore */ }
  const { raw_data: _, ...rest } = item as MarketListing & { raw_data?: string | null }
  return { ...rest, img_url, loc_x, loc_z, item_details, listed_date, original_price }
}

async function getInitialListings(): Promise<PazarResponse | null> {
  try {
    const supabase = await createClient()
    const PAGE_SIZE = 30

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any).rpc('get_market_listings', {
      p_server:  'zero3',
      p_q:       null,
      p_sort:    'price_asc',
      p_upgrade: -1,
      p_limit:   PAGE_SIZE,
      p_offset:  0,
    })

    if (error || !data) return null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: countData } = await (supabase as any).rpc('get_market_listings_count', {
      p_server:  'zero3',
      p_q:       null,
      p_upgrade: -1,
    })

    const { data: logData } = await supabase
      .from('market_scrape_log')
      .select('scraped_at')
      .eq('server', 'zero3')
      .order('scraped_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const total = (countData as number) ?? 0

    const listings = ((data ?? []) as (MarketListing & { raw_data?: string | null })[])
      .map(parseRaw)

    return {
      listings,
      total,
      page: 1,
      page_size:      PAGE_SIZE,
      total_pages:    Math.max(1, Math.ceil(total / PAGE_SIZE)),
      server:         'zero3',
      last_scraped:   logData?.scraped_at ?? null,
      upgrade_filter: null,
    }
  } catch {
    return null
  }
}

export default async function PazarPage() {
  const initialData = await getInitialListings()

  return (
    <>
      <Script
        id="pazar-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <PazarClient initialData={initialData} />
    </>
  )
}
