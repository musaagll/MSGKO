'use client'

import type { CalculatorState, StatPoints } from '@/lib/calculator/types'
import type { Action } from '@/lib/calculator/reducer'

interface Props {
  state: CalculatorState
  dispatch: React.Dispatch<Action>
  freeStatPoints: number
  freeRebirthPoints: number
}

// ─── Stat key listesi ─────────────────────────────────────────────────────────

const STAT_KEYS: { key: keyof StatPoints; label: string }[] = [
  { key: 'str', label: 'STR' },
  { key: 'dex', label: 'DEX' },
  { key: 'hp',  label: 'HP'  },
  { key: 'mp',  label: 'MP'  },
  { key: 'int', label: 'INT' },
]

// ─── Buff bonus açıklamaları ──────────────────────────────────────────────────

function getBuffBonuses(
  key: keyof StatPoints,
  buffs: CalculatorState['buffs'],
): string[] {
  const bonuses: string[] = []

  if (key === 'str') {
    if (buffs.strScroll)  bonuses.push('+15 (STR Scroll)')
    if (buffs.lionScroll) bonuses.push('+10 (Lion)')
    if (buffs.battleCry)  bonuses.push('+15 (Battle Cry)')
    if (buffs.priestStr)  bonuses.push('+30 (Priest Str)')
  }
  if (key === 'dex') {
    if (buffs.dexScroll)  bonuses.push('+15 (DEX Scroll)')
    if (buffs.lionScroll) bonuses.push('+10 (Lion)')
    if (buffs.battleCry)  bonuses.push('+15 (Battle Cry)')
  }
  if (key === 'hp') {
    if (buffs.hpScroll)   bonuses.push('+15 (HP Scroll)')
    if (buffs.lionScroll) bonuses.push('+10 (Lion)')
  }
  if (key === 'mp') {
    if (buffs.mpScroll)   bonuses.push('+15 (MP Scroll)')
    if (buffs.lionScroll) bonuses.push('+10 (Lion)')
  }
  if (key === 'int') {
    if (buffs.intScroll)  bonuses.push('+15 (INT Scroll)')
    if (buffs.lionScroll) bonuses.push('+10 (Lion)')
  }

  return bonuses
}

// ─── Ana bileşen ──────────────────────────────────────────────────────────────

export function StatPanel({ state, dispatch, freeStatPoints, freeRebirthPoints }: Props) {
  const {
    statPoints,
    rebirthStatPoints,
    usedPoints,
    totalPoints,
    usedRebirthPoints,
    totalRebirthPoints,
    rebirthLevel,
    buffs,
  } = state

  const progressPct = totalPoints > 0 ? Math.min(100, (usedPoints / totalPoints) * 100) : 0
  const isFull = usedPoints >= totalPoints
  const isOverLimit = freeStatPoints < 0

  const rebirthProgressPct =
    totalRebirthPoints > 0
      ? Math.min(100, (usedRebirthPoints / totalRebirthPoints) * 100)
      : 0
  const isRebirthFull = usedRebirthPoints >= totalRebirthPoints
  const isRebirthOverLimit = freeRebirthPoints < 0

  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-sm p-4 space-y-4">

      {/* ── Stat Inputları ── */}
      <div className="space-y-2">
        {STAT_KEYS.map(({ key, label }) => {
          const value = statPoints[key]
          const buffBonuses = getBuffBonuses(key, buffs)

          return (
            <div key={key}>
              <div className="flex items-center gap-2">
                <label className="w-8 text-xs font-semibold text-white/60 uppercase tracking-wider">
                  {label}
                </label>
                <input
                  type="number"
                  min="0"
                  value={value}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_STAT',
                      payload: { stat: key, value: Math.max(0, parseInt(e.target.value) || 0) },
                    })
                  }
                  className={`w-full bg-white/[0.05] border rounded-sm px-2 py-1 text-sm text-white placeholder-white/20 focus:outline-none focus:border-purple-500/60 transition-colors ${
                    isOverLimit
                      ? 'border-red-500/60'
                      : 'border-white/[0.12]'
                  }`}
                />
              </div>
              {buffBonuses.length > 0 && (
                <div className="ml-10 mt-0.5 flex flex-wrap gap-x-2">
                  {buffBonuses.map((bonus) => (
                    <span key={bonus} className="text-[10px] text-purple-400/70">
                      {bonus}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Toplam Stat Puanı Progress Bar ── */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-white/50">
          <span>Stat Points</span>
          <span className={isFull ? 'text-red-400' : 'text-white/50'}>
            {usedPoints} / {totalPoints}
          </span>
        </div>
        <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${isFull ? 'bg-red-500' : 'bg-purple-500'}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {freeStatPoints > 0 && (
          <p className="text-[11px] text-white/40">
            {freeStatPoints} puan kaldı
          </p>
        )}
        {isOverLimit && (
          <p className="text-[11px] text-red-400/80">
            {Math.abs(freeStatPoints)} puan aşıldı
          </p>
        )}
      </div>

      {/* ── Rebirth Stat Noktaları ── */}
      {rebirthLevel > 0 && (
        <div className="border-t border-white/[0.06] pt-4 space-y-2">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">
            Rebirth Stats
          </p>

          {/* Rebirth stat inputları */}
          {STAT_KEYS.map(({ key, label }) => {
            const value = rebirthStatPoints[key]

            return (
              <div key={`rebirth-${key}`} className="flex items-center gap-2">
                <label className="w-8 text-xs font-semibold text-white/60 uppercase tracking-wider">
                  {label}
                </label>
                <input
                  type="number"
                  min="0"
                  value={value}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_REBIRTH_STAT',
                      payload: { stat: key, value: Math.max(0, parseInt(e.target.value) || 0) },
                    })
                  }
                  className={`w-full bg-white/[0.05] border rounded-sm px-2 py-1 text-sm text-white placeholder-white/20 focus:outline-none focus:border-purple-500/60 transition-colors ${
                    isRebirthOverLimit
                      ? 'border-red-500/60'
                      : 'border-white/[0.12]'
                  }`}
                />
              </div>
            )
          })}

          {/* Rebirth progress bar */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-xs text-white/50">
              <span>Rebirth Points</span>
              <span className={isRebirthFull ? 'text-red-400' : 'text-white/50'}>
                {usedRebirthPoints} / {totalRebirthPoints}
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${isRebirthFull ? 'bg-red-500' : 'bg-purple-500'}`}
                style={{ width: `${rebirthProgressPct}%` }}
              />
            </div>
            {freeRebirthPoints > 0 && (
              <p className="text-[11px] text-white/40">
                {freeRebirthPoints} rebirth puan kaldı
              </p>
            )}
            {isRebirthOverLimit && (
              <p className="text-[11px] text-red-400/80">
                {Math.abs(freeRebirthPoints)} rebirth puan aşıldı
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
