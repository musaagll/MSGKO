/**
 * Pazar sistemi paylaşılan tipler ve sabitler
 */

export const CHANNELS = [
  { key: 'zero3',    label: 'Zero 3',    group: 'zero'    },
  { key: 'zero4',    label: 'Zero 4',    group: 'zero'    },
  { key: 'zero5',    label: 'Zero 5',    group: 'zero'    },
  { key: 'zero8',    label: 'Zero 8',    group: 'zero'    },
  { key: 'agartha3', label: 'Agartha 3', group: 'agartha' },
  { key: 'agartha4', label: 'Agartha 4', group: 'agartha' },
  { key: 'pandora3', label: 'Pandora 3', group: 'pandora' },
  { key: 'pandora4', label: 'Pandora 4', group: 'pandora' },
  { key: 'destan2',  label: 'Destan 2',  group: 'destan'  },
  { key: 'destan3',  label: 'Destan 3',  group: 'destan'  },
  { key: 'oreads1',  label: 'Oreads 1',  group: 'oreads'  },
  { key: 'oreads2',  label: 'Oreads 2',  group: 'oreads'  },
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
  // raw_data'dan parse edilenler
  img_url?: string | null
  loc_x?: number | null
  loc_z?: number | null
  item_details?: string | null
  listed_date?: string | null
  original_price?: number | null
}

export interface PazarResponse {
  listings: MarketListing[]
  total: number
  page: number
  page_size: number
  total_pages: number
  server: string           // virgülle ayrılmış olabilir ("zero3,zero4")
  last_scraped: string | null
  upgrade_filter?: number | null
}
