/**
 * Knight Online — Karakter Sınıfları
 * Tüm sınıf bilgileri, SEO verisi ve entity ilişkileri
 */

import type { KOClass } from '@/lib/types'

export interface ClassData {
  slug: KOClass
  name: string
  nameEn: string
  shortName: string
  race: 'human' | 'karus' | 'both'
  primaryStat: string
  secondaryStat: string
  role: string[]
  description: string
  excerpt: string
  playstyle: string
  difficulty: 'basit' | 'orta' | 'ileri'
  /** Alias'lar — farklı yazım varyasyonları */
  aliases: string[]
  /** SEO: bu sınıf için en sık aranan long-tail sorgular */
  keyQuestions: string[]
  /** İlgili build slug'ları */
  relatedBuilds: string[]
  /** Guide slug'u */
  guideSlug: string
  /** Renk kodu (UI için) */
  color: string
  icon: string
}

export const KO_CLASSES: ClassData[] = [
  {
    slug: 'rogue',
    name: 'Asas',
    nameEn: 'Rogue / Assassin',
    shortName: 'Asas',
    race: 'both',
    primaryStat: 'STR',
    secondaryStat: 'DEX',
    role: ['DPS', 'PK', 'Farm'],
    difficulty: 'orta',
    description:
      'Asas (Rogue), Knight Online\'ın en popüler ve en fazla tercih edilen DPS sınıfıdır. Yüksek tek vuruş hasarı, hız ve combo odaklı oynanışıyla öne çıkar. STR ve DEX dengesi doğru ayarlandığında hem PK hem farm konusunda son derece etkili olur.',
    excerpt:
      'Knight Online asas; yüksek DPS, hızlı combo ve güçlü PK kabiliyetiyle en popüler sınıflardan biridir.',
    playstyle:
      'Kombo sırasına dikkat ederek düşmanı hızla etkisiz kılmak esastır. CS (Crit Strike), Mortal Blow ve Stun kombinasyonlarını doğru kullanmak başarının anahtarıdır.',
    aliases: [
      'asas', 'assassin', 'rogue', 'ko asas', 'knight asas',
      'ko assassin', 'knight online asas', 'rogue build',
    ],
    keyQuestions: [
      'Knight Online asas nasıl oynanır?',
      'Asas stat dağılımı nasıl olmalı?',
      'Asas combo sırası nedir?',
      'Asas hangi itemleri kullanmalı?',
      'En iyi asas build nedir?',
      'Asas PK taktikleri nelerdir?',
      'Asas STR mi DEX mi daha iyi?',
      'Knight Online asas skill dizilimi nedir?',
    ],
    relatedBuilds: ['asas-str-pvp', 'asas-dex-farm', 'asas-hybrid'],
    guideSlug: 'asas',
    color: '#3b82f6',
    icon: '🗡️',
  },
  {
    slug: 'archer',
    name: 'Okçu',
    nameEn: 'Archer',
    shortName: 'Okçu',
    race: 'both',
    primaryStat: 'DEX',
    secondaryStat: 'STR',
    role: ['DPS', 'PK', 'PvP'],
    difficulty: 'orta',
    description:
      'Okçu (Archer), uzun menzilli saldırılar ve yüksek kritik vuruş oranıyla tanınan bir DPS sınıfıdır. DEX ağırlıklı stat dağılımı sayesinde yüksek kritik hasar verir. Diğer sınıflara göre daha güvenli mesafeden savaşabilmesi avantajdır.',
    excerpt:
      'Knight Online okçu; uzun menzil, yüksek kritik ve güvenli mesafeden saldırı kabiliyetiyle güçlü bir DPS sınıfıdır.',
    playstyle:
      'Mesafe yönetimi ve doğru skill sırası kritik önem taşır. Rapid Fire ve piercing okları kombine ederek yüksek hasar çıkarılır.',
    aliases: [
      'okçu', 'okcu', 'archer', 'ko okçu', 'ko archer',
      'knight okçu', 'knight online okçu', 'archer build',
    ],
    keyQuestions: [
      'Knight Online okçu nasıl oynanır?',
      'Okçu stat dağılımı nasıl olmalı?',
      'Okçu combo sırası nedir?',
      'Okçu hangi ok kullanmalı?',
      'En iyi okçu build nedir?',
      'Okçu PK taktikleri nelerdir?',
      'Knight Online okçu skill dizilimi nedir?',
      'Okçu farm rotası nerede?',
    ],
    relatedBuilds: ['okcu-dex-pvp', 'okcu-str-hybrid', 'okcu-farm'],
    guideSlug: 'okcu',
    color: '#f59e0b',
    icon: '🏹',
  },
  {
    slug: 'warrior',
    name: 'Warrior',
    nameEn: 'Warrior',
    shortName: 'Warrior',
    race: 'both',
    primaryStat: 'STR',
    secondaryStat: 'HP',
    role: ['Tank', 'DPS', 'PvP', 'WS'],
    difficulty: 'basit',
    description:
      'Warrior, Knight Online\'ın en sağlam ve dayanıklı sınıfıdır. Yüksek HP ve savunma değerleriyle öne çıkar. Tank ve DPS olmak üzere iki farklı oynanış biçimi mevcuttur. War Score (WS) modunda vazgeçilmez bir sınıftır.',
    excerpt:
      'Knight Online warrior; yüksek HP, güçlü savunma ve Tank/DPS oynanışıyla WS\'nin olmazsa olmazıdır.',
    playstyle:
      'STR/HP dengesi ile maksimum dayanıklılık sağlanır. Charge ve Stun kombinasyonları rakipleri etkisiz kılar.',
    aliases: [
      'warrior', 'ko warrior', 'knight warrior', 'knight online warrior',
      'tank', 'savaşçı', 'warrior build',
    ],
    keyQuestions: [
      'Knight Online warrior nasıl oynanır?',
      'Warrior stat dağılımı nasıl olmalı?',
      'Tank warrior build nedir?',
      'DPS warrior build nedir?',
      'Warrior hangi itemleri kullanmalı?',
      'Warrior WS\'de nasıl oynanır?',
      'Knight Online warrior skill dizilimi nedir?',
    ],
    relatedBuilds: ['warrior-tank-ws', 'warrior-dps-pvp', 'warrior-farm'],
    guideSlug: 'warrior',
    color: '#ef4444',
    icon: '⚔️',
  },
  {
    slug: 'mage',
    name: 'Mage',
    nameEn: 'Mage',
    shortName: 'Mage',
    race: 'both',
    primaryStat: 'INT',
    secondaryStat: 'MP',
    role: ['AOE DPS', 'PvP', 'PvE'],
    difficulty: 'orta',
    description:
      'Mage, INT bazlı büyü hasarı veren en güçlü AOE (Alan Etkili) sınıftır. Kalabalık düşman gruplarına karşı son derece etkilidir. AOE Mage ve Single-Target Mage olmak üzere iki farklı build seçeneği bulunur.',
    excerpt:
      'Knight Online mage; INT bazlı büyü gücü ve güçlü AOE saldırılarıyla PvE\'nin en etkili sınıfıdır.',
    playstyle:
      'INT\'e yüksek yatırım yapılır. Nova Strike ve Chain Lightning gibi AOE skilllar kalabalık düşmanlara karşı kullanılır.',
    aliases: [
      'mage', 'ko mage', 'knight mage', 'knight online mage',
      'büyücü', 'sihirbaz', 'aoe mage', 'int build', 'mage build',
    ],
    keyQuestions: [
      'Knight Online mage nasıl oynanır?',
      'Mage stat dağılımı nasıl olmalı?',
      'AOE mage build nedir?',
      'Mage hangi skillları kullanmalı?',
      'Mage PK nasıl yapılır?',
      'Knight Online mage skill dizilimi nedir?',
      'Mage farm nasıl yapılır?',
    ],
    relatedBuilds: ['mage-aoe-pve', 'mage-int-pvp', 'mage-farm'],
    guideSlug: 'mage',
    color: '#8b5cf6',
    icon: '🔮',
  },
  {
    slug: 'priest',
    name: 'Priest',
    nameEn: 'Priest',
    shortName: 'Priest',
    race: 'both',
    primaryStat: 'INT',
    secondaryStat: 'HP',
    role: ['Healer', 'Support', 'Buff'],
    difficulty: 'basit',
    description:
      'Priest, grubun iyileştiricisi ve tampon (buff) kaynağıdır. Heal Priest ve Attack Priest olmak üzere iki farklı oynanış biçimi mevcuttur. Gruplarda vazgeçilmez bir rol üstlenen Priest, düngeon ve boss runlarının en kritik sınıfıdır.',
    excerpt:
      'Knight Online priest; heal ve buff kabiliyetiyle grupların vazgeçilmezi, dungeon run\'larının olmazsa olmazıdır.',
    playstyle:
      'HP yönetimi ve grup heal önceliklidir. Buff sırası ve mana yönetimi kritik önem taşır.',
    aliases: [
      'priest', 'ko priest', 'knight priest', 'knight online priest',
      'rahip', 'heal', 'heal priest', 'attack priest', 'buf', 'buff',
    ],
    keyQuestions: [
      'Knight Online priest nasıl oynanır?',
      'Heal priest mi attack priest mi daha iyi?',
      'Priest stat dağılımı nasıl olmalı?',
      'Priest hangi itemleri kullanmalı?',
      'Priest buff sırası nedir?',
      'Knight Online priest skill dizilimi nedir?',
      'Priest dungeon\'da nasıl oynanır?',
    ],
    relatedBuilds: ['priest-heal-support', 'priest-attack-pvp', 'priest-farm'],
    guideSlug: 'priest',
    color: '#10b981',
    icon: '✨',
  },
  {
    slug: 'battle-priest',
    name: 'Battle Priest',
    nameEn: 'Battle Priest',
    shortName: 'BP',
    race: 'both',
    primaryStat: 'STR',
    secondaryStat: 'INT',
    role: ['Melee DPS', 'Support', 'PvP'],
    difficulty: 'ileri',
    description:
      'Battle Priest (BP), yakın dövüş hasar ve heal kabiliyetini bir arada sunan hibrit bir sınıftır. Doğru oynanışı zor ancak ödüllendiricidir. STR/INT dengesi sağlandığında hem hasar verir hem de grubunu ayakta tutar.',
    excerpt:
      'Knight Online Battle Priest; yakın dövüş hasarı ile heal kabiliyetini birleştiren, ustalar için tasarlanmış hibrit sınıf.',
    playstyle:
      'STR ile melee hasar, INT ile heal gücü dengelenir. Mana yönetimi çok kritiktir.',
    aliases: [
      'battle priest', 'bp', 'ko bp', 'battle priest build',
      'knight online battle priest', 'bp rehber',
    ],
    keyQuestions: [
      'Knight Online Battle Priest nasıl oynanır?',
      'Battle Priest stat dağılımı nasıl olmalı?',
      'BP build nedir?',
      'Battle Priest hangi skillları kullanmalı?',
      'BP PvP taktikleri nelerdir?',
    ],
    relatedBuilds: ['battle-priest-hybrid', 'battle-priest-str'],
    guideSlug: 'battle-priest',
    color: '#f97316',
    icon: '⚡',
  },
]

/** Slug'a göre sınıf verisini döndürür */
export function getClassBySlug(slug: string): ClassData | undefined {
  return KO_CLASSES.find((c) => c.slug === slug || c.guideSlug === slug)
}

/** Türkçe isim veya alias'a göre sınıf verisini döndürür */
export function getClassByAlias(alias: string): ClassData | undefined {
  const lower = alias.toLowerCase()
  return KO_CLASSES.find(
    (c) => c.aliases.some((a) => a.toLowerCase() === lower) || c.name.toLowerCase() === lower
  )
}

/** Tüm sınıf slug'larını döndürür (generateStaticParams için) */
export function getAllClassSlugs(): string[] {
  return KO_CLASSES.map((c) => c.guideSlug)
}
