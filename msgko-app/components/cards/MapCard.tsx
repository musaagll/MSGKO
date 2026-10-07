import Link from 'next/link'
import { ArrowRight, Castle, Swords } from 'lucide-react'
import type { MapSeedData } from '@/lib/ko-data/maps'

export const MAP_TYPE: Record<string, { label: string; className: string }> = {
  pvp: { label: 'PvP', className: 'text-red-200 border-red-400/35 bg-red-500/10' },
  pve: { label: 'PvE', className: 'text-emerald-200 border-emerald-400/35 bg-emerald-500/10' },
  dungeon: { label: 'Dungeon', className: 'text-amethyst-200 border-amethyst-400/35 bg-amethyst-500/10' },
  town: { label: 'Kasaba', className: 'text-sky-200 border-sky-400/35 bg-sky-500/10' },
  event: { label: 'Etkinlik', className: 'text-amber-200 border-amber-400/35 bg-amber-500/10' },
}

export function levelRange(min: number | null, max: number | null): string | null {
  if (!min && !max) return null
  return `${min ?? '?'}${max ? ` – ${max}` : '+'}`
}

export function MapCard({ map, as: Heading = 'h2' }: { map: MapSeedData; as?: 'h2' | 'h3' }) {
  const type = MAP_TYPE[map.map_type] ?? MAP_TYPE.pve
  const range = levelRange(map.min_level, map.max_level)
  return (
    <Link href={`/harita/${map.slug}`} className="group card card-interactive flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <span className={`chip border ${type.className}`}>{type.label}</span>
        <span className="flex items-center gap-2 text-fg-4">
          {map.is_war_zone && <Swords size={16} aria-label="Savaş bölgesi" />}
          {map.has_dungeon && <Castle size={16} aria-label="Dungeon var" />}
        </span>
      </div>
      <Heading className="mt-4 text-xl font-bold text-fg">{map.name}</Heading>
      {range && <p className="mt-1.5 text-sm tabular-nums text-fg-3">Level {range}</p>}
      {map.description && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-fg-3">{map.description}</p>}
      {map.bosses_here.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {map.bosses_here.slice(0, 3).map((b) => (
            <li key={b.boss_slug} className="chip">{b.boss_name}</li>
          ))}
        </ul>
      )}
      <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-fg-2 transition-colors group-hover:text-amethyst-200">
        Harita Rehberi
        <ArrowRight size={15} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  )
}
