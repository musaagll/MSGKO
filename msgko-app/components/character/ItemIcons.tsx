// ============================================================
// KO-style item slot icons — inline SVG, no external deps
// Each slot type has a distinct recognizable icon
// ============================================================

import type { ItemType, EquipmentSlotKey } from '@/lib/types/character'

const BASE = 'currentColor'

export const SLOT_ICONS: Record<EquipmentSlotKey, React.ReactNode> = {
  HELMET: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M32 8C20 8 12 18 12 30v8h4v4h32v-4h4V30C52 18 44 8 32 8z" fill="rgba(139,92,246,0.3)" stroke="rgba(139,92,246,0.8)" strokeWidth="1.5"/>
      <path d="M16 34h32" stroke="rgba(139,92,246,0.6)" strokeWidth="1"/>
      <path d="M20 30c0-6.6 5.4-12 12-12s12 5.4 12 12" stroke="rgba(167,139,250,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="16" y="38" width="32" height="6" rx="2" fill="rgba(139,92,246,0.2)" stroke="rgba(139,92,246,0.6)" strokeWidth="1"/>
    </svg>
  ),
  ARMOR: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M22 10l-10 8v18l20 16 20-16V18l-10-8-10 4-10-4z" fill="rgba(139,92,246,0.25)" stroke="rgba(139,92,246,0.8)" strokeWidth="1.5"/>
      <path d="M32 14v34" stroke="rgba(139,92,246,0.4)" strokeWidth="1"/>
      <path d="M12 26h40" stroke="rgba(139,92,246,0.4)" strokeWidth="1"/>
      <path d="M22 10l10 4 10-4" stroke="rgba(167,139,250,0.7)" strokeWidth="1.5"/>
    </svg>
  ),
  PADS: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M18 12h28v20c0 8-4 16-14 18-10-2-14-10-14-18V12z" fill="rgba(139,92,246,0.25)" stroke="rgba(139,92,246,0.8)" strokeWidth="1.5"/>
      <path d="M18 22h28M18 32h28" stroke="rgba(139,92,246,0.4)" strokeWidth="1"/>
      <path d="M22 12v8M32 12v8M42 12v8" stroke="rgba(139,92,246,0.3)" strokeWidth="1"/>
    </svg>
  ),
  GLOVES: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M20 28V16a3 3 0 016 0v8M26 24V14a3 3 0 016 0v10M32 24V16a3 3 0 016 0v8M38 28V20a3 3 0 016 0v10c0 6-3 14-14 16-11-2-14-10-14-16V26a3 3 0 016 0v2" fill="rgba(139,92,246,0.25)" stroke="rgba(139,92,246,0.8)" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  BOOTS: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M20 10v30l-6 10h36l-4-10V10H20z" fill="rgba(139,92,246,0.25)" stroke="rgba(139,92,246,0.8)" strokeWidth="1.5"/>
      <path d="M14 50h36" stroke="rgba(139,92,246,0.6)" strokeWidth="1"/>
      <path d="M20 28h26" stroke="rgba(139,92,246,0.4)" strokeWidth="1"/>
      <rect x="14" y="50" width="36" height="4" rx="2" fill="rgba(139,92,246,0.2)" stroke="rgba(139,92,246,0.5)" strokeWidth="1"/>
    </svg>
  ),
  RIGHT_HAND: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <line x1="32" y1="6" x2="32" y2="50" stroke="rgba(251,191,36,0.8)" strokeWidth="3" strokeLinecap="round"/>
      <path d="M26 18l6-12 6 12" fill="rgba(251,191,36,0.3)" stroke="rgba(251,191,36,0.8)" strokeWidth="1.5"/>
      <path d="M20 36h24" stroke="rgba(251,191,36,0.7)" strokeWidth="3" strokeLinecap="round"/>
      <rect x="28" y="46" width="8" height="12" rx="2" fill="rgba(251,191,36,0.2)" stroke="rgba(251,191,36,0.6)" strokeWidth="1.5"/>
    </svg>
  ),
  LEFT_HAND: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <line x1="32" y1="6" x2="32" y2="50" stroke="rgba(251,191,36,0.8)" strokeWidth="3" strokeLinecap="round"/>
      <path d="M26 18l6-12 6 12" fill="rgba(251,191,36,0.3)" stroke="rgba(251,191,36,0.8)" strokeWidth="1.5"/>
      <path d="M20 36h24" stroke="rgba(251,191,36,0.7)" strokeWidth="3" strokeLinecap="round"/>
      <rect x="28" y="46" width="8" height="12" rx="2" fill="rgba(251,191,36,0.2)" stroke="rgba(251,191,36,0.6)" strokeWidth="1.5"/>
    </svg>
  ),
  RING_1: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="32" cy="32" r="16" stroke="rgba(251,191,36,0.7)" strokeWidth="4" fill="none"/>
      <circle cx="32" cy="32" r="8" fill="rgba(251,191,36,0.15)" stroke="rgba(251,191,36,0.4)" strokeWidth="1.5"/>
      <circle cx="32" cy="16" r="4" fill="rgba(251,191,36,0.3)" stroke="rgba(251,191,36,0.8)" strokeWidth="1.5"/>
    </svg>
  ),
  RING_2: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="32" cy="32" r="16" stroke="rgba(251,191,36,0.7)" strokeWidth="4" fill="none"/>
      <circle cx="32" cy="32" r="8" fill="rgba(251,191,36,0.15)" stroke="rgba(251,191,36,0.4)" strokeWidth="1.5"/>
      <circle cx="32" cy="16" r="4" fill="rgba(251,191,36,0.3)" stroke="rgba(251,191,36,0.8)" strokeWidth="1.5"/>
    </svg>
  ),
  NECKLACE: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M12 14c0 0 8 4 20 4s20-4 20-4" stroke="rgba(251,191,36,0.7)" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M12 14c-4 10-2 20 20 30C54 34 56 24 52 14" stroke="rgba(251,191,36,0.5)" strokeWidth="1.5" fill="none"/>
      <path d="M28 40l4 8 4-8-4 4-4-4z" fill="rgba(251,191,36,0.4)" stroke="rgba(251,191,36,0.8)" strokeWidth="1"/>
    </svg>
  ),
  EARRING_1: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="32" cy="18" r="5" fill="rgba(251,191,36,0.2)" stroke="rgba(251,191,36,0.8)" strokeWidth="1.5"/>
      <line x1="32" y1="23" x2="32" y2="38" stroke="rgba(251,191,36,0.6)" strokeWidth="1.5"/>
      <path d="M26 38l6 10 6-10" fill="rgba(251,191,36,0.25)" stroke="rgba(251,191,36,0.7)" strokeWidth="1.5"/>
    </svg>
  ),
  EARRING_2: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="32" cy="18" r="5" fill="rgba(251,191,36,0.2)" stroke="rgba(251,191,36,0.8)" strokeWidth="1.5"/>
      <line x1="32" y1="23" x2="32" y2="38" stroke="rgba(251,191,36,0.6)" strokeWidth="1.5"/>
      <path d="M26 38l6 10 6-10" fill="rgba(251,191,36,0.25)" stroke="rgba(251,191,36,0.7)" strokeWidth="1.5"/>
    </svg>
  ),
  WINGS: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M32 32C32 32 10 20 8 8c8 2 16 10 24 24z" fill="rgba(139,92,246,0.3)" stroke="rgba(139,92,246,0.8)" strokeWidth="1.5"/>
      <path d="M32 32C32 32 54 20 56 8c-8 2-16 10-24 24z" fill="rgba(139,92,246,0.3)" stroke="rgba(139,92,246,0.8)" strokeWidth="1.5"/>
      <path d="M32 32C32 32 14 36 10 50c8-2 18-8 22-18z" fill="rgba(139,92,246,0.2)" stroke="rgba(139,92,246,0.6)" strokeWidth="1.5"/>
      <path d="M32 32C32 32 50 36 54 50c-8-2-18-8-22-18z" fill="rgba(139,92,246,0.2)" stroke="rgba(139,92,246,0.6)" strokeWidth="1.5"/>
    </svg>
  ),
  PET: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="32" cy="36" rx="14" ry="12" fill="rgba(34,197,94,0.2)" stroke="rgba(34,197,94,0.7)" strokeWidth="1.5"/>
      <circle cx="26" cy="30" r="3" fill="rgba(34,197,94,0.4)" stroke="rgba(34,197,94,0.8)" strokeWidth="1"/>
      <circle cx="38" cy="30" r="3" fill="rgba(34,197,94,0.4)" stroke="rgba(34,197,94,0.8)" strokeWidth="1"/>
      <path d="M26 40c0 0 3 4 6 4s6-4 6-4" stroke="rgba(34,197,94,0.7)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M18 24c-2-6 2-10 6-8M46 24c2-6-2-10-6-8" stroke="rgba(34,197,94,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
}

// Item type icons (when no slot icon available)
export const ITEM_TYPE_ICONS: Record<ItemType, React.ReactNode> = {
  weapon: SLOT_ICONS.RIGHT_HAND,
  armor: SLOT_ICONS.ARMOR,
  accessory: SLOT_ICONS.RING_1,
  cospre: SLOT_ICONS.WINGS,
  pet: SLOT_ICONS.PET,
  consumable: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="20" y="24" width="24" height="32" rx="4" fill="rgba(139,92,246,0.2)" stroke="rgba(139,92,246,0.7)" strokeWidth="1.5"/>
      <rect x="24" y="16" width="16" height="10" rx="2" fill="rgba(139,92,246,0.3)" stroke="rgba(139,92,246,0.8)" strokeWidth="1.5"/>
      <path d="M28 36h8M28 42h8M32 30v12" stroke="rgba(139,92,246,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
}

// Upgrade glow colors
export const UPGRADE_GLOW: Record<number, string> = {
  7:  '0 0 8px rgba(234,179,8,0.6)',
  8:  '0 0 10px rgba(234,179,8,0.8)',
  9:  '0 0 12px rgba(249,115,22,0.8)',
  10: '0 0 14px rgba(249,115,22,1)',
  11: '0 0 16px rgba(239,68,68,1), 0 0 32px rgba(239,68,68,0.4)',
}

export const UPGRADE_COLORS: Record<number, string> = {
  1: '#a3a3a3',
  2: '#a3a3a3',
  3: '#60a5fa',
  4: '#60a5fa',
  5: '#34d399',
  6: '#34d399',
  7: '#fbbf24',
  8: '#f59e0b',
  9: '#f97316',
  10: '#ef4444',
  11: '#e879f9',
}
