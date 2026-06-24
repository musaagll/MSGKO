'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calculator, Zap, Shield, Heart, Sword } from 'lucide-react'

// ─── Sabitler ──────────────────────────────────────────────────────────────

const MAX_LEVEL = 83
const STAT_POINTS_PER_LEVEL = 3
const STAT_CAP = 255
// Level 1'de verilen başlangıç stat puanları sınıfa göre
// Her sınıf 3×82=246 toplam puan kazanır (level 2'den 83'e)

const CLASSES = [
  { id: 'rogue_asas',   label: 'Asas (Rogue)',    icon: '⚔️',  mainStat: 'str',  secondStat: 'dex', color: '#a78bfa' },
  { id: 'rogue_okcu',   label: 'Okçu (Archer)',   icon: '🏹',  mainStat: 'dex',  secondStat: 'str', color: '#60a5fa' },
  { id: 'warrior',      label: 'Warrior',          icon: '🛡️',  mainStat: 'str',  secondStat: 'hp',  color: '#f87171' },
  { id: 'mage',         label: 'Mage',             icon: '🔮',  mainStat: 'int',  secondStat: 'hp',  color: '#34d399' },
  { id: 'priest_int',   label: 'Priest (INT)',     icon: '✨',  mainStat: 'int',  secondStat: 'hp',  color: '#fbbf24' },
  { id: 'priest_str',   label: 'Priest (STR)',     icon: '⚡',  mainStat: 'str',  secondStat: 'int', color: '#fb923c' },
] as const

type ClassId = typeof CLASSES[number]['id']

// Başlangıç statları (level 1, sınıfa göre)
const BASE_STATS: Record<ClassId, { str: number; dex: number; int: number; hp: number }> = {
  rogue_asas:  { str: 25, dex: 25, int: 15, hp: 15 },
  rogue_okcu:  { str: 15, dex: 25, int: 15, hp: 25 },
  warrior:     { str: 25, dex: 15, int: 15, hp: 25 },
  mage:        { str: 15, dex: 15, int: 25, hp: 25 },
  priest_int:  { str: 15, dex: 15, int: 25, hp: 25 },
  priest_str:  { str: 25, dex: 15, int: 15, hp: 25 },
}

// Silahlar (WeaponAP değerleri, +0 base)
const WEAPONS: Record<string, { label: string; ap: number; type: string; classes: ClassId[] }[]> = {
  'Tek El Kılıç': [
    { label: 'Iron Sword',         ap: 24,  type: 'sword1h', classes: ['warrior', 'priest_str'] },
    { label: 'Short Sword',        ap: 30,  type: 'sword1h', classes: ['warrior', 'priest_str'] },
    { label: 'Long Sword',         ap: 38,  type: 'sword1h', classes: ['warrior', 'priest_str'] },
    { label: 'Estoc',              ap: 46,  type: 'sword1h', classes: ['warrior', 'priest_str'] },
    { label: 'Falchion',           ap: 56,  type: 'sword1h', classes: ['warrior', 'priest_str'] },
    { label: 'Sword of Mirror',    ap: 68,  type: 'sword1h', classes: ['warrior', 'priest_str'] },
    { label: 'Elven Sword',        ap: 80,  type: 'sword1h', classes: ['warrior', 'priest_str'] },
    { label: 'Hell Breaker',       ap: 93,  type: 'sword1h', classes: ['warrior', 'priest_str'] },
    { label: 'Moonlight',          ap: 106, type: 'sword1h', classes: ['warrior', 'priest_str'] },
    { label: 'Crystal Sword',      ap: 115, type: 'sword1h', classes: ['warrior', 'priest_str'] },
  ],
  'İki El Kılıç': [
    { label: 'Two-Handed Sword',   ap: 50,  type: 'sword2h', classes: ['warrior'] },
    { label: 'Zweihander',         ap: 65,  type: 'sword2h', classes: ['warrior'] },
    { label: 'Claymore',           ap: 80,  type: 'sword2h', classes: ['warrior'] },
    { label: 'Flamberge',          ap: 95,  type: 'sword2h', classes: ['warrior'] },
    { label: 'BastardSword',       ap: 110, type: 'sword2h', classes: ['warrior'] },
    { label: 'Shard',              ap: 120, type: 'sword2h', classes: ['warrior'] },
  ],
  'Hançer': [
    { label: 'Dagger',             ap: 22,  type: 'dagger',  classes: ['rogue_asas'] },
    { label: 'Stiletto',           ap: 30,  type: 'dagger',  classes: ['rogue_asas'] },
    { label: 'Kris',               ap: 38,  type: 'dagger',  classes: ['rogue_asas'] },
    { label: 'Rondel',             ap: 46,  type: 'dagger',  classes: ['rogue_asas'] },
    { label: 'Baselard',           ap: 56,  type: 'dagger',  classes: ['rogue_asas'] },
    { label: 'Main Gauche',        ap: 68,  type: 'dagger',  classes: ['rogue_asas'] },
    { label: 'Gladius',            ap: 80,  type: 'dagger',  classes: ['rogue_asas'] },
    { label: 'Chitin Dagger',      ap: 92,  type: 'dagger',  classes: ['rogue_asas'] },
    { label: 'Dragon Tooth',       ap: 105, type: 'dagger',  classes: ['rogue_asas'] },
    { label: 'Exceptional Dagger', ap: 115, type: 'dagger',  classes: ['rogue_asas'] },
  ],
  'Yay/Ok': [
    { label: 'Short Bow',          ap: 28,  type: 'bow',     classes: ['rogue_okcu'] },
    { label: 'Hunting Bow',        ap: 38,  type: 'bow',     classes: ['rogue_okcu'] },
    { label: 'Composite Bow',      ap: 50,  type: 'bow',     classes: ['rogue_okcu'] },
    { label: 'Long Bow',           ap: 62,  type: 'bow',     classes: ['rogue_okcu'] },
    { label: 'Silver Bow',         ap: 76,  type: 'bow',     classes: ['rogue_okcu'] },
    { label: 'Elven Bow',          ap: 90,  type: 'bow',     classes: ['rogue_okcu'] },
    { label: 'Dragon Bow',         ap: 105, type: 'bow',     classes: ['rogue_okcu'] },
    { label: 'Raptor',             ap: 118, type: 'bow',     classes: ['rogue_okcu'] },
  ],
  'Asa (Staff)': [
    { label: 'Short Staff',        ap: 30,  type: 'staff',   classes: ['mage', 'priest_int'] },
    { label: 'Staff',              ap: 40,  type: 'staff',   classes: ['mage', 'priest_int'] },
    { label: 'Bone Staff',         ap: 52,  type: 'staff',   classes: ['mage', 'priest_int'] },
    { label: 'Crystal Staff',      ap: 66,  type: 'staff',   classes: ['mage', 'priest_int'] },
    { label: 'Mystic Staff',       ap: 80,  type: 'staff',   classes: ['mage', 'priest_int'] },
    { label: 'Krowaz Staff',       ap: 96,  type: 'staff',   classes: ['mage', 'priest_int'] },
    { label: 'StaffWoE',           ap: 110, type: 'staff',   classes: ['mage', 'priest_int'] },
    { label: 'Exceptional Staff',  ap: 120, type: 'staff',   classes: ['mage', 'priest_int'] },
  ],
}

// Upgrade bonusları (+1'den +9'a kadar)
const UPGRADE_BONUS: Record<number, number> = {
  0: 0, 1: 3, 2: 6, 3: 9, 4: 14, 5: 20, 6: 28, 7: 38, 8: 50, 9: 65
}

// AP Coefficient — silah tipine ve sınıfa göre
const COEFFICIENTS: Record<string, number> = {
  dagger:  0.00025,
  bow:     0.00022,
  sword1h: 0.00020,
  sword2h: 0.00018,
  staff:   0.00015,
}

// ─── Yardımcı Fonksiyonlar ─────────────────────────────────────────────────

function calcAP(weaponAP: number, totalStat: number, level: number, weaponType: string, bonusPct: number, wes: boolean): number {
  const effectiveAP = weaponAP + (wes ? 5 : 0)
  const coeff = COEFFICIENTS[weaponType] ?? 0.00020
  const inner = Math.floor(
    (0.005 * effectiveAP * (totalStat + 40)) +
    (coeff * effectiveAP * level * totalStat) + 3
  )
  const multiplier = 1 + bonusPct / 100
  return Math.floor(inner * multiplier)
}

function calcHP(hp: number, sta: number): number {
  // Her STA puanı yaklaşık 4 HP (sınıfa göre değişir, warrior daha fazla)
  return hp * 10 + sta * 4
}

function calcTotalStatPoints(level: number): number {
  // Level 1: başlangıç statları (sabit), level 2'den itibaren her level 3 puan
  return (level - 1) * STAT_POINTS_PER_LEVEL
}

// ─── Ana Bileşen ───────────────────────────────────────────────────────────

export function HesaplayiciClient() {
  // Karakter
  const [selectedClass, setSelectedClass] = useState<ClassId>('rogue_asas')
  const [level, setLevel] = useState(83)

  // Stat dağılımı (kullanıcı tarafından ayarlanan bonus puanlar)
  const [str, setStr] = useState(200)
  const [dex, setDex] = useState(80)
  const [int, setInt] = useState(10)
  const [hp, setHp] = useState(20)

  // Silah seçimi
  const [weaponCategory, setWeaponCategory] = useState('Hançer')
  const [weaponIndex, setWeaponIndex] = useState(9)
  const [upgrade, setUpgrade] = useState(8)
  const [wes, setWes] = useState(true)

  // Sol el (sadece asas için)
  const [offhandCategory, setOffhandCategory] = useState('Hançer')
  const [offhandIndex, setOffhandIndex] = useState(6)
  const [offhandUpgrade, setOffhandUpgrade] = useState(7)
  const [offhandWes, setOffhandWes] = useState(false)

  // Bufflar
  const [wolf, setWolf] = useState(false)
  const [apScroll, setApScroll] = useState(false)
  const [redPotion, setRedPotion] = useState(false)
  const [commander, setCommander] = useState(false)

  const classInfo = CLASSES.find(c => c.id === selectedClass)!
  const baseStats = BASE_STATS[selectedClass]

  // Toplam mevcut puanlar
  const totalPoints = calcTotalStatPoints(level)
  const usedPoints = str + dex + int + hp
  const remaining = totalPoints - usedPoints

  // Toplam stat (base + dağıtılan)
  const totalStr = baseStats.str + str
  const totalDex = baseStats.dex + dex
  const totalInt = baseStats.int + int
  const totalHp  = baseStats.hp  + hp

  // Ana stat (sınıfa göre)
  const mainStatValue = classInfo.mainStat === 'str' ? totalStr
    : classInfo.mainStat === 'dex' ? totalDex
    : classInfo.mainStat === 'int' ? totalInt
    : totalHp

  // Buff bonusu hesapla
  const buffPct = useMemo(() => {
    // Wolf ve Commander stack etmez, ikisi açıksa sadece büyük olanı al
    let pct = 0
    if (wolf && commander) pct += 30
    else if (commander) pct += 30
    else if (wolf) pct += 20
    if (apScroll) pct += 22
    if (redPotion) pct += 10
    return pct
  }, [wolf, apScroll, redPotion, commander])

  // Silah AP hesapla
  const weapons = WEAPONS[weaponCategory] ?? []
  const weapon = weapons[weaponIndex]
  const weaponFinalAP = weapon ? weapon.ap + UPGRADE_BONUS[upgrade] : 0
  const weaponType = weapon?.type ?? 'sword1h'

  // Sağ el AP
  const rightHandAP = calcAP(weaponFinalAP, mainStatValue, level, weaponType, buffPct, wes)

  // Sol el AP (sadece asas, yarım sayılır)
  const isAsas = selectedClass === 'rogue_asas'
  const offhandWeapons = WEAPONS[offhandCategory] ?? []
  const offhandWeapon = offhandWeapons[offhandIndex]
  const offhandFinalAP = offhandWeapon ? offhandWeapon.ap + UPGRADE_BONUS[offhandUpgrade] : 0
  const leftHandAP = isAsas ? Math.floor(calcAP(offhandFinalAP, mainStatValue, level, offhandWeapon?.type ?? 'dagger', buffPct, offhandWes) * 0.5) : 0

  const totalAP = rightHandAP + leftHandAP
  const estimatedHP = calcHP(totalHp, totalHp)

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#07070B' }}>
      {/* Arka plan */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 50% at 20% 20%, rgba(109,40,217,0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 80% 80%, rgba(236,72,153,0.05) 0%, transparent 55%)'
      }} />
      <div className="fixed top-0 left-0 right-0 h-px z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.7), rgba(236,72,153,0.5), transparent)' }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 flex-shrink-0 mt-16"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-200 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span className="text-[0.78rem] font-medium tracking-[0.06em]">Geri Dön</span>
        </Link>
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <p className="text-[0.62rem] font-bold tracking-[0.3em] uppercase mb-0.5" style={{ color: 'rgba(139,92,246,0.7)' }}>MSGKO.NET</p>
          <h1 className="text-[1.1rem] font-black tracking-[0.12em] uppercase text-white" style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
            Build Hesaplayıcı
          </h1>
        </div>
        <div className="w-20" />
      </header>

      {/* İçerik */}
      <div className="relative z-10 flex-1 px-4 md:px-8 lg:px-12 py-8 max-w-[1400px] mx-auto w-full">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">

          {/* ── Sol: Ayarlar ── */}
          <div className="flex flex-col gap-5">

            {/* Sınıf ve Level */}
            <section className="p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h2 className="text-[0.72rem] font-bold tracking-[0.18em] uppercase mb-4" style={{ color: 'rgba(139,92,246,0.8)' }}>
                Karakter
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                {CLASSES.map(cls => (
                  <button key={cls.id} type="button" onClick={() => setSelectedClass(cls.id)}
                    className="flex items-center gap-2 px-3 py-2.5 text-left transition-all duration-200"
                    style={{
                      background: selectedClass === cls.id ? `${cls.color}18` : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${selectedClass === cls.id ? cls.color + '50' : 'rgba(255,255,255,0.07)'}`,
                      color: selectedClass === cls.id ? cls.color : 'rgba(255,255,255,0.45)',
                    }}>
                    <span className="text-base">{cls.icon}</span>
                    <span className="text-[0.75rem] font-semibold">{cls.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <label className="text-[0.72rem] text-white/40 tracking-wider">Level</label>
                <input type="range" min={1} max={83} value={level} onChange={e => setLevel(Number(e.target.value))}
                  className="flex-1 accent-purple-500" />
                <span className="text-[1rem] font-bold text-white w-8 text-right">{level}</span>
              </div>
              <p className="text-[0.68rem] text-white/25 mt-2">
                Toplam dağıtılabilir puan: <span className="text-purple-400">{totalPoints}</span> — Kullanılan: <span className={remaining < 0 ? 'text-red-400' : 'text-green-400'}>{usedPoints}</span> — Kalan: <span className={remaining < 0 ? 'text-red-400' : 'text-white/50'}>{remaining}</span>
              </p>
            </section>

            {/* Stat Dağılımı */}
            <section className="p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h2 className="text-[0.72rem] font-bold tracking-[0.18em] uppercase mb-4" style={{ color: 'rgba(139,92,246,0.8)' }}>
                Stat Dağılımı
              </h2>
              {[
                { key: 'str' as const, label: 'STR (Güç)', icon: <Sword size={14}/>, color: '#f87171', val: str, set: setStr, base: baseStats.str },
                { key: 'dex' as const, label: 'DEX (Çeviklik)', icon: <Zap size={14}/>, color: '#60a5fa', val: dex, set: setDex, base: baseStats.dex },
                { key: 'int' as const, label: 'INT (Zeka)', icon: <Calculator size={14}/>, color: '#34d399', val: int, set: setInt, base: baseStats.int },
                { key: 'hp'  as const, label: 'HP (Sağlık)', icon: <Heart size={14}/>, color: '#fb923c', val: hp,  set: setHp,  base: baseStats.hp },
              ].map(s => {
                const totalVal = s.base + s.val
                const isMain = classInfo.mainStat === s.key
                return (
                  <div key={s.key} className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span style={{ color: s.color }}>{s.icon}</span>
                        <span className="text-[0.78rem] text-white/70">{s.label}</span>
                        {isMain && <span className="text-[0.58rem] px-1.5 py-0.5 font-bold tracking-wider" style={{ background: s.color + '20', color: s.color, border: `1px solid ${s.color}40` }}>ANA STAT</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[0.68rem] text-white/30">base {s.base}</span>
                        <span className="text-[0.9rem] font-bold text-white">{totalVal}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="range" min={0} max={STAT_CAP - s.base} value={s.val}
                        onChange={e => s.set(Number(e.target.value))}
                        className="flex-1" style={{ accentColor: s.color }} />
                      <input type="number" min={0} max={STAT_CAP - s.base} value={s.val}
                        onChange={e => s.set(Math.min(STAT_CAP - s.base, Math.max(0, Number(e.target.value))))}
                        className="w-16 bg-white/[0.05] border border-white/10 text-white text-center text-[0.82rem] py-1 rounded-sm" />
                    </div>
                  </div>
                )
              })}
            </section>

            {/* Silah Seçimi */}
            <section className="p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h2 className="text-[0.72rem] font-bold tracking-[0.18em] uppercase mb-4" style={{ color: 'rgba(139,92,246,0.8)' }}>
                Silah — Sağ El
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="text-[0.68rem] text-white/30 mb-1 block">Kategori</label>
                  <select value={weaponCategory} onChange={e => { setWeaponCategory(e.target.value); setWeaponIndex(0) }}
                    className="w-full bg-[#0e0e14] border border-white/10 text-white text-[0.8rem] px-3 py-2">
                    {Object.keys(WEAPONS).map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[0.68rem] text-white/30 mb-1 block">Silah</label>
                  <select value={weaponIndex} onChange={e => setWeaponIndex(Number(e.target.value))}
                    className="w-full bg-[#0e0e14] border border-white/10 text-white text-[0.8rem] px-3 py-2">
                    {(WEAPONS[weaponCategory] ?? []).map((w, i) => (
                      <option key={i} value={i}>{w.label} (AP: {w.ap})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[0.68rem] text-white/30 mb-1 block">Upgrade (+{upgrade})</label>
                  <input type="range" min={0} max={9} value={upgrade} onChange={e => setUpgrade(Number(e.target.value))}
                    className="w-full mt-2" style={{ accentColor: '#a78bfa' }} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={wes} onChange={e => setWes(e.target.checked)} className="accent-purple-500" />
                  <span className="text-[0.75rem] text-white/60">WES (Weapon Enchant Scroll) +5 AP</span>
                </label>
                <span className="text-[0.72rem] text-purple-400 ml-auto">Final AP: <strong>{weaponFinalAP + (wes ? 5 : 0)}</strong></span>
              </div>
            </section>

            {/* Sol El (sadece Asas) */}
            {isAsas && (
              <section className="p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(109,40,217,0.2)' }}>
                <h2 className="text-[0.72rem] font-bold tracking-[0.18em] uppercase mb-1" style={{ color: 'rgba(139,92,246,0.8)' }}>
                  Silah — Sol El (Dual Wield)
                </h2>
                <p className="text-[0.65rem] text-white/30 mb-3">Sol el AP %50 hesaplanır</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="text-[0.68rem] text-white/30 mb-1 block">Kategori</label>
                    <select value={offhandCategory} onChange={e => { setOffhandCategory(e.target.value); setOffhandIndex(0) }}
                      className="w-full bg-[#0e0e14] border border-white/10 text-white text-[0.8rem] px-3 py-2">
                      {Object.keys(WEAPONS).map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[0.68rem] text-white/30 mb-1 block">Silah</label>
                    <select value={offhandIndex} onChange={e => setOffhandIndex(Number(e.target.value))}
                      className="w-full bg-[#0e0e14] border border-white/10 text-white text-[0.8rem] px-3 py-2">
                      {(WEAPONS[offhandCategory] ?? []).map((w, i) => (
                        <option key={i} value={i}>{w.label} (AP: {w.ap})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[0.68rem] text-white/30 mb-1 block">Upgrade (+{offhandUpgrade})</label>
                    <input type="range" min={0} max={9} value={offhandUpgrade} onChange={e => setOffhandUpgrade(Number(e.target.value))}
                      className="w-full mt-2" style={{ accentColor: '#a78bfa' }} />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={offhandWes} onChange={e => setOffhandWes(e.target.checked)} className="accent-purple-500" />
                    <span className="text-[0.75rem] text-white/60">WES +5 AP</span>
                  </label>
                  <span className="text-[0.72rem] text-purple-400 ml-auto">Final AP: <strong>{offhandFinalAP + (offhandWes ? 5 : 0)}</strong></span>
                </div>
              </section>
            )}

            {/* Bufflar */}
            <section className="p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h2 className="text-[0.72rem] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: 'rgba(139,92,246,0.8)' }}>
                Buff / Premium
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'Wolf Premium', sub: '+20%', val: wolf, set: setWolf, color: '#fbbf24' },
                  { label: 'AP Scroll', sub: '+22%', val: apScroll, set: setApScroll, color: '#60a5fa' },
                  { label: 'Red Potion', sub: '+10%', val: redPotion, set: setRedPotion, color: '#f87171' },
                  { label: 'Commander Buff', sub: '+30%', val: commander, set: setCommander, color: '#34d399' },
                ].map(b => (
                  <button key={b.label} type="button" onClick={() => b.set(!b.val)}
                    className="flex flex-col items-center py-3 px-2 transition-all duration-200"
                    style={{
                      background: b.val ? b.color + '15' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${b.val ? b.color + '50' : 'rgba(255,255,255,0.07)'}`,
                    }}>
                    <span className="text-[0.72rem] font-semibold" style={{ color: b.val ? b.color : 'rgba(255,255,255,0.4)' }}>{b.label}</span>
                    <span className="text-[0.65rem] mt-0.5" style={{ color: b.val ? b.color : 'rgba(255,255,255,0.2)' }}>{b.sub}</span>
                  </button>
                ))}
              </div>
              {wolf && commander && (
                <p className="text-[0.65rem] text-yellow-400/70 mt-2">⚠️ Wolf Premium ve Commander Buff stack etmez — sadece Commander (+30%) hesaplanır.</p>
              )}
              <p className="text-[0.68rem] text-white/30 mt-2">Toplam buff bonusu: <span className="text-purple-400">+{buffPct}%</span></p>
            </section>
          </div>

          {/* ── Sağ: Sonuçlar ── */}
          <div className="flex flex-col gap-4">
            {/* AP Sonucu */}
            <div className="p-6 sticky top-24" style={{ background: 'rgba(109,40,217,0.08)', border: '1px solid rgba(139,92,246,0.25)' }}>
              <div className="flex items-center gap-2 mb-5">
                <Shield size={16} className="text-purple-400" />
                <h2 className="text-[0.72rem] font-bold tracking-[0.18em] uppercase text-purple-400">Hesaplama Sonucu</h2>
              </div>

              {/* Sınıf badge */}
              <div className="flex items-center gap-2 mb-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-xl">{classInfo.icon}</span>
                <div>
                  <p className="text-[0.68rem] text-white/35">Sınıf</p>
                  <p className="text-[0.9rem] font-bold text-white">{classInfo.label} — Lv.{level}</p>
                </div>
              </div>

              {/* Ana AP */}
              <div className="text-center mb-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-[0.65rem] tracking-[0.2em] uppercase text-white/30 mb-1">Toplam Attack Power</p>
                <p className="text-5xl font-black text-white" style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                  {totalAP.toLocaleString('tr-TR')}
                </p>
                <p className="text-[0.68rem] text-white/25 mt-1">AP</p>
              </div>

              {/* Detaylar */}
              <div className="flex flex-col gap-2 mb-4">
                {isAsas && (
                  <>
                    <div className="flex justify-between text-[0.75rem]">
                      <span className="text-white/40">Sağ El AP</span>
                      <span className="text-white font-semibold">{rightHandAP.toLocaleString('tr-TR')}</span>
                    </div>
                    <div className="flex justify-between text-[0.75rem]">
                      <span className="text-white/40">Sol El AP (%50)</span>
                      <span className="text-white font-semibold">{leftHandAP.toLocaleString('tr-TR')}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between text-[0.75rem]">
                  <span className="text-white/40">Ana Stat ({classInfo.mainStat.toUpperCase()})</span>
                  <span className="text-purple-300 font-semibold">{mainStatValue}</span>
                </div>
                <div className="flex justify-between text-[0.75rem]">
                  <span className="text-white/40">Silah AP (final)</span>
                  <span className="text-white font-semibold">{weaponFinalAP + (wes ? 5 : 0)}</span>
                </div>
                <div className="flex justify-between text-[0.75rem]">
                  <span className="text-white/40">Buff Bonusu</span>
                  <span className="text-yellow-400 font-semibold">+{buffPct}%</span>
                </div>
              </div>

              {/* Stat özeti */}
              <div className="p-3 mb-4" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-[0.65rem] tracking-[0.15em] uppercase text-white/25 mb-2">Stat Özeti</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: 'STR', val: totalStr, color: '#f87171' },
                    { label: 'DEX', val: totalDex, color: '#60a5fa' },
                    { label: 'INT', val: totalInt, color: '#34d399' },
                    { label: 'HP',  val: totalHp,  color: '#fb923c' },
                  ].map(s => (
                    <div key={s.label} className="flex justify-between text-[0.72rem]">
                      <span style={{ color: s.color }}>{s.label}</span>
                      <span className="text-white font-bold">{s.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kalan puan uyarısı */}
              {remaining < 0 && (
                <div className="p-3 mb-3" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                  <p className="text-[0.72rem] text-red-400">⚠️ {Math.abs(remaining)} puan fazla dağıttın! Stat dağılımını düzelt.</p>
                </div>
              )}
              {remaining > 0 && (
                <div className="p-3 mb-3" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <p className="text-[0.72rem] text-green-400">✓ {remaining} puan dağıtılmamış.</p>
                </div>
              )}

              <p className="text-[0.6rem] text-white/15 text-center leading-relaxed">
                Hesaplama kobugda.com formüllerine dayanmaktadır.<br/>Sunucuya göre küçük farklılıklar olabilir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
