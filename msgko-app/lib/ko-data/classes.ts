/**
 * Knight Online — Karakter Sınıfları
 * Kaynak: korehberi.com
 * Sadece kaynaktan alınan bilgiler yer almaktadır.
 */

export type KOClassSlug = 'warrior' | 'rogue' | 'mage' | 'priest'

export interface SkillInfo {
  level: number | string
  name: string
  description: string
}

export interface ClassData {
  slug: KOClassSlug
  guideSlug: string
  name: string
  nameEn: string
  icon: string
  color: string

  /** Birincil stat — korehberi.com */
  primaryStat: string

  /** Mevcut ırklar — korehberi.com */
  races: string[]

  /** Master unvanı — korehberi.com */
  masterTitle: { human: string; karus: string }

  /** Master NPC — korehberi.com */
  masterNPC: string

  /** Sınıf açıklaması — korehberi.com */
  description: string

  /** Stat dağılımı önerileri — korehberi.com (sadece Warrior için) */
  statBuilds: {
    name: string
    distribution: string
  }[]

  /** Skill ağaçları — korehberi.com */
  skillTrees: {
    name: string
    skills: SkillInfo[]
  }[]

  /** Master açma gereksinimleri — korehberi.com */
  masterRequirements: {
    items: string[]
    npcLocation: string
    notes: string
  }

  /** İleri seviye skill açma (Spell Stone Powder) — korehberi.com */
  highSkillRequirements: {
    level70: number
    level72?: number
    level74?: number
    level75?: number
    level76?: number
    level78?: number
    level80: number
  }

  /** İpuçları — korehberi.com */
  tips: string[]

  /** Arama alias'ları — SEO için */
  aliases: string[]
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
    icon: '⚔️',
    color: '#ef4444',
    primaryStat: 'Strength (STR)',
    races: ['Barbarian', 'El Morad Male', 'El Morad Female', 'Arch Tuarek'],
    masterTitle: { human: 'Blade Master', karus: 'Berserker Hero' },
    masterNPC: '[Warrior Master] Skaki — El Morad Castle / Luferson Castle',
    description:
      `Warrior'lar, yakın dövüşteki ustalıklarıyla düşmanlarının korkulu rüyası ya da yüksek defansları ve sağlık puanlarıyla müttefiklerinin koruyucusu olabilirler. Warrior sınıfı, mevcut tüm sınıflardan ziyade savaş alanlarında savunması ve yüksek atak gücüyle nam salmıştır. Kendisi ve parti üyelerinin bonuslarını yükseltme, rakiplerinin hareketini engelleyebilmek için bacaklarını kırma ve onlarda şok etkisi yaratarak kilitleme başta olmak üzere birçok zorlayıcı becerisi bulunmaktadır.`,
    statBuilds: [
      {
        name: 'Berserker Warrior',
        distribution: 'Berserker: 83 — Defense: 55 — Master: 10',
      },
      {
        name: 'Attacker Warrior',
        distribution: 'Attack: 80 — Defense: 55 — Master: 13',
      },
    ],
    skillTrees: [
      {
        name: 'Basic',
        skills: [
          { level: 1,  name: 'Stroke',   description: '%70 hasar veren bir yakın menzil saldırısıdır.' },
          { level: 1,  name: 'Sprint',   description: 'Hareket hızınızı geçici olarak arttırır.' },
          { level: 3,  name: 'Slash',    description: '%120 hasar verir.' },
          { level: 5,  name: 'Crash',    description: 'Bir saldırıyı başarma şansınızı 1.5 katı arttırır.' },
          { level: 7,  name: 'Defense',  description: 'Savunmanızı geçici olarak arttırır.' },
          { level: 9,  name: 'Piercing', description: '%120 ve ek 50 hasar verir.' },
        ],
      },
      {
        name: 'Attack',
        skills: [
          { level: 0,  name: 'Hash',            description: 'Savunma fark etmeksizin ek 30 hasar verir.' },
          { level: 5,  name: 'Hoodwink',         description: '%150 hasar verir.' },
          { level: 10, name: 'Shear',            description: 'Savunma fark etmeksizin ek 50 hasar verir.' },
          { level: 15, name: 'Pierce',           description: 'Başarısızlık şansı olmadan %100 hasar verir.' },
          { level: 20, name: 'Leg Cutting',      description: 'Düşmanın hareket hızını yavaşlatır.' },
          { level: 25, name: 'Carving',          description: '%200 hasar verir.' },
          { level: 30, name: 'Sever',            description: 'Savunma fark etmeksizin ek 100 hasar verir.' },
          { level: 35, name: 'Prick',            description: 'Başarısızlık şansı olmadan %150 hasar verir.' },
          { level: 40, name: 'Multiple Shock',   description: '%150 ve ek 50 hasar verir.' },
          { level: 45, name: 'Cleave',           description: '%250 hasar verir.' },
          { level: 50, name: 'Mangling',         description: 'Savunma fark etmeksizin ek 150 hasar verir.' },
          { level: 55, name: 'Thrust',           description: 'Başarısızlık şansı olmadan %200 hasar verir.' },
          { level: 57, name: 'Sword Aura',       description: 'Başarısızlık şansı olmadan %200 ve ek 100 hasar verir.' },
          { level: 60, name: 'Sword Dancing',    description: 'Başarısızlık şansı olmadan %250 ve ek 150 hasar verir.' },
          { level: 70, name: 'Howling Sword',    description: 'Başarısızlık şansı olmadan %300 ve ek 200 hasar verir.' },
          { level: 75, name: 'Blooding',         description: 'Başarısızlık şansı olmadan %200 ve ek 150 hasar verir ve 20 saniye boyunca 1000 hasar daha verir.' },
          { level: 80, name: 'Hell Blade',       description: 'Başarısızlık şansı olmadan %300 ve ek 350 hasar verir.' },
        ],
      },
      {
        name: 'Defense',
        skills: [
          { level: 5,  name: 'Hinder',        description: '[Pasif] Savunmayı %10 arttırır. Kalkan kuşanılmamışsa etki yarıya düşer.' },
          { level: 10, name: 'Resist',        description: '[Pasif] Tüm dirençleri 30 arttırır. Kalkan kuşanılmamışsa etki yarıya düşer.' },
          { level: 15, name: 'Arrest',        description: '[Pasif] Savunmayı %15 arttırır. Kalkan kuşanılmamışsa etki yarıya düşer.' },
          { level: 20, name: 'Endure',        description: '[Pasif] Tüm dirençleri 60 arttırır. Kalkan kuşanılmamışsa etki yarıya düşer.' },
          { level: 30, name: 'Binding',       description: 'Bir canavarın size saldırmasını sağlarsınız.' },
          { level: 35, name: 'Bulwark',       description: '[Pasif] Savunmayı %20 arttırır. Kalkan kuşanılmamışsa etki yarıya düşer.' },
          { level: 40, name: 'Immunity',      description: '[Pasif] Tüm dirençleri 90 arttırır. Kalkan kuşanılmamışsa etki yarıya düşer.' },
          { level: 45, name: 'Provoke',       description: 'Belirli bir alandaki canavarları, size saldırması için provoke eder.' },
          { level: 50, name: 'Descent',       description: 'Seçilen bir parti üyesinin konumuna ışınlar.' },
          { level: 55, name: 'Evading',       description: '[Pasif] Savunmayı %25 arttırır. Kalkan kuşanılmamışsa etki yarıya düşer.' },
          { level: 60, name: 'Sacrifice',     description: 'Bir parti üyesinin HP\'sini doldurmak için kendinizi feda edersiniz.' },
          { level: 70, name: 'Iron Skin',     description: '[Pasif] Savunmayı %30 arttırır. Kalkan kuşanılmamışsa etki yarıya düşer.' },
          { level: 75, name: 'Wall Of Iron',  description: 'Savunmayı 10 saniyeliğine üç katına çıkarır. Ancak bu süre boyunca koşma hızını %50 düşürür.' },
          { level: 80, name: 'Iron Body',     description: '[Pasif] Savunmayı %40 arttırır. Kalkan kuşanılmamışsa etki yarıya düşer.' },
        ],
      },
      {
        name: 'Passion / Berserker',
        skills: [
          { level: 5,  name: 'Gain',          description: 'Strength\'i 15 arttırır.' },
          { level: 10, name: 'Pain Killer',   description: '200 MP karşılığında 100 HP verir.' },
          { level: 15, name: 'Rise',          description: 'HP\'yi 10 arttırır.' },
          { level: 20, name: 'Outrage',       description: 'Gelen hasarları 10 saniyeliğine MP ile emer.' },
          { level: 25, name: 'Blade Of Hate', description: 'Uzaktaki bir düşmana saldırı gerçekleştirir.' },
          { level: 30, name: 'Restoration',   description: 'HP yenileme oranını geçici olarak arttırır.' },
          { level: 30, name: 'Blaze Killer',  description: '400 MP karşılığında 200 HP verir.' },
          { level: 35, name: 'Nimble Wind',   description: 'Dexterity\'nizi 20 arttırır.' },
          { level: 40, name: 'Return To Life',description: '500 MP karşılığında 250 HP verir.' },
          { level: 50, name: 'Regeneration',  description: 'HP yenileme oranını geçici olarak arttırır. Restoration\'dan fazladır.' },
          { level: 55, name: 'Frenzy',        description: 'Gelen hasarları 20 saniyeliğine MP ile emer.' },
          { level: 60, name: 'Quake',         description: 'Çevredeki tüm düşmanlara saldıran bir kılıç yeteneği.' },
          { level: 70, name: 'Berserk Echo',  description: 'Geçici olarak saldırı hızınızı %40 arttırır.' },
          { level: 75, name: 'Berserker',     description: '20 saniyeliğine saldırı hızını %20 arttırır. Ancak bu süre boyunca savunma 300 azalır.' },
          { level: 80, name: 'HP Booster',    description: 'Belirli bir süre boyunca, oturuyormuşçasına ayaktayken HP yeniler.' },
          { level: 83, name: 'Battle Cry',    description: 'Cast boyunca, Warrior\'un 30 metre menzilindeki tüm parti üyelerinin tüm statlarını 15 arttırır.' },
          { level: 83, name: 'Cry Echo',      description: 'Battle Cry ile kullanıldığında uygulanabilir. Başarısızlık şansı olmadan %300 ve ek 200 hasar.' },
        ],
      },
      {
        name: 'Master',
        skills: [
          { level: 0,  name: 'Boldness',           description: '[Pasif] HP %30 ya da daha altındayken savunmayı %20 arttırır.' },
          { level: 2,  name: 'Scream',             description: 'Başarısızlık şansı olmadan %250 ve ek 150 hasar veren bir saldırı. Ayrıca düşmanı geçici olarak dondurur.' },
          { level: 5,  name: 'Absoluteness',       description: '[Pasif] Tüm saldırıların hasarını %10 düşürür.' },
          { level: 10, name: 'Matchless',          description: '[Pasif] Alınan tüm hasarları %15 düşürür.' },
          { level: 15, name: 'Exceed Break',       description: 'Başarısızlık şansı olmadan %200 hasar verir ve düşmanın zırhı ile silahının dayanıklılığını 1000 düşürme şansı vardır.' },
          { level: 20, name: 'Shock Stun',         description: '%200 hasar verir ve düşmanı 3 saniye boyunca sersemletir.' },
          { level: 23, name: 'Inevitable Muderus', description: 'Menzili 10 saniyeliğine 1 metre arttırır.' },
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
      notes: 'Üç eşyayı topladıktan (ya da pazardan satın aldıktan) sonra Skaki\'ye giderek 2nd Job Change görevini tamamlayarak Master skill\'lerinizi açabilirsiniz.',
    },
    highSkillRequirements: {
      level70: 5,
      level75: 10,
      level80: 15,
    },
    tips: [
      'Her zaman çantanızda bir shield hazır bulundurun, dara düştüğünüzde Rogue\'ların Chitin Shield\'a geçmesi gibi değişim yapın. BDW\'de de bu tekniği kullanabilirsiniz.',
      'BDW\'de, Altar\'ı kalkanınızla kırın. Kalkanlar, Raptor\'un Very Slow ve Baal ya da Wirinom\'un Slow attack speed\'inin aksine hızlı attack speed\'e sahiptir. Bu şekilde her zaman Altar\'ı alabilirsiniz.',
      'Evet, BDW\'lerde Warrior olarak Altar\'ı yok etmek sizin işiniz. Oyunun tank karakteri sizsiniz. Bu yüzden zamanlayıcıya dikkat edip orada olun.',
      'Partinizden çok fazla uzaklaşıp birilerini kovalamayın. Bir Rogue\'u asla yakalayamazsınız.',
      'Juraid\'de Doom, Apostle ve Troll Warrior gibi trash moblar spawn olduğunda passion AoE skill\'lerinizi kullanın. Juraid zamana karşı yarış etkinliği ve 5 saniye bile fark yaratabilir.',
      'Partinizde Heal ağacına 75+ vermiş bir Priest varsa HP Booster kullanmayın, çünkü bu ilgili Priest\'in Superior Restore kullanmasını engelleyecektir.',
      'Gerektiği zamanda Sundries\'ten alınan Resistance potlarını kullanın.',
    ],
    aliases: [
      'warrior', 'ko warrior', 'knight warrior', 'knight online warrior',
      'warrior rehber', 'warrior build', 'warrior stat',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────────
  // ROGUE (Assassin + Archer)
  // ────────────────────────────────────────────────────────────────────────────
  {
    slug: 'rogue',
    guideSlug: 'asas',
    name: 'Asas / Okçu',
    nameEn: 'Rogue (Assassin / Archer)',
    icon: '🗡️',
    color: '#3b82f6',
    primaryStat: 'Dexterity (DEX)',
    races: ['El Morad Male', 'El Morad Female', 'Tuarek'],
    masterTitle: { human: 'Kasar Hood', karus: 'Shadow Vain' },
    masterNPC: '[Secret Agent] Clarence — Asga / Bellua Village',
    description:
      `Rogue'lar, düşmanlarına gizlice yaklaşıp ölümcül hasarlar veren suikastçılar ya da yaylarıyla çok uzaktan saldırılar gerçekleştirebilen okçular olabilirler. Rogue sınıfı, diğer sınıflardaki birçok özelliğini kendisinde barındırır. Kendini iyileştirme, saldırı gücünü yükseltme, görünmez düşmanları görebilme, büyücülerin kendilerine yaptıkları hasarları düşürme, üzerilerindeki zarar verici özellikleri kaldırma gibi özel güçleri bulunan, görünmez olabilen, düşmanını kör edebilen ve yavaşlatabilen, kendi sınıfına ait karakterlerin görünmez olmalarını engelleyebilen ve çok hızlı hareket edebilme kabiliyetine sahip olan bir karakterdir.`,
    statBuilds: [],
    skillTrees: [
      {
        name: 'Basic',
        skills: [
          { level: 1,  name: 'Stroke',          description: '%70 hasar veren bir yakın menzil saldırısıdır.' },
          { level: 1,  name: 'Sprint',           description: 'Koşma hızınızı geçici olarak arttırır.' },
          { level: 3,  name: 'Archery',          description: 'Ok atmak için bir yay kullanır.' },
          { level: 5,  name: 'Stab',             description: '%150 hasar veren bir hançer saldırısı.' },
          { level: 7,  name: 'Stab2',            description: 'Başarısızlık şansı olmadan %250 ve ek 50 hasar veren bir hançer saldırısı.' },
          { level: 9,  name: 'Archery2',         description: '%120 hasar veren bir ok saldırısı.' },
          { level: 10, name: 'Swift',            description: 'Hedefin (ya da kendinizin) koşma hızını arttırır.' },
          { level: 30, name: 'Strength of Wolf', description: 'Parti üyelerinizin saldırı güçlerini arttırır.' },
        ],
      },
      {
        name: 'Archery (Okçu)',
        skills: [
          { level: 0,  name: 'Through Shot',    description: '%150 hasar veren bir yay saldırısı.' },
          { level: 5,  name: 'Fire Arrow',       description: 'Alevli oklar atan bir yay saldırısı.' },
          { level: 10, name: 'Poison Arrow',     description: 'Zehirli oklar atan bir yay saldırısı.' },
          { level: 15, name: 'Multiple Shot',    description: 'Aynı anda 3 ok atan bir yay saldırısı.' },
          { level: 20, name: 'Guided Arrow',     description: 'Hedefini mutlaka vuran bir yay saldırısı.' },
          { level: 25, name: 'Perfect Shot',     description: '%200 hasar veren bir yay saldırısı.' },
          { level: 30, name: 'Fire Shot',        description: 'Ek alev hasarı veren bir yay saldırısı.' },
          { level: 35, name: 'Poison Shot',      description: 'Ek zehir hasarı veren bir yay saldırısı.' },
          { level: 40, name: 'Arc Shot',         description: '%250 hasar veren bir yay saldırısı.' },
          { level: 45, name: 'Explosive Shot',   description: 'En güç alev saldırısı.' },
          { level: 50, name: 'Viper',            description: 'En güçlü zehir saldırısı.' },
          { level: 52, name: 'Counter Strike',   description: 'Kritik hasar veren yay saldırısı.' },
          { level: 55, name: 'Arrow Shower',     description: 'Aynı anda 5 ok atan bir yay saldırısı.' },
          { level: 57, name: 'Shadow Shot',      description: '%200 hasarla hedefini mutlaka vuran bir yay saldırısı.' },
          { level: 60, name: 'Shadow Hunter',    description: '%300 hasarla hedefini mutlaka vuran bir yay saldırısı.' },
          { level: 62, name: 'Ice Shot',         description: '%300 hasar veren ve düşmanı yavaşlatma şansı bulunan bir yay saldırısı.' },
          { level: 66, name: 'Lighting Shot',    description: '%300 hasar veren ve 3 saniyeliğine sersemleten bir yay saldırısı.' },
          { level: 70, name: 'Dark Pursuer',     description: '%350 hasarla hedefini mutlaka vuran bir yay saldırısı.' },
          { level: 72, name: 'Blow Arrow',       description: 'Hareket ederken bir düşmana %200 hasarla ok saplama saldırısı.' },
          { level: 75, name: 'Blinding Strafe',  description: 'Düşmana %400 hasar veren ve onu kör eden bir ok atar. Canavarlara işlemez.' },
          { level: 80, name: 'Power Shot',       description: 'Büyük bir miktarda hasar veren bir yay saldırısı.' },
        ],
      },
      {
        name: 'Assassinate (Asas)',
        skills: [
          { level: 0,  name: 'Jab',             description: 'Rakibin savunmasını yok sayan bir bıçaklama.' },
          { level: 10, name: 'Blood Drain',     description: 'Düşmanın HP\'sinin %5\'ini alır. Dakikada bir defa kullanılabilir.' },
          { level: 15, name: 'Pierce',          description: '%200 hasar veren bir hançer saldırısı.' },
          { level: 20, name: 'Shock',           description: 'Rakibin savunmasını yok sayan bir bıçaklama.' },
          { level: 30, name: 'Illusion',        description: 'Düşmanın saldırı isabetini 15 saniyeliğine düşürür.' },
          { level: 35, name: 'Thrust',          description: '%400 hasar veren bir hançer saldırısı.' },
          { level: 40, name: 'Cut',             description: 'Rakibin savunmasını yok sayan bir bıçaklama.' },
          { level: 45, name: 'Stealth',         description: 'Saldırı yapana dek 80 saniyeliğine görünmezlik sağlar.' },
          { level: 50, name: 'Vampiric Touch',  description: 'Düşmanın HP\'sinin %10\'unu alır. Dakikada bir defa kullanılabilir.' },
          { level: 55, name: 'Spike',           description: '%600 hasar veren bir hançer saldırısı.' },
          { level: 63, name: 'Throwing Knife',  description: '20 metre menzildeki bir düşmana %300 hasar veren bir bıçak fırlatır.' },
          { level: 70, name: 'Bloody Beast',    description: 'Rakibin savunmasını yok sayan bir bıçaklama.' },
          { level: 72, name: 'Blinding',        description: '%500 hasar verir ve düşmanı 2 saniyeliğine kör eder. Canavarlara uygulanamaz.' },
          { level: 75, name: 'Beast Hiding',    description: '%300 hasar verir ve sizi 3 saniyeliğine görünmezlik sağlar. Canavarlara uygulanamaz.' },
          { level: 80, name: 'Critical Point',  description: 'Kritik saldırılar gerçekleştirir. Canavarlara uygulanamaz.' },
        ],
      },
      {
        name: 'Search',
        skills: [
          { level: 0,  name: 'Hide',            description: 'Hareket edene dek 40 saniyeliğine görünmezlik sağlar.' },
          { level: 5,  name: 'Minor Healing',   description: '60 HP yeniler.' },
          { level: 10, name: 'Evade',           description: '15 saniyeliğine AC\'yi 200 arttırır.' },
          { level: 15, name: 'Cat\'s Eyes',     description: '50 saniye boyunca görünmez düşmanları görmenizi sağlar.' },
          { level: 25, name: 'Light Feet',      description: 'Koşma hızınızı 10 saniyeliğine 2 katına çıkarır.' },
          { level: 30, name: 'Safety',          description: '15 saniyeliğine AC\'yi 400 arttırır.' },
          { level: 35, name: 'Lupine Eyes',     description: '50 saniye boyunca sizin ve parti üyelerinizin görünmez düşmanları görmesini sağlar.' },
          { level: 36, name: 'Cure Curse',      description: 'Direnç düşüren tüm büyüleri bertaraf eder.' },
          { level: 48, name: 'Cure Disease',    description: 'HP\'nizi düşüren tüm büyüleri bertaraf eder.' },
          { level: 60, name: 'Scaled Skin',     description: '15 saniyeliğine AC\'yi 800 arttırır.' },
          { level: 70, name: 'Wild Advent',     description: 'Kendinizden belirli mesafedeki bir düşmana ışınlar.' },
          { level: 75, name: 'Concentration',   description: '15 saniye boyunca saldırıların başarısızlık şansını ortadan kaldırır.' },
          { level: 80, name: 'Smoke Screen',    description: 'Bir alana duman atar, etraftaki herkesin hedefleme kabiliyetini devre dışı bırakır. Canavarlara uygulanamaz.' },
        ],
      },
      {
        name: 'Master',
        skills: [
          { level: 0,  name: 'Valor',              description: '[Pasif] HP\'niz %30 ya da altına indiğinde direncinizi 50 arttırır.' },
          { level: 2,  name: 'Magic Shield',       description: 'Geçici olarak tüm direnç puanlarınızı arttırır.' },
          { level: 5,  name: 'Absoluteness',       description: '[Pasif] Tüm saldırıların hasarını %10 düşürür.' },
          { level: 10, name: 'Matchless',          description: '[Pasif] Alınan tüm hasarları %15 düşürür.' },
          { level: 15, name: 'Source Marking',     description: 'Bir düşmanı işaretler, görünmez olmasını engeller. Canavarlara uygulanamaz.' },
          { level: 20, name: 'Weapon Cancelation', description: 'Bir düşmanın kullandığı silahı iptal etme şansı verir. Canavarlara uygulanamaz.' },
          { level: 23, name: 'Eskrima',            description: 'Kanatıcı lanetin yanı sıra düşmana hasar verir. Kanama laneti debuff\'ının etkisi altındaki düşmanın Hançer ve Yay savunmasını %10 düşürür.' },
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
      notes: 'Üç eşyayı topladıktan (ya da pazardan satın aldıktan) sonra Clarence\'a giderek 2nd Job Change görevini tamamlayarak Master skill\'lerinizi açabilirsiniz.',
    },
    highSkillRequirements: {
      level70: 5,
      level72: 7,
      level75: 10,
      level80: 15,
    },
    tips: [
      // Assassin ipuçları (korehberi.com)
      'Spike + Trust ile çok daha fazla hasar verebileceğiniz zayıf bir yaratıkta (Riote ya da Bach gibi) Drain kullanmayın.',
      'Illusion kullanın. Partinizdeki arkadaşınızın başka bir assassin tarafından öldürülmesini engelleyebilir.',
      'BDW\'deyken bayrak taşıyıcınızı Minor Heal\'leyin.',
      'Juraid\'de, Priest\'iniz Deva\'yı Parasite\'lamadan onu Drain\'lemeyin.',
      // Archer ipuçları (korehberi.com)
      'Güvenli olduğundan ve 2 saniye içinde tek yemeyeceğinizden emin olmadan Arrow Shower / Multiple Shot menziline girmeyin. Archer\'lar her zaman göze batarlar.',
      'Hasar vermek için asla Blinding Strafe kullanmayın. Bir Archer\'ın kullanabileceği panik butonlarından biridir ve uzun cooldown\'ı bulunuyor.',
      'Karşınızdakinin town çekmesini engellemek istemediğiniz ya da birinin işini bitirmek istemediğiniz sürece Power Shot\'ı asla kullanmayın.',
      'Blow Arrow diye bir yeteneğiniz var, biliyorsunuz değil mi?',
      'Juraid\'de, Minotaurs\'a yeşil hedef çemberinin kenarından saldırın. Bu şekilde oklarınız hedefi bulacak ve fail olmayacaktır.',
      'BDW\'de, daha fazla destekçi (cure, minor) olmaya çalışın ve normalden bir tık daha fazla tank\'ımsı oynayın, çünkü BDW\'de Battle Priest ile birlikte en zayıf class\'sınız.',
      '400-600 arasında hasar veriyorsanız, belki de zamanınızı daha iyi bir şeyle değerlendirmelisiniz, mesela daha iyi item toplama gibi.',
      'Kite\'lamak da bir şeydir. Menziliniz var, bunu avantajınıza kullanın.',
      'Elf Ring sandığınız kadar iyi değil.',
      'Silah seçimi önerisi: Windforce +11 > Hepa IB +11 > Helenid +11 / EE +11 (son ikisi yeni yeni başlıyorsanız idealdir). Elde etmeye değecek başka yay bulunmuyor. Quest bow +11 de çöp.',
      'Eskrima için sakın Master\'a 23 vermeyin. Archer\'lar için çöpten beter bir yetenektir. Cure Disease sizin için çok daha iyi bir seçenek olacaktır.',
      'Styx diye bir şey var farkında mısınız? Bazı Archer\'lar bunu kullanmıyorlar bile.',
    ],
    aliases: [
      'asas', 'assassin', 'rogue', 'okçu', 'okcu', 'archer',
      'ko asas', 'knight asas', 'ko archer', 'knight online asas',
      'asas rehber', 'okçu rehber', 'rogue rehber',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────────
  // MAGE
  // ────────────────────────────────────────────────────────────────────────────
  {
    slug: 'mage',
    guideSlug: 'mage',
    name: 'Mage',
    nameEn: 'Mage',
    icon: '🔮',
    color: '#8b5cf6',
    primaryStat: 'Magic Power (MP) / Intelligence (INT)',
    races: ['El Morad Male', 'El Morad Female', 'Wrinkle Tuarek', 'Puri Tuarek'],
    masterTitle: { human: 'Arch Mage', karus: 'Elemental Lord' },
    masterNPC: '[Archmage] Drake — Laiba / Linate Village',
    description:
      `Büyücüler, doğadaki elementleri kullanarak saldırı ve savunma büyüleri yapabilirler.`,
    statBuilds: [],
    skillTrees: [
      {
        name: 'Basic',
        skills: [
          { level: 1,  name: 'Stroke',       description: '%70 hasar veren bir yakın menzil saldırısıdır.' },
          { level: 1,  name: 'Flash',        description: 'Düşmana 24 Fire hasarı veren büyülü şoklar kullanırsınız.' },
          { level: 3,  name: 'Shiver',       description: '20 saniye boyunca 60 Ice hasarı veren bir saldırıdır.' },
          { level: 4,  name: 'Summon Friend',description: 'Seçilen parti üyesini olduğunuz yere ışınlarsınız.' },
          { level: 5,  name: 'Flame',        description: 'Hedefe 62 Fire hasarı veren bir alev büyüsü uygularsınız.' },
          { level: 7,  name: 'Cold Wave',    description: 'Hedefe 68 Ice hasarı verir, ardından 10 saniye boyunca hareket hızını %65\'e sabitleyerek yavaşlatırsınız.' },
          { level: 9,  name: 'Spark',        description: 'Düşmanınıza 88 Lightning hasarıyla saldırırsınız. Aynı zamanda büyü saldırılarını 3 saniye boyunca etkisiz hale getirme özelliği vardır.' },
          { level: 9,  name: 'Magic Blade',  description: '%90 hasar veren bir saldırıdır.' },
          { level: 15, name: 'Gate',         description: 'Seçilen canlanma noktasına ışınlar.' },
          { level: 35, name: 'Escape',       description: 'Tüm parti üyelerinizi canlanma noktanıza ışınlar.' },
        ],
      },
      {
        name: 'Fire',
        skills: [
          { level: 3,  name: 'Burn',          description: '168 Fire hasar veren, başarısızlık şansı olmayan bir ateş saldırısı gerçekleştirirsiniz.' },
          { level: 6,  name: 'Resist Fire',   description: 'Fire direncinizi 5 dakika boyunca 20 arttırır.' },
          { level: 9,  name: 'Blaze',         description: 'Düşmanınızı 20 saniye boyunca yakarak 280 Fire hasarı verirsiniz.' },
          { level: 15, name: 'Fire Ball',      description: 'Uzak mesafeden düşmanınıza bir ateş topu yollayarak 308 Fire hasarı verirsiniz.' },
          { level: 18, name: 'Ignition',       description: 'Düşmanınıza ateş kıvılcımları göndererek 238 Fire hasarı verir ve ardından 20 saniye boyunca 336 hasar daha verirsiniz.' },
          { level: 24, name: 'Endure Fire',    description: 'Fire direncinizi 5 dakika boyunca 50 arttırır.' },
          { level: 27, name: 'Fire Spear',     description: 'Uzak mesafeden düşmanınıza alev mızrakları yollayarak 588 Fire hasarı verirsiniz.' },
          { level: 33, name: 'Fire Burst',     description: 'Uzak mesafeden düşmanınıza patlayıcı ateş patlamaları yollayarak 588 Fire hasarı verirsiniz.' },
          { level: 35, name: 'Fire Blast',     description: 'Uzak mesafeden düşmanınıza bir ateş patlaması yollayarak 840 Fire hasarı verirsiniz.' },
          { level: 39, name: 'Hell Fire',      description: 'Düşmanınıza 480 Fire hasarı verir ve ardından 20 saniye boyunca 1.120 Fire hasarı daha verirsiniz.' },
          { level: 42, name: 'Fire Blade',     description: 'Düşmanınıza asanız ile vurarak 336 Fire hasarı verirsiniz.' },
          { level: 43, name: 'Specter of Fire',description: '615 Fire hasarı veren ve başarısızlık şansı olmayan bir ateş saldırısı gerçekleştirirsiniz.' },
          { level: 45, name: 'Inferno',        description: '15 metre yarıçapındaki bir alana cehennem ateşleri yağdırarak 504 hasar verirsiniz.' },
          { level: 48, name: 'Immunity Fire',  description: 'Fire direncinizi 5 dakika boyunca 80 arttırır.' },
          { level: 51, name: 'Pillar of Fire', description: 'Düşmanınızı devasa ateşler ile yakarak 1.260 Fire hasarı verirsiniz.' },
          { level: 54, name: 'Fire Thorn',     description: 'Fire hasarı verir ve 1.550 HP emersiniz. HP emme, sadece diğer oyuncularda geçerlidir.' },
          { level: 56, name: 'Manes of Fire',  description: 'Başarısızlık şansı olmayan bir ateş büyüsü uygulayarak 1.015 Fire hasarı verirsiniz.' },
          { level: 57, name: 'Fire Impact',    description: '10 saniye boyunca süren 1.000 hasarla birlikte 1.260 Fire hasarı verirsiniz.' },
          { level: 60, name: 'Supernova',      description: 'Büyük güçle patlayarak 1.800 Fire hasarı bir süpernova çağırırsınız. Bununla birlikte 20 saniye boyunca 600 ek hasar uygularsınız.' },
          { level: 70, name: 'Incineration',   description: 'Bir düşmana 2500 Fire hasarı vermek için yanan bir meteor çağırırsınız.' },
          { level: 70, name: 'Meteor Fall',    description: 'Belirli bir alandaki düşmanlara 2100 Fire hasarı vermek üzere yanan bir meteor çağırırsınız. Ayrıca 20 saniye boyunca 600 Fire hasarı daha verirsiniz.' },
          { level: 72, name: 'Fire Staff',     description: 'Düşmanınıza asanız ile vurarak 1.103 Fire hasarı verirsiniz.' },
          { level: 75, name: 'Fire Armor',     description: 'Size saldıran düşmana güçlü bir Fire hasarı verir ve ardından kısa bir süre boyunca sürekli hasar verirsiniz.' },
          { level: 80, name: 'Vampiric Fire',  description: 'Düşmana bir ateş topu atar, 20 saniye boyunca 3.000 MP\'sini emerek HP olarak kullanırsınız.' },
          { level: 80, name: 'Igzination',     description: 'Düşmana saldırmak üzere yanan bir meteor çağırır, 3.000 Fire hasarı verirsiniz.' },
        ],
      },
      {
        name: 'Glacier (Ice)',
        skills: [
          { level: 3,  name: 'Freeze',              description: '118 Ice hasarı veren, başarısızlık şansı olmayan bir saldırı gerçekleştirir ve düşmanınızın hareket hızını 10 saniyeliğine %50\'ye sabitleyerek yavaşlatırsınız.' },
          { level: 6,  name: 'Resist Cold',          description: 'Ice direncinizi 5 dakika boyunca 20 artırır.' },
          { level: 9,  name: 'Chill',                description: '20 saniye boyunca düşmanınıza 196 Ice hasarıyla saldırırsınız. 11 saniyeliğine düşmanın hareket hızını %48\'e sabitleyerek onu yavaşlatma şansına sahiptir.' },
          { level: 12, name: 'Frozen Armor',         description: 'Savunmanızı 5 dakika boyunca 60 artırır.' },
          { level: 15, name: 'Ice Arrow',            description: 'Uzak mesafeden düşmanınıza 216 Ice hasarıyla saldırırsınız. Ayrıca düşmanının hareket hızını 12 saniye boyunca %46\'ya sabitler.' },
          { level: 18, name: 'Solid',                description: 'Uzak mesafeden düşmanınıza 167 Ice hasarıyla saldırır, 20 saniye boyunca 236 Ice hasarı daha verirsiniz. Düşmanın hareket hızını 13 saniye boyunca %44\'e sabitler.' },
          { level: 24, name: 'Endure Cold',          description: 'Ice direncinizi 5 dakika boyunca 50 artırır.' },
          { level: 27, name: 'Ice Orb',              description: 'Uzak mesafeden düşmanınıza 412 Ice hasarıyla saldırırsınız. Ayrıca düşmanının hareket hızını 14 saniye boyunca %42\'ye sabitler.' },
          { level: 30, name: 'Frozen Shell',         description: 'Savunmanızı 5 dakika boyunca 120 arttırır.' },
          { level: 33, name: 'Ice Burst',            description: 'Uzak mesafeden düşmanınıza patlayıcı bir buz topu fırlatarak 8 metre yarıçapındaki alana 412 Ice hasarı verirsiniz. Düşmanın hareket hızını 15 saniye boyunca %40\'a sabitler.' },
          { level: 35, name: 'Ice Blast',            description: 'Uzak mesafeden düşmanınıza bir Buz Patlaması fırlatarak 588 Ice hasarı verirsiniz. Düşmanın hareket hızını 16 saniye boyunca %38\'e sabitler.' },
          { level: 39, name: 'Frostbite',            description: 'Düşmanınıza 336 Ice hasarı verir ve ardından 20 saniye boyunca 784 Ice hasarı daha verirsiniz. Düşmanın hareket hızını 17 saniye boyunca %36\'ya sabitleme etkisi de vardır.' },
          { level: 42, name: 'Frozen Blade',         description: 'Düşmanınıza asanız ile vurarak 236 Ice hasarı verirsiniz.' },
          { level: 43, name: 'Specter of Ice',       description: 'Başarısızlık şansı olmayan bir buz büyüsü uygulayarak 431 Ice hasarı verirsiniz.' },
          { level: 45, name: 'Blizzard',             description: 'Etrafınızdaki tüm düşmanlara 353 Ice hasarı veren bir buz fırtınası oluşturursunuz. Ayrıca düşmanlarınızın hareket hızını 18 saniye boyunca %34\'e sabitler.' },
          { level: 48, name: 'Immunity Cold',        description: 'Ice direncinizi 5 dakika boyunca 80 artırır.' },
          { level: 51, name: 'Ice Comet',            description: 'Düşmanınıza saldırması için buzdan bir kuyrukluyıldız çağırarak 882 Ice hasarı verirsiniz. Düşmanın hareket hızını 19 saniye boyunca %32\'ye sabitler.' },
          { level: 54, name: 'Ice Barrier',          description: 'Savunmanızı 5 dakika boyunca 180 arttırır.' },
          { level: 56, name: 'Manes of Ice',         description: 'Başarısızlık şansı olmayan bir buz büyüsü uygulayarak 711 Ice hasarı verirsiniz.' },
          { level: 57, name: 'Ice Impact',           description: 'Düşmanınıza 882 Ice hasarı verir ve ardından 10 saniye boyunca 700 Ice hasarı daha verirsiniz. Ayrıca düşmanının hareket hızını 10 saniye boyunca %50\'ye sabitler.' },
          { level: 60, name: 'Frost Nova',           description: 'Belirli bir alandaki düşmanlara 1.260 Ice hasarı veren ve hareket hızlarını 20 saniye boyunca %30\'a sabitleyerek onları yavaşlatan bir buzul patlamasıdır.' },
          { level: 70, name: 'Prismatic',            description: 'Bir düşmanınıza 1.750 Ice hasarıyla saldırması için donmuş bir meteor çağırırsınız. Ayrıca düşmanınızın hareket hızını 10 saniye boyunca %50\'ye sabitleyerek onu yavaşlatırsınız.' },
          { level: 70, name: 'Ice Storm',            description: 'Belirli bir alandaki düşmanlara 1.470 Ice hasarıyla saldırması için donmuş meteorlar çağırırsınız. Ayrıca düşmanlarınızın hareket hızını 20 saniye boyunca %30\'a sabitleyerek onları yavaşlatırsınız.' },
          { level: 72, name: 'Ice Staff',            description: 'Asanız ile düşmana 883 Ice hasarı verirsiniz. Ayrıca belirli bir süre boyunca düşmanınızı yavaşlatır.' },
          { level: 75, name: 'Ice Armor',            description: 'Size saldıran düşmana güçlü bir Ice hasarı verirsiniz, düşman(lar)ı anlık olarak yavaşlatma şansına da sahiptir.' },
          { level: 80, name: 'Freezing Distance',    description: 'Düşmanı 15 saniye boyunca dondurarak hareket hızını %1\'e sabitlersiniz. Donmanın başarı şansı, hedefin mevcut HP seviyesiyle orantılıdır. Canavarlara uygulanamaz.' },
        ],
      },
      {
        name: 'Lightning',
        skills: [
          { level: 3,  name: 'Charge',              description: '118 Lightning hasarı veren, başarısızlık şansı olmayan bir yıldırım saldırısı gerçekleştirirsiniz.' },
          { level: 6,  name: 'Resist Lightning',    description: 'Lightning direncinizi 5 dakika boyunca 20 arttırır.' },
          { level: 9,  name: 'Counter Spell',       description: 'Düşmanın büyü saldırısını 3 saniye boyunca etkisiz hale getiren ve 20 saniye boyunca 196 Lightning hasarı veren bir yıldırım büyüsüdür.' },
          { level: 15, name: 'Lightning',            description: 'Uzak mesafeden bir düşmana 216 Lightning hasarı veren bir yıldırım büyüsüdür. Düşmanın büyüsel saldırılarını 3 saniyeliğine etkisiz hale getirme etkisine de sahiptir.' },
          { level: 18, name: 'Static Hemisphere',   description: 'Düşmanınızın etrafında bir yıldırım küresi oluşturur, anlık 167 Lightning hasarı, ardından 20 saniye boyunca 236 Lightning hasarı daha verirsiniz.' },
          { level: 24, name: 'Endure Lightning',    description: 'Lightning direncinizi 5 dakika boyunca 50 arttırır.' },
          { level: 27, name: 'Thunder',              description: 'Uzak mesafeden düşmanınıza 412 Lightning hasarıyla saldırmanızı sağlayan bir yıldırım büyüsüdür.' },
          { level: 33, name: 'Thunder Burst',        description: 'Uzak mesafeden bir düşmanınıza patlayıcı bir yıldırım topu fırlatarak 8 metre yarıçapındaki alana 412 Lightning hasarı verirsiniz.' },
          { level: 35, name: 'Thunder Blast',        description: 'Uzak mesafeden bir düşmana 588 Lightning hasarıyla saldırmak için bir yıldırım patlaması fırlatırsınız.' },
          { level: 39, name: 'Discharge',            description: 'Düşmanınıza 336 Lightning hasarı vererek onu şoklar ve ardından 20 saniye boyunca 784 Lightning hasarı daha verirsiniz. Ek olarak, düşmanın büyüsel saldırılarını 3 saniyeliğine etkisiz hale getirme etkisi vardır.' },
          { level: 42, name: 'Charged Blade',        description: 'Düşmanınıza asanız ile vurarak 236 Lightning hasarı verirsiniz.' },
          { level: 43, name: 'Specter of Thunder',   description: 'Başarısızlık şansı olmayan bir yıldırım büyüsü uygulayarak 431 Lightning hasarı verirsiniz.' },
          { level: 45, name: 'Thundercloud',         description: 'Bir yıldırım bulutu çağırarak, 15 metre yarıçapındaki bir alana 353 Lightning hasarı verirsiniz.' },
          { level: 48, name: 'Immunity Lightning',   description: 'Lightning direncinizi 5 dakika boyunca 80 arttırır.' },
          { level: 51, name: 'Static Orb',           description: 'Yüklü bir yıldırım topu fırlatarak 882 Lightning hasarı verirsiniz.' },
          { level: 54, name: 'Static Thorn',         description: 'Yıldırım hasarı verir ve 1.110 HP emersiniz. HP emme, sadece diğer oyuncularda geçerlidir.' },
          { level: 56, name: 'Manes of Thunder',     description: 'Başarısızlık şansı olmayan bir yıldırım büyüsü uygulayarak 711 Lightning hasarı verirsiniz.' },
          { level: 57, name: 'Thunder Impact',       description: 'Düşmana güçlü bir elektrik şoku uygulayarak 882 Lightning hasarı verir ve ardından 10 saniye boyunca 700 Lightning hasarı daha verirsiniz.' },
          { level: 60, name: 'Static Nova',          description: '15 metre yarıçapında bir alana 1260 Lightning hasarı veren büyük bir yıldırım patlamasıdır. Bununla birlikte belirli bir süre boyunca 420 ek Lightning hasarı daha uygularsınız.' },
          { level: 62, name: 'Light Shock',          description: 'Bir ışık huzmesiyle 10 metre yarıçapındaki bir alanda bulunan düşman(lar)ınızı kör edersiniz. Canavarlara uygulanamaz.' },
          { level: 70, name: 'Stun Cloud',           description: 'Bir düşmana 1750 Lightning hasarıyla saldırmak için elektrik yüklü bir meteor çağırırsınız.' },
          { level: 70, name: 'Chain Lightning',      description: '15 metre yarıçapındaki bir alandaki düşmanlara 1470 Lightning hasarıyla saldırmak için elektrik yüklü meteorlar çağırırsınız. Ayrıca 20 saniye boyunca 420 Lightning hasarı daha verirsiniz.' },
          { level: 72, name: 'Light Staff',          description: 'Asa ile güçlü bir yıldırım saldırısı uygulayarak 883 Lightning hasarı verirsiniz. Ayrıca anlık olarak sersemletir.' },
          { level: 75, name: 'Lightning Armor',      description: 'Size saldıran düşmana güçlü bir Lightning hasarı verirsiniz, düşman(lar)ı anlık olarak sersemletme şansına da sahiptir.' },
          { level: 80, name: 'Blink',                description: '20 metre ileriye ışınlanırsınız.' },
        ],
      },
      {
        name: 'Master',
        skills: [
          { level: 0,  name: 'Bright Dew',      description: '[Pasif] MP\'niz %30 ya da altına düştüğünde MP yenileme hızınızı %20 artırır.' },
          { level: 2,  name: 'Absolute Power',  description: '30 saniye boyunca büyüsel saldırı gücünüzü %130\'a çıkarır.' },
          { level: 5,  name: 'Absoluteness',    description: '[Pasif] Tüm saldırıların hasarını %10 düşürür.' },
          { level: 10, name: 'Matchless',       description: '[Pasif] Alınan tüm hasarları %15 düşürür.' },
          { level: 12, name: 'Mana Shield',     description: '40 saniye boyunca, alınan hasarın %15\'ini mana üzerinden emer. Ancak manadan emilen hasar 4 katı daha büyük olacaktır.' },
          { level: 15, name: 'Instantly Magic', description: 'Cooldown süresi olmadan bir büyüyü bir kez daha kullanmanızı sağlar.' },
          { level: 20, name: 'Minor Resist',    description: '10 metre yarıçapındaki bir alanda bulunan tüm düşmanların dirençlerini 10 saniye boyunca %20 düşürür. Yaratıklar üzerinde çalışmaz.' },
          { level: 23, name: 'Guard Summon',    description: 'Bir muhafız (ejderha) çağırırsınız, bu muhafız belirli bir süre boyunca devam eden saldırılar uygular.' },
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
      notes: 'Üç eşyayı topladıktan (ya da pazardan satın aldıktan) sonra Drake\'ye giderek 2nd Job Change görevini tamamlayarak Master skill\'lerinizi açabilirsiniz.',
    },
    highSkillRequirements: {
      level70: 5,
      level72: 7,
      level75: 10,
      level80: 15,
    },
    tips: [
      'Daha sık Instantly Magic + Light Shock kullanın. En mükemmel seçeneğiniz Double Blink değil.',
      'Priest ve Warrior\'lara resistance vermeye çalışın.',
      'BDW\'de, yanınızda en azından bir Chitin Shield ya da daha iyisi (Gab\'s Adamant +7 gibi) olsun.',
      'MP Fire Mage\'seniz BDW\'ye girmeyin. Bir işe yaramıyorsunuz.',
      'Juraid\'de, zaman kazanmak için Double Blink ve Call Party kullanın. Eğer başka bir Lightning mage varsa, Double Blink\'leyip ona Teleport\'lanın, o da Double Blink\'leyip Call Party kullansın (rolleri tersine çevirebilirsiniz). Bu şekilde bolca zaman kazanabilirsiniz.',
    ],
    aliases: [
      'mage', 'ko mage', 'knight mage', 'knight online mage',
      'büyücü', 'fire mage', 'ice mage', 'lightning mage',
      'mage rehber', 'mage build',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────────
  // PRIEST
  // ────────────────────────────────────────────────────────────────────────────
  {
    slug: 'priest',
    guideSlug: 'priest',
    name: 'Priest',
    nameEn: 'Priest',
    icon: '✨',
    color: '#10b981',
    primaryStat: 'Intelligence (INT) / Strength (STR)',
    races: ['El Morad Male', 'El Morad Female', 'Tuarek', 'Puri Tuarek'],
    masterTitle: { human: 'Paladin', karus: 'Shadow Knight' },
    masterNPC: '[Priest] Minerva — El Morad Castle / Luferson Castle',
    description:
      `Priest'ler dostlarını iyileştirip büyüleri ile onları saldırılardan koruyabildikleri gibi, düşmanlarına onları güçsüz bırakan lanetler yağdırabilirler.`,
    statBuilds: [],
    skillTrees: [
      {
        name: 'Basic',
        skills: [
          { level: 1,  name: 'Stroke',              description: '%70 hasar veren bir yakın menzil saldırısıdır.' },
          { level: 1,  name: 'Tiny Healing',        description: '15 HP iyileştirir.' },
          { level: 2,  name: 'Light Strike',        description: '29 Magic hasarı veren hafif bir büyü saldırısıdır.' },
          { level: 4,  name: 'Strength',            description: 'Strength\'i 15 arttırır.' },
          { level: 5,  name: 'Light Healing',       description: '30 HP iyileştirir.' },
          { level: 5,  name: 'Holy Attack',         description: '%90 hasar verir.' },
          { level: 6,  name: 'Resist Poison',       description: 'Poison direncini 20 arttırır.' },
          { level: 7,  name: 'Brightness',          description: '77 Magic hasarı veren hafif bir büyü saldırısıdır.' },
          { level: 8,  name: 'Tiny Restore',        description: '20 saniye boyunca 50 HP iyileştirir.' },
          { level: 10, name: 'Prayer of Cronos',    description: 'Doğaüstü güç, 100 saniye boyunca AP\'yi %20 arttırır.' },
          { level: 18, name: 'Light Magic Attack',  description: '105 Magic hasarı veren hafif bir büyü saldırısıdır.' },
          { level: 20, name: 'Prayer of God\'s Power', description: 'Doğaüstü güç, 100 saniye boyunca AP\'yi %50 arttırır.' },
          { level: 24, name: 'Light Counter',       description: '260 Magic hasarı veren hafif bir büyü saldırısıdır.' },
          { level: 33, name: 'Critical Light',      description: '385 Magic hasarı veren hafif bir büyü saldırısıdır.' },
        ],
      },
      {
        name: 'Heal',
        skills: [
          { level: 0,  name: 'Minor Healing',         description: '60 HP iyileştirir.' },
          { level: 3,  name: 'Light Restore',         description: '20 saniye boyunca 100 HP iyileştirir.' },
          { level: 9,  name: 'Healing',               description: '240 HP iyileştirir.' },
          { level: 12, name: 'Collision',             description: '%120 hasar veren ve başarısızlık şansı bulunmayan yakın menzilli bir saldırıdır.' },
          { level: 12, name: 'Restore',               description: '20 saniye boyunca 400 HP iyileştirir.' },
          { level: 18, name: 'Major Healing',         description: '360 HP iyileştirir.' },
          { level: 21, name: 'Shuddering',            description: '%150 hasar veren ve başarısızlık şansı bulunmayan yakın menzilli bir saldırıdır.' },
          { level: 21, name: 'Major Restore',         description: '20 saniye boyunca 600 HP iyileştirir.' },
          { level: 25, name: 'Cure Curse',            description: 'Direnç düşüren tüm büyüleri kaldırır.' },
          { level: 27, name: 'Great Healing',         description: '720 HP iyileştirir.' },
          { level: 30, name: 'Blasting',              description: 'Strength\'i 30 arttırır.' },
          { level: 30, name: 'Great Restore',         description: '20 saniye boyunca 800 HP iyileştirir.' },
          { level: 35, name: 'Cure Disease',          description: 'HP düşüren tüm büyüleri kaldırır.' },
          { level: 36, name: 'Massive Healing',       description: '960 HP iyileştirir.' },
          { level: 39, name: 'Massive Restore',       description: '20 saniye boyunca 1.500 HP iyileştirir.' },
          { level: 42, name: 'Ruin',                  description: 'Başarısızlık şansı olmayan ve %150 hasara ek olarak 100 hasar veren yakın menzilli bir saldırıdır.' },
          { level: 45, name: 'Superior Healing',      description: '1.920 HP iyileştirir.' },
          { level: 48, name: 'Superior Restore',      description: '20 saniye boyunca 2.500 HP iyileştirir.' },
          { level: 51, name: 'Hellish',               description: 'Başarısızlık şansı olmayan ve %200 hasara ek olarak 50 hasar veren yakın menzilli bir saldırıdır.' },
          { level: 54, name: 'Complete Healing',      description: 'Bir dostunuzun tüm sağlığını iyileştirir.' },
          { level: 57, name: 'Group Massive Healing', description: 'Tüm parti üyelerinizin 960 HP\'sini iyileştirirsiniz.' },
          { level: 60, name: 'Group Complete Healing',description: 'Partinizdeki herkesin tüm sağlığını iyileştirirsiniz.' },
          { level: 70, name: 'Critical Restore',      description: '20 metre yarıçapındaki bir alandaki parti arkadaşlarınızın 20 saniye boyunca 3.000 HP\'sini iyileştirirsiniz.' },
          { level: 75, name: 'Past Recovery',         description: 'Bir dostunuzun 2500 HP\'sini iyileştirir ve ek olarak 20 saniye boyunca 3000 HP\'sini daha iyileştirirsiniz.' },
          { level: 80, name: 'Past Restore',          description: '30 metre yarıçapındaki bir alandaki parti arkadaşlarınızın 20 saniye boyunca 6.000 HP\'sini iyileştirirsiniz.' },
        ],
      },
      {
        name: 'Aura (Buff)',
        skills: [
          { level: 3,  name: 'Insensibility Skin',      description: 'AC\'yi 10 dakikalığına 20 artırır.' },
          { level: 6,  name: 'Grace',                   description: 'Bir parti üyesinin HP\'sini 10 dakikalığına 60 artırır.' },
          { level: 9,  name: 'Resist All',              description: 'Magic, Curse ve Poison direncini 10 dakikalığına 20 arttırır.' },
          { level: 12, name: 'Wrath',                   description: 'Başarısızlık şansı olmayan ve %120 hasar veren yakın menzilli bir saldırıdır.' },
          { level: 12, name: 'Insensibility Shell',     description: 'AC\'yi 10 dakikalığına 40 artırır.' },
          { level: 15, name: 'Brave',                   description: 'Bir parti üyesinin HP\'sini 10 dakikalığına 240 artırır.' },
          { level: 21, name: 'Wield',                   description: 'Başarısızlık şansı bulunmayan ve %150 hasar veren yakın menzilli bir saldırı.' },
          { level: 21, name: 'Insensibility Armor',     description: 'AC\'yi 10 dakikalığına 80 artırır.' },
          { level: 24, name: 'Strong',                  description: 'Bir parti üyesinin HP\'sini 10 dakikalığına 360 artırır.' },
          { level: 27, name: 'Bright Mind',             description: 'Magic, Curse ve Poison direncini 10 dakikalığına 40 arttırır.' },
          { level: 30, name: 'Wildness',                description: 'Strength\'i 4 dakikalığına 30 artırır.' },
          { level: 30, name: 'Insensibility Shield',    description: 'AC\'yi 10 dakikalığına 120 artırır.' },
          { level: 33, name: 'Hardness',                description: 'Bir parti üyesinin HP\'sini 10 dakikalığına 720 artırır.' },
          { level: 36, name: 'Calm Mind',               description: 'Magic, Curse ve Poison direncini 10 dakikalığına 60 arttırır.' },
          { level: 39, name: 'Insensibility Barrier',  description: 'AC\'yi 10 dakikalığına 160 artırır.' },
          { level: 42, name: 'Harsh',                   description: 'Başarısızlık şansı bulunmayan ve %150 hasara ek 100 hasar veren yakın menzilli bir saldırıdır.' },
          { level: 42, name: 'Mightness',               description: 'Bir parti üyesinin HP\'sini 10 dakikalığına 960 artırır.' },
          { level: 45, name: 'Fresh Mind',              description: 'Magic, Curse ve Poison direncini 10 dakikalığına 80 arttırır.' },
          { level: 51, name: 'Collapse',                description: 'Başarısızlık şansı bulunmayan ve %200 hasara ek 50 hasar veren yakın menzilli bir saldırıdır.' },
          { level: 51, name: 'Insensibility Protector', description: 'AC\'yi 10 dakikalığına 200 artırır.' },
          { level: 54, name: 'Undying',                 description: 'Bir parti üyesinin azami HP sınırını 10 dakikalığına %60 artırır.' },
          { level: 54, name: 'Heapness',                description: 'Bir parti üyesinin azami HP sınırını 10 dakikalığına 1.200 artırır.' },
          { level: 57, name: 'Greatness',               description: 'Tüm parti üyelerinin azami HP sınırını 10 dakikalığına 1.200 artırır.' },
          { level: 57, name: 'Massiveness',             description: 'Bir parti üyesinin azami HP sınırını 10 dakikalığına 1.500 artırır.' },
          { level: 60, name: 'Insensibility Peel',      description: 'AC\'yi 10 dakikalığına 300 artırır.' },
          { level: 70, name: 'Imposingness',            description: 'Bir parti üyesinin azami HP sınırını 10 dakikalığına 2.000 artırır.' },
          { level: 70, name: 'Bless of God',            description: 'Tüm parti üyelerine cure uygular.' },
          { level: 72, name: 'Massive Binder',          description: 'Tüm parti üyelerinin azami HP sınırını 10 dakikalığına 2.000 artırır.' },
          { level: 74, name: 'Round Insensibility',     description: 'Tüm parti üyelerinin AC\'lerini 10 dakikalığına 300 artırır.' },
          { level: 76, name: 'Insensibility Guard',     description: 'Bir parti üyesinin AC\'sini 10 dakikalığına 350 artırır.' },
          { level: 78, name: 'Superioris',              description: 'Parti üyesinin azami HP sınırını 10 dakikalığına 2.500 artırır.' },
          { level: 80, name: 'Counter Curse',           description: '10 saniyeliğine tüm curse\'leri engeller.' },
        ],
      },
      {
        name: 'Holy (Debuff)',
        skills: [
          { level: 0,  name: 'Gate',                    description: 'Seçilen canlanma noktasına ışınlar.' },
          { level: 3,  name: 'Malice',                  description: 'Düşmanınızın AC\'sini %25 düşürür.' },
          { level: 9,  name: 'Clear Mana',              description: 'Düşmanınızın Mana\'sını 480 düşürür.' },
          { level: 12, name: 'Tilt',                    description: 'Başarısızlık şansı olmayan ve %120 hasar veren yakın menzilli bir saldırıdır.' },
          { level: 15, name: 'Confusion',               description: 'Düşmanınızın Magic Power\'ını 30 düşürür.' },
          { level: 21, name: 'Bloody',                  description: 'Başarısızlık şansı bulunmayan ve %150 hasar veren yakın menzilli bir saldırıdır.' },
          { level: 24, name: 'Slow',                    description: 'Düşmanınızın saldırı hızını %20 düşürür.' },
          { level: 27, name: 'Reverse Life',            description: 'Düşmanınızın HP bonuslarını kaldırır.' },
          { level: 30, name: 'Eruption',                description: 'Strength\'i 30 artırır.' },
          { level: 30, name: 'Sleep Wing',              description: 'Bir yaratığı 20 saniyeliğine uykuya yatırır.' },
          { level: 33, name: 'Resurrection of Love',    description: 'Kaybedilen exp\'in %60\'ını geri kazandırarak canlandırır.' },
          { level: 36, name: 'Sweep Mana',              description: 'Düşmanınızın Mana\'sını 960 düşürür.' },
          { level: 39, name: 'Raving Edge',             description: 'Başarısızlık şansı olmayan ve %150 hasara ek olarak 100 hasar veren yakın menzilli bir saldırıdır.' },
          { level: 42, name: 'Resurrection of Grace',   description: 'Kaybedilen exp\'in %70\'ini geri kazandırarak canlandırır.' },
          { level: 45, name: 'Parasite',                description: 'Düşmanınızın azami HP\'sini %20 düşürür.' },
          { level: 51, name: 'Hades',                   description: 'Başarısızlık şansı bulunmayan ve %200 hasara ek olarak 50 hasar veren yakın menzilli bir saldırıdır.' },
          { level: 51, name: 'Sleep Carpet',            description: 'Belirli bir alandaki tüm yaratıkları 20 saniyeliğine uykuya yatırır.' },
          { level: 54, name: 'Resurrection of Favors',  description: 'Kaybedilen exp\'in %80\'ini geri kazandırarak canlandırır.' },
          { level: 57, name: 'Torment',                 description: 'Belirli bir alandaki tüm düşmanların savunmalarını %30 düşürür.' },
          { level: 60, name: 'Massive',                 description: 'Düşmanınızın AP\'sini %20 düşürür.' },
          { level: 70, name: 'Subside',                 description: 'Belirli bir alandaki düşmanların saldırı yeteneklerini %20 düşürür.' },
          { level: 75, name: 'Superior Parasite',       description: 'Bir düşmanın HP\'sini %30 düşürür. Unique yaratıklarda uygulanamaz.' },
          { level: 80, name: 'Discountis',              description: 'Bir düşmanın Mana\'sını 3.840 düşürür.' },
        ],
      },
      {
        name: 'Master',
        skills: [
          { level: 0,  name: 'Daring',            description: '[Pasif] HP\'niz %30\'a ya da altına düştüğünde savunmanızı %20 artırır.' },
          { level: 2,  name: 'Judgment',          description: 'Başarısızlık şansı olmayan ve %200 hasara ek 150 hasar veren yakın menzilli bir saldırıdır.' },
          { level: 5,  name: 'Absoluteness',      description: '[Pasif] Tüm saldırıların hasarını %10 düşürür.' },
          { level: 10, name: 'Matchless',         description: '[Pasif] Alınan tüm hasarları %15 düşürür.' },
          { level: 12, name: 'Helis',             description: 'Başarısızlık şansı bulunmayan ve %250 hasara ek olarak karşı tarafın savunmasını yok sayan 400 hasar veren yakın menzilli bir saldırıdır.' },
          { level: 15, name: 'Curse Refraction',  description: 'Tüm curse\'leri 10 saniyeliğine engeller ve bir curse\'ü gönderene geri yollama şansına sahiptir.' },
          { level: 20, name: 'Elysian Web',       description: 'Büyüsel saldırılardan alınan hasarı %30 düşürmek için Magic direncini 20 saniyeliğine 70 artırır.' },
          { level: 23, name: 'Minak\'s Thorn',    description: 'Tüm parti üyelerine yapılan direkt saldırıların %10\'unu yansıtan bir aura uygular. Thorn etkisi cast süresince devam eder ve size uygulanan tüm hasarın %10\'unu geri yansıtır.' },
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
      notes: 'Üç eşyayı topladıktan (ya da pazardan satın aldıktan) sonra Minerva\'ya giderek 2nd Job Change görevini tamamlayarak Master skill\'lerinizi açabilirsiniz.',
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
      'Skill barınızda olması gereken heal\'ler 10k ve 960 aoe heal\'den ibaret değildir.',
      'Debuff\'lama, healing\'i geri plana itecektir. Parti üyeleriniz ölüyken Torment yapıştırmanın anlamı nedir ki?',
      'Zaten canı düşük olan bir hedefi Parasite\'lamayın. Bu onlar için bedava /town olacaktır.',
      'Juraid\'de, yalnızca öldürülmekte olan canavarları değil, öldürülecek olanları da önden Parasite ve Superior Parasite\'layın.',
      'Forgotten Temple\'da, mümkünse parti üyelerinize Fresh Mind ve ayrıca Undying verin.',
      'BDW\'de, karşı tarafında debuff\'a sahip olmaması durumunda Undying verdiğinizden emin olun.',
      'BDW\'de, önceliğiniz bayrak taşıyıcınızın etrafında bulunmak ve mümkün olduğunca onu heal\'lemek olsun.',
      'Juraid\'de bildiğiniz gibi olay hızda bitiyor. Eğer saldırı yapmayan ve Lobo hammer kullanan bir Priest\'seniz, muhtemelen bir işe yaramıyorsunuzdur. Skill bar\'ınıza Helis yerleştirin ve Smite +11 ya da benzer bir şeyle takımınıza yardım edin.',
    ],
    aliases: [
      'priest', 'ko priest', 'knight priest', 'knight online priest',
      'heal priest', 'attack priest', 'healer', 'priest rehber',
    ],
  },
]

// ─── Yardımcı Fonksiyonlar ─────────────────────────────────────────────────

/** guideSlug'a göre sınıf verisini döndürür */
export function getClassBySlug(slug: string): ClassData | undefined {
  return KO_CLASSES.find((c) => c.guideSlug === slug || c.slug === slug)
}

/** Alias'a göre sınıf verisini döndürür */
export function getClassByAlias(alias: string): ClassData | undefined {
  const lower = alias.toLowerCase()
  return KO_CLASSES.find(
    (c) =>
      c.aliases.some((a) => a.toLowerCase() === lower) ||
      c.name.toLowerCase() === lower
  )
}

/** Tüm guide slug'larını döndürür */
export function getAllClassSlugs(): string[] {
  return KO_CLASSES.map((c) => c.guideSlug)
}
