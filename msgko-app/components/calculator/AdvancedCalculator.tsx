'use client'
import { useReducer, useMemo } from 'react'
import { calculatorReducer, initialState } from '@/lib/calculator/reducer'
import { recalculate } from '@/lib/calculator/formulas'
import { ClassLevelPanel } from './ClassLevelPanel'
import { StatPanel } from './StatPanel'
import { ItemPanel } from './ItemPanel'
import { BuffPanel } from './BuffPanel'
import { SetBonusPanel } from './SetBonusPanel'
import { ResultPanel } from './ResultPanel'

export function AdvancedCalculator() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState)
  const result = useMemo(() => recalculate(state), [state])

  const { freeStatPoints, freeRebirthPoints } = result

  return (
    <section className="min-h-screen bg-[#07070B] text-white px-4 sm:px-6 py-10 sm:py-14">
      {/* ── Sayfa Başlığı ── */}
      <div className="max-w-[1400px] mx-auto mb-8">
        <div className="mb-1 flex items-center gap-2">
          <div
            className="flex items-center gap-2 px-3 py-1.5"
            style={{
              background: 'rgba(109,40,217,0.12)',
              border: '1px solid rgba(139,92,246,0.28)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full bg-purple-400"
              style={{ animation: 'pulse 2.5s ease-in-out infinite' }}
            />
            <span className="text-[0.67rem] font-bold tracking-[0.24em] uppercase text-purple-400">
              Knight Online
            </span>
          </div>
        </div>

        <h1
          className="text-transparent bg-clip-text font-black uppercase leading-tight tracking-tight"
          style={{
            backgroundImage:
              'linear-gradient(125deg, #e0d7ff 0%, #a78bfa 30%, #8b5cf6 50%, #ec4899 75%, #f59e0b 100%)',
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
          }}
        >
          Hesap Makinesi
        </h1>

        <div
          className="mt-2 h-[2px] max-w-[280px]"
          style={{
            background:
              'linear-gradient(90deg, rgba(139,92,246,0.7), rgba(236,72,153,0.4), transparent)',
          }}
        />

        <p className="mt-3 text-sm text-white/50 max-w-[560px] leading-relaxed">
          Karakterinin gerçek AP, AC, HP, MP ve direnç değerlerini hesapla. Ekipman, buff ve
          set bonuslarını birleştirerek optimum kombinasyonu bul.
        </p>
      </div>

      {/* ── Ana Layout ── */}
      <div className="max-w-[1400px] mx-auto">
        {/* Mobil: tek sütun | md+: 3 sütun grid */}
        <div className="flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-6">

          {/* ── Sol Kolon: Class/Level + Stat ── */}
          <div className="md:w-72 shrink-0 flex flex-col gap-6">
            <ClassLevelPanel
              state={state}
              dispatch={dispatch}
              freeStatPoints={freeStatPoints}
              freeRebirthPoints={freeRebirthPoints}
            />
            <StatPanel
              state={state}
              dispatch={dispatch}
              freeStatPoints={freeStatPoints}
              freeRebirthPoints={freeRebirthPoints}
            />
          </div>

          {/* ── Orta Kolon: Items ── */}
          <div className="flex flex-col gap-6">
            <ItemPanel
              state={state}
              dispatch={dispatch}
            />
          </div>

          {/* ── Sağ Geniş Alan: Buffs + Sets + Results ── */}
          <div className="flex flex-col gap-6">
            <BuffPanel
              state={state}
              dispatch={dispatch}
            />
            <SetBonusPanel
              state={state}
              dispatch={dispatch}
            />
            <ResultPanel result={result} />
          </div>

        </div>
      </div>
    </section>
  )
}
