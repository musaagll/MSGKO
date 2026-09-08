/**
 * Knight Online — Karakter Sınıfları
 * Kaynak: korehberi.com (Knight Online resmi wiki kaynağı)
 */

export type KOClassSlug =
  | 'warrior'
  | 'rogue'
  | 'mage'
  | 'priest'

export interface SkillInfo {
  level: number | string
  name: string
  description: string
  tree?: string
}

export interface ClassData {
  slug: KOClassSlug
  guideSlug: string
  name: string
  nameEn: string
  shortName: string
  icon: string
  color: string

  /** Birincil stat */
  primaryStat: string
  /** İkincil stat */
  secondaryStat: string

  /** Mevcut ırklar */
  races: string[]

  /** Master unvanı (Human / Karus) */
  masterTitle: { human: string; karus: string }

  /** Master NPC */
  masterNPC: string

  /** Rol listesi */
  role: string[]

  /** Zorluk */
  difficulty: 'basit' | 'orta' | 'ileri'

  /** Oynanış açıklaması */
  description: string

  /** Kısa özet (listing sayfaları için) */
  excerpt: string

  /** Oynanış stili */
  playstyle: string

  /** Stat dağılımı önerileri */
  statBuilds: {
    name: string
    distribution: string
    notes: string
  }[]

  /** Skill ağaçları */
  skillTrees: {
    name: string
    skills: SkillInfo[]
  }[]

  /** Master skill gereksinimleri */
  masterRequirements: {
    items: string[]
    npcLocation: string
    notes: string
  }

  /** İleri seviye skill açma (Spell Stone Powder) */
  highSkillRequirements: {
    level70: number
    level72?: number
    level74?: number
    level75?: number
    level76?: number
    level78?: number
    level80: number
  }

  /** PvP / PvE ipuçları */
  tips: string[]

  /** Arama alias'ları */
  aliases: string[]

  /** Sık sorulan sorular */
  keyQuestions: string[]

  /** İlgili build'ler */
  relatedBuilds: string[]
}

export const KO_CLASSES: ClassData[] = [

  // ────────────────────────────────────────────────────────────────────────────
  // WARRIOR
  // ────────────────────────────────────────────────────────────────────────────
  {
    slug: 'warrior',
    guideSlug: 'warrior',
    name: 'Warrior',
    nameEn: 'Warrior',
    shortName: 'Warrior',
    icon: '⚔️',
    color: '#ef4444',
    primaryStat: 'STR (Strength)',
    secondaryStat: 'HP',
    races: ['Barbarian', 'El Morad Male', 'El Morad Female', 'Arch Tuarek'],
    masterTitle: { human: 'Blade Master', karus: 'Berserker Hero' },
    masterNPC: '[Warrior Master] Skaki — El Morad Castle / Luferson Castle',
    role: ['Tank', 'DPS', 'WS (War Score)', 'Melee'],
    difficulty: 'basit',
    description:
      `Warrior'lar, yakın dövüşteki ustalıklarıyla düşmanlarının korkulu rüyası ya da yüksek defansları ve sağlık puanlarıyla müttefiklerinin koruyucusu olabilirler. Warrior sınıfı, mevcut tüm sınıflardan ziyade savaş alanlarında savunması ve yüksek atak gücüyle nam salmıştır. Kendisi ve parti üyelerinin bonuslarını yükseltme, rakiplerinin hareketini engelleyebilmek için bacaklarını kırma ve onlarda şok etkisi yaratarak kilitleme başta olmak üzere birçok zorlayıcı becerisi bulunmaktadır.`,
    excerpt:
      'Knight Online Warrior; yüksek STR, güçlü savunma ve BDW/WS savaşlarında Tank rolüyle grubun omurgasıdır.',
    playstyle:
      `BDW'de Altar'ı kalkan ile kırın — kalkanlar hızlı saldırı hızına sahiptir. Partinizden fazla uzaklaşıp kimseyi kovalamayın; bir Rogue'u asla yakalayamazsınız. Berserker ağacına odaklanırsanız yüksek hasar, Defense ağacına odaklanırsanız maksimum dayanıklılık elde edersiniz.`,
    statBuilds: [
      {
        name: 'Berserker Warrior',
        distribution: 'Berserker: 83 — Defense: 55 — Master: 10',
        notes: 'Yüksek hasar odaklı build. BDW ve PvP için ideal.',
      },
      {
        name: 'Attacker Warrior',
        distribution: 'Attack: 80 — Defense: 55 — Master: 13',
        notes: 'Dengeli saldırı/savunma. PvE ve genel kullanım için.',
      },
    ],
    skillTrees: [
      {
        name: 'Attack',
        skills: [
          { level: 0,  name: 'Hash',           description: 'Savunma fark etmeksizin ek 30 hasar verir.' },
          { level: 5,  name: 'Hoodwink',        description: '%150 hasar verir.' },
          { level: 10, name: 'Shear',           description: 'Savunma fark etmeksizin ek 50 hasar verir.' },
          { level: 15, name: 'Pierce',          description: 'Başarısızlık şansı olmadan %100 hasar verir.' },
          { level: 20, name: 'Leg Cutting',     description: 'Düşmanın hareket hızını yavaşlatır.' },
          { level: 25, name: 'Carving',         description: '%200 hasar verir.' },
          { level: 35, name: 'Prick',           description: 'Başarısızlık şansı olmadan %150 hasar verir.' },
          { level: 45, name: 'Cleave',          description: '%250 hasar verir.' },
          { level: 55, name: 'Thrust',          description: 'Başarısızlık şansı olmadan %200 hasar verir.' },
          { level: 57, name: 'Sword Aura',      description: 'Başarısızlık şansı olmadan %200 + ek 100 hasar.' },
          { level: 60, name: 'Sword Dancing',   description: 'Başarısızlık şansı olmadan %250 + ek 150 hasar.' },
          { level: 70, name: 'Howling Sword',   description: 'Başarısızlık şansı olmadan %300 + ek 200 hasar.' },
          { level: 75, name: 'Blooding',        description: 'Başarısızlık şansı olmadan %200 + ek 150 hasar + 20 sn boyunca 1000 ek hasar.' },
          { level: 80, name: 'Hell Blade',      description: 'Başarısızlık şansı olmadan %300 + ek 350 hasar.' },
        ],
      },
      {
        name: 'Defense',
        skills: [
          { level: 5,  name: 'Hinder',         description: '[Pasif] Savunmayı %10 artırır. Kalkan yoksa etki yarıya düşer.' },
          { level: 10, name: 'Resist',         description: '[Pasif] Tüm dirençleri 30 artırır. Kalkan yoksa yarıya düşer.' },
          { level: 15, name: 'Arrest',         description: '[Pasif] Savunmayı %15 artırır. Kalkan yoksa yarıya düşer.' },
          { level: 20, name: 'Endure',         description: '[Pasif] Tüm dirençleri 60 artırır. Kalkan yoksa yarıya düşer.' },
          { level: 30, name: 'Binding',        description: 'Bir canavarın size saldırmasını sağlar.' },
          { level: 35, name: 'Bulwark',        description: '[Pasif] Savunmayı %20 artırır. Kalkan yoksa yarıya düşer.' },
          { level: 40, name: 'Immunity',       description: '[Pasif] Tüm dirençleri 90 artırır. Kalkan yoksa yarıya düşer.' },
          { level: 45, name: 'Provoke',        description: 'Belirli bir alandaki canavarları size saldırtır.' },
          { level: 50, name: 'Descent',        description: 'Seçilen parti üyesinin konumuna ışınlar.' },
          { level: 55, name: 'Evading',        description: '[Pasif] Savunmayı %25 artırır. Kalkan yoksa yarıya düşer.' },
          { level: 60, name: 'Sacrifice',      description: 'Bir parti üyesinin HP\'sini doldurmak için kendinizi feda edersiniz.' },
          { level: 70, name: 'Iron Skin',      description: '[Pasif] Savunmayı %30 artırır. Kalkan yoksa yarıya düşer.' },
          { level: 75, name: 'Wall Of Iron',   description: 'Savunmayı 10 sn boyunca 3 katına çıkarır fakat koşu hızı %50 düşer.' },
          { level: 80, name: 'Iron Body',      description: '[Pasif] Savunmayı %40 artırır. Kalkan yoksa yarıya düşer.' },
        ],
      },
      {
        name: 'Passion / Berserker',
        skills: [
          { level: 5,  name: 'Gain',           description: 'STR\'yi 15 artırır.' },
          { level: 10, name: 'Pain Killer',    description: '200 MP karşılığında 100 HP verir.' },
          { level: 20, name: 'Outrage',        description: 'Gelen hasarları 10 sn boyunca MP ile emer.' },
          { level: 25, name: 'Blade Of Hate',  description: 'Uzaktaki bir düşmana saldırı gerçekleştirir.' },
          { level: 55, name: 'Frenzy',         description: 'Gelen hasarları 20 sn boyunca MP ile emer.' },
          { level: 60, name: 'Quake',          description: 'Çevredeki tüm düşmanlara saldıran AOE kılıç yeteneği.' },
          { level: 70, name: 'Berserk Echo',   description: 'Geçici olarak saldırı hızını %40 artırır.' },
          { level: 75, name: 'Berserker',      description: '20 sn boyunca saldırı hızını %20 artırır fakat savunma 300 azalır.' },
          { level: 80, name: 'HP Booster',     description: 'Belirli bir süre boyunca oturuyormuşçasına ayaktayken HP yeniler.' },
          { level: 83, name: 'Battle Cry',     description: '30 metre menzilindeki tüm parti üyelerinin statlarını 15 artırır.' },
          { level: 83, name: 'Cry Echo',       description: 'Battle Cry ile birlikte kullanılır. Başarısızlık şansı olmadan %300 + ek 200 hasar.' },
        ],
      },
      {
        name: 'Master',
        skills: [
          { level: 0,  name: 'Boldness',            description: '[Pasif] HP %30 altındayken savunmayı %20 artırır.' },
          { level: 2,  name: 'Scream',              description: 'Başarısızlık şansı olmadan %250 + ek 150 hasar. Düşmanı geçici olarak dondurur.' },
          { level: 5,  name: 'Absoluteness',        description: '[Pasif] Tüm saldırıların hasarını %10 düşürür.' },
          { level: 10, name: 'Matchless',           description: '[Pasif] Alınan tüm hasarları %15 düşürür.' },
          { level: 15, name: 'Exceed Break',        description: 'Başarısızlık şansı olmadan %200 hasar verir + zırh/silah dayanıklılığını 1000 düşürme şansı.' },
          { level: 20, name: 'Shock Stun',          description: '%200 hasar verir ve düşmanı 3 sn boyunca sersemletir.' },
          { level: 23, name: 'Inevitable Muderus',  description: 'Menzili 10 sn boyunca 1 metre artırır.' },
        ],
      },
    ],
    masterRequirements: {
      items: [
        '1x Unstable Kentaraus\' Heart — Lunar Valley\'deki Centaur Faol\'lardan düşer',
        '1x Urkthron\'s Essence — [Field Boss] Urukthrone\'dan düşer (Uruk Hai / Blade / Tron slotları)',
        '1x Alkeradeua\'s Essence — [Field Boss] Alkedrada\'dan düşer (Dragon Tooth Skeleton / Soldier / Commander slotları)',
      ],
      npcLocation: '[Warrior Master] Skaki — El Morad Castle / Luferson Castle',
      notes: 'Üç eşyayı toplayıp (ya da pazardan alıp) Skaki\'ye giderek 2nd Job Change görevini tamamla.',
    },
    highSkillRequirements: {
      level70: 5,
      level75: 10,
      level80: 15,
    },
    tips: [
      'Her zaman çantanda bir kalkan hazır bulundur — dara düştüğünde Rogue\'ların Chitin Shield\'a geçmesi gibi değişim yap.',
      'BDW\'de Altar\'ı kalkanınla kır. Kalkanlar hızlı saldırı hızına sahiptir; Raptor\'un Very Slow etkisinin aksine her zaman Altar\'ı alabilirsin.',
      'BDW\'de Warrior olarak Altar\'ı yok etmek senin görevin. Zamanlayıcıya dikkat et ve orada ol.',
      'Partinden çok fazla uzaklaşıp kimseyi kovalama — bir Rogue\'u asla yakalayamazsın.',
      'Juraid\'de trash mob spawn olduğunda (Doom, Apostle, Troll Warrior vb.) AoE skill\'lerini kullan.',
      'Partinde Heal ağacına 75+ vermiş Priest varsa HP Booster kullanma — Superior Restore kullanılmasını engeller.',
      'Gerektiğinde Sundries\'ten alınan Resistance potlarını kullan.',
    ],
    aliases: [
      'warrior', 'ko warrior', 'knight warrior', 'knight online warrior',
      'savaşçı', 'tank', 'berserker', 'warrior build', 'warrior rehber',
    ],
    keyQuestions: [
      'Knight Online Warrior nasıl oynanır?',
      'Warrior stat dağılımı nasıl olmalı?',
      'Berserker Warrior build nedir?',
      'Warrior BDW\'de ne yapmalı?',
      'Warrior Master nasıl açılır?',
      'Warrior için hangi skill ağacı daha iyi?',
      'Warrior 70-80 skill\'leri nasıl açılır?',
    ],
    relatedBuilds: ['warrior-berserker', 'warrior-attacker', 'warrior-tank'],
  },

  // ────────────────────────────────────────────────────────────────────────────
  // ROGUE (Assassin + Archer)
  // ────────────────────────────────────────────────────────────────────────────
  {
    slug: 'rogue',
    guideSlug: 'asas',
    name: 'Asas / Okçu',
    nameEn: 'Rogue (Assassin / Archer)',
    shortName: 'Rogue',
    icon: '🗡️',
    color: '#3b82f6',
    primaryStat: 'DEX (Dexterity)',
    secondaryStat: 'STR',
    races: ['El Morad Male', 'El Morad Female', 'Tuarek'],
    masterTitle: { human: 'Kasar Hood', karus: 'Shadow Vain' },
    masterNPC: '[Secret Agent] Clarence — Asga / Bellua Village',
    role: ['DPS', 'Assassin (Melee)', 'Archer (Ranged)', 'PvP', 'Farm'],
    difficulty: 'orta',
    description:
      `Rogue'lar, düşmanlarına gizlice yaklaşıp ölümcül hasarlar veren suikastçılar (Assassin) ya da yaylarıyla uzaktan saldırılar gerçekleştirebilen okçular (Archer) olabilirler. Rogue sınıfı diğer sınıflardaki birçok özelliği kendinde barındırır: kendini iyileştirme, görünmez olabilme, düşmanı kör etme ve yavaşlatma, çok hızlı hareket edebilme kabiliyetine sahip çok yönlü bir sınıftır.`,
    excerpt:
      'Knight Online Rogue; Assassin (asas) ve Archer (okçu) olmak üzere iki oynanış biçimiyle yüksek DPS ve gizlilik kabiliyeti sunar.',
    playstyle:
      `Assassin: Spike + Trust ile yüksek hasar vereceğin zayıf hedeflerde Drain kullanma. Illusion ile parti arkadaşlarını koru. BDW\'de bayrak taşıyıcını Minor Heal\'le.
Okçu: Arrow Shower / Multiple Shot menziline güvende değilsen girme. Blinding Strafe\'i hasar için değil, panik butonu olarak kullan. Power Shot\'ı sadece birinin kaçmasını engellemek için kullan.`,
    statBuilds: [
      {
        name: 'Assassin Build',
        distribution: 'DEX ağırlıklı, STR dengeli',
        notes: 'Assassinate ağacına odaklan. Stealth ve Spike/Critical Point kombinasyonu.',
      },
      {
        name: 'Archer Build',
        distribution: 'DEX maksimum',
        notes: 'Archery ağacına odaklan. Silah önerisi: Windforce +11 > Hepa IB +11 > Helenid +11.',
      },
    ],
    skillTrees: [
      {
        name: 'Basic',
        skills: [
          { level: 1,  name: 'Stroke',           description: '%70 hasar veren yakın menzil saldırısı.' },
          { level: 1,  name: 'Sprint',            description: 'Koşma hızını geçici olarak artırır.' },
          { level: 3,  name: 'Archery',           description: 'Ok atmak için yay kullanır.' },
          { level: 5,  name: 'Stab',              description: '%150 hasar veren hançer saldırısı.' },
          { level: 7,  name: 'Stab2',             description: 'Başarısızlık şansı olmadan %250 + ek 50 hasar.' },
          { level: 9,  name: 'Archery2',          description: '%120 hasar veren ok saldırısı.' },
          { level: 10, name: 'Swift',             description: 'Hedefin (ya da kendin) koşma hızını artırır.' },
          { level: 30, name: 'Strength of Wolf',  description: 'Parti üyelerinin saldırı güçlerini artırır.' },
        ],
      },
      {
        name: 'Archery (Okçu)',
        skills: [
          { level: 0,  name: 'Through Shot',      description: '%150 hasar veren yay saldırısı.' },
          { level: 5,  name: 'Fire Arrow',         description: 'Alevli ok saldırısı.' },
          { level: 15, name: 'Multiple Shot',      description: 'Aynı anda 3 ok atar.' },
          { level: 20, name: 'Guided Arrow',       description: 'Hedefini mutlaka vuran yay saldırısı.' },
          { level: 25, name: 'Perfect Shot',       description: '%200 hasar veren yay saldırısı.' },
          { level: 40, name: 'Arc Shot',           description: '%250 hasar veren yay saldırısı.' },
          { level: 52, name: 'Counter Strike',     description: 'Kritik hasar veren yay saldırısı.' },
          { level: 55, name: 'Arrow Shower',       description: 'Aynı anda 5 ok atar.' },
          { level: 57, name: 'Shadow Shot',        description: '%200 hasarla hedefini mutlaka vuran yay saldırısı.' },
          { level: 60, name: 'Shadow Hunter',      description: '%300 hasarla hedefini mutlaka vuran yay saldırısı.' },
          { level: 62, name: 'Ice Shot',           description: '%300 hasar + düşmanı yavaşlatma şansı.' },
          { level: 66, name: 'Lighting Shot',      description: '%300 hasar + 3 sn sersemletme.' },
          { level: 70, name: 'Dark Pursuer',       description: '%350 hasarla hedefini mutlaka vuran yay saldırısı.' },
          { level: 72, name: 'Blow Arrow',         description: 'Hareket ederken düşmana %200 hasarla ok saplar.' },
          { level: 75, name: 'Blinding Strafe',    description: 'Düşmana %400 hasar + kör eder. Canavarlara işlemez.' },
          { level: 80, name: 'Power Shot',         description: 'Büyük hasar veren yay saldırısı.' },
        ],
      },
      {
        name: 'Assassinate (Asas)',
        skills: [
          { level: 0,  name: 'Jab',              description: 'Rakibin savunmasını yok sayan bıçaklama.' },
          { level: 10, name: 'Blood Drain',      description: 'Düşmanın HP\'sinin %5\'ini alır. Dakikada bir defa.' },
          { level: 15, name: 'Pierce',           description: '%200 hasar veren hançer saldırısı.' },
          { level: 20, name: 'Shock',            description: 'Rakibin savunmasını yok sayan bıçaklama.' },
          { level: 30, name: 'Illusion',         description: 'Düşmanın saldırı isabetini 15 sn düşürür.' },
          { level: 35, name: 'Thrust',           description: '%400 hasar veren hançer saldırısı.' },
          { level: 40, name: 'Cut',              description: 'Rakibin savunmasını yok sayan bıçaklama.' },
          { level: 45, name: 'Stealth',          description: 'Saldırı yapana dek 80 sn görünmezlik sağlar.' },
          { level: 50, name: 'Vampiric Touch',   description: 'Düşmanın HP\'sinin %10\'unu alır. Dakikada bir defa.' },
          { level: 55, name: 'Spike',            description: '%600 hasar veren hançer saldırısı.' },
          { level: 63, name: 'Throwing Knife',   description: '20 metre menzildeki düşmana %300 hasar veren bıçak fırlatır.' },
          { level: 70, name: 'Bloody Beast',     description: 'Rakibin savunmasını yok sayan bıçaklama.' },
          { level: 72, name: 'Blinding',         description: '%500 hasar + 2 sn kör eder. Canavarlara uygulanamaz.' },
          { level: 75, name: 'Beast Hiding',     description: '%300 hasar + 3 sn görünmezlik. Canavarlara uygulanamaz.' },
          { level: 80, name: 'Critical Point',   description: 'Kritik saldırılar gerçekleştirir. Canavarlara uygulanamaz.' },
        ],
      },
      {
        name: 'Search',
        skills: [
          { level: 0,  name: 'Hide',              description: 'Hareket edene dek 40 sn görünmezlik.' },
          { level: 5,  name: 'Minor Healing',     description: '60 HP yeniler.' },
          { level: 10, name: 'Evade',             description: '15 sn boyunca AC\'yi 200 artırır.' },
          { level: 15, name: 'Cat\'s Eyes',       description: '50 sn görünmez düşmanları görmeni sağlar.' },
          { level: 25, name: 'Light Feet',        description: 'Koşma hızını 10 sn 2 katına çıkarır.' },
          { level: 30, name: 'Safety',            description: '15 sn boyunca AC\'yi 400 artırır.' },
          { level: 35, name: 'Lupine Eyes',       description: '50 sn sen ve parti üyelerinin görünmez düşmanları görmesini sağlar.' },
          { level: 36, name: 'Cure Curse',        description: 'Direnç düşüren tüm büyüleri bertaraf eder.' },
          { level: 48, name: 'Cure Disease',      description: 'HP\'yi düşüren tüm büyüleri bertaraf eder.' },
          { level: 60, name: 'Scaled Skin',       description: '15 sn boyunca AC\'yi 800 artırır.' },
          { level: 70, name: 'Wild Advent',       description: 'Belirli mesafedeki bir düşmana ışınlar.' },
          { level: 75, name: 'Concentration',     description: '15 sn boyunca saldırıların başarısızlık şansını ortadan kaldırır.' },
          { level: 80, name: 'Smoke Screen',      description: 'Alan duman atar, etraftaki herkesin hedefleme kabiliyetini devre dışı bırakır. Canavarlara uygulanamaz.' },
        ],
      },
      {
        name: 'Master',
        skills: [
          { level: 0,  name: 'Valor',              description: '[Pasif] HP %30 altına indiğinde direnci 50 artırır.' },
          { level: 2,  name: 'Magic Shield',       description: 'Geçici olarak tüm direnç puanlarını artırır.' },
          { level: 5,  name: 'Absoluteness',       description: '[Pasif] Tüm saldırıların hasarını %10 düşürür.' },
          { level: 10, name: 'Matchless',          description: '[Pasif] Alınan tüm hasarları %15 düşürür.' },
          { level: 15, name: 'Source Marking',     description: 'Bir düşmanı işaretler, görünmez olmasını engeller. Canavarlara uygulanamaz.' },
          { level: 20, name: 'Weapon Cancelation', description: 'Düşmanın kullandığı silahı iptal etme şansı verir. Canavarlara uygulanamaz.' },
          { level: 23, name: 'Eskrima',            description: 'Kanatıcı lanet + hasar. Okçular için çöp; Archer\'lar Cure Disease\'yi tercih etmeli.' },
        ],
      },
    ],
    masterRequirements: {
      items: [
        '1x Unstable Kentaraus\' Heart — Lunar Valley\'deki Centaur Faol\'lardan düşer',
        '1x GaruKonga\'s Essence — [Field Boss] Garukonga\'dan düşer (Haunga / Kongau slotları)',
        '1x Trethonz\'s Essence — [Field Boss] Trethorns\'dan düşer (Ancient / Treant slotları)',
      ],
      npcLocation: '[Secret Agent] Clarence — Asga / Bellua Village',
      notes: 'Üç eşyayı toplayıp (ya da pazardan alıp) Clarence\'a giderek 2nd Job Change görevini tamamla.',
    },
    highSkillRequirements: {
      level70: 5,
      level72: 7,
      level75: 10,
      level80: 15,
    },
    tips: [
      // Assassin ipuçları
      'Spike + Thrust ile çok daha fazla hasar vereceğin zayıf hedeflerde (Riote ya da Bach gibi) Drain kullanma.',
      'Illusion kullan — partindeki arkadaşının başka bir assassin tarafından öldürülmesini engelleyebilir.',
      'BDW\'deyken bayrak taşıyıcını Minor Heal\'le.',
      // Archer ipuçları
      'Güvende olmadan Arrow Shower / Multiple Shot menziline girme — Archer\'lar her zaman göze çarpar.',
      'Hasar için asla Blinding Strafe kullanma; bu bir panik butonudur ve uzun cooldown\'u var.',
      'Power Shot\'ı sadece birinin town çekmesini engellemek veya işini bitirmek için kullan.',
      'Blow Arrow adında bir yeteneğin var, kullan!',
      'Silah önerisi: Windforce +11 > Hepa IB +11 > Helenid +11 / EE +11. Quest bow +11 çöp.',
      'Okçu için Eskrima\'ya Master\'da 23 verme — Cure Disease çok daha iyi bir seçenek.',
      'Styx\'i kullanmayı unutma.',
      'BDW\'de daha fazla destek (cure, minor) olmaya çalış ve Battle Priest ile birlikte en zayıf class olduğunu unutma.',
      'Kite etmeyi öğren — menzilin var, bunu avantajına kullan.',
    ],
    aliases: [
      'asas', 'assassin', 'rogue', 'okçu', 'okcu', 'archer',
      'ko asas', 'knight asas', 'ko archer', 'knight online asas',
      'asas rehber', 'okçu rehber', 'rogue build',
    ],
    keyQuestions: [
      'Knight Online asas nasıl oynanır?',
      'Knight Online okçu nasıl oynanır?',
      'Asas ve okçu farkı nedir?',
      'Asas stat dağılımı nasıl olmalı?',
      'Okçu için en iyi silah hangisi?',
      'Rogue Master nasıl açılır?',
      'Assassin combo sırası nedir?',
      'Archer\'da hangi skill\'ler önemli?',
      'Rogue 70-80 skill\'leri nasıl açılır?',
    ],
    relatedBuilds: ['asas-assassin', 'asas-archer', 'okcu-dex'],
  },

  // ────────────────────────────────────────────────────────────────────────────
  // MAGE
  // ────────────────────────────────────────────────────────────────────────────
  {
    slug: 'mage',
    guideSlug: 'mage',
    name: 'Mage',
    nameEn: 'Mage',
    shortName: 'Mage',
    icon: '🔮',
    color: '#8b5cf6',
    primaryStat: 'INT (Intelligence) / Magic Power (MP)',
    secondaryStat: 'INT',
    races: ['El Morad Male', 'El Morad Female', 'Wrinkle Tuarek', 'Puri Tuarek'],
    masterTitle: { human: 'Arch Mage', karus: 'Elemental Lord' },
    masterNPC: '[Archmage] Drake — Laiba / Linate Village',
    role: ['AOE DPS', 'Elemental Hasar', 'PvP', 'PvE'],
    difficulty: 'orta',
    description:
      `Büyücüler, doğadaki elementleri (Fire, Ice, Lightning) kullanarak saldırı ve savunma büyüleri yapabilirler. Mage, tek hedef ve alan (AOE) saldırılar ile hem PvP\'de hem PvE\'de güçlü bir sınıftır. Fire, Glacier (Ice) ve Lightning olmak üzere üç element ağacına sahiptir.`,
    excerpt:
      'Knight Online Mage; Fire, Ice ve Lightning elementleriyle güçlü AOE ve tek hedef büyüler yapan büyücü sınıfıdır.',
    playstyle:
      `Double Blink yerine daha sık Instantly Magic + Light Shock kullan. Priest ve Warrior\'lara resistance vermeye çalış. MP Fire Mage\'sen BDW\'ye girme — işe yaramıyorsun. Juraid\'de zaman kazanmak için Double Blink ve Call Party kullan.`,
    statBuilds: [
      {
        name: 'Lightning Mage',
        distribution: 'INT maksimum, Lightning ağacı',
        notes: 'PvP\'de en güçlü seçenek. Instantly Magic + Light Shock + Chain Lightning kombinasyonu.',
      },
      {
        name: 'Fire Mage',
        distribution: 'INT maksimum, Fire ağacı',
        notes: 'PvE ve farm için etkili. AOE için Meteor Fall ve Inferno.',
      },
      {
        name: 'Glacier (Ice) Mage',
        distribution: 'INT maksimum, Glacier ağacı',
        notes: 'Yavaşlatma efektleri ile kontrol odaklı oynanış.',
      },
    ],
    skillTrees: [
      {
        name: 'Fire',
        skills: [
          { level: 3,  name: 'Burn',           description: '168 Fire hasar, başarısızlık şansı yok.' },
          { level: 9,  name: 'Blaze',          description: '20 sn boyunca 280 Fire hasar.' },
          { level: 15, name: 'Fire Ball',       description: '308 Fire hasar.' },
          { level: 27, name: 'Fire Spear',      description: '588 Fire hasar.' },
          { level: 35, name: 'Fire Blast',      description: '840 Fire hasar.' },
          { level: 39, name: 'Hell Fire',       description: '480 + 20 sn boyunca 1.120 Fire hasar.' },
          { level: 45, name: 'Inferno',         description: '15 metre alana 504 hasar (AOE).' },
          { level: 51, name: 'Pillar of Fire',  description: '1.260 Fire hasar.' },
          { level: 57, name: 'Fire Impact',     description: '1.260 + 10 sn boyunca 1.000 hasar.' },
          { level: 60, name: 'Supernova',       description: '1.800 + 20 sn boyunca 600 ek hasar.' },
          { level: 70, name: 'Incineration',    description: '2.500 Fire hasar (tek hedef).' },
          { level: 70, name: 'Meteor Fall',     description: '2.100 + 20 sn boyunca 600 Fire hasar (AOE).' },
          { level: 80, name: 'Igzination',      description: '3.000 Fire hasar.' },
        ],
      },
      {
        name: 'Glacier (Ice)',
        skills: [
          { level: 3,  name: 'Freeze',         description: '118 Ice hasar + hareket hızını %50\'ye yavaşlatır.' },
          { level: 9,  name: 'Chill',          description: '20 sn boyunca 196 Ice hasar + yavaşlatma şansı.' },
          { level: 15, name: 'Ice Arrow',       description: '216 Ice hasar + 12 sn yavaşlatma.' },
          { level: 27, name: 'Ice Orb',         description: '412 Ice hasar + 14 sn yavaşlatma.' },
          { level: 33, name: 'Ice Burst',       description: '412 Ice hasar (AOE) + 15 sn yavaşlatma.' },
          { level: 35, name: 'Ice Blast',       description: '588 Ice hasar + 16 sn yavaşlatma.' },
          { level: 45, name: 'Blizzard',        description: 'AOE 353 Ice hasar + 18 sn yavaşlatma.' },
          { level: 51, name: 'Ice Comet',       description: '882 Ice hasar + 19 sn yavaşlatma.' },
          { level: 57, name: 'Ice Impact',      description: '882 + 10 sn boyunca 700 Ice hasar + yavaşlatma.' },
          { level: 60, name: 'Frost Nova',      description: 'AOE 1.260 Ice hasar + 20 sn yavaşlatma.' },
          { level: 70, name: 'Prismatic',       description: '1.750 Ice hasar + 10 sn dondurma (tek hedef).' },
          { level: 70, name: 'Ice Storm',       description: '1.470 Ice hasar (AOE) + 20 sn yavaşlatma.' },
          { level: 80, name: 'Freezing Distance', description: '15 sn dondurur (%1 hareket hızı). Canavarlara uygulanamaz.' },
        ],
      },
      {
        name: 'Lightning',
        skills: [
          { level: 3,  name: 'Charge',           description: '118 Lightning hasar, başarısızlık şansı yok.' },
          { level: 9,  name: 'Counter Spell',    description: 'Büyüyü 3 sn etkisiz + 20 sn 196 Lightning hasar.' },
          { level: 15, name: 'Lightning',         description: '216 Lightning hasar + büyüyü 3 sn etkisiz.' },
          { level: 27, name: 'Thunder',           description: '412 Lightning hasar.' },
          { level: 33, name: 'Thunder Burst',     description: '412 Lightning hasar (AOE).' },
          { level: 35, name: 'Thunder Blast',     description: '588 Lightning hasar.' },
          { level: 45, name: 'Thundercloud',      description: '15 metre alana 353 Lightning hasar (AOE).' },
          { level: 51, name: 'Static Orb',        description: '882 Lightning hasar.' },
          { level: 57, name: 'Thunder Impact',    description: '882 + 10 sn boyunca 700 Lightning hasar.' },
          { level: 60, name: 'Static Nova',       description: '15 metre AOE 1.260 Lightning hasar.' },
          { level: 62, name: 'Light Shock',       description: '10 metre alana kör eder. Canavarlara uygulanamaz.' },
          { level: 70, name: 'Stun Cloud',        description: '1.750 Lightning hasar (tek hedef).' },
          { level: 70, name: 'Chain Lightning',   description: '1.470 Lightning hasar (AOE) + 20 sn ek hasar.' },
          { level: 72, name: 'Light Staff',       description: 'Asa saldırısı 883 Lightning hasar + anlık sersemletme.' },
          { level: 80, name: 'Blink',             description: '20 metre ileriye ışınlanır.' },
        ],
      },
      {
        name: 'Master',
        skills: [
          { level: 0,  name: 'Bright Dew',       description: '[Pasif] MP %30 altında MP yenileme hızını %20 artırır.' },
          { level: 2,  name: 'Absolute Power',   description: '30 sn boyunca büyüsel saldırı gücünü %130\'a çıkarır.' },
          { level: 5,  name: 'Absoluteness',     description: '[Pasif] Tüm saldırıların hasarını %10 düşürür.' },
          { level: 10, name: 'Matchless',        description: '[Pasif] Alınan tüm hasarları %15 düşürür.' },
          { level: 12, name: 'Mana Shield',      description: '40 sn boyunca alınan hasarın %15\'ini mana üzerinden emer (ama 4 katı mana gider).' },
          { level: 15, name: 'Instantly Magic',  description: 'Cooldown süresi olmadan bir büyüyü bir kez daha kullanmanı sağlar.' },
          { level: 20, name: 'Minor Resist',     description: '10 metre alana düşmanların dirençlerini 10 sn boyunca %20 düşürür. Yaratıklara uygulanamaz.' },
          { level: 23, name: 'Guard Summon',     description: 'Belirli süre boyunca saldırı yapan bir ejderha muhafız çağırır.' },
        ],
      },
    ],
    masterRequirements: {
      items: [
        '1x Unstable Kentaraus\' Heart — Lunar Valley\'deki Centaur Faol\'lardan düşer',
        '1x Colmicola\'s Essence — [Field Boss] Kamicollo\'dan düşer (Scolar / Sheriff / Cardinal / Baron slotları)',
        '1x GaruKonga\'s Essence — [Field Boss] Garukonga\'dan düşer (Haunga / Kongau slotları)',
      ],
      npcLocation: '[Archmage] Drake — Laiba / Linate Village',
      notes: 'Üç eşyayı toplayıp (ya da pazardan alıp) Drake\'ye giderek 2nd Job Change görevini tamamla.',
    },
    highSkillRequirements: {
      level70: 5,
      level72: 7,
      level75: 10,
      level80: 15,
    },
    tips: [
      'Daha sık Instantly Magic + Light Shock kullan; en iyi seçeneğin Double Blink değil.',
      'Priest ve Warrior\'lara resistance vermeye çalış.',
      'BDW\'de yanında en azından bir Chitin Shield ya da daha iyisi (Gab\'s Adamant +7) olsun.',
      'MP Fire Mage\'sen BDW\'ye girme.',
      'Juraid\'de Double Blink ve Call Party kullan; başka Lightning Mage varsa rolleri tersine çevirebilirsiniz.',
    ],
    aliases: [
      'mage', 'ko mage', 'knight mage', 'knight online mage',
      'büyücü', 'aoe mage', 'fire mage', 'ice mage', 'lightning mage',
      'mage rehber', 'mage build',
    ],
    keyQuestions: [
      'Knight Online Mage nasıl oynanır?',
      'Mage stat dağılımı nasıl olmalı?',
      'Fire Mage mi Lightning Mage mi daha iyi?',
      'Mage AOE skill\'leri nelerdir?',
      'Mage Master nasıl açılır?',
      'Instantly Magic nasıl kullanılır?',
      'Mage 70-80 skill\'leri nasıl açılır?',
    ],
    relatedBuilds: ['mage-fire', 'mage-lightning', 'mage-ice'],
  },

  // ────────────────────────────────────────────────────────────────────────────
  // PRIEST
  // ────────────────────────────────────────────────────────────────────────────
  {
    slug: 'priest',
    guideSlug: 'priest',
    name: 'Priest',
    nameEn: 'Priest',
    shortName: 'Priest',
    icon: '✨',
    color: '#10b981',
    primaryStat: 'INT (Intelligence)',
    secondaryStat: 'STR',
    races: ['El Morad Male', 'El Morad Female', 'Tuarek', 'Puri Tuarek'],
    masterTitle: { human: 'Paladin', karus: 'Shadow Knight' },
    masterNPC: '[Priest] Minerva — El Morad Castle / Luferson Castle',
    role: ['Healer', 'Support', 'Buff', 'Debuff', 'Grubun Kalkanı'],
    difficulty: 'basit',
    description:
      `Priest'ler dostlarını iyileştirip büyüleri ile onları saldırılardan koruyabildikleri gibi, düşmanlarına onları güçsüz bırakan lanetler yağdırabilirler. Heal, Aura (buff) ve Holy (debuff/lanet) olmak üzere üç ana ağaca sahiptir. Grubun en kritik sınıfıdır.`,
    excerpt:
      'Knight Online Priest; heal, buff ve debuff kabiliyetiyle grubun vazgeçilmezi, Juraid ve Dungeon runlarının olmazsa olmazıdır.',
    playstyle:
      `Skill barında sadece 10k ve 960 AoE heal olmamalı — daha fazla araç kullan. Debuff yaparken parti üyelerin ölüyorsa Torment\'in anlamı yok. Canı düşük hedefe Parasite\'lama; bedava town olur. BDW\'de bayrak taşıyıcının etrafında kal ve heal\'le.`,
    statBuilds: [
      {
        name: 'Heal Priest (Destek)',
        distribution: 'Heal ağacı maksimum, Aura buff\'ları',
        notes: 'Grubun hayatta kalmasını sağlar. Complete Healing, Group Complete Healing ve Superior Restore öncelikli.',
      },
      {
        name: 'Attack Priest (Saldırı)',
        distribution: 'Holy ağacı + Master Helis',
        notes: 'Juraid ve PvP için. Smite +11 veya Lobo hammer, Helis + Torment + Parasite kombinasyonu.',
      },
    ],
    skillTrees: [
      {
        name: 'Heal',
        skills: [
          { level: 0,  name: 'Minor Healing',       description: '60 HP iyileştirir.' },
          { level: 9,  name: 'Healing',             description: '240 HP iyileştirir.' },
          { level: 12, name: 'Restore',             description: '20 sn boyunca 400 HP iyileştirir.' },
          { level: 18, name: 'Major Healing',       description: '360 HP iyileştirir.' },
          { level: 21, name: 'Major Restore',       description: '20 sn boyunca 600 HP iyileştirir.' },
          { level: 27, name: 'Great Healing',       description: '720 HP iyileştirir.' },
          { level: 36, name: 'Massive Healing',     description: '960 HP iyileştirir.' },
          { level: 45, name: 'Superior Healing',    description: '1.920 HP iyileştirir.' },
          { level: 48, name: 'Superior Restore',    description: '20 sn boyunca 2.500 HP iyileştirir.' },
          { level: 54, name: 'Complete Healing',    description: 'Bir dostunun tüm HP\'sini iyileştirir.' },
          { level: 57, name: 'Group Massive Healing', description: 'Tüm parti üyelerinin 960 HP\'sini iyileştirir.' },
          { level: 60, name: 'Group Complete Healing', description: 'Partinin tümünün HP\'sini komple iyileştirir.' },
          { level: 70, name: 'Critical Restore',   description: '20 metre alana 20 sn boyunca 3.000 HP iyileştirir.' },
          { level: 75, name: 'Past Recovery',       description: 'Dostun 2.500 HP\'sini + 20 sn boyunca 3.000 HP daha iyileştirir.' },
          { level: 80, name: 'Past Restore',        description: '30 metre alana 20 sn boyunca 6.000 HP iyileştirir.' },
        ],
      },
      {
        name: 'Aura (Buff)',
        skills: [
          { level: 6,  name: 'Grace',               description: 'Parti üyesinin HP\'sini 10 dk 60 artırır.' },
          { level: 9,  name: 'Resist All',          description: 'Magic/Curse/Poison direncini 10 dk 20 artırır.' },
          { level: 15, name: 'Brave',               description: 'Parti üyesinin HP\'sini 10 dk 240 artırır.' },
          { level: 27, name: 'Bright Mind',         description: 'Magic/Curse/Poison direncini 10 dk 40 artırır.' },
          { level: 33, name: 'Hardness',            description: 'Parti üyesinin HP\'sini 10 dk 720 artırır.' },
          { level: 36, name: 'Calm Mind',           description: 'Magic/Curse/Poison direncini 10 dk 60 artırır.' },
          { level: 42, name: 'Mightness',           description: 'Parti üyesinin HP\'sini 10 dk 960 artırır.' },
          { level: 45, name: 'Fresh Mind',          description: 'Magic/Curse/Poison direncini 10 dk 80 artırır.' },
          { level: 54, name: 'Undying',             description: 'Parti üyesinin azami HP sınırını 10 dk %60 artırır.' },
          { level: 57, name: 'Greatness',           description: 'Tüm parti üyelerinin azami HP sınırını 10 dk 1.200 artırır.' },
          { level: 70, name: 'Imposingness',        description: 'Parti üyesinin azami HP sınırını 10 dk 2.000 artırır.' },
          { level: 70, name: 'Bless of God',        description: 'Tüm parti üyelerine cure uygular.' },
          { level: 72, name: 'Massive Binder',      description: 'Tüm parti üyelerinin azami HP sınırını 10 dk 2.000 artırır.' },
          { level: 74, name: 'Round Insensibility', description: 'Tüm parti üyelerinin AC\'lerini 10 dk 300 artırır.' },
          { level: 78, name: 'Superioris',          description: 'Parti üyesinin azami HP sınırını 10 dk 2.500 artırır.' },
          { level: 80, name: 'Counter Curse',       description: '10 sn boyunca tüm curse\'leri engeller.' },
        ],
      },
      {
        name: 'Holy (Debuff / Lanet)',
        skills: [
          { level: 3,  name: 'Malice',              description: 'Düşmanın AC\'sini %25 düşürür.' },
          { level: 9,  name: 'Clear Mana',          description: 'Düşmanın Mana\'sını 480 düşürür.' },
          { level: 15, name: 'Confusion',           description: 'Düşmanın Magic Power\'ını 30 düşürür.' },
          { level: 24, name: 'Slow',                description: 'Düşmanın saldırı hızını %20 düşürür.' },
          { level: 27, name: 'Reverse Life',        description: 'Düşmanın HP bonuslarını kaldırır.' },
          { level: 33, name: 'Resurrection of Love', description: 'Kaybedilen exp\'in %60\'ını geri kazandırarak canlandırır.' },
          { level: 36, name: 'Sweep Mana',          description: 'Düşmanın Mana\'sını 960 düşürür.' },
          { level: 42, name: 'Resurrection of Grace', description: 'Kaybedilen exp\'in %70\'ini geri kazandırarak canlandırır.' },
          { level: 45, name: 'Parasite',            description: 'Düşmanın azami HP\'sini %20 düşürür.' },
          { level: 54, name: 'Resurrection of Favors', description: 'Kaybedilen exp\'in %80\'ini geri kazandırarak canlandırır.' },
          { level: 57, name: 'Torment',             description: 'Belirli alana düşmanların savunmalarını %30 düşürür (AOE debuff).' },
          { level: 60, name: 'Massive',             description: 'Düşmanın AP\'sini %20 düşürür.' },
          { level: 70, name: 'Subside',             description: 'Belirli alana düşmanların saldırı yeteneklerini %20 düşürür.' },
          { level: 75, name: 'Superior Parasite',   description: 'Bir düşmanın HP\'sini %30 düşürür. Unique yaratıklara uygulanamaz.' },
          { level: 80, name: 'Discountis',          description: 'Düşmanın Mana\'sını 3.840 düşürür.' },
        ],
      },
      {
        name: 'Master',
        skills: [
          { level: 0,  name: 'Daring',              description: '[Pasif] HP %30 altına indiğinde savunmayı %20 artırır.' },
          { level: 2,  name: 'Judgment',            description: 'Başarısızlık şansı olmadan %200 + ek 150 hasar, yakın menzil.' },
          { level: 5,  name: 'Absoluteness',        description: '[Pasif] Tüm saldırıların hasarını %10 düşürür.' },
          { level: 10, name: 'Matchless',           description: '[Pasif] Alınan tüm hasarları %15 düşürür.' },
          { level: 12, name: 'Helis',               description: 'Başarısızlık şansı olmadan %250 + savunmayı yok sayan 400 hasar, yakın menzil. Juraid için kritik.' },
          { level: 15, name: 'Curse Refraction',    description: 'Tüm curse\'leri 10 sn engeller + gönderene geri yollama şansı.' },
          { level: 20, name: 'Elysian Web',         description: '20 sn boyunca Magic direncini 70 artırır, büyüsel hasarı %30 düşürür.' },
          { level: 23, name: 'Minak\'s Thorn',      description: 'Tüm parti üyelerine yapılan saldırıların %10\'unu yansıtan aura.' },
        ],
      },
    ],
    masterRequirements: {
      items: [
        '1x Unstable Kentaraus\' Heart — Lunar Valley\'deki Centaur Faol\'lardan düşer',
        '1x Colmicola\'s Essence — [Field Boss] Kamicollo\'dan düşer (Scolar / Sheriff / Cardinal / Baron slotları)',
        '1x Trethonz\'s Essence — [Field Boss] Trethorns\'dan düşer (Ancient / Treant slotları)',
      ],
      npcLocation: '[Priest] Minerva — El Morad Castle / Luferson Castle',
      notes: 'Üç eşyayı toplayıp (ya da pazardan alıp) Minerva\'ya giderek 2nd Job Change görevini tamamla.',
    },
    highSkillRequirements: {
      level70: 5,
      level72: 7,
      level74: 9,
      level76: 11,
      level78: 12,
      level80: 15,
    },
    tips: [
      'Skill barında sadece 10k ve 960 AoE heal olmamalı — daha fazla araç kullan.',
      'Debuff yaparken parti üyelerin ölüyorsa Torment yapıştırmanın anlamı yok.',
      'Canı zaten düşük olan bir hedefi Parasite\'lama — bedava /town olacaktır.',
      'Juraid\'de sadece öldürülmekte olan canavarları değil, öldürülecek olanları da önceden Parasite ve Superior Parasite\'la.',
      'Forgotten Temple\'da mümkünse parti üyelerine Fresh Mind ve Undying ver.',
      'BDW\'de karşı tarafın debuff\'u yoksa Undying verdiğinden emin ol.',
      'BDW\'de önceliğin bayrak taşıyıcının etrafında bulunmak ve onu heal\'lemek olsun.',
      'Juraid\'de Lobo hammer kullanıyorsan ve saldırı yapmıyorsan — Skill barına Helis koy, Smite +11 ile yardım et.',
    ],
    aliases: [
      'priest', 'ko priest', 'knight priest', 'knight online priest',
      'heal priest', 'attack priest', 'rahip', 'buf', 'buff', 'healer',
      'priest rehber', 'priest build',
    ],
    keyQuestions: [
      'Knight Online Priest nasıl oynanır?',
      'Heal Priest mi Attack Priest mi daha iyi?',
      'Priest stat dağılımı nasıl olmalı?',
      'Priest buff sırası nedir?',
      'Parasite ve Superior Parasite ne işe yarar?',
      'Priest Master nasıl açılır?',
      'Priest 70-80 skill\'leri nasıl açılır?',
      'Undying buff\'ı ne işe yarar?',
    ],
    relatedBuilds: ['priest-heal', 'priest-attack', 'priest-juraid'],
  },
]

// ─── Yardımcı Fonksiyonlar ─────────────────────────────────────────────────

/** guideSlug\'a göre sınıf verisini döndürür */
export function getClassBySlug(slug: string): ClassData | undefined {
  return KO_CLASSES.find((c) => c.guideSlug === slug || c.slug === slug)
}

/** Alias\'a göre sınıf verisini döndürür */
export function getClassByAlias(alias: string): ClassData | undefined {
  const lower = alias.toLowerCase()
  return KO_CLASSES.find(
    (c) =>
      c.aliases.some((a) => a.toLowerCase() === lower) ||
      c.name.toLowerCase() === lower ||
      c.nameEn.toLowerCase() === lower
  )
}

/** Tüm guide slug\'larını döndürür (generateStaticParams için) */
export function getAllClassSlugs(): string[] {
  return KO_CLASSES.map((c) => c.guideSlug)
}

/** Belirli rol için sınıfları döndürür */
export function getClassesByRole(role: string): ClassData[] {
  return KO_CLASSES.filter((c) =>
    c.role.some((r) => r.toLowerCase().includes(role.toLowerCase()))
  )
}
