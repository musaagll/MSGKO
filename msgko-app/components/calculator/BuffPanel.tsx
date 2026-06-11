'use client'

import type { CalculatorState, BuffState, AchievementBonus } from '@/lib/calculator/types'
import type { Action } from '@/lib/calculator/reducer'
import { ACHIEVEMENTS } from '@/lib/calculator/achievements'

interface Props {
  state: CalculatorState
  dispatch: React.Dispatch<Action>
}

// ─── Disabled buff logic ──────────────────────────────────────────────────────

function isBuffDisabled(buffKey: keyof BuffState, buffs: BuffState): boolean {
  const AP_CONFLICT = ['wolf', 'priestBook', 'priestLimitedBook', 'commanderDetermination', 'apScroll'] as const
  if (AP_CONFLICT.includes(buffKey as any)) {
    const others = AP_CONFLICT.filter(k => k !== buffKey)
    return others.some(k => buffs[k] === true)
  }
  if (['strScroll', 'dexScroll', 'hpScroll', 'mpScroll', 'intScroll'].includes(buffKey as string)) {
    return buffs.lionScroll
  }
  if (buffKey === 'lionScroll') {
    return ['strScroll', 'dexScroll', 'hpScroll', 'mpScroll', 'intScroll'].some(k => buffs[k as keyof BuffState] === true)
  }
  if (['mageFrozenArmor', 'mageFrozenShell', 'mageIceBarrier'].includes(buffKey as string)) {
    const others = ['mageFrozenArmor', 'mageFrozenShell', 'mageIceBarrier'].filter(k => k !== buffKey)
    return others.some(k => buffs[k as keyof BuffState] === true)
  }
  if (['mageFR', 'mageIR', 'mageLR', 'magicShield'].includes(buffKey as string)) {
    const others = ['mageFR', 'mageIR', 'mageLR', 'magicShield'].filter(k => k !== buffKey)
    return others.some(k => buffs[k as keyof BuffState] === true)
  }
  if (['petHp', 'petAc', 'petAp'].includes(buffKey as string)) {
    const others = ['petHp', 'petAc', 'petAp'].filter(k => k !== buffKey)
    return others.some(k => buffs[k as keyof BuffState] === true)
  }
  if (buffKey === 'spellOfLife') return buffs.hpBuff > 1
  return false
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const SELECT_CLASS =
  'w-full bg-white/[0.06] border border-white/[0.12] rounded-sm px-2 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500/60 focus:bg-white/[0.08] transition-colors cursor-pointer'

// ─── Toggle Buff Checkbox ─────────────────────────────────────────────────────

interface ToggleBuffProps {
  buffKey: keyof BuffState
  label: string
  buffs: BuffState
  dispatch: React.Dispatch<Action>
}

function ToggleBuff({ buffKey, label, buffs, dispatch }: ToggleBuffProps) {
  const disabled = isBuffDisabled(buffKey, buffs)
  const checked = buffs[buffKey] as boolean

  return (
    <label
      className={`flex items-center gap-2 text-xs cursor-pointer ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() => dispatch({ type: 'TOGGLE_BUFF', payload: buffKey })}
        disabled={disabled}
        className="accent-purple-500"
      />
      {label}
    </label>
  )
}

// ─── BuffPanel ────────────────────────────────────────────────────────────────

export function BuffPanel({ state, dispatch }: Props) {
  const { buffs, characterClass } = state

  function handleAchievementChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const achievement = ACHIEVEMENTS.find(a => a.id === e.target.value)
    if (!achievement) return
    const bonus: AchievementBonus = {
      ap: 0, ac: 0, str: 0, dex: 0, hp: 0, mp: 0, int: 0,
      flameres: 0, iceres: 0, lightingres: 0,
      ...achievement.bonusObj,
    }
    dispatch({ type: 'SET_ACHIEVEMENT', payload: bonus })
  }

  // Derive selected achievement id from current state
  const currentAchId = (() => {
    const cur = state.achievement
    const match = ACHIEVEMENTS.find(a => {
      if (!a.bonusObj) return cur.ap === 0 && cur.ac === 0 && cur.str === 0 && cur.dex === 0 && cur.hp === 0 && cur.mp === 0 && cur.int === 0 && cur.flameres === 0 && cur.iceres === 0 && cur.lightingres === 0
      return Object.entries(a.bonusObj).every(([k, v]) => cur[k as keyof AchievementBonus] === v)
    })
    return match?.id ?? ''
  })()

  return (
    <details className="border border-white/[0.10] rounded-sm">
      <summary className="px-4 py-3 text-xs font-semibold text-white/70 uppercase tracking-widest cursor-pointer select-none hover:bg-white/[0.03] transition-colors">
        Scrolls &amp; Buffs ▼
      </summary>

      <div className="px-4 pb-4 pt-2 grid grid-cols-2 gap-x-6 gap-y-2">

        {/* ── Left Column: Buffs ── */}
        <div className="space-y-2">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Buffs</p>

          {/* Achievement select */}
          <div className="space-y-1">
            <label className="block text-xs text-white/50">Achievement</label>
            <select
              value={currentAchId}
              onChange={handleAchievementChange}
              className={SELECT_CLASS}
            >
              {ACHIEVEMENTS.map(a => (
                <option key={a.id} value={a.id} className="bg-neutral-900">
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* HP Buff select */}
          <div className="space-y-1">
            <label className="block text-xs text-white/50">HP Buff</label>
            <select
              value={buffs.hpBuff}
              onChange={e => dispatch({ type: 'SET_BUFF_VALUE', payload: { buff: 'hpBuff', value: Number(e.target.value) } })}
              className={SELECT_CLASS}
            >
              <option value={1} className="bg-neutral-900">HP buff - OFF</option>
              <option value={2} className="bg-neutral-900">HP buff - 1500</option>
              <option value={3} className="bg-neutral-900">HP buff - 2000</option>
              <option value={4} className="bg-neutral-900">HP buff - 60% (Undying)</option>
              <option value={5} className="bg-neutral-900">HP buff - 2200</option>
            </select>
          </div>

          {/* AC Buff select */}
          <div className="space-y-1">
            <label className="block text-xs text-white/50">AC Buff</label>
            <select
              value={buffs.acBuff}
              onChange={e => dispatch({ type: 'SET_BUFF_VALUE', payload: { buff: 'acBuff', value: Number(e.target.value) } })}
              className={SELECT_CLASS}
            >
              <option value={1} className="bg-neutral-900">AC buff - OFF</option>
              <option value={2} className="bg-neutral-900">AC buff - +200</option>
              <option value={3} className="bg-neutral-900">AC buff - +300</option>
              <option value={4} className="bg-neutral-900">AC buff - +350</option>
              <option value={5} className="bg-neutral-900">AC buff - +380</option>
            </select>
          </div>

          {/* Stat Scrolls */}
          <div className="pt-1 border-t border-white/[0.06] space-y-1.5">
            <p className="text-xs text-white/30 uppercase tracking-wider">Stat Scrolls</p>
            <ToggleBuff buffKey="strScroll"  label="STR Scroll (+15 STR)"  buffs={buffs} dispatch={dispatch} />
            <ToggleBuff buffKey="dexScroll"  label="DEX Scroll (+15 DEX)"  buffs={buffs} dispatch={dispatch} />
            <ToggleBuff buffKey="hpScroll"   label="HP Scroll (+15 HP)"    buffs={buffs} dispatch={dispatch} />
            <ToggleBuff buffKey="mpScroll"   label="MP Scroll (+15 MP)"    buffs={buffs} dispatch={dispatch} />
            <ToggleBuff buffKey="intScroll"  label="INT Scroll (+15 INT)"  buffs={buffs} dispatch={dispatch} />
            <ToggleBuff buffKey="lionScroll" label="Power of Lion (+10 all)" buffs={buffs} dispatch={dispatch} />
          </div>

          {/* General Buffs */}
          <div className="pt-1 border-t border-white/[0.06] space-y-1.5">
            <p className="text-xs text-white/30 uppercase tracking-wider">General Buffs</p>
            <ToggleBuff buffKey="redPotion"     label="Red Potion (+10% AP)"    buffs={buffs} dispatch={dispatch} />
            <ToggleBuff buffKey="bluePotion"    label="Blue Potion (+60 AC)"    buffs={buffs} dispatch={dispatch} />
            <ToggleBuff buffKey="wolf"          label="Wolf (+20% AP)"          buffs={buffs} dispatch={dispatch} />
            <ToggleBuff buffKey="apScroll"      label="AP Scroll (+22% AP)"     buffs={buffs} dispatch={dispatch} />
            <ToggleBuff buffKey="weaponEnchant" label="Weapon Enchant"          buffs={buffs} dispatch={dispatch} />
            <ToggleBuff buffKey="armorEnchant"  label="Armor Enchant"           buffs={buffs} dispatch={dispatch} />
            <ToggleBuff buffKey="gemDefense"    label="Gem of Defense"          buffs={buffs} dispatch={dispatch} />
            <ToggleBuff buffKey="gemLife"       label="Gem of Life"             buffs={buffs} dispatch={dispatch} />
            <ToggleBuff buffKey="battleCry"     label="Battle Cry (+15 all)"    buffs={buffs} dispatch={dispatch} />
          </div>

          {/* Class-specific Buffs */}
          {characterClass === 'Warrior' && (
            <div className="pt-1 border-t border-white/[0.06] space-y-1.5">
              <p className="text-xs text-white/30 uppercase tracking-wider">Warrior</p>
              <ToggleBuff buffKey="berserker" label="Berserker (+20% AP)" buffs={buffs} dispatch={dispatch} />
            </div>
          )}

          {characterClass === 'Priest' && (
            <div className="pt-1 border-t border-white/[0.06] space-y-1.5">
              <p className="text-xs text-white/30 uppercase tracking-wider">Priest</p>
              <ToggleBuff buffKey="priestBook"        label="Priest Book (+50% AP)"        buffs={buffs} dispatch={dispatch} />
              <ToggleBuff buffKey="priestLimitedBook" label="Priest Ltd. Book (+55% AP)"   buffs={buffs} dispatch={dispatch} />
              <ToggleBuff buffKey="priestStr"         label="Priest STR (+30 STR)"         buffs={buffs} dispatch={dispatch} />
            </div>
          )}

          {/* Mage Buffs */}
          <div className="pt-1 border-t border-white/[0.06] space-y-1.5">
            <p className="text-xs text-white/30 uppercase tracking-wider">Mage Buffs</p>
            <ToggleBuff buffKey="mageFR"          label="Flame Immunity (+80 FR)"   buffs={buffs} dispatch={dispatch} />
            <ToggleBuff buffKey="mageIR"          label="Ice Immunity (+80 IR)"     buffs={buffs} dispatch={dispatch} />
            <ToggleBuff buffKey="mageLR"          label="Lightning Immunity (+80 LR)" buffs={buffs} dispatch={dispatch} />
            <ToggleBuff buffKey="mageFrozenArmor" label="Frozen Armor (Mage AC)"    buffs={buffs} dispatch={dispatch} />
            <ToggleBuff buffKey="mageFrozenShell" label="Frozen Shell (Mage AC)"    buffs={buffs} dispatch={dispatch} />
            <ToggleBuff buffKey="mageIceBarrier"  label="Ice Barrier (Mage AC)"     buffs={buffs} dispatch={dispatch} />
          </div>

          {/* Commander Determination */}
          <div className="pt-1 border-t border-white/[0.06] space-y-1.5">
            <ToggleBuff buffKey="commanderDetermination" label="Commander's Determination (+30% AP)" buffs={buffs} dispatch={dispatch} />
          </div>
        </div>

        {/* ── Right Column: Debuffs + Pet ── */}
        <div className="space-y-2">

          {/* Debuffs */}
          <div className="space-y-1.5">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Debuffs</p>
            <ToggleBuff buffKey="malice"       label="Malice"         buffs={buffs} dispatch={dispatch} />
            <ToggleBuff buffKey="torment"      label="Torment"        buffs={buffs} dispatch={dispatch} />
            <ToggleBuff buffKey="parasite"     label="Parasite"       buffs={buffs} dispatch={dispatch} />
            <ToggleBuff buffKey="superParasite" label="Super Parasite" buffs={buffs} dispatch={dispatch} />
            <ToggleBuff buffKey="confusion"    label="Confusion (-30 MP)" buffs={buffs} dispatch={dispatch} />
            <ToggleBuff buffKey="massive"      label="Massive (-20% AP)"  buffs={buffs} dispatch={dispatch} />
            <ToggleBuff buffKey="subside"      label="Subside (-20% AP)"  buffs={buffs} dispatch={dispatch} />
          </div>

          {/* Pet Buffs */}
          <div className="pt-1 border-t border-white/[0.06] space-y-1.5">
            <p className="text-xs text-white/30 uppercase tracking-wider">Pet</p>
            <ToggleBuff buffKey="petHp" label="Pet HP (+200 HP)" buffs={buffs} dispatch={dispatch} />
            <ToggleBuff buffKey="petAc" label="Pet AC (+20 AC)"  buffs={buffs} dispatch={dispatch} />
            <ToggleBuff buffKey="petAp" label="Pet AP (+5 AP)"   buffs={buffs} dispatch={dispatch} />
          </div>

          {/* Spell of Life (depends on hpBuff) */}
          <div className="pt-1 border-t border-white/[0.06] space-y-1.5">
            <p className="text-xs text-white/30 uppercase tracking-wider">Other</p>
            <ToggleBuff buffKey="spellOfLife" label="Spell of Life" buffs={buffs} dispatch={dispatch} />
          </div>

        </div>
      </div>
    </details>
  )
}
