'use client'

import { useEffect } from 'react'
import type { Item } from '@/lib/types/character'

interface Props {
  item: Item
  upgradeLevel: number
  slotLabel: string
  onClose: () => void
}

function getUpgradeColor(level: number): string {
  if (level >= 11) return '#e879f9'
  if (level >= 9) return '#f97316'
  if (level >= 7) return '#fbbf24'
  return '#a3a3a3'
}

const GRADE_LABELS: Record<string, { tr: string; color: string }> = {
  low:     { tr: 'Normal',   color: '#9ca3af' },
  middle:  { tr: 'Middle',   color: '#60a5fa' },
  high:    { tr: 'Rare',     color: '#fbbf24' },
  unique:  { tr: 'Unique',   color: '#f97316' },
  reverse: { tr: 'Reverse',  color: '#e879f9' },
}

const TYPE_LABELS: Record<string, string> = {
  weapon: 'Silah', armor: 'Zırh', accessory: 'Aksesuar',
  cospre: 'Cospre', pet: 'Evcil Hayvan', consumable: 'Sarf',
}

export function ItemDetailPopup({ item, upgradeLevel, slotLabel, onClose }: Props) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])

  const upgradeColor = getUpgradeColor(upgradeLevel)
  const grade = item.item_grade ? GRADE_LABELS[item.item_grade] : null
  const fullName = `${item.item_name_en ?? item.item_name}${upgradeLevel > 0 ? ` (+${upgradeLevel})` : ''}`

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative w-full max-w-[300px] rounded-xl pointer-events-auto"
          style={{
            background: 'linear-gradient(160deg, #0f0a1e 0%, #08050f 100%)',
            border: '1px solid rgba(139,92,246,0.3)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          }}
        >
          <button onClick={onClose}
            className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded
                       text-white/30 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Kapat">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>

          <div className="p-5">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-1"
                style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)' }}
              >
                {item.icon_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.icon_url} alt={item.item_name} className="w-full h-full object-contain" />
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="1.5" className="text-white/20">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                  </svg>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-black text-white text-sm leading-tight"
                  style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                  {fullName}
                </h3>
                {grade && (
                  <span
                    className="inline-block text-[0.55rem] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded mt-1"
                    style={{ color: grade.color, background: `${grade.color}15`, border: `1px solid ${grade.color}30` }}
                  >
                    {grade.tr}
                  </span>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 border-t pt-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <Row label="Slot"   value={slotLabel} />
              <Row label="Tür"    value={TYPE_LABELS[item.item_type] ?? item.item_type} />
              {item.class_restriction && item.class_restriction !== 'all' && (
                <Row label="Sınıf" value={{
                  warrior: 'Savaşçı', rogue: 'Asas', mage: 'Büyücü', priest: 'Rahip'
                }[item.class_restriction] ?? item.class_restriction} />
              )}
              {upgradeLevel > 0 && <Row label="Upgrade" value={`+${upgradeLevel}`} accent={upgradeColor} />}
              {(item.max_upgrade ?? 0) > 0 && <Row label="Max" value={`+${item.max_upgrade}`} />}
              <Row label="Item ID" value={String(item.item_id)} muted />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function Row({ label, value, accent, muted }: {
  label: string; value: string; accent?: string; muted?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[0.65rem] text-white/35 flex-shrink-0">{label}</span>
      <span className="text-[0.7rem] font-semibold text-right"
        style={{ color: accent ?? (muted ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.8)') }}>
        {value}
      </span>
    </div>
  )
}
