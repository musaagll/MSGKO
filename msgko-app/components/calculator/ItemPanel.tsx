'use client'
import { useState } from 'react'
import type { CalculatorState, EquippedItems, ItemStat, CharacterClass } from '@/lib/calculator/types'
import type { Action } from '@/lib/calculator/reducer'
import {
  getItemCategories,
  getItemsByCategory,
  getItemById,
  getItemGrades,
  ITEM_LIST,
  type ItemEntry,
  type ItemCategory,
} from '@/lib/calculator/items'

interface Props {
  state: CalculatorState
  dispatch: React.Dispatch<Action>
}

const SELECT_CLASS =
  'w-full bg-white/[0.06] border border-white/[0.12] rounded-sm px-2 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500/60 focus:bg-white/[0.08] transition-colors cursor-pointer'

const SLOT_LABELS: Record<keyof EquippedItems, string> = {
  rightHand: 'Sağ El',
  leftHand:  'Sol El',
  armor:     'Zırh',
  accessory: 'Aksesuar',
  leftPathos:  'Sol Pathos',
  rightPathos: 'Sağ Pathos',
  tattoo:    'Tattoo',
  wings:     'Wings',
  emblem:    'Emblem',
}

const STAT_LABELS: { key: keyof ItemStat; label: string }[] = [
  { key: 'attackPower',       label: 'Attack Power' },
  { key: 'defense',           label: 'Defense Ability' },
  { key: 'attackSpeed',       label: 'Attack Speed' },
  { key: 'effectiveRange',    label: 'Effective Range' },
  { key: 'weight',            label: 'Weight' },
  { key: 'durability',        label: 'Max Durability' },
  { key: 'damagePercentage',  label: 'Damage +% Increase' },
  { key: 'defensePercentage', label: 'Defense +% Increase' },
  { key: 'bonusHealth',       label: 'Health Bonus' },
  { key: 'bonusStrength',     label: 'Strength Bonus' },
  { key: 'bonusDexterity',    label: 'Dexterity Bonus' },
  { key: 'bonusMagicPower',   label: 'Magic Power Bonus' },
  { key: 'bonusIntelligence', label: 'Intelligence Bonus' },
  { key: 'bonusHp',           label: 'HP Bonus' },
  { key: 'bonusMp',           label: 'MP Bonus' },
  { key: 'resistanceFlame',   label: 'Resistance Flame' },
  { key: 'resistanceGlacier', label: 'Resistance Glacier' },
  { key: 'resistanceLighting',label: 'Resistance Lighting' },
  { key: 'resistancePoison',  label: 'Resistance Poison' },
  { key: 'resistanceDark',    label: 'Resistance Dark' },
  { key: 'requiredLevel',     label: 'Required Level' },
  { key: 'requiredStr',       label: 'Required Strength' },
  { key: 'requiredDex',       label: 'Required Dexterity' },
  { key: 'requiredMagicPower',label: 'Required Magic Power' },
  { key: 'requiredInt',       label: 'Required Intelligence' },
  { key: 'requiredHealth',    label: 'Required Health' },
]

// Kategorileri character class'a göre filtrele
function getRelevantCategories(cls: CharacterClass, subClass?: string): ItemCategory[] {
  const all = getItemCategories()
  return all.filter(cat => {
    // Her sınıf tüm genel kategorilere erişebilir
    if (!cat.id.includes('-')) return true
    // Sınıfa özel kategoriler
    const parts = cat.id.split('-')
    const catClass = parts[parts.length - 1]
    if (catClass === 'warrior' && cls === 'Warrior') return true
    if (catClass === 'rogue'   && cls === 'Rogue')   return true
    if (catClass === 'priest'  && cls === 'Priest')  return true
    if (catClass === 'mage'    && cls === 'Mage')    return true
    if (catClass === 'kurian'  && cls === 'Kurian')  return true
    // Genel kategoriler
    if (['accessories', 'pathos', 'tattoo'].includes(cat.id)) return true
    return false
  })
}

// Grade'e göre AP artışı — her +1 için ~3 AP (basit model, orijinal de böyle)
function getGradeApBonus(gradeId: number): number {
  return gradeId * 3
}

function meetsLevelRequirement(item: ItemEntry, currentLevel: number): boolean {
  const req = item.baseStats.requiredLevel
  if (!req) return true
  return currentLevel >= req
}

export function ItemPanel({ state, dispatch }: Props) {
  const categories = getRelevantCategories(state.characterClass)

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [selectedItemId, setSelectedItemId]         = useState<string>('')
  const [selectedGradeId, setSelectedGradeId]       = useState<number>(0)
  const [pathosSlot, setPathosSlot]                  = useState<'leftPathos' | 'rightPathos'>('leftPathos')

  const itemsInCategory = selectedCategoryId ? getItemsByCategory(selectedCategoryId) : []
  const selectedItem    = selectedItemId ? getItemById(selectedItemId) : undefined
  const grades          = selectedItem   ? getItemGrades(selectedItem) : []

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedCategoryId(e.target.value)
    setSelectedItemId('')
    setSelectedGradeId(0)
  }

  function handleItemChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedItemId(e.target.value)
    setSelectedGradeId(0)
  }

  function equipItem(slot: keyof EquippedItems) {
    if (!selectedItem) return
    const apBonus = getGradeApBonus(selectedGradeId)
    const effectiveStat: ItemStat = {
      ...selectedItem.baseStats,
      ...(selectedItem.baseStats.attackPower != null
        ? { attackPower: selectedItem.baseStats.attackPower + apBonus }
        : {}),
    }
    dispatch({ type: 'EQUIP_ITEM', payload: { slot, item: { itemStat: effectiveStat } } })
  }

  function handleEquipNormal() {
    if (!selectedItem || !selectedCategoryId) return
    let slot: keyof EquippedItems

    if (selectedCategoryId.startsWith('armor-')) {
      slot = 'armor'
    } else if (selectedCategoryId === 'accessories') {
      slot = 'accessory'
    } else if (selectedCategoryId === 'pathos') {
      slot = pathosSlot
    } else if (selectedCategoryId === 'tattoo') {
      // tattoo, wings, emblem → categoryId ile belirle
      slot = 'tattoo'
    } else {
      slot = 'armor'
    }

    equipItem(slot)
  }

  const equippedSlots = (Object.keys(state.equipped) as (keyof EquippedItems)[]).filter(
    (slot) => state.equipped[slot] !== null,
  )

  // Equipped item için görüntü adı
  function getEquippedName(slot: keyof EquippedItems): string {
    const eq = state.equipped[slot]
    if (!eq) return SLOT_LABELS[slot]
    const ap  = eq.itemStat.attackPower
    const def = eq.itemStat.defense
    const match = ITEM_LIST.find(it => {
      if (ap  != null && it.baseStats.attackPower != null) return Math.abs(ap  - it.baseStats.attackPower) <= 30
      if (def != null && it.baseStats.defense     != null) return it.baseStats.defense === def
      return false
    })
    return match?.name ?? SLOT_LABELS[slot]
  }

  return (
    <fieldset className="border border-white/[0.10] rounded-sm p-4 space-y-4">
      <legend className="px-2 text-xs font-semibold text-white/50 uppercase tracking-widest">
        Items &amp; Equipment
      </legend>

      {/* Kategori */}
      <div className="space-y-1">
        <label className="block text-xs text-white/50 uppercase tracking-wider">Kategori</label>
        <select value={selectedCategoryId} onChange={handleCategoryChange} className={SELECT_CLASS}>
          <option value="" className="bg-neutral-900">— Kategori Seç —</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id} className="bg-neutral-900">{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Item */}
      {selectedCategoryId && (
        <div className="space-y-1">
          <label className="block text-xs text-white/50 uppercase tracking-wider">Item</label>
          <select value={selectedItemId} onChange={handleItemChange} className={SELECT_CLASS}>
            <option value="" className="bg-neutral-900">— Item Seç —</option>
            {itemsInCategory.map(item => (
              <option key={item.id} value={item.id} className="bg-neutral-900">
                {item.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Grade */}
      {selectedItem && grades.length > 1 && (
        <div className="space-y-1">
          <label className="block text-xs text-white/50 uppercase tracking-wider">Grade</label>
          <select
            value={selectedGradeId}
            onChange={e => setSelectedGradeId(Number(e.target.value))}
            className={SELECT_CLASS}
          >
            {grades.map(g => (
              <option key={g.id} value={g.id} className="bg-neutral-900">{g.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Item Stats */}
      {selectedItem && (
        <div
          className="rounded-sm p-3 space-y-2"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <p className={`text-sm font-semibold ${
            meetsLevelRequirement(selectedItem, state.level) ? 'text-white' : 'text-red-400'
          }`}>
            {selectedItem.name}{selectedGradeId > 0 ? ` (+${selectedGradeId})` : ''}
          </p>

          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
            {STAT_LABELS.map(({ key, label }) => {
              let val = selectedItem.baseStats[key as keyof ItemStat]
              if (key === 'attackPower' && val != null && selectedGradeId > 0) {
                val = (val as number) + getGradeApBonus(selectedGradeId)
              }
              if (val == null || val === 0) return null
              return (
                <div key={key} className="text-xs text-white/60">
                  {label}: <span className="text-white/90">{val}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Equip Butonları */}
      {selectedItem && (
        <div className="space-y-2">
          {selectedCategoryId === 'pathos' && (
            <div className="space-y-1">
              <label className="block text-xs text-white/50 uppercase tracking-wider">Pathos Slotu</label>
              <select
                value={pathosSlot}
                onChange={e => setPathosSlot(e.target.value as 'leftPathos' | 'rightPathos')}
                className={SELECT_CLASS}
              >
                <option value="leftPathos"  className="bg-neutral-900">Sol Pathos</option>
                <option value="rightPathos" className="bg-neutral-900">Sağ Pathos</option>
              </select>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {selectedItem.canEquipRight && (
              <button
                onClick={() => equipItem('rightHand')}
                className="px-3 py-1.5 text-xs font-medium bg-purple-600/70 hover:bg-purple-600 border border-purple-500/50 rounded-sm text-white transition-colors"
              >
                Sağ El
              </button>
            )}
            {selectedItem.canEquipLeft && (
              <button
                onClick={() => equipItem('leftHand')}
                className="px-3 py-1.5 text-xs font-medium bg-blue-600/70 hover:bg-blue-600 border border-blue-500/50 rounded-sm text-white transition-colors"
              >
                Sol El
              </button>
            )}
            {selectedItem.canEquipNormal && (
              <button
                onClick={handleEquipNormal}
                className="px-3 py-1.5 text-xs font-medium bg-emerald-600/70 hover:bg-emerald-600 border border-emerald-500/50 rounded-sm text-white transition-colors"
              >
                Giy
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mevcut Ekipman */}
      {equippedSlots.length > 0 && (
        <div
          className="rounded-sm p-3 space-y-1.5"
          style={{ border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Ekipman</p>
          {equippedSlots.map(slot => {
            const eq = state.equipped[slot]
            if (!eq) return null
            return (
              <div key={slot} className="flex items-center justify-between gap-2">
                <div className="text-xs text-white/70 min-w-0">
                  <span className="text-white/40">{SLOT_LABELS[slot]}: </span>
                  <span className="text-white/85">{getEquippedName(slot)}</span>
                  {eq.itemStat.attackPower != null && (
                    <span className="text-purple-400 ml-1">AP:{eq.itemStat.attackPower}</span>
                  )}
                  {eq.itemStat.defense != null && (
                    <span className="text-blue-400 ml-1">AC:{eq.itemStat.defense}</span>
                  )}
                </div>
                <button
                  onClick={() => dispatch({ type: 'UNEQUIP_ITEM', payload: { slot } })}
                  className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-xs bg-red-600/50 hover:bg-red-600 border border-red-500/40 rounded-sm text-white transition-colors"
                  title="Çıkar"
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
      )}
    </fieldset>
  )
}
