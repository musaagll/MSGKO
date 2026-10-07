import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ItemSeedData } from '@/lib/ko-data/items'

export const ITEM_TYPE: Record<string, string> = {
  weapon: 'Silah', armor: 'Zırh', accessory: 'Aksesuar',
  ring: 'Yüzük', necklace: 'Kolye', shield: 'Kalkan',
  helmet: 'Kask', gloves: 'Eldiven', boots: 'Bot', cape: 'Pelerin',
}

export const ITEM_GRADE: Record<string, { label: string; className: string }> = {
  normal: { label: 'Normal', className: 'text-fg-2 border-white/15 bg-white/5' },
  unique: { label: 'Unique', className: 'text-amber-200 border-amber-400/35 bg-amber-500/10' },
  legendary: { label: 'Legendary', className: 'text-amethyst-200 border-amethyst-400/40 bg-amethyst-500/15' },
}

export const STAT_LABELS: Record<string, string> = {
  ap: 'AP (Saldırı)', ac: 'AC (Savunma)', hp: 'HP', mp: 'MP',
  str: 'STR', dex: 'DEX', int: 'INT', ap_range: 'AP Menzil',
}

export function ItemCard({ item, as: Heading = 'h2' }: { item: ItemSeedData; as?: 'h2' | 'h3' }) {
  const grade = ITEM_GRADE[item.item_grade] ?? ITEM_GRADE.normal
  const stats = Object.entries(item.base_stats).slice(0, 4)
  return (
    <Link href={`/item/${item.slug}`} className="group card card-interactive flex h-full flex-col p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="chip">{ITEM_TYPE[item.item_type] ?? item.item_type}</span>
        <span className={`chip border ${grade.className}`}>{grade.label}</span>
      </div>
      <Heading className="mt-4 text-xl font-bold text-fg">{item.name}</Heading>
      <p className="mt-1.5 text-sm text-fg-3">
        Min Lv. {item.min_level}
        {item.character_class.length > 0 && ` · ${item.character_class.join(' / ')}`}
      </p>
      {stats.length > 0 && (
        <dl className="mt-4 grid grid-cols-2 gap-2">
          {stats.map(([stat, val]) => (
            <div key={stat} className="rounded-lg border border-white/6 bg-white/2 px-3 py-2">
              <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-fg-4">{STAT_LABELS[stat] ?? stat.toUpperCase()}</dt>
              <dd className="mt-0.5 font-bold tabular-nums text-fg">+{val}</dd>
            </div>
          ))}
        </dl>
      )}
      {item.description && <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-fg-3">{item.description}</p>}
      <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-fg-2 transition-colors group-hover:text-amethyst-200">
        Item Detayı
        <ArrowRight size={15} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  )
}
