import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import type { BossSeedData } from '@/lib/ko-data/bosses'
import { getMapBySlug } from '@/lib/ko-data/maps'

export const BOSS_TYPE: Record<string, { label: string; className: string }> = {
  world: { label: 'World Boss', className: 'text-ember-300 border-ember-400/35 bg-ember-500/10' },
  dungeon: { label: 'Dungeon Boss', className: 'text-amethyst-200 border-amethyst-400/35 bg-amethyst-500/10' },
  event: { label: 'Event Boss', className: 'text-amber-200 border-amber-400/35 bg-amber-500/10' },
  mini: { label: 'Mini Boss', className: 'text-fg-2 border-white/15 bg-white/5' },
}

/** Harita slug'ını okunur isme çevirir (veri varsa harita adı) */
export function mapLabel(slug: string): string {
  return getMapBySlug(slug)?.name ?? slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}

export function BossCard({ boss, as: Heading = 'h2' }: { boss: BossSeedData; as?: 'h2' | 'h3' }) {
  const type = BOSS_TYPE[boss.boss_type] ?? BOSS_TYPE.mini
  return (
    <Link href={`/boss/${boss.slug}`} className="group card card-interactive flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <span className={`chip border ${type.className}`}>{type.label}</span>
        {boss.level && <span className="text-sm font-semibold tabular-nums text-fg-3">Lv. {boss.level}</span>}
      </div>
      <Heading className="mt-4 text-xl font-bold text-fg">{boss.name}</Heading>
      {boss.map_slug && (
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-fg-3">
          <MapPin size={14} aria-hidden="true" className="text-fg-4" />
          {mapLabel(boss.map_slug)}
        </p>
      )}
      {boss.drop_list.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-4">Drop</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {boss.drop_list.slice(0, 3).map((d) => (
              <li key={d.item_name} className="chip">{d.item_name}</li>
            ))}
            {boss.drop_list.length > 3 && <li className="chip text-fg-4">+{boss.drop_list.length - 3}</li>}
          </ul>
        </div>
      )}
      <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-fg-2 transition-colors group-hover:text-amethyst-200">
        Rehberi Oku
        <ArrowRight size={15} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  )
}
