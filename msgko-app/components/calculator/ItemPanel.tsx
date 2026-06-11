'use client'
import { useState } from 'react'
import type { CalculatorState, EquippedItems, ItemStat } from '@/lib/calculator/types'
import type { Action } from '@/lib/calculator/reducer'
import {
  getItemCategories,
  getItemsByCategory,
  getItemById,
  getItemGrades,
  ITEM_LIST,
  type ItemEntry,
  type ItemGrade,
} from '@/lib/calculator/items'

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  state: CalculatorState
  dispatch: React.Dispatch<Action>
}

// ─── Ortak select stili ───────────────────────────────────────────────────────

const SELECT_CLASS =
  'w-full bg-white/[0.06] border border-white/[0.12] rounded-sm px-2 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500/60 focus:bg-white/[0.08] transition-colors cursor-pointer'

// ─── Slot adları ──────────────────────────────────────────────────────────────

const SLOT_LABELS: Record<keyof EquippedItems, string> = {
  rightHand: 'Right Hand',
  leftHand: 'Left Hand',
  armor: 'Armor',
  accessory: 'Accessory',
  leftPathos: 'Left Pathos',
  rightPathos: 'Right Pathos',
  tattoo: 'Tattoo / Wings / Emblem',
  wings: 'Wings',
  emblem: 'Emblem',
}

// ─── Stat Label Listesi ───────────────────────────────────────────────────────

const STAT_LABELS: { key: keyof ItemStat; label: string }[] = [
  { key: 'attackPower', label: 'Attack Power' },
  { key: 'defense', label: 'Defense' },
  { key: 'weight', label: 'Weight' },
  { key: 'durability', label: 'Max Durability' },
  { key: 'bonusStrength', label: 'Bonus STR' },
  { key: 'bonusDexterity', label: 'Bonus DEX' },
  { key: 'bonusMagicPower', label: 'Bonus Magic Power' },
  { key: 'bonusIntelligence', label: 'Bonus INT' },
  { key: 'bonusHp', label: 'Bonus HP' },
  { key: 'bonusMp', label: 'Bonus MP' },
  { key: 'damagePercentage', label: 'Damage %' },
  { key: 'resistanceFlame', label: 'Flame Resistance' },
  { key: 'resistanceGlacier', label: 'Glacier Resistance' },
  { key: 'resistanceLighting', label: 'Lightning Resistance' },
  { key: 'requiredLevel', label: 'Required Level' },
  { key: 'requiredStr', label: 'Required STR' },
  { key: 'requiredDex', label: 'Required DEX' },
]

// ─── Grade'e göre AP bonusu hesapla ──────────────────────────────────────────

function getGradeApBonus(gradeId: number): number {
  // Her +1 için yaklaşık 3 AP bonus (basit model)
  return gradeId * 3
}

// ─── Item adı grade ile birlikte ──────────────────────────────────────────────

function buildItemDisplayName(item: ItemEntry, gradeId: number): string {
  if (gradeId === 0) return item.name
  return `${item.name} (+${gradeId})`
}

// ─── Level gereksinimi karşılanıyor mu? ───────────────────────────────────────

function meetsLevelRequirement(item: ItemEntry, currentLevel: number): boolean {
  const req = item.baseStats.requiredLevel
  if (!req) return true
  return currentLevel >= req
}

// ─── ItemPanel ────────────────────────────────────────────────────────────────

export function ItemPanel({ state, dispatch }: Props) {
  const categories = getItemCategories()

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [selectedItemId, setSelectedItemId] = useState<string>('')
  const [selectedGradeId, setSelectedGradeId] = useState<number>(0)
  const [pathosSlot, setPathosSlot] = useState<'leftPathos' | 'rightPathos'>('leftPathos')

  // Kategoriye göre item listesi
  const itemsInCategory = selectedCategoryId ? getItemsByCategory(selectedCategoryId) : []

  // Seçili item
  const selectedItem = selectedItemId ? getItemById(selectedItemId) : undefined

  // Seçili item için grade listesi
  const grades: ItemGrade[] = selectedItem ? getItemGrades(selectedItem) : []

  // ─── Handlers ──────────────────────────────────────────────────────────────

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const catId = e.target.value
    setSelectedCategoryId(catId)
    setSelectedItemId('')
    setSelectedGradeId(0)
  }

  function handleItemChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const itemId = e.target.value
    setSelectedItemId(itemId)
    setSelectedGradeId(0)
  }

  function handleGradeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedGradeId(Number(e.target.value))
  }

  // ─── Equip işlemi ──────────────────────────────────────────────────────────

  function equipItem(slot: keyof EquippedItems) {
    if (!selectedItem) return
    const apBonus = getGradeApBonus(selectedGradeId)
    const effectiveStat: ItemStat = {
      ...selectedItem.baseStats,
      ...(selectedItem.baseStats.attackPower != null
        ? { attackPower: selectedItem.baseStats.attackPower + apBonus }
        : {}),
    }
    dispatch({
      type: 'EQUIP_ITEM',
      payload: { slot, item: { itemStat: effectiveStat } },
    })
  }

  function handleEquipRight() {
    equipItem('rightHand')
  }

  function handleEquipLeft() {
    equipItem('leftHand')
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
      slot = 'tattoo'
    } else {
      slot = 'armor'
    }

    equipItem(slot)
  }

  // ─── Equipped items listesi ─────────────────────────────────────────────────

  const equippedSlots = (Object.keys(state.equipped) as (keyof EquippedItems)[]).filter(
    (slot) => state.equipped[slot] !== null,
  )

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <fieldset className="border border-white/[0.10] rounded-sm p-4 space-y-4">
      <legend className="px-2 text-xs font-semibold text-white/50 uppercase tracking-widest">
        Items &amp; Equipment
      </legend>

      {/* ── A. Item Seçimi ── */}
      <div className="space-y-3">
        {/* Kategori */}
        <div className="space-y-1">
          <label className="block text-xs text-white/50 uppercase tracking-wider">Category</label>
          <select value={selectedCategoryId} onChange={handleCategoryChange} className={SELECT_CLASS}>
            <option value="" className="bg-neutral-900">
              — Select Category —
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-neutral-900">
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Item */}
        {selectedCategoryId && (
          <div className="space-y-1">
            <label className="block text-xs text-white/50 uppercase tracking-wider">Item</label>
            <select value={selectedItemId} onChange={handleItemChange} className={SELECT_CLASS}>
              <option value="" className="bg-neutral-900">
                — Select Item —
              </option>
              {itemsInCategory.map((item) => (
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
            <select value={selectedGradeId} onChange={handleGradeChange} className={SELECT_CLASS}>
              {grades.map((g) => (
                <option key={g.id} value={g.id} className="bg-neutral-900">
                  {g.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ── B. Item Stat Gösterimi ── */}
      {selectedItem && (
        <fieldset className="border border-white/[0.07] rounded-sm p-3 space-y-2">
          <legend className="px-1.5 text-xs text-white/40 uppercase tracking-wider">
            Item Stats
          </legend>

          {/* Item adı */}
          <p
            className={`text-sm font-medium ${
              meetsLevelRequirement(selectedItem, state.level)
                ? 'text-white/90'
                : 'text-red-400'
            }`}
          >
            {buildItemDisplayName(selectedItem, selectedGradeId)}
          </p>

          {/* Stat listesi */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
            {STAT_LABELS.map(({ key, label }) => {
              let val = selectedItem.baseStats[key]
              // Grade AP bonusu ekle
              if (key === 'attackPower' && val != null && selectedGradeId > 0) {
                val = (val as number) + getGradeApBonus(selectedGradeId)
              }
              if (val == null) return null
              return (
                <div key={key} className="text-xs text-white/60">
                  {label}:{' '}
                  <span className="text-white/90">{val}</span>
                </div>
              )
            })}
          </div>
        </fieldset>
      )}

      {/* ── C. Equip Butonları ── */}
      {selectedItem && (
        <div className="space-y-2">
          {/* Pathos slot seçimi */}
          {selectedCategoryId === 'pathos' && (
            <div className="space-y-1">
              <label className="block text-xs text-white/50 uppercase tracking-wider">
                Pathos Slot
              </label>
              <select
                value={pathosSlot}
                onChange={(e) => setPathosSlot(e.target.value as 'leftPathos' | 'rightPathos')}
                className={SELECT_CLASS}
              >
                <option value="leftPathos" className="bg-neutral-900">
                  Left Pathos
                </option>
                <option value="rightPathos" className="bg-neutral-900">
                  Right Pathos
                </option>
              </select>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {selectedItem.canEquipRight && (
              <button
                onClick={handleEquipRight}
                className="px-3 py-1.5 text-xs font-medium bg-purple-600/70 hover:bg-purple-600 border border-purple-500/50 rounded-sm text-white transition-colors"
              >
                Equip Right
              </button>
            )}
            {selectedItem.canEquipLeft && (
              <button
                onClick={handleEquipLeft}
                className="px-3 py-1.5 text-xs font-medium bg-blue-600/70 hover:bg-blue-600 border border-blue-500/50 rounded-sm text-white transition-colors"
              >
                Equip Left
              </button>
            )}
            {selectedItem.canEquipNormal && (
              <button
                onClick={handleEquipNormal}
                className="px-3 py-1.5 text-xs font-medium bg-emerald-600/70 hover:bg-emerald-600 border border-emerald-500/50 rounded-sm text-white transition-colors"
              >
                Equip
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── D. Mevcut Ekipman Listesi ── */}
      {equippedSlots.length > 0 && (
        <fieldset className="border border-white/[0.07] rounded-sm p-3 space-y-1.5">
          <legend className="px-1.5 text-xs text-white/40 uppercase tracking-wider">
            Equipped
          </legend>
          {equippedSlots.map((slot) => {
            const equippedItem = state.equipped[slot]
            if (!equippedItem) return null

            // AP değerinden item adını geri bul (opsiyonel, en iyi eşleşme)
            const ap = equippedItem.itemStat.attackPower
            const def = equippedItem.itemStat.defense
            const matchedItem = ITEM_LIST.find((it) => {
              const base = it.baseStats
              if (ap != null && base.attackPower != null) {
                return Math.abs((ap) - base.attackPower) <= 27 // max +9*3
              }
              if (def != null && base.defense != null) {
                return base.defense === def
              }
              return false
            })
            const displayName = matchedItem ? matchedItem.name : SLOT_LABELS[slot]

            return (
              <div key={slot} className="flex items-center justify-between gap-2">
                <span className="text-xs text-white/60">
                  <span className="text-white/40">{SLOT_LABELS[slot]}:</span>{' '}
                  <span className="text-white/80">{displayName}</span>
                </span>
                <button
                  onClick={() => dispatch({ type: 'UNEQUIP_ITEM', payload: { slot } })}
                  className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-xs bg-red-600/50 hover:bg-red-600 border border-red-500/40 rounded-sm text-white transition-colors"
                  title={`Unequip ${SLOT_LABELS[slot]}`}
                >
                  ×
                </button>
              </div>
            )
          })}
        </fieldset>
      )}
    </fieldset>
  )
}
