'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import type { Character, EquipmentSlotKey } from '@/lib/types/character'
import { CharacterHeader } from './CharacterHeader'
import { CosprePanel } from './CosprePanel'
import { EquipmentSidebar } from './EquipmentSidebar'
import { ItemDetailPopup } from './ItemDetailPopup'
import type { Item } from '@/lib/types/character'

const Character3DViewer = dynamic(
  () => import('./Character3DViewer').then(m => ({ default: m.Character3DViewer })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center"
        style={{ background: 'rgba(7,7,15,0.95)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-purple-500 border-purple-500/20 animate-spin" />
      </div>
    ),
  }
)

interface Props { character: Character; isMock?: boolean }

export function CharacterDetailClient({ character, isMock }: Props) {
  const [highlightedSlot, setHighlightedSlot] = useState<EquipmentSlotKey | null>(null)
  const [popup, setPopup] = useState<{ item: Item; upgradeLevel: number; slotLabel: string } | null>(null)

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-5">

      {/* Demo warning */}
      {isMock && (
        <div className="mb-3 px-4 py-2 rounded flex items-center gap-2"
          style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" className="text-yellow-400 flex-shrink-0">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <path d="M12 9v4"/><path d="M12 17h.01"/>
          </svg>
          <p className="text-xs text-yellow-200/70">
            <strong className="text-yellow-300">Demo:</strong> Bu veriler test amaçlıdır. Gerçek USKO sunucu bağlantısı henüz aktif değil.
          </p>
        </div>
      )}

      {/* Character header — USKO.LIVE style */}
      <CharacterHeader character={character} />

      {/* Main 3-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_280px] gap-3 mt-3">

        {/* LEFT: Cospre panel */}
        <div className="hidden lg:block">
          <CosprePanel character={character} onItemClick={(item, upg, label) => setPopup({ item, upgradeLevel: upg, slotLabel: label })} />
        </div>

        {/* CENTER: 3D Viewer */}
        <div
          className="relative rounded-lg overflow-hidden"
          style={{ minHeight: 480, background: 'linear-gradient(180deg, #08070f 0%, #0d0b1a 100%)', border: '1px solid rgba(139,92,246,0.12)' }}
        >
          <Character3DViewer character={character} highlightedSlot={highlightedSlot} />
        </div>

        {/* RIGHT: Equipment & Pet */}
        <div>
          <EquipmentSidebar
            character={character}
            onSlotHover={setHighlightedSlot}
            onItemClick={(item, upg, label) => setPopup({ item, upgradeLevel: upg, slotLabel: label })}
          />
        </div>
      </div>

      {/* Mobile: Cospre below */}
      <div className="lg:hidden mt-3">
        <CosprePanel character={character} onItemClick={(item, upg, label) => setPopup({ item, upgradeLevel: upg, slotLabel: label })} />
      </div>

      {/* Item detail popup */}
      {popup && (
        <ItemDetailPopup
          item={popup.item}
          upgradeLevel={popup.upgradeLevel}
          slotLabel={popup.slotLabel}
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  )
}
