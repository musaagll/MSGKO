'use client'

import { useState } from 'react'
import type { CalculatorState } from '@/lib/calculator/types'
import type { Action } from '@/lib/calculator/reducer'

interface Props {
  state: CalculatorState
  dispatch: React.Dispatch<Action>
}

// ─── Types ────────────────────────────────────────────────────────────────────

type SetName =
  | 'krowaz'
  | 'mithril'
  | 'secret'
  | 'holyKnight'
  | 'rosetta'
  | 'krowazKurian'
  | 'holyKnightKurian'

const PIECE_OPTIONS = [0, 1, 2, 3, 4, 5].map(n => ({
  value: n,
  label: n === 0 ? '0 pieces' : `${n} piece${n > 1 ? 's' : ''}`,
}))

// ─── Shared styles ────────────────────────────────────────────────────────────

const SELECT_CLASS =
  'w-full bg-white/[0.06] border border-white/[0.12] rounded-sm px-2 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500/60 focus:bg-white/[0.08] transition-colors cursor-pointer'

// ─── Piece count state shape ──────────────────────────────────────────────────

interface PieceCounts {
  krowaz: number
  mithril: number
  secret: number
  holyKnight: number
  rosetta: number
  krowazKurian: number
  holyKnightKurian: number
}

// ─── SetBonusPanel ────────────────────────────────────────────────────────────

export function SetBonusPanel({ state, dispatch }: Props) {
  const { characterClass } = state

  // CalculatorState stores computed bonuses, not raw piece counts.
  // Track piece counts locally so dropdowns remain controlled.
  const [pieces, setPieces] = useState<PieceCounts>({
    krowaz: 0,
    mithril: 0,
    secret: 0,
    holyKnight: 0,
    rosetta: 0,
    krowazKurian: 0,
    holyKnightKurian: 0,
  })

  function handleChange(setName: SetName, value: number) {
    setPieces(prev => ({ ...prev, [setName]: value }))
    dispatch({ type: 'SET_SET_BONUS', payload: { setName, pieces: value } })
  }

  function renderRow(label: string, setName: SetName) {
    return (
      <div key={setName} className="flex items-center gap-3">
        <span className="text-xs text-white/70 w-36 shrink-0">{label}</span>
        <select
          value={pieces[setName]}
          onChange={e => handleChange(setName, Number(e.target.value))}
          className={SELECT_CLASS}
        >
          {PIECE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-neutral-900">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <details className="border border-white/[0.10] rounded-sm">
      <summary className="px-4 py-3 text-xs font-semibold text-white/70 uppercase tracking-widest cursor-pointer select-none hover:bg-white/[0.03] transition-colors">
        Set Bonuses ▼
      </summary>

      <div className="px-4 pb-4 pt-2">
        <fieldset className="border border-white/[0.08] rounded-sm px-3 py-3 space-y-3">
          <legend className="px-1 text-xs text-white/40 uppercase tracking-wider">
            Set Pieces
          </legend>

          {renderRow('Krowaz', 'krowaz')}
          {renderRow('Mithril / Basic', 'mithril')}
          {renderRow('Secret', 'secret')}
          {renderRow('Holy Knight', 'holyKnight')}
          {renderRow('Rosetta', 'rosetta')}

          {characterClass === 'Kurian' && (
            <div className="border-t border-white/[0.06] pt-3 space-y-3">
              <p className="text-xs text-white/30 uppercase tracking-wider">Kurian Sets</p>
              {renderRow('Krowaz Kurian', 'krowazKurian')}
              {renderRow('Holy Knight Kurian', 'holyKnightKurian')}
            </div>
          )}
        </fieldset>
      </div>
    </details>
  )
}
