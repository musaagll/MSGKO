'use client'

import type { CalculatorResult } from '@/lib/calculator/types'

interface Props {
  result: CalculatorResult
}

export function ResultPanel({ result }: Props) {
  return (
    <div className="space-y-4">
      {/* AP — Ana kart */}
      <div className="flex flex-col items-center justify-center border border-white/[0.08] bg-white/[0.03] rounded-sm p-6">
        <span className="text-4xl font-bold text-purple-400">{result.ap}</span>
        <span className="mt-1 text-xs text-white/50 uppercase tracking-widest">Attack Power</span>
      </div>

      {/* AC / HP / MP */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="AC" value={result.ac} />
        <StatCard label="HP" value={result.hp} />
        <StatCard label="MP" value={result.mp} />
      </div>

      {/* FR / IR / LR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Flame Res." value={result.fr} />
        <StatCard label="Ice Res." value={result.ir} />
        <StatCard label="Lightning Res." value={result.lr} />
      </div>

      {/* Serbest stat puanı */}
      <p className="text-center text-sm text-white/40">
        {result.freeStatPoints} stat points remaining
      </p>
    </div>
  )
}

// ─── Yardımcı bileşen ─────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center border border-white/[0.08] bg-white/[0.03] rounded-sm p-3">
      <span className="text-lg font-semibold text-white">{value}</span>
      <span className="mt-0.5 text-xs text-white/50 uppercase tracking-wider">{label}</span>
    </div>
  )
}
