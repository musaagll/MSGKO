'use client'

import { useState } from 'react'
import type { Character, EquipmentSlotKey } from '@/lib/types/character'
import { SLOT_INFO } from '@/lib/types/character'
import { ItemCard, EmptySlotCard } from './ItemCard'
import { ItemDetailPopup } from './ItemDetailPopup'
import type { Item } from '@/lib/types/character'

interface Props {
  character: Character
  onSlotHover?: (slot: EquipmentSlotKey | null) => void
}

const EQUIPMENT_ORDER: EquipmentSlotKey[] = [
  'HELMET', 'ARMOR', 'PADS', 'GLOVES', 'BOOTS',
  'RIGHT_HAND', 'LEFT_HAND',
  'RING_1', 'RING_2', 'NECKLACE',
  'EARRING_1', 'EARRING_2',
  'WINGS', 'PET',
]

const COSPRE_ORDER = ['valkyrie', 'pathos', 'wings', 'fairy', 'tattoo', 'emblem', 'talisman'] as const
const COSPRE_LABELS: Record<string, string> = {
  valkyrie: 'Valkyrie', pathos: 'Pathos', wings: 'Kanat (CS)',
  fairy: 'Peri', tattoo: 'Dövme', emblem: 'Amblem', talisman: 'Tılsım',
}

export function EquipmentGrid({ character, onSlotHover }: Props) {
  const [popup, setPopup] = useState<{ item: Item; upgrade: number; label: string } | null>(null)

  const eq = character.equipment ?? {}
  const cs = character.cospre ?? {}
  const hasActiveCospre = Object.values(cs).some(c => c?.enabled && c.item_id)

  return (
    <div className="space-y-5">

      {/* Equipment */}
      <div>
        <h3 className="flex items-center gap-2 text-[0.65rem] font-black tracking-[0.22em] uppercase
                       text-white/40 mb-3">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" className="text-purple-400">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Ekipman
        </h3>

        <div className="grid grid-cols-3 gap-1.5">
          {EQUIPMENT_ORDER.map(slotKey => {
            const entry = eq[slotKey]
            const info = SLOT_INFO[slotKey]
            if (entry?.item) {
              return (
                <ItemCard
                  key={slotKey}
                  item={entry.item}
                  slotKey={slotKey}
                  upgradeLevel={entry.upgrade_level}
                  slotLabel={info.slot_label_tr}
                  onMouseEnter={() => onSlotHover?.(slotKey)}
                  onMouseLeave={() => onSlotHover?.(null)}
                  onClick={() => setPopup({
                    item: entry.item!,
                    upgrade: entry.upgrade_level,
                    label: info.slot_label_tr,
                  })}
                />
              )
            }
            return <EmptySlotCard key={slotKey} slotKey={slotKey} slotLabel={info.slot_label_tr} />
          })}
        </div>
      </div>

      {/* Cospre */}
      {hasActiveCospre && (
        <div>
          <h3 className="flex items-center gap-2 text-[0.65rem] font-black tracking-[0.22em] uppercase
                         text-white/40 mb-3">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" className="text-pink-400">
              <path d="M12 2L9.5 9H2l6 4.5L5.5 21 12 17l6.5 4-2.5-7.5L22 9h-7.5z"/>
            </svg>
            Cospre
          </h3>
          <div className="grid grid-cols-3 gap-1.5">
            {COSPRE_ORDER.map(type => {
              const entry = cs[type]
              if (!entry?.enabled || !entry.item) return null
              return (
                <ItemCard
                  key={type}
                  item={entry.item}
                  slotKey="WINGS"
                  upgradeLevel={entry.upgrade_level}
                  slotLabel={COSPRE_LABELS[type]}
                  onClick={() => setPopup({
                    item: entry.item!,
                    upgrade: entry.upgrade_level,
                    label: COSPRE_LABELS[type],
                  })}
                />
              )
            })}
          </div>
        </div>
      )}

      {popup && (
        <ItemDetailPopup
          item={popup.item}
          upgradeLevel={popup.upgrade}
          slotLabel={popup.label}
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  )
}
