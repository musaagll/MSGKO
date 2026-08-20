// ============================================================
// Character Info Header — USKO.LIVE style
// ============================================================

import type { Character } from '@/lib/types/character'

const CLASS_LABELS: Record<string, string> = {
  warrior: 'Warrior',
  rogue: 'Rogue (Assassin)',
  mage: 'Mage',
  priest: 'Priest',
}

const CLASS_COLORS: Record<string, string> = {
  warrior: '#ef4444',
  rogue: '#a78bfa',
  mage: '#60a5fa',
  priest: '#34d399',
}

const NATION_LABELS: Record<string, string> = {
  karus: 'Karus',
  el_morad: 'El Morad',
}

const NATION_COLORS: Record<string, string> = {
  karus: '#ef4444',
  el_morad: '#3b82f6',
}

export function CharacterInfo({ character }: { character: Character }) {
  const classColor = CLASS_COLORS[character.class] ?? '#a78bfa'
  const nationColor = NATION_COLORS[character.nation] ?? '#a78bfa'

  return (
    <div
      className="relative overflow-hidden rounded-lg p-5 sm:p-6"
      style={{
        background: 'linear-gradient(135deg, rgba(15,10,30,0.98) 0%, rgba(10,7,20,0.98) 100%)',
        border: '1px solid rgba(139,92,246,0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      {/* Accent top border */}
      <div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${classColor}80, transparent)` }} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        {/* Left: Name + badges */}
        <div className="flex items-start gap-4">
          {/* Class icon circle */}
          <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: `${classColor}18`, border: `1px solid ${classColor}40` }}>
            <ClassIcon cls={character.class} color={classColor} />
          </div>

          <div>
            {/* Server badge */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[0.58rem] font-black tracking-[0.2em] uppercase px-2 py-0.5 rounded"
                style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: 'rgba(167,139,250,0.9)' }}>
                {character.server.server_name}
              </span>
              {character.data_source === 'mock' && (
                <span className="text-[0.52rem] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.25)', color: 'rgba(234,179,8,0.7)' }}>
                  DEMO
                </span>
              )}
            </div>

            {/* Character name */}
            <h1
              className="text-2xl sm:text-3xl font-black tracking-wider uppercase text-white leading-none mb-2"
              style={{ fontFamily: 'var(--font-rajdhani), sans-serif', textShadow: `0 0 30px ${classColor}40` }}
            >
              {character.character_name}
            </h1>

            {/* Tags row */}
            <div className="flex flex-wrap items-center gap-2">
              <Tag color={classColor} label={CLASS_LABELS[character.class] ?? character.class} />
              <span className="text-white/20 text-xs">·</span>
              <Tag color={nationColor} label={NATION_LABELS[character.nation] ?? character.nation} />
              <span className="text-white/20 text-xs">·</span>
              <span className="text-sm text-white/50 font-medium">
                Lv. <strong className="text-white">{character.level}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Stats summary (display only) */}
        <div className="flex items-center gap-3 sm:gap-4">
          <StatBadge label="ULUS" value={NATION_LABELS[character.nation]} color={nationColor} />
          <StatBadge label="SEVİYE" value={String(character.level)} color={classColor} />
        </div>
      </div>
    </div>
  )
}

function Tag({ color, label }: { color: string; label: string }) {
  return (
    <span className="text-xs font-bold tracking-wide px-2 py-0.5 rounded"
      style={{ color, background: `${color}15`, border: `1px solid ${color}30` }}>
      {label}
    </span>
  )
}

function StatBadge({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="text-center px-3 py-2 rounded"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <p className="text-[0.5rem] font-black tracking-[0.2em] uppercase mb-0.5"
        style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</p>
      <p className="text-sm font-black" style={{ color }}>{value}</p>
    </div>
  )
}

function ClassIcon({ cls, color }: { cls: string; color: string }) {
  const icons: Record<string, React.ReactNode> = {
    rogue: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
        <path d="m14.5 17.5-5-5 9-9-4 4 2 2-2 8Z"/><path d="m9.5 12.5-2 2-2.5 2.5 1 1 2.5-2.5 2-2"/>
      </svg>
    ),
    warrior: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    mage: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
        <path d="M15 4V2m0 14v-2M8 9H2m14 0h-2M4.2 4.2l1.4 1.4m8.4 8.4 1.4 1.4M4.2 13.8l1.4-1.4M13.8 4.2l1.4-1.4"/>
        <circle cx="10" cy="9" r="4"/>
      </svg>
    ),
    priest: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 2v20M2 12h20"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  }
  return <>{icons[cls] ?? icons.warrior}</>
}
