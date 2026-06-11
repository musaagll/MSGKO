'use client'

import type { CalculatorState } from '@/lib/calculator/types'
import type { Action } from '@/lib/calculator/reducer'

interface Props {
  state: CalculatorState
  dispatch: React.Dispatch<Action>
  freeStatPoints: number
  freeRebirthPoints: number
}

// ─── Level listesi ────────────────────────────────────────────────────────────

interface LevelOption {
  id: number
  label: string
  level: number
  rebirthLevel: number
}

function buildLevelOptions(): LevelOption[] {
  const opts: LevelOption[] = []
  // id 1–83: normal level 1–83
  for (let i = 1; i <= 83; i++) {
    opts.push({ id: i, label: String(i), level: i, rebirthLevel: 0 })
  }
  // id 84–98: rebirth 83/1 – 83/15
  for (let r = 1; r <= 15; r++) {
    opts.push({ id: 83 + r, label: `83 / ${r}`, level: 83, rebirthLevel: r })
  }
  return opts
}

const LEVEL_OPTIONS = buildLevelOptions()

// ─── Sınıf seçenekleri ────────────────────────────────────────────────────────

const CLASS_OPTIONS = [
  { value: 'Warrior', label: 'Warrior' },
  { value: 'Rogue-Assassin', label: 'Rogue (Assassin)' },
  { value: 'Rogue-Archer', label: 'Rogue (Archer)' },
  { value: 'Priest', label: 'Priest' },
  { value: 'Mage', label: 'Mage' },
  { value: 'Kurian', label: 'Kurian' },
] as const

// ─── Warrior pasif skill seçenekleri ─────────────────────────────────────────

const WARRIOR_DEFENSE_SKILLS = [
  { value: 0, label: 'Select Defense Skill' },
  { value: 1, label: 'Hinder +10% AC (5 pts)' },
  { value: 2, label: 'Arrest +15% AC (15 pts)' },
  { value: 3, label: 'Bulwark +20% AC (35 pts)' },
  { value: 4, label: 'Evading +25% AC (55 pts)' },
  { value: 5, label: 'Iron Skin +30% AC (70 pts)' },
  { value: 6, label: 'Iron Body +40% AC (80 pts)' },
]

const WARRIOR_RESIST_SKILLS = [
  { value: 0, label: 'Select Resist Skill' },
  { value: 1, label: 'Resist +30 (10 pts)' },
  { value: 2, label: 'Endure +60 (20 pts)' },
  { value: 3, label: 'Immunity +90 (40 pts)' },
]

// ─── Kurian pasif skill seçenekleri ──────────────────────────────────────────

const KURIAN_DEFENSE_SKILLS = [
  { value: 0, label: 'Select Defense Skill' },
  { value: 1, label: 'Hinder +5% AC (5 pts)' },
  { value: 2, label: 'Arrest +8% AC (15 pts)' },
  { value: 3, label: 'Bulwark +10% AC (35 pts)' },
  { value: 4, label: 'Evading +13% AC (55 pts)' },
  { value: 5, label: 'Iron Skin +15% AC (70 pts)' },
  { value: 6, label: 'Iron Linker +20% AC (80 pts)' },
]

const KURIAN_RESIST_SKILLS = [
  { value: 0, label: 'Select Resist Skill' },
  { value: 1, label: 'Resist +15 (10 pts)' },
  { value: 2, label: 'Endure +30 (20 pts)' },
  { value: 3, label: 'Immunity +45 (40 pts)' },
]

// ─── Priest weapon seçenekleri ────────────────────────────────────────────────

const PRIEST_WEAPON_TYPES = ['Sword', 'Club - 1H', 'Club - 2H']

// ─── Ortak select stili ───────────────────────────────────────────────────────

const SELECT_CLASS =
  'w-full bg-white/[0.06] border border-white/[0.12] rounded-sm px-2 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500/60 focus:bg-white/[0.08] transition-colors cursor-pointer'

// ─── ClassLevelPanel ──────────────────────────────────────────────────────────

export function ClassLevelPanel({ state, dispatch, freeStatPoints, freeRebirthPoints }: Props) {
  // Sınıf seçimi için birleşik değer (Rogue alt sınıfını da içeriyor)
  const classValue =
    state.characterClass === 'Rogue'
      ? `Rogue-${state.rogueSubClass}`
      : state.characterClass

  function handleClassChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value
    if (val.startsWith('Rogue-')) {
      const sub = val.replace('Rogue-', '') as 'Assassin' | 'Archer'
      dispatch({ type: 'SET_CLASS', payload: 'Rogue' })
      dispatch({ type: 'SET_ROGUE_SUBCLASS', payload: sub })
    } else {
      dispatch({ type: 'SET_CLASS', payload: val as 'Warrior' | 'Priest' | 'Mage' | 'Kurian' })
    }
  }

  function handleLevelChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const opt = LEVEL_OPTIONS.find((o) => o.id === Number(e.target.value))
    if (!opt) return
    dispatch({
      type: 'SET_LEVEL',
      payload: { levelId: opt.id, level: opt.level, rebirthLevel: opt.rebirthLevel },
    })
  }

  return (
    <fieldset className="border border-white/[0.10] rounded-sm p-4 space-y-4">
      <legend className="px-2 text-xs font-semibold text-white/50 uppercase tracking-widest">
        Class &amp; Level
      </legend>

      {/* Sınıf seçimi */}
      <div className="space-y-1">
        <label className="block text-xs text-white/50 uppercase tracking-wider">Class</label>
        <select value={classValue} onChange={handleClassChange} className={SELECT_CLASS}>
          {CLASS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-neutral-900">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Seviye seçimi */}
      <div className="space-y-1">
        <label className="block text-xs text-white/50 uppercase tracking-wider">Level</label>
        <select value={state.levelId} onChange={handleLevelChange} className={SELECT_CLASS}>
          {LEVEL_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id} className="bg-neutral-900">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Warrior pasif skill'leri */}
      {state.characterClass === 'Warrior' && (
        <fieldset className="border border-white/[0.07] rounded-sm p-3 space-y-3">
          <legend className="px-1.5 text-xs text-white/40 uppercase tracking-wider">
            Passive Skills
          </legend>

          <div className="space-y-1">
            <label className="block text-xs text-white/50 uppercase tracking-wider">Defense</label>
            <select
              value={state.warriorDefenseSkill}
              onChange={(e) =>
                dispatch({ type: 'SET_WARRIOR_DEFENSE_SKILL', payload: Number(e.target.value) })
              }
              className={SELECT_CLASS}
            >
              {WARRIOR_DEFENSE_SKILLS.map((s) => (
                <option key={s.value} value={s.value} className="bg-neutral-900">
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-white/50 uppercase tracking-wider">Resist</label>
            <select
              value={state.warriorResistSkill}
              onChange={(e) =>
                dispatch({ type: 'SET_WARRIOR_RESIST_SKILL', payload: Number(e.target.value) })
              }
              className={SELECT_CLASS}
            >
              {WARRIOR_RESIST_SKILLS.map((s) => (
                <option key={s.value} value={s.value} className="bg-neutral-900">
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </fieldset>
      )}

      {/* Kurian pasif skill'leri */}
      {state.characterClass === 'Kurian' && (
        <fieldset className="border border-white/[0.07] rounded-sm p-3 space-y-3">
          <legend className="px-1.5 text-xs text-white/40 uppercase tracking-wider">
            Passive Skills
          </legend>

          <div className="space-y-1">
            <label className="block text-xs text-white/50 uppercase tracking-wider">Defense</label>
            <select
              value={state.kurianDefenseSkill}
              onChange={(e) =>
                dispatch({ type: 'SET_KURIAN_DEFENSE_SKILL', payload: Number(e.target.value) })
              }
              className={SELECT_CLASS}
            >
              {KURIAN_DEFENSE_SKILLS.map((s) => (
                <option key={s.value} value={s.value} className="bg-neutral-900">
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-white/50 uppercase tracking-wider">Resist</label>
            <select
              value={state.kurianResistSkill}
              onChange={(e) =>
                dispatch({ type: 'SET_KURIAN_RESIST_SKILL', payload: Number(e.target.value) })
              }
              className={SELECT_CLASS}
            >
              {KURIAN_RESIST_SKILLS.map((s) => (
                <option key={s.value} value={s.value} className="bg-neutral-900">
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </fieldset>
      )}

      {/* Priest weapon type */}
      {state.characterClass === 'Priest' && (
        <div className="space-y-1">
          <label className="block text-xs text-white/50 uppercase tracking-wider">
            Weapon Type
          </label>
          <select
            value={state.priestWeaponType}
            onChange={(e) =>
              dispatch({ type: 'SET_PRIEST_WEAPON_TYPE', payload: e.target.value })
            }
            className={SELECT_CLASS}
          >
            {PRIEST_WEAPON_TYPES.map((w) => (
              <option key={w} value={w} className="bg-neutral-900">
                {w}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Serbest stat puanı gösterimi */}
      <div className="pt-1 border-t border-white/[0.06] space-y-0.5">
        <p className="text-xs text-white/40 text-center">
          <span className="text-white/70 font-medium">{freeStatPoints}</span> points remaining
        </p>
        {state.rebirthLevel > 0 && (
          <p className="text-xs text-white/40 text-center">
            <span className="text-purple-400 font-medium">{freeRebirthPoints}</span> rebirth points remaining
          </p>
        )}
      </div>
    </fieldset>
  )
}
