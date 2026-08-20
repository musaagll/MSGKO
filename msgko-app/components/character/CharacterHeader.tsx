// ============================================================
// Character Header — USKO.LIVE layout
// ============================================================

import type { Character } from '@/lib/types/character'

const CLASS_LABELS: Record<string, string> = {
  warrior: 'Warrior', rogue: 'Rogue', mage: 'Mage', priest: 'Priest',
}
const NATION_LABELS: Record<string, string> = {
  karus: 'Karus', el_morad: 'El Morad',
}
const NATION_COLORS: Record<string, string> = {
  karus: '#ef4444', el_morad: '#3b82f6',
}
const CLASS_COLORS: Record<string, string> = {
  warrior: '#f59e0b', rogue: '#a78bfa', mage: '#60a5fa', priest: '#34d399',
}

export function CharacterHeader({ character }: { character: Character }) {
  const nationColor = NATION_COLORS[character.nation] ?? '#a78bfa'
  const classColor = CLASS_COLORS[character.class] ?? '#a78bfa'
  const nationLabel = NATION_LABELS[character.nation] ?? character.nation
  const classLabel = CLASS_LABELS[character.class] ?? character.class

  return (
    <div
      className="rounded-lg px-5 py-4"
      style={{
        background: 'linear-gradient(135deg, rgba(12,9,24,0.98) 0%, rgba(8,6,18,0.98) 100%)',
        border: '1px solid rgba(139,92,246,0.18)',
      }}
    >
      <div className="flex flex-wrap items-center gap-3">
        {/* Server + Demo badges */}
        <div className="flex items-center gap-2">
          <span
            className="text-[0.6rem] font-black tracking-[0.18em] uppercase px-2.5 py-1 rounded"
            style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.35)', color: '#c4b5fd' }}
          >
            {character.server.server_name}
          </span>
          {character.data_source === 'mock' && (
            <span
              className="text-[0.55rem] font-bold tracking-widest uppercase px-2 py-0.5 rounded"
              style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)', color: 'rgba(234,179,8,0.8)' }}
            >
              DEMO
            </span>
          )}
        </div>

        {/* Character name */}
        <h1
          className="text-2xl md:text-[1.75rem] font-black tracking-wider uppercase text-white"
          style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}
        >
          {character.character_name}
        </h1>

        {/* Nation badge */}
        <span
          className="text-[0.62rem] font-black tracking-wide px-2.5 py-1 rounded"
          style={{
            color: nationColor,
            background: `${nationColor}18`,
            border: `1px solid ${nationColor}40`,
          }}
        >
          {nationLabel}
        </span>

        {/* Class badge */}
        <span
          className="text-[0.62rem] font-black tracking-wide px-2.5 py-1 rounded"
          style={{
            color: classColor,
            background: `${classColor}18`,
            border: `1px solid ${classColor}40`,
          }}
        >
          {classLabel}
        </span>

        {/* Level */}
        <span className="text-sm text-white/50">
          Lv. <strong className="text-white font-black">{character.level}</strong>
        </span>
      </div>
    </div>
  )
}
