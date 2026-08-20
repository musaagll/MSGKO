'use client'

import type { Item, EquipmentSlotKey } from '@/lib/types/character'
import { SLOT_ICONS, UPGRADE_COLORS } from './ItemIcons'

interface Props {
  item: Item
  slotKey: EquipmentSlotKey
  upgradeLevel: number
  slotLabel: string
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

const GRADE_BORDER: Record<string, string> = {
  low:     'rgba(156,163,175,0.3)',
  middle:  'rgba(96,165,250,0.4)',
  high:    'rgba(251,191,36,0.4)',
  unique:  'rgba(249,115,22,0.5)',
  reverse: 'rgba(232,121,249,0.5)',
}

export function ItemCard({ item, slotKey, upgradeLevel, slotLabel, onClick, onMouseEnter, onMouseLeave }: Props) {
  const upgradeStr = upgradeLevel > 0 ? `+${upgradeLevel}` : null
  const upgradeColor = UPGRADE_COLORS[upgradeLevel] ?? '#e5e7eb'
  const borderColor = item.item_grade ? GRADE_BORDER[item.item_grade] : 'rgba(255,255,255,0.08)'
  const icon = SLOT_ICONS[slotKey]

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="group relative flex flex-col items-center gap-2 p-2 rounded-lg w-full cursor-pointer text-left transition-all duration-200 hover:scale-[1.03]"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${borderColor}`,
      }}
    >
      {/* Slot label */}
      <span className="self-start text-[0.5rem] font-bold tracking-[0.18em] uppercase leading-none"
        style={{ color: 'rgba(255,255,255,0.28)' }}>
        {slotLabel}
      </span>

      {/* Icon */}
      <div
        className="relative w-14 h-14 flex-shrink-0 rounded-lg flex items-center justify-center p-1.5 overflow-hidden"
        style={{
          background: 'rgba(0,0,0,0.5)',
          border: `1px solid ${borderColor}`,
          boxShadow: upgradeLevel >= 9 ? `0 0 12px ${upgradeColor}40` : 'none',
        }}
      >
        {item.icon_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.icon_url} alt={item.item_name}
            className="w-full h-full object-contain"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        ) : (
          <div className="w-full h-full">{icon}</div>
        )}

        {/* Upgrade badge */}
        {upgradeStr && (
          <span
            className="absolute bottom-0 right-0 text-[0.6rem] font-black leading-none px-1 py-0.5 rounded-tl"
            style={{ color: upgradeColor, background: 'rgba(0,0,0,0.85)' }}
          >
            {upgradeStr}
          </span>
        )}

        {/* Grade glow overlay */}
        {(item.item_grade === 'unique' || item.item_grade === 'reverse') && (
          <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: `radial-gradient(circle at 50% 50%, ${upgradeLevel >= 7 ? upgradeColor : '#f97316'}15 0%, transparent 70%)` }} />
        )}
      </div>

      {/* Item name */}
      <span
        className="text-[0.72rem] font-bold text-center leading-tight w-full line-clamp-2"
        style={{ color: 'rgba(255,255,255,0.85)' }}
      >
        {item.item_name_en ?? item.item_name}
        {upgradeStr && (
          <span className="ml-1 font-black" style={{ color: upgradeColor }}>{upgradeStr}</span>
        )}
      </span>
    </button>
  )
}

// Empty slot
export function EmptySlotCard({ slotKey, slotLabel }: { slotKey: EquipmentSlotKey; slotLabel: string }) {
  return (
    <div
      className="flex flex-col items-center gap-2 p-2 rounded-lg w-full"
      style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', opacity: 0.35 }}
    >
      <span className="self-start text-[0.5rem] font-bold tracking-[0.18em] uppercase leading-none text-white/25">
        {slotLabel}
      </span>
      <div className="w-14 h-14 rounded-lg border border-dashed border-white/10 bg-black/20
                      flex items-center justify-center p-2 opacity-40">
        {SLOT_ICONS[slotKey]}
      </div>
      <span className="text-[0.62rem] text-white/15">—</span>
    </div>
  )
}
