'use client'

// ============================================================
// Cospre Panel — sol taraf (USKO.LIVE style)
// ============================================================

import type { Character, Item } from '@/lib/types/character'

const COSPRE_TYPES = [
  'valkyrie', 'pathos', 'wings', 'fairy', 'tattoo', 'emblem', 'talisman'
] as const

const COSPRE_LABELS: Record<string, string> = {
  valkyrie: 'Valkyrie', pathos: 'Pathos', wings: 'Kanat',
  fairy: 'Peri', tattoo: 'Dövme', emblem: 'Amblem', talisman: 'Tılsım',
}

interface Props {
  character: Character
  onItemClick?: (item: Item, upgradeLevel: number, label: string) => void
}

export function CosprePanel({ character, onItemClick }: Props) {
  const cospre = character.cospre ?? {}
  const hasAnyCospre = Object.values(cospre).some(c => c?.item_id)

  return (
    <div
      className="rounded-lg overflow-hidden h-full"
      style={{
        background: 'rgba(10,8,20,0.97)',
        border: '1px solid rgba(139,92,246,0.12)',
      }}
    >
      {/* Header */}
      <div
        className="px-3 py-2.5 flex items-center gap-2"
        style={{ borderBottom: '1px solid rgba(139,92,246,0.1)' }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" className="text-purple-400 flex-shrink-0">
          <path d="M12 2L9.5 9H2l6 4.5L5.5 21 12 17l6.5 4-2.5-7.5L22 9h-7.5z"/>
        </svg>
        <span className="text-[0.6rem] font-black tracking-[0.22em] uppercase text-white/40">Cospre</span>
      </div>

      {/* Cospre rows */}
      <div className="p-2 space-y-1">
        {COSPRE_TYPES.map(type => {
          const entry = cospre[type]
          const hasItem = entry?.enabled && entry.item_id && entry.item

          return (
            <button
              key={type}
              type="button"
              onClick={() => hasItem && entry.item && onItemClick?.(entry.item, entry.upgrade_level, COSPRE_LABELS[type])}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded transition-all duration-150 text-left
                ${hasItem ? 'hover:bg-white/[0.04] cursor-pointer' : 'opacity-40 cursor-default'}`}
              style={{ background: 'transparent' }}
            >
              {/* Icon */}
              <div
                className="w-9 h-9 flex-shrink-0 rounded flex items-center justify-center overflow-hidden"
                style={{
                  background: hasItem ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${hasItem ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.07)'}`,
                }}
              >
                {hasItem && entry.item?.icon_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={entry.item.icon_url}
                    alt={entry.item.item_name}
                    className="w-full h-full object-contain p-0.5"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-dashed border-white/15" />
                )}
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <p className="text-[0.6rem] font-bold text-white/30 uppercase tracking-wider leading-none mb-0.5">
                  {COSPRE_LABELS[type]}
                </p>
                {hasItem && entry.item ? (
                  <p className="text-[0.68rem] font-semibold text-white/85 leading-tight truncate">
                    {entry.item.item_name_en ?? entry.item.item_name}
                    {entry.upgrade_level > 0 && (
                      <span className="ml-1 font-black" style={{ color: getUpgradeColor(entry.upgrade_level) }}>
                        +{entry.upgrade_level}
                      </span>
                    )}
                  </p>
                ) : (
                  <p className="text-[0.62rem] text-white/20 leading-tight">—</p>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function getUpgradeColor(level: number): string {
  if (level >= 11) return '#e879f9'
  if (level >= 9) return '#f97316'
  if (level >= 7) return '#fbbf24'
  return '#a3a3a3'
}
