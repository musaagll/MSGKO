# Design Document — Advanced Calculator

## Overview

Knight Online Advanced Calculator, MSGKO Next.js sitesine `/hesap-makinesi` route'u altında entegre edilecek tam client-side hesaplama aracıdır. Tüm hesaplama mantığı pure TypeScript fonksiyonlarında yaşar; item veritabanı dışında hiçbir backend çağrısı gerekmez. Proje mevcut Tailwind CSS koyu temasına (mor/pembe aksanlar, `#07070B` arka plan) uyumlu biçimde tasarlanmıştır.

---

## Architecture

```
app/
  hesap-makinesi/
    page.tsx                  ← Server Component (metadata + layout)
    loading.tsx               ← Suspense fallback

components/
  calculator/
    AdvancedCalculator.tsx    ← Ana Client Component ('use client')
    ClassLevelPanel.tsx       ← Sınıf ve seviye seçimi
    StatPanel.tsx             ← Stat noktası dağıtımı
    ItemPanel.tsx             ← Item/ekipman seçimi ve gösterimi
    BuffPanel.tsx             ← Buff/debuff toggle'ları
    SetBonusPanel.tsx         ← Set bonus seçimi
    ResultPanel.tsx           ← AP/AC/HP/MP/FR/IR/LR sonuç gösterimi

lib/
  calculator/
    types.ts                  ← Tüm Calculator-specific TypeScript tipleri
    coefficients.ts           ← Sınıf katsayı lookup tabloları
    formulas.ts               ← Pure hesaplama fonksiyonları
    achievements.ts           ← Achievement statik veri
    sets.ts                   ← Set bonus statik veri
    items.ts                  ← Statik item verisi (temel silahlar/zırhlar)
    reducer.ts                ← useReducer state yönetimi

app/
  api/
    calculator/
      items/
        route.ts              ← (Opsiyonel) Supabase'den dinamik item verisi
```

---

## Data Models

### CalculatorState (reducer.ts)

```typescript
interface CalculatorState {
  // Sınıf & Seviye
  characterClass: CharacterClass        // 'Warrior' | 'Rogue' | 'Priest' | 'Mage' | 'Kurian'
  rogueSubClass: 'Assassin' | 'Archer'  // Rogue için alt sınıf
  levelId: number                       // 1-98 (83/15 için id:98)
  level: number                         // Gerçek level (83'te cap)
  rebirthLevel: number                  // 0-15

  // Stat Noktaları
  statPoints: StatPoints                // { str, dex, hp, mp, int }
  rebirthStatPoints: StatPoints         // Rebirth'e özgü stat noktaları
  bonusStatPoints: StatPoints           // Buff'lardan gelen bonus (sadece gösterim)
  totalPoints: number                   // Kullanılabilir toplam stat puanı
  usedPoints: number                    // Kullanılan stat puanı
  totalRebirthPoints: number
  usedRebirthPoints: number

  // Ekipman
  equipped: EquippedItems               // { rightHand, leftHand, armor, accessory, ... }
  itemStat: ItemStat | null             // Seçili item'ın istatistikleri (gösterim için)

  // Buff'lar
  buffs: BuffState                      // Her buff için boolean/string değeri

  // Set Bonus
  setBonusKrowaz: SetBonus
  setBonusMithril: SetBonus
  setBonusSecret: SetBonus
  setBonusHolyKnight: SetBonus
  setBonusRosetta: SetBonus
  setBonusKrowazKurian: SetBonus
  setBonusHolyKnightKurian: SetBonus

  // Achievement
  achievement: AchievementBonus         // { ap, ac, str, dex, hp, mp, int, flameres, iceres, lightingres }

  // Pasif Skill'ler
  warriorDefenseSkill: number           // 0-6 (id değeri)
  warriorResistSkill: number            // 0-3
  kurianDefenseSkill: number            // 0-6
  kurianResistSkill: number             // 0-3
  priestWeaponType: string              // 'Sword' | 'Club - 1H' | 'Club - 2H'
}
```

### CharacterClass

```typescript
type CharacterClass = 'Warrior' | 'Rogue' | 'Priest' | 'Mage' | 'Kurian'
```

### StatPoints

```typescript
interface StatPoints {
  str: number
  dex: number
  hp: number   // health/magicpower
  mp: number
  int: number
}
```

### EquippedItems

```typescript
interface EquippedItems {
  rightHand: EquippedItem | null
  leftHand: EquippedItem | null
  armor: EquippedItem | null
  accessory: EquippedItem | null
  leftPathos: EquippedItem | null
  rightPathos: EquippedItem | null
  tattoo: EquippedItem | null
  wings: EquippedItem | null
  emblem: EquippedItem | null
}

interface EquippedItem {
  itemStat: ItemStat
}
```

### ItemStat

```typescript
interface ItemStat {
  attackPower?: number
  attackSpeed?: number
  effectiveRange?: number
  weight?: number
  durability?: number
  defense?: number
  poisonDamage?: number
  glacierDamage?: number
  flameDamage?: number
  lightingDamage?: number
  damagePercentage?: number
  defensePercentage?: number
  damageAgainstClass?: boolean
  bonusHealth?: number
  bonusStrength?: number
  bonusDexterity?: number
  bonusMagicPower?: number
  bonusIntelligence?: number
  bonusHp?: number
  bonusMp?: number
  resistanceFlame?: number
  resistanceGlacier?: number
  resistanceLighting?: number
  resistancePoison?: number
  resistanceDark?: number
  resistanceMagic?: number
  requiredLevel?: number
  requiredStr?: number
  requiredDex?: number
  requiredMagicPower?: number
  requiredInt?: number
  requiredHealth?: number
  canChangeStatBonus?: boolean
  canChangeShieldBonus?: boolean
  canChangeRecovery?: boolean
}
```

### BuffState

```typescript
interface BuffState {
  // Stat Scroll'ları
  strScroll: boolean           // +15 STR
  dexScroll: boolean           // +15 DEX
  hpScroll: boolean            // +15 HP
  mpScroll: boolean            // +15 MP
  intScroll: boolean           // +15 INT
  lionScroll: boolean          // +10 all stats

  // AP Buff'ları
  wolf: boolean                // +20% AP
  apScroll: boolean            // +22% AP
  redPotion: boolean           // +10% AP
  weaponEnchant: boolean       // +5 weapon AP, +1 AP
  berserker: boolean           // +20% AP (Warrior only)
  commanderDetermination: boolean // +30% AP

  // AC Buff'ları
  bluePotion: boolean          // +60 AC
  armorEnchant: boolean        // AC bonus
  frozenArmor: boolean         // +60 AC
  frozenShell: boolean         // +120 AC
  iceBarrier: boolean          // +180 AC
  acBuff: number               // 1=OFF, 2=200, 3=300, 4=350, 5=380
  gemDefense: boolean          // AC bonus
  magicShield: boolean         // Mage

  // HP Buff'ları
  hpBuff: number               // 1=OFF, 2=1500, 3=2000, 4=60%, 5=2200
  spellOfLife: boolean         // HP buff
  gemLife: boolean             // HP bonus

  // Sınıfa Özgü Buff'lar
  battleCry: boolean           // +15 all stats (Warrior buff)
  priestBook: boolean          // +50% AP
  priestLimitedBook: boolean   // +55% AP
  priestStr: boolean           // +30 STR (Priest only)

  // Mage Immunity
  mageFR: boolean              // +80 FR
  mageIR: boolean              // +80 IR
  mageLR: boolean              // +80 LR
  mageFrozenArmor: boolean     // AC (Mage)
  mageFrozenShell: boolean     // AC (Mage)
  mageIceBarrier: boolean      // AC (Mage)

  // Debuff'lar
  malice: boolean
  torment: boolean
  parasite: boolean
  superParasite: boolean
  confusion: boolean           // -30 MP
  massive: boolean             // -20% AP
  subside: boolean             // -20% AP

  // Pet Buff'lar
  petHp: boolean               // +200 HP
  petAc: boolean               // +20 AC
  petAp: boolean               // +5 AP
}
```

### SetBonus

```typescript
interface SetBonus {
  str: number
  dex: number
  hp: number
  mp: number
  int: number
  ac: number
  flameres: number
  iceres: number
  lightingres: number
  ap: number
}
```

### AchievementBonus

```typescript
interface AchievementBonus {
  ap: number
  ac: number
  str: number
  dex: number
  hp: number
  mp: number
  int: number
  flameres: number
  iceres: number
  lightingres: number
}
```

### CalculatorResult

```typescript
interface CalculatorResult {
  ap: number
  ac: number
  hp: number
  mp: number
  fr: number    // flame resistance
  ir: number    // ice resistance
  lr: number    // lighting resistance
  freeStatPoints: number
  freeRebirthPoints: number
}
```

---

## Components

### AdvancedCalculator.tsx

Ana koordinatör component. `useReducer` ile tüm state'i yönetir, her değişiklikte `recalculate()` çağırır, sonucu `CalculatorResult` olarak tutar.

```
AdvancedCalculator
├── ClassLevelPanel      (sınıf + seviye seçimi, stat noktası gösterimi)
├── StatPanel            (STR/DEX/HP/MP/INT input'ları)
├── ItemPanel            (kategori → item → grade dropdown + item stat gösterimi)
├── BuffPanel            (buff/debuff toggle'ları, açılır panel)
├── SetBonusPanel        (set seçimi dropdown'ları)
└── ResultPanel          (AP/AC/HP/MP/FR/IR/LR sonuç kartları)
```

### ClassLevelPanel.tsx

- Sınıf seçimi: `<select>` → Warrior, Rogue (Assassin), Rogue (Archer), Priest, Mage, Kurian
- Seviye seçimi: 1–83 + 83/1–83/15 listesi
- Kalan serbest stat puanı gösterimi: `{freePoints} points`
- Sınıf değişince ilgili buff paneli ve pasif skill dropdown'ları gösterilir/gizlenir

### StatPanel.tsx

- 5 adet `<input type="number">` — STR, DEX, HP, MP, INT
- Her input'un altında buff bonus gösterimi (örn. `+15 (Scroll)`)
- Toplam kullanılan / toplam limit progress bar
- Rebirth stat noktaları ayrı bölümde

### ItemPanel.tsx

- Kategori dropdown → Item dropdown → Normal/Reverse/Rare → Grade/Level dropdown
- Seçili item'ın stat kartı (AP, AC, bonus statlar, gereksinimler)
- Equip butonları: Equip Right, Equip Left, Equip (normal)
- Set item algılandığında "Equip Set" butonu

### BuffPanel.tsx

- `<details>` / toggle ile açılır kapanır panel
- Sol kolon: Buff'lar (scroll'lar, potions, wolf, enchants, sınıfa özgü)
- Sağ kolon: Debuff'lar + Pet buff'ları
- Her toggle `<input type="checkbox">` — disabled state mantığı reducer'da yönetilir

### SetBonusPanel.tsx

- Her set için ayrı dropdown: Krowaz (0-5 parça), Mithril, Secret, HolyKnight, Rosetta
- Kurian için ayrı Krowaz Kurian / HolyKnight Kurian dropdown'ları
- Seçim değişince dispatch → recalculate

### ResultPanel.tsx

- Büyük AP değeri kartı (ana sonuç)
- AC, HP, MP yan yana
- FR, IR, LR yan yana
- Tüm değerler anlık güncellenir

---

## Formulas (lib/calculator/formulas.ts)

### calculateAP()

```typescript
function calculateAP(state: CalculatorState): number {
  const { characterClass, buffs, equipped, statPoints, bonusStatPoints } = state
  const level = Math.min(state.level, 83)
  
  // Tier belirleme (katsayı için)
  let tier = 0
  if (level >= 10) tier++
  if (level >= 60) tier++

  // Bonus multiplier hesabı
  let bonusPercent = 0
  // Massive/Subside debuff varsa diğerleri işlenmez
  if (buffs.massive || buffs.subside) {
    bonusPercent -= 20
  } else {
    if (buffs.wolf) bonusPercent += 20
    if (buffs.commanderDetermination) bonusPercent += 30
    if (buffs.apScroll) bonusPercent += 22
  }
  if (buffs.redPotion) bonusPercent += 10
  // ... Pathos/Tattoo/Wings/Emblem damagePercentage toplamı
  
  const bonusMultiplier = (bonusPercent + 100) / 100

  switch (characterClass) {
    case 'Warrior': return calculateWarriorAP(state, tier, bonusMultiplier)
    case 'Rogue':   return calculateRogueAP(state, tier, bonusMultiplier)
    case 'Priest':  return calculatePriestAP(state, tier, bonusMultiplier)
    case 'Mage':    return calculateMageAP(state, tier, bonusMultiplier)
    case 'Kurian':  return calculateKurianAP(state, tier, bonusMultiplier)
  }
}
```

### calculateWarriorAP()

```typescript
function calculateWarriorAP(state, tier, bonusMultiplier): number {
  const rightHandAP = state.equipped.rightHand?.itemStat.attackPower ?? 0
  const leftHandAP  = state.equipped.leftHand?.itemStat.attackPower ?? 0
  const level = Math.min(state.level, 83)
  const str = state.statPoints.str
  const totalStr = str + getTotalBonusStr(state)
  
  // Extra STR (str > 150 bonus)
  let extra = 0
  if (str > 150) extra = str - 150
  if (str === 160) extra--
  
  const coeff = getWarriorCoefficients(tier, 'axe')
  let weaponAP = rightHandAP
  if (state.buffs.weaponEnchant) weaponAP += 5
  weaponAP += Math.floor(leftHandAP * 0.5)
  if (weaponAP < 3) weaponAP = 3
  
  let ap = Math.floor(
    Math.floor(0.005 * weaponAP * (totalStr + 40) + coeff * weaponAP * level * totalStr + 3)
    * bonusMultiplier
  ) + extra
  
  if (state.buffs.weaponEnchant) ap += 1
  if (state.buffs.berserker) {
    // Berserker ayrıca uygulanır (zaten bonusPercent'e eklendi)
  }
  if (state.buffs.petAp) ap += 5
  
  return ap + state.achievement.ap
}
```

### Coefficients (lib/calculator/coefficients.ts)

Kobugda.com kaynak kodundan elde edilen katsayılar — tier 0 (level<10), tier 1 (level 10-59), tier 2 (level 60+):

```typescript
export const COEFFICIENTS = {
  warrior: {
    axe:   [0.00070, 0.00080, 0.00090],
  },
  rogue: {
    dagger: [0.00065, 0.00075, 0.00085],
    bow:    [0.00065, 0.00075, 0.00085],
  },
  priest: {
    sword:  [0.00060, 0.00070, 0.00080],
    club:   [0.00060, 0.00070, 0.00080],
  },
  mage: {
    staff:  [0.00060, 0.00070, 0.00080],
  },
  kurian: {
    sword:  [0.00070, 0.00080, 0.00090],
  },
}
// NOT: Gerçek katsayılar site kaynak kodundan doğrulanacak
```

### calculateAC()

```typescript
function calculateAC(state: CalculatorState): number {
  let ac = 0
  ac += state.equipped.armor?.itemStat.defense ?? 0
  
  // Buff bonusları
  if (state.buffs.bluePotion) ac += 60
  if (state.buffs.armorEnchant) ac += ARMOR_ENCHANT_BONUS
  if (state.buffs.frozenArmor) ac += 60
  else if (state.buffs.frozenShell) ac += 120
  else if (state.buffs.iceBarrier) ac += 180
  
  const acBuffValues = { 1: 0, 2: 200, 3: 300, 4: 350, 5: 380 }
  ac += acBuffValues[state.buffs.acBuff] ?? 0
  
  if (state.buffs.petAc) ac += 20
  
  // Set bonus
  ac += getAllSetBonuses(state).ac
  ac += state.achievement.ac
  
  // Warrior pasif skill
  if (state.characterClass === 'Warrior' && state.warriorDefenseSkill > 0) {
    const skillPercent = WARRIOR_DEFENSE_SKILLS[state.warriorDefenseSkill]
    ac = Math.floor(ac * (1 + skillPercent / 100))
  }
  
  return ac
}
```

---

## Reducer (lib/calculator/reducer.ts)

```typescript
type Action =
  | { type: 'SET_CLASS'; payload: CharacterClass }
  | { type: 'SET_LEVEL'; payload: number }
  | { type: 'SET_STAT'; payload: { stat: keyof StatPoints; value: number } }
  | { type: 'TOGGLE_BUFF'; payload: keyof BuffState }
  | { type: 'SET_BUFF_VALUE'; payload: { buff: keyof BuffState; value: number } }
  | { type: 'EQUIP_ITEM'; payload: { slot: keyof EquippedItems; item: EquippedItem } }
  | { type: 'SET_ACHIEVEMENT'; payload: AchievementBonus }
  | { type: 'SET_WARRIOR_DEFENSE_SKILL'; payload: number }
  | { type: 'SET_WARRIOR_RESIST_SKILL'; payload: number }
  | { type: 'SET_KURIAN_DEFENSE_SKILL'; payload: number }
  | { type: 'SET_KURIAN_RESIST_SKILL'; payload: number }
  | { type: 'SET_SET_BONUS'; payload: { set: string; pieces: number } }
```

Reducer her action'da:
1. State'i günceller
2. Buff conflict kurallarını uygular (wolf ↔ priestBook ↔ apScroll vb.)
3. Yeni state'i döner — hesaplama ayrıca `useMemo` ile çalışır

---

## Routing & Navbar Integration

### app/hesap-makinesi/page.tsx

```typescript
import { Metadata } from 'next'
import { AdvancedCalculator } from '@/components/calculator/AdvancedCalculator'

export const metadata: Metadata = {
  title: 'Hesap Makinesi',
  description: 'Knight Online karakter stat hesaplama aracı — AP, AC, HP, MP, direniş değerlerini anlık hesapla.',
}

export default function HesapMakinesiPage() {
  return (
    <main className="min-h-screen pt-20 px-4 pb-10">
      <AdvancedCalculator />
    </main>
  )
}
```

### Navbar değişikliği (lib/data.ts)

`NAV_ITEMS` dizisine ekleme:

```typescript
export const NAV_ITEMS: NavItem[] = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Hesap Makinesi', href: '/hesap-makinesi' },
]
```

Navbar'daki mevcut `Link` map'i zaten `isActive` kontrolü yapıyor — route `/hesap-makinesi` olduğunda otomatik vurgulanır, `layoutId="nav-indicator"` animasyonu çalışır.

---

## Static Data Files

### lib/calculator/achievements.ts

```typescript
export interface Achievement {
  id: string
  name: string
  bonusObj?: Partial<AchievementBonus>
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: '1', name: 'Master of Chaos', bonusObj: { ap: 3 } },
  { id: '2', name: 'War Commander',   bonusObj: { ap: 5 } },
  // ... tüm achievement listesi kobugda.com achievementsdata dosyasından derlenir
]
```

### lib/calculator/sets.ts

```typescript
// Her set, 1-5 parça için bonus nesnesi döner
export const WARRIOR_KROWAZ: SetBonus[] = [
  { str: 0, dex: 0, hp: 0, mp: 0, int: 0, ac: 0, flameres: 0, iceres: 0, lightingres: 0, ap: 0 },  // 0 parça
  { str: 5, ... },  // 1 parça
  // ...
]
export const ROGUE_KROWAZ: SetBonus[] = [ ... ]
export const PRIEST_KROWAZ: SetBonus[] = [ ... ]
// ... vb.
```

---

## Visual Design

Mevcut sitenin koyu temasına uygun layout:

```
┌─────────────────────────────────────────────────────────────┐
│  NAVBAR (mevcut)                                            │
├─────────────────────────────────────────────────────────────┤
│  [Sınıf ve Seviye]    [Stat Noktaları]                     │
│  Class dropdown       STR: [___]  DEX: [___]               │
│  Level dropdown       HP:  [___]  MP:  [___]               │
│                       INT: [___]  Kalan: XX pts             │
│                                                             │
│  [Item Seçimi]                                             │
│  Kategori > Item > Normal/Rev > Grade                      │
│  ┌──────────────────────────────┐                          │
│  │ Item Stat Gösterimi          │                          │
│  │ Krowaz Portu Gauntlets(+4)   │                          │
│  │ Defense: 83  STR Bonus: 6    │                          │
│  └──────────────────────────────┘                          │
│                                                             │
│  [Buff'lar ▼]  (açılır panel)                             │
│  [Set Bonusları]                                           │
│                                                             │
│  ┌──────────┬──────┬──────┬──────┬──────┬──────┐          │
│  │   AP     │  AC  │  HP  │  MP  │  FR  │ IR/LR│          │
│  │  2,450   │  850 │ 5200 │ 2100 │  120 │  80  │          │
│  └──────────┴──────┴──────┴──────┴──────┴──────┘          │
├─────────────────────────────────────────────────────────────┤
│  FOOTER (mevcut)                                            │
└─────────────────────────────────────────────────────────────┘
```

**Renk paleti:**
- Arka plan: `bg-[#07070B]` / `bg-white/[0.03]`
- Kart border: `border-white/[0.08]`
- AP sonucu: `text-purple-400` (vurgu)
- Aktif buff toggle: `bg-purple-500/20 border-purple-500/40`
- Gereksinim karşılanmamış item: `text-red-400`
- Fieldset legend: mevcut projedeki `text-white/60` stili

---

## File Creation Order (Task Sırası)

1. `lib/calculator/types.ts` — Tüm tipler
2. `lib/calculator/coefficients.ts` — Katsayı tabloları
3. `lib/calculator/achievements.ts` — Achievement verisi
4. `lib/calculator/sets.ts` — Set bonus verisi
5. `lib/calculator/items.ts` — Temel item verisi
6. `lib/calculator/formulas.ts` — Pure hesaplama fonksiyonları
7. `lib/calculator/reducer.ts` — State reducer ve başlangıç state'i
8. `components/calculator/ResultPanel.tsx`
9. `components/calculator/ClassLevelPanel.tsx`
10. `components/calculator/StatPanel.tsx`
11. `components/calculator/ItemPanel.tsx`
12. `components/calculator/BuffPanel.tsx`
13. `components/calculator/SetBonusPanel.tsx`
14. `components/calculator/AdvancedCalculator.tsx` — Ana koordinatör
15. `app/hesap-makinesi/page.tsx` — Route
16. `lib/data.ts` güncellemesi — NAV_ITEMS'a hesap makinesi ekleme
