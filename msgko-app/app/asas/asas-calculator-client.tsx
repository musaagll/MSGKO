'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

// ═══════════════ VERİTABANI ═══════════════

const WEAPONS = [
  { name: '— Boş —',          upgrades: [{ lvl: '', ap: 0, dex: 0 }] },
  { name: 'Shard',             upgrades: [{ lvl: '+7', ap: 93, dex: 0 }, { lvl: '+8', ap: 101, dex: 0 }, { lvl: '+9', ap: 109, dex: 0 }] },
  { name: 'Mirage Dagger',     upgrades: [{ lvl: '+7', ap: 87, dex: 0 }, { lvl: '+8', ap: 95,  dex: 0 }, { lvl: '+9', ap: 103, dex: 0 }] },
  { name: 'Dark Vane',         upgrades: [{ lvl: '+7', ap: 91, dex: 7 }, { lvl: '+8', ap: 99,  dex: 9 }, { lvl: '+9', ap: 107, dex: 11 }] },
  { name: 'Weapon Breaker',    upgrades: [{ lvl: '+7', ap: 82, dex: 0 }, { lvl: '+8', ap: 90,  dex: 0 }, { lvl: '+9', ap: 98,  dex: 0 }] },
  { name: 'Khanjar',           upgrades: [{ lvl: '+7', ap: 97, dex: 0 }, { lvl: '+8', ap: 105, dex: 0 }, { lvl: '+9', ap: 113, dex: 0 }] },
  { name: 'Moonlight',         upgrades: [{ lvl: '+7', ap: 103,dex: 0 }, { lvl: '+8', ap: 111, dex: 0 }, { lvl: '+9', ap: 119, dex: 0 }] },
  { name: "Eagle's Eye",       upgrades: [{ lvl: '+7', ap: 115,dex: 5 }, { lvl: '+8', ap: 123, dex: 7 }, { lvl: '+9', ap: 131, dex: 9 }] },
  { name: 'Iron Bow',          upgrades: [{ lvl: '+7', ap: 119,dex: 0 }, { lvl: '+8', ap: 127, dex: 0 }, { lvl: '+9', ap: 135, dex: 0 }] },
  { name: 'Chitin Bow',        upgrades: [{ lvl: '+7', ap: 117,dex: 0 }, { lvl: '+8', ap: 125, dex: 0 }, { lvl: '+9', ap: 133, dex: 0 }] },
  { name: "Hepa's Shard",      upgrades: [{ lvl: '+7', ap: 98, dex: 0 }, { lvl: '+8', ap: 106, dex: 0 }, { lvl: '+9', ap: 114, dex: 0 }] },
  { name: 'Sherion',           upgrades: [{ lvl: '+7', ap: 95, dex: 0 }, { lvl: '+8', ap: 103, dex: 0 }, { lvl: '+9', ap: 111, dex: 0 }] },
]

const ARMORS = [
  { name: '— Boş —',    upgrades: [{ lvl: '', dex: 0 }] },
  { name: 'Chitin',      upgrades: [{ lvl: '+7', dex: 7 }, { lvl: '+8', dex: 9  }, { lvl: '+9', dex: 12 }] },
  { name: 'Shell',       upgrades: [{ lvl: '+7', dex: 8 }, { lvl: '+8', dex: 10 }, { lvl: '+9', dex: 13 }] },
  { name: 'Mythril',     upgrades: [{ lvl: '+7', dex: 9 }, { lvl: '+8', dex: 11 }, { lvl: '+9', dex: 14 }] },
  { name: 'Krowaz',      upgrades: [{ lvl: '+7', dex: 10}, { lvl: '+8', dex: 12 }, { lvl: '+9', dex: 15 }] },
  { name: 'Rosetta',     upgrades: [{ lvl: '+7', dex: 9 }, { lvl: '+8', dex: 11 }, { lvl: '+9', dex: 14 }] },
  { name: 'Holy Knight', upgrades: [{ lvl: '+7', dex: 11}, { lvl: '+8', dex: 13 }, { lvl: '+9', dex: 16 }] },
]

const RINGS = [
  { name: '— Boş —',         upgrades: [{ lvl: '', dex: 0 }] },
  { name: 'Ring of Life',     upgrades: [{ lvl: '+0', dex: 7 }, { lvl: '+1', dex: 8  }, { lvl: '+2', dex: 9  }, { lvl: '+3', dex: 10 }] },
  { name: 'Legionnaire Band', upgrades: [{ lvl: '+0', dex: 8 }, { lvl: '+1', dex: 10 }, { lvl: '+2', dex: 12 }, { lvl: '+3', dex: 14 }] },
  { name: 'Foverin',          upgrades: [{ lvl: '+0', dex: 5 }, { lvl: '+1', dex: 7  }, { lvl: '+2', dex: 9  }, { lvl: '+3', dex: 11 }] },
  { name: "Pontus's Ring",    upgrades: [{ lvl: '+0', dex: 7 }, { lvl: '+1', dex: 9  }, { lvl: '+2', dex: 11 }, { lvl: '+3', dex: 13 }] },
  { name: 'Ararat Ring',      upgrades: [{ lvl: '+0', dex: 7 }, { lvl: '+1', dex: 9  }, { lvl: '+2', dex: 11 }, { lvl: '+3', dex: 13 }] },
  { name: 'Taurus Ring',      upgrades: [{ lvl: '+0', dex: 7 }, { lvl: '+1', dex: 9  }, { lvl: '+2', dex: 11 }, { lvl: '+3', dex: 13 }] },
  { name: 'Old Ring of Life', upgrades: [{ lvl: 'Sabit', dex: 7 }] },
]

const EARRINGS = [
  { name: '— Boş —',               upgrades: [{ lvl: '', dex: 0 }] },
  { name: 'Howling Rooster',        upgrades: [{ lvl: '+0', dex: 10 }, { lvl: '+1', dex: 12 }, { lvl: '+2', dex: 14 }, { lvl: '+3', dex: 16 }] },
  { name: 'Cockatrice Earring',     upgrades: [{ lvl: '+0', dex: 8  }, { lvl: '+1', dex: 10 }, { lvl: '+2', dex: 12 }, { lvl: '+3', dex: 14 }] },
  { name: 'Silver Earring',         upgrades: [{ lvl: '+0', dex: 7  }, { lvl: '+1', dex: 9  }, { lvl: '+2', dex: 11 }, { lvl: '+3', dex: 13 }] },
  { name: 'Rogue Earring',          upgrades: [{ lvl: '+0', dex: 7  }, { lvl: '+1', dex: 9  }, { lvl: '+2', dex: 11 }, { lvl: '+3', dex: 13 }] },
  { name: 'Old Cockatrice Earring', upgrades: [{ lvl: 'Sabit', dex: 8 }] },
]

const NECKLACES = [
  { name: '— Boş —',              upgrades: [{ lvl: '', dex: 0 }] },
  { name: 'Priest Pendant',        upgrades: [{ lvl: '+0', dex: 10 }, { lvl: '+1', dex: 15 }, { lvl: '+2', dex: 20 }, { lvl: '+3', dex: 30 }] },
  { name: 'Amulet of Dexterity',   upgrades: [{ lvl: '+0', dex: 15 }, { lvl: '+1', dex: 20 }, { lvl: '+2', dex: 25 }, { lvl: '+3', dex: 35 }] },
  { name: 'Black Dragon Necklace', upgrades: [{ lvl: '+0', dex: 5  }, { lvl: '+1', dex: 10 }, { lvl: '+2', dex: 15 }, { lvl: '+3', dex: 20 }] },
  { name: "Draki's Pendant (S S S)", upgrades: [{ lvl: 'Sabit', dex: 30 }] },
  { name: 'Old Priest Pendant',    upgrades: [{ lvl: 'Sabit', dex: 10 }] },
]

const BELTS = [
  { name: '— Boş —',      upgrades: [{ lvl: '', dex: 0 }] },
  { name: 'Elf Belt',      upgrades: [{ lvl: '+0', dex: 10 }, { lvl: '+1', dex: 12 }, { lvl: '+2', dex: 14 }, { lvl: '+3', dex: 16 }] },
  { name: 'Judicious Belt',upgrades: [{ lvl: '+0', dex: 7  }, { lvl: '+1', dex: 9  }, { lvl: '+2', dex: 11 }, { lvl: '+3', dex: 13 }] },
  { name: 'Glass Belt',    upgrades: [{ lvl: '+0', dex: 0  }, { lvl: '+1', dex: 0  }, { lvl: '+2', dex: 0  }, { lvl: '+3', dex: 0  }] },
  { name: 'Iron Belt',     upgrades: [{ lvl: '+0', dex: 0  }, { lvl: '+1', dex: 0  }, { lvl: '+2', dex: 0  }, { lvl: '+3', dex: 0  }] },
  { name: 'Old Elf Belt',  upgrades: [{ lvl: 'Sabit', dex: 10 }] },
]

// ═══════════════ TİPLER ═══════════════
interface Upgrade { lvl: string; ap?: number; dex: number }
interface Item { name: string; upgrades: Upgrade[] }
interface SlotState { nameIdx: number; lvlIdx: number }

function initSlot(): SlotState { return { nameIdx: 0, lvlIdx: 0 } }

function ItemSelect({ label, db, slot, onChange }: {
  label: string
  db: Item[]
  slot: SlotState
  onChange: (s: SlotState) => void
}) {
  const item = db[slot.nameIdx]
  const ups = item?.upgrades ?? []

  return (
    <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.07)', padding: '10px', borderRadius: 2 }}>
      <p style={{ fontSize: '.6rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(139,92,246,.65)', marginBottom: 6 }}>{label}</p>
      <select
        value={slot.nameIdx}
        onChange={e => onChange({ nameIdx: Number(e.target.value), lvlIdx: 0 })}
        style={selStyle}
      >
        {db.map((d, i) => <option key={i} value={i}>{d.name}</option>)}
      </select>
      <select
        value={slot.lvlIdx}
        onChange={e => onChange({ ...slot, lvlIdx: Number(e.target.value) })}
        style={{ ...selStyle, marginTop: 4 }}
        disabled={ups.length <= 1 && ups[0]?.lvl === ''}
      >
        {ups.map((u, i) => (
          <option key={i} value={i}>
            {u.lvl
              ? `${u.lvl}${u.ap !== undefined ? `  AP:${u.ap}` : ''}${u.dex ? `  +${u.dex} DEX` : ''}`
              : '—'}
          </option>
        ))}
      </select>
    </div>
  )
}

const selStyle: React.CSSProperties = {
  width: '100%', background: '#0d0d12', border: '1px solid rgba(255,255,255,.1)',
  color: '#fff', padding: '6px 8px', fontSize: '.78rem', borderRadius: 2, outline: 'none',
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)', padding: 18, borderRadius: 2,
}

const cardTitleStyle: React.CSSProperties = {
  fontSize: '.65rem', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase',
  color: 'rgba(139,92,246,.8)', marginBottom: 14,
}

function getDex(db: Item[], slot: SlotState): number {
  return db[slot.nameIdx]?.upgrades[slot.lvlIdx]?.dex ?? 0
}

function getAP(slot: SlotState): number {
  return WEAPONS[slot.nameIdx]?.upgrades[slot.lvlIdx]?.ap ?? 0
}

function getWeaponDex(slot: SlotState): number {
  return WEAPONS[slot.nameIdx]?.upgrades[slot.lvlIdx]?.dex ?? 0
}

export function AsasCalculatorClient() {
  const [baseDex, setBaseDex] = useState(255)
  const [wolf, setWolf] = useState(false)

  const [rWeapon, setRWeapon] = useState<SlotState>(initSlot())
  const [lWeapon, setLWeapon] = useState<SlotState>(initSlot())

  const [aHead,  setAHead]  = useState<SlotState>(initSlot())
  const [aChest, setAChest] = useState<SlotState>(initSlot())
  const [aLegs,  setALegs]  = useState<SlotState>(initSlot())
  const [aArms,  setAArms]  = useState<SlotState>(initSlot())
  const [aBoots, setABoots] = useState<SlotState>(initSlot())

  const [ring1, setRing1] = useState<SlotState>(initSlot())
  const [ring2, setRing2] = useState<SlotState>(initSlot())
  const [ear1,  setEar1]  = useState<SlotState>(initSlot())
  const [ear2,  setEar2]  = useState<SlotState>(initSlot())
  const [neck,  setNeck]  = useState<SlotState>(initSlot())
  const [belt,  setBelt]  = useState<SlotState>(initSlot())

  const rAP = getAP(rWeapon)
  const lAP = getAP(lWeapon)
  const weaponDex = getWeaponDex(rWeapon) + getWeaponDex(lWeapon)

  const armorDex = getDex(ARMORS, aHead) + getDex(ARMORS, aChest) + getDex(ARMORS, aLegs) + getDex(ARMORS, aArms) + getDex(ARMORS, aBoots)

  const jewelDex = getDex(RINGS, ring1) + getDex(RINGS, ring2) + getDex(EARRINGS, ear1) + getDex(EARRINGS, ear2) + getDex(NECKLACES, neck) + getDex(BELTS, belt)

  const totalDex = Math.min(baseDex, 255) + weaponDex + armorDex + jewelDex
  const weaponAtk = lAP > 0 ? rAP + Math.floor(lAP / 2) : rAP
  const wolfMult = wolf ? 1.20 : 1.0
  const totalAP = Math.floor(((totalDex * 0.0405) + weaponAtk) * wolfMult)

  return (
    <div style={{ minHeight: '100vh', background: '#07070B', padding: '0 0 64px' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(139,92,246,.7),rgba(236,72,153,.5),transparent)', zIndex: 10 }} />

      {/* Header */}
      <header style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', marginTop: 64, borderBottom: '1px solid rgba(255,255,255,.05)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,.4)', textDecoration: 'none', fontSize: '.78rem' }}>
          <ArrowLeft size={15} /> Geri Dön
        </Link>
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
          <p style={{ fontSize: '.6rem', fontWeight: 700, letterSpacing: '.3em', textTransform: 'uppercase', color: 'rgba(139,92,246,.7)', marginBottom: 2 }}>MSGKO.NET</p>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 900, letterSpacing: '.12em', textTransform: 'uppercase', color: '#fff' }}>Asas AP Hesaplayıcı</h1>
        </div>
        <div style={{ width: 80 }} />
      </header>

      {/* Body */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px', display: 'grid', gridTemplateColumns: '200px 1fr 220px', gap: 20 }}
        className="calc-grid">
        <style>{`@media(max-width:900px){.calc-grid{grid-template-columns:1fr!important}}`}</style>

        {/* SOL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={cardStyle}>
            <p style={cardTitleStyle}>Karakter</p>
            <label style={{ fontSize: '.7rem', color: 'rgba(255,255,255,.4)', display: 'block', marginBottom: 4 }}>Temel DEX (max 255)</label>
            <input type="number" min={1} max={255} value={baseDex}
              onChange={e => setBaseDex(Math.min(255, Math.max(1, Number(e.target.value))))}
              style={selStyle} />

            <div
              onClick={() => setWolf(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, padding: '10px 12px',
                background: wolf ? 'rgba(251,191,36,.08)' : 'rgba(255,255,255,.02)',
                border: `1px solid ${wolf ? 'rgba(251,191,36,.35)' : 'rgba(255,255,255,.07)'}`,
                borderRadius: 2, cursor: 'pointer', userSelect: 'none', transition: 'all .2s',
              }}>
              <div style={{
                width: 18, height: 18, borderRadius: 3, border: `2px solid ${wolf ? '#fbbf24' : 'rgba(255,255,255,.2)'}`,
                background: wolf ? '#fbbf24' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .2s'
              }}>
                {wolf && <span style={{ color: '#000', fontSize: '.7rem', fontWeight: 900 }}>✓</span>}
              </div>
              <div>
                <p style={{ fontSize: '.78rem', fontWeight: 700, color: wolf ? '#fbbf24' : 'rgba(255,255,255,.45)' }}>Wolf Premium</p>
                <p style={{ fontSize: '.62rem', color: wolf ? 'rgba(251,191,36,.55)' : 'rgba(255,255,255,.2)' }}>+20% Atak Gücü</p>
              </div>
            </div>
          </div>
        </div>

        {/* ORTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Silahlar */}
          <div style={cardStyle}>
            <p style={cardTitleStyle}>Silahlar</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <ItemSelect label="Sağ El" db={WEAPONS} slot={rWeapon} onChange={setRWeapon} />
              <ItemSelect label="Sol El (AP ÷ 2)" db={WEAPONS} slot={lWeapon} onChange={setLWeapon} />
            </div>
          </div>

          {/* Zırhlar */}
          <div style={cardStyle}>
            <p style={cardTitleStyle}>Zırhlar</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <ItemSelect label="Kafalık"   db={ARMORS} slot={aHead}  onChange={setAHead} />
              <ItemSelect label="Göğüslük"  db={ARMORS} slot={aChest} onChange={setAChest} />
              <ItemSelect label="Donluk"    db={ARMORS} slot={aLegs}  onChange={setALegs} />
              <ItemSelect label="Kolluk"    db={ARMORS} slot={aArms}  onChange={setAArms} />
              <ItemSelect label="Bot"       db={ARMORS} slot={aBoots} onChange={setABoots} />
            </div>
          </div>

          {/* Takılar */}
          <div style={cardStyle}>
            <p style={cardTitleStyle}>Takılar</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <ItemSelect label="Yüzük 1" db={RINGS}     slot={ring1} onChange={setRing1} />
              <ItemSelect label="Yüzük 2" db={RINGS}     slot={ring2} onChange={setRing2} />
              <ItemSelect label="Küpe 1"  db={EARRINGS}  slot={ear1}  onChange={setEar1} />
              <ItemSelect label="Küpe 2"  db={EARRINGS}  slot={ear2}  onChange={setEar2} />
              <ItemSelect label="Kolye"   db={NECKLACES} slot={neck}  onChange={setNeck} />
              <ItemSelect label="Kemer"   db={BELTS}     slot={belt}  onChange={setBelt} />
            </div>
          </div>
        </div>

        {/* SAĞ: Sonuç */}
        <div>
          <div style={{ ...cardStyle, background: 'rgba(109,40,217,.1)', border: '1px solid rgba(139,92,246,.3)', textAlign: 'center', position: 'sticky', top: 20 }}>
            <p style={{ fontSize: '.6rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginBottom: 6 }}>Toplam AP</p>
            <p style={{ fontSize: '3.2rem', fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-.02em' }}>{totalAP.toLocaleString('tr-TR')}</p>

            <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,.07)', margin: '16px 0' }} />

            <p style={{ fontSize: '.6rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginBottom: 6 }}>Toplam DEX</p>
            <p style={{ fontSize: '2rem', fontWeight: 900, color: '#a78bfa', lineHeight: 1 }}>{totalDex.toLocaleString('tr-TR')}</p>

            <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,.07)', margin: '16px 0' }} />

            {[
              { label: 'Temel DEX',  val: Math.min(baseDex, 255) },
              { label: 'Zırh DEX',   val: armorDex },
              { label: 'Takı DEX',   val: jewelDex },
              { label: 'Silah DEX',  val: weaponDex },
              { label: 'Sağ El AP',  val: rAP },
              { label: 'Sol El AP(/2)', val: lAP > 0 ? `${Math.floor(lAP/2)} (${lAP}÷2)` : 0 },
              { label: 'Wolf Çarpanı', val: wolf ? '×1.20' : '×1.00' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.72rem', padding: '3px 0', color: 'rgba(255,255,255,.4)' }}>
                <span>{r.label}</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{r.val}</span>
              </div>
            ))}

            <div style={{ marginTop: 14, display: 'inline-block', fontSize: '.6rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 2, background: wolf ? 'rgba(251,191,36,.15)' : 'rgba(255,255,255,.05)', color: wolf ? '#fbbf24' : 'rgba(255,255,255,.25)', border: `1px solid ${wolf ? 'rgba(251,191,36,.3)' : 'rgba(255,255,255,.08)'}` }}>
              {wolf ? 'Wolf Aktif (+20%)' : 'Wolf Pasif'}
            </div>

            <p style={{ marginTop: 14, fontSize: '.58rem', color: 'rgba(255,255,255,.15)', lineHeight: 1.6 }}>
              Formül: floor(((DEX × 0.0405) + SilahAtak) × Wolf)<br/>
              Dual Wield: Sağ + Sol÷2
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
