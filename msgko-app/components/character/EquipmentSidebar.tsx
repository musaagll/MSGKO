'use client'

// ============================================================
// Equipment Sidebar — sağ panel, USKO.LIVE tarzı
// ============================================================

import type { Character, EquipmentSlotKey, Item } from '@/lib/types/character'
import { SLOT_INFO } from '@/lib/types/character'

const SLOT_ORDER: EquipmentSlotKey[] = [
  'HELMET', 'ARMOR', 'PADS',
  'GLOVES', 'BOOTS',
  'RIGHT_HAND', 'LEFT_HAND',
  'RING_1', 'RING_2', 'NECKLACE',
  'EARRING_1', 'EARRING_2',
  'WINGS', 'PET',
]

const SLOT_LABELS_TR: Record<EquipmentSlotKey, string> = {
  HELMET: 'KASK', ARMOR: 'ZIRH', PADS: 'PANT.',
  GLOVES: 'ELDİVEN', BOOTS: 'BOT',
  RIGHT_HAND: 'SAĞ EL', LEFT_HAND: 'SOL EL',
  RING_1: 'YÜZÜK 1', RING_2: 'YÜZÜK 2', NECKLACE: 'KOLYE',
  EARRING_1: 'KÜPE 1', EARRING_2: 'KÜPE 2',
  WINGS: 'KANAT', PET: 'PET',
}

const GRADE_LABELS: Record<string, string> = {
  low: 'Normal Item', middle: 'Middle Item', high: 'Rare Item',
  unique: 'Unique Item', reverse: 'Reverse Item',
}

function getUpgradeColor(level: number): string {
  if (level >= 11) return '#e879f9'
  if (level >= 9) return '#f97316'
  if (level >= 7) return '#fbbf24'
  if (level >= 5) return '#34d399'
  return '#9ca3af'
}

interface Props {
  character: Character
  onSlotHover?: (slot: EquipmentSlotKey | null) => void
  onItemClick?: (item: Item, upgradeLevel: number, slotLabel: string) => void
}

interface EquipRowProps {
  slotKey: EquipmentSlotKey
  item?: Item
  upgradeLevel: number
  onHover?: (slot: EquipmentSlotKey | null) => void
  onClick?: (item: Item, upgradeLevel: number, slotLabel: string) => void
}

function EquipRow({ slotKey, item, upgradeLevel, onHover, onClick }: EquipRowProps) {
  const slotLabel = SLOT_LABELS_TR[slotKey]
  const upgradeColor = getUpgradeColor(upgradeLevel)
  const gradeLabel = item?.item_grade ? GRADE_LABELS[item.item_grade] : ''

  return (
    <button
      type="button"
      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded transition-all duration-150 text-left
        ${item ? 'hover:bg-white/[0.04] cursor-pointer' : 'opacity-40 cursor-default'}`}
      onMouseEnter={() => item && onHover?.(slotKey)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() => item && onClick?.(item, upgradeLevel, slotLabel)}
    >
      {/* Icon box */}
      <div
        className="w-10 h-10 flex-shrink-0 rounded flex items-center justify-center overflow-hidden"
        style={{
          background: item ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
          border: item
            ? `1px solid ${upgradeLevel >= 7 ? upgradeColor + '40' : 'rgba(255,255,255,0.1)'}`
            : '1px solid rgba(255,255,255,0.06)',
          boxShadow: upgradeLevel >= 9 && item ? `0 0 8px ${upgradeColor}30` : 'none',
        }}
      >
        {item?.icon_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.icon_url}
            alt={item.item_name}
            className="w-full h-full object-contain p-0.5"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        ) : item ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.5" className="text-white/30">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
          </svg>
        ) : (
          <div className="w-4 h-4 rounded border border-dashed border-white/10" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {/* Slot label + grade */}
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[0.52rem] font-black tracking-[0.18em] uppercase text-white/25 leading-none">
            {slotLabel}
          </span>
          {gradeLabel && (
            <span className="text-[0.48rem] text-white/20 leading-none">{gradeLabel}</span>
          )}
        </div>

        {/* Item name + upgrade */}
        {item ? (
          <p className="text-[0.72rem] font-bold leading-tight" style={{ color: 'rgba(255,255,255,0.88)' }}>
            {item.item_name_en ?? item.item_name}
            {upgradeLevel > 0 && (
              <span className="ml-1 font-black" style={{ color: upgradeColor }}>
                (+{upgradeLevel})
              </span>
            )}
          </p>
        ) : (
          <p className="text-[0.65rem] text-white/18">—</p>
        )}
      </div>

      {/* Item icon (right side thumbnail, like USKO.LIVE) */}
      {item?.icon_url && (
        <div
          className="w-8 h-8 flex-shrink-0 rounded overflow-hidden"
          style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.icon_url}
            alt=""
            className="w-full h-full object-contain p-0.5"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </div>
      )}
    </button>
  )
}

export function EquipmentSidebar({ character, onSlotHover, onItemClick }: Props) {
  const eq = character.equipment ?? {}

  return (
    <div
      className="rounded-lg overflow-hidden"
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
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <span className="text-[0.6rem] font-black tracking-[0.22em] uppercase text-white/40">
          Ekipman &amp; Pet
        </span>
      </div>

      {/* Rows */}
      <div className="p-1.5 space-y-0.5">
        {SLOT_ORDER.map(slotKey => {
          const entry = eq[slotKey]
          return (
            <EquipRow
              key={slotKey}
              slotKey={slotKey}
              item={entry?.item}
              upgradeLevel={entry?.upgrade_level ?? 0}
              onHover={onSlotHover}
              onClick={onItemClick}
            />
          )
        })}
      </div>
    </div>
  )
}
