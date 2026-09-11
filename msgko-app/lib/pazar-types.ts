/**
 * Pazar sistemi paylaşılan tipler ve sabitler
 * Hem API route hem Client Component tarafından kullanılır
 */

export const CHANNELS = [
  { key: 'zero3',    label: 'Zero 3',    group: 'zero' },
  { key: 'zero4',    label: 'Zero 4',    group: 'zero' },
  { key: 'zero5',    label: 'Zero 5',    group: 'zero' },
  { key: 'zero8',    label: 'Zero 8',    group: 'zero' },
  { key: 'agartha3', label: 'Agartha 3', group: 'agartha' },
  { key: 'agartha4', label: 'Agartha 4', group: 'agartha' },
  { key: 'pandora3', label: 'Pandora 3', group: 'pandora' },
  { key: 'pandora4', label: 'Pandora 4', group: 'pandora' },
  { key: 'destan2',  label: 'Destan 2',  group: 'destan' },
  { key: 'destan3',  label: 'Destan 3',  group: 'destan' },
] as const

export type ChannelKey = (typeof CHANNELS)[number]['key']

export interface MarketListing {
  id: number
  server: string
  item_name: string
  item_count: number
  upgrade_level: number | null
  price: number
  price_per_unit: number | null
  seller_name: string | null
  scraped_at: string
  img_url?: string | null
}

export interface PazarResponse {
  listings: MarketListing[]
  total: number
  page: number
  page_size: number
  total_pages: number
  server: string
  last_scraped: string | null
  upgrade_filter?: number | null
}
