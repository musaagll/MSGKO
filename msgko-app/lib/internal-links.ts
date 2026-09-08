/**
 * MSGKO — Otomatik Internal Linking Motoru
 *
 * Bir metin içinde geçen Knight Online entity isimlerini (boss, item,
 * harita, karakter sınıfı, quest vb.) otomatik olarak ilgili sayfalara
 * bağlayan sistematik bir içerik işleyicisi.
 *
 * Kullanım:
 *   import { linkifyContent } from '@/lib/internal-links'
 *   const linked = linkifyContent(rawText, { currentPath: '/boss/felankor' })
 *
 * Çıktı: React.ReactNode[] — içinde <a> etiketleri olan bir dizi
 *
 * Kural: Aynı sayfaya aşırı link verme. Her entity'ye en fazla 1 kez link ver.
 */

// ─── Entity Tanımları ─────────────────────────────────────────────────────────

export interface LinkEntity {
  /** Metinde aranacak kelimeler (büyük/küçük harf duyarsız) */
  patterns: string[]
  /** Hedef URL */
  href: string
  /** Entity adı (link title attribute için) */
  title: string
  /** Entity türü */
  type: 'guide' | 'boss' | 'item' | 'map' | 'quest' | 'build' | 'farm' | 'skill'
  /** Bağlantı önceliği — yüksek öncelikli entity'ler çakışmada kazanır */
  priority: number
}

/** Tüm bağlantı kuralları — sıraya göre önceliklidir */
export const LINK_ENTITIES: LinkEntity[] = [
  // ── Boss'lar ───────────────────────────────────────────────────────────────
  {
    patterns: ['Felankor', 'felankor'],
    href: '/boss/felankor',
    title: 'Knight Online Felankor Boss Rehberi',
    type: 'boss',
    priority: 90,
  },
  {
    patterns: ['Isiloon', 'isiloon'],
    href: '/boss/isiloon',
    title: 'Knight Online Isiloon Boss Rehberi',
    type: 'boss',
    priority: 85,
  },
  {
    patterns: ['Apostle of God', 'Apostle'],
    href: '/boss/apostle-of-god',
    title: 'Knight Online Apostle of God Boss Rehberi',
    type: 'boss',
    priority: 80,
  },
  {
    patterns: ['Kundun', 'kundun'],
    href: '/boss/kundun',
    title: 'Knight Online Kundun Boss Rehberi',
    type: 'boss',
    priority: 80,
  },
  {
    patterns: ['Talos', 'talos'],
    href: '/boss/talos',
    title: 'Knight Online Talos Boss Rehberi',
    type: 'boss',
    priority: 75,
  },
  {
    patterns: ['Titans', 'titans'],
    href: '/boss/titans',
    title: 'Knight Online Titans Boss Rehberi',
    type: 'boss',
    priority: 75,
  },
  {
    patterns: ['Bellon', 'bellon'],
    href: '/boss/bellon',
    title: 'Knight Online Bellon Boss Rehberi',
    type: 'boss',
    priority: 70,
  },

  // ── Haritalar ──────────────────────────────────────────────────────────────
  {
    patterns: ['Ronark Land', 'CZ', 'Controlled Zone'],
    href: '/harita/ronark-land',
    title: 'Knight Online Ronark Land (CZ) Harita Rehberi',
    type: 'map',
    priority: 85,
  },
  {
    patterns: ['Ardream'],
    href: '/harita/ardream',
    title: 'Knight Online Ardream Harita Rehberi',
    type: 'map',
    priority: 75,
  },
  {
    patterns: ['Forgotten Temple', 'FT'],
    href: '/harita/forgotten-temple',
    title: 'Knight Online Forgotten Temple (FT) Rehberi',
    type: 'map',
    priority: 80,
  },
  {
    patterns: ['Juraid Mountain', 'Juraid'],
    href: '/harita/juraid-mountain',
    title: 'Knight Online Juraid Mountain Dungeon Rehberi',
    type: 'map',
    priority: 75,
  },
  {
    patterns: ['Ronark Land Base', 'RLB'],
    href: '/harita/ronark-land-base',
    title: 'Knight Online RLB Harita Rehberi',
    type: 'map',
    priority: 70,
  },
  {
    patterns: ['Colony Zone'],
    href: '/harita/colony-zone',
    title: 'Knight Online Colony Zone Rehberi',
    type: 'map',
    priority: 70,
  },
  {
    patterns: ['Eslant'],
    href: '/harita/eslant',
    title: 'Knight Online Eslant Harita Rehberi',
    type: 'map',
    priority: 70,
  },
  {
    patterns: ['Moradon'],
    href: '/harita/moradon',
    title: 'Knight Online Moradon Rehberi',
    type: 'map',
    priority: 65,
  },
  {
    patterns: ['El Morad'],
    href: '/harita/el-morad',
    title: 'Knight Online El Morad Rehberi',
    type: 'map',
    priority: 65,
  },
  {
    patterns: ['Delos'],
    href: '/harita/delos',
    title: 'Knight Online Delos Harita Rehberi',
    type: 'map',
    priority: 65,
  },

  // ── Karakter Rehberleri ────────────────────────────────────────────────────
  {
    patterns: ['Asas', 'Assassin', 'Rogue'],
    href: '/rehber/asas',
    title: 'Knight Online Asas Rehberi',
    type: 'guide',
    priority: 70,
  },
  {
    patterns: ['Okçu', 'Archer'],
    href: '/rehber/okcu',
    title: 'Knight Online Okçu Rehberi',
    type: 'guide',
    priority: 70,
  },
  {
    patterns: ['Warrior', 'Savaşçı'],
    href: '/rehber/warrior',
    title: 'Knight Online Warrior Rehberi',
    type: 'guide',
    priority: 70,
  },
  {
    patterns: ['Mage', 'Büyücü'],
    href: '/rehber/mage',
    title: 'Knight Online Mage Rehberi',
    type: 'guide',
    priority: 70,
  },
  {
    patterns: ['Battle Priest', 'BP'],
    href: '/rehber/battle-priest',
    title: 'Knight Online Battle Priest Rehberi',
    type: 'guide',
    priority: 72, // Priest'ten önce eşleşmeli
  },
  {
    patterns: ['Priest'],
    href: '/rehber/priest',
    title: 'Knight Online Priest Rehberi',
    type: 'guide',
    priority: 68,
  },

  // ── Item'lar ───────────────────────────────────────────────────────────────
  {
    patterns: ['Raptor'],
    href: '/item/raptor',
    title: 'Knight Online Raptor Item Rehberi',
    type: 'item',
    priority: 75,
  },
  {
    patterns: ['Dual Blade'],
    href: '/item/dual-blade',
    title: 'Knight Online Dual Blade Item Rehberi',
    type: 'item',
    priority: 70,
  },
  {
    patterns: ['Chitin Staff', "Chitin's Staff"],
    href: '/item/chitins-staff',
    title: 'Knight Online Chitin Staff Item Rehberi',
    type: 'item',
    priority: 70,
  },

  // ── Quest'ler ──────────────────────────────────────────────────────────────
  {
    patterns: ['Guardian of 7 Keys', 'Anahtar Görevi', '7 Keys'],
    href: '/quest/guardian-of-7-keys',
    title: 'Knight Online Guardian of 7 Keys Görev Rehberi',
    type: 'quest',
    priority: 75,
  },
  {
    patterns: ['Bifrost'],
    href: '/quest/bifrost-quest',
    title: 'Knight Online Bifrost Görevi Rehberi',
    type: 'quest',
    priority: 70,
  },
]

// ─── Yardımcı Fonksiyonlar ────────────────────────────────────────────────────

/**
 * Bir metni parçalara böler: metin parçası veya link verisi.
 */
interface TextSegment {
  type: 'text'
  content: string
}

interface LinkSegment {
  type: 'link'
  content: string
  href: string
  title: string
  entityType: string
}

type Segment = TextSegment | LinkSegment

/**
 * Escape regex özel karakterleri
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Ham metin içinde entity'leri bulur ve segment listesi döndürür.
 *
 * @param text - İşlenecek ham metin
 * @param currentPath - Mevcut sayfa path'i (kendi sayfasına link vermemek için)
 * @param maxLinksPerEntity - Her entity'ye verilecek max link sayısı (default: 1)
 */
export function parseLinks(
  text: string,
  opts: {
    currentPath?: string
    maxLinksPerEntity?: number
    maxTotalLinks?: number
  } = {}
): Segment[] {
  const { currentPath = '', maxLinksPerEntity = 1, maxTotalLinks = 15 } = opts

  // Önceliğe göre sırala (yüksekten düşüğe)
  const sortedEntities = [...LINK_ENTITIES].sort((a, b) => b.priority - a.priority)

  // Mevcut sayfayla aynı href'e sahip entity'leri filtrele
  const eligibleEntities = sortedEntities.filter(
    (e) => !currentPath || !currentPath.startsWith(e.href)
  )

  // Kullanım sayaçları
  const usageCount: Record<string, number> = {}
  let totalLinks = 0

  // İlk segment: tüm metin
  let segments: Segment[] = [{ type: 'text', content: text }]

  for (const entity of eligibleEntities) {
    if (totalLinks >= maxTotalLinks) break

    const entityKey = entity.href
    if ((usageCount[entityKey] ?? 0) >= maxLinksPerEntity) continue

    // Tüm pattern'ları dene (uzundan kısaya — "Battle Priest" > "Priest")
    const sortedPatterns = [...entity.patterns].sort((a, b) => b.length - a.length)

    for (const pattern of sortedPatterns) {
      const regex = new RegExp(`\\b(${escapeRegex(pattern)})\\b`, 'gi')
      let matched = false

      const newSegments: Segment[] = []

      for (const seg of segments) {
        if (seg.type !== 'text') {
          newSegments.push(seg)
          continue
        }

        const parts = seg.content.split(regex)
        if (parts.length === 1) {
          newSegments.push(seg)
          continue
        }

        // Eşleşme bulundu
        for (let i = 0; i < parts.length; i++) {
          if (parts[i] === '') continue

          if (regex.test(parts[i]) || pattern.toLowerCase() === parts[i].toLowerCase()) {
            // İlk N eşleşmeyi link yap
            if ((usageCount[entityKey] ?? 0) < maxLinksPerEntity && totalLinks < maxTotalLinks) {
              newSegments.push({
                type: 'link',
                content: parts[i],
                href: entity.href,
                title: entity.title,
                entityType: entity.type,
              })
              usageCount[entityKey] = (usageCount[entityKey] ?? 0) + 1
              totalLinks++
              matched = true
            } else {
              newSegments.push({ type: 'text', content: parts[i] })
            }
          } else {
            newSegments.push({ type: 'text', content: parts[i] })
          }
        }

        // regex.lastIndex sıfırla
        regex.lastIndex = 0
      }

      if (matched) {
        segments = newSegments
        break // Bu entity için pattern eşleşti, sonraki entity'e geç
      }
    }
  }

  return segments
}

/**
 * Segment listesini düz metin + basit HTML string'e dönüştürür.
 * (Server Components içinde dangerouslySetInnerHTML ile kullanılabilir)
 */
export function segmentsToHtml(segments: Segment[]): string {
  return segments
    .map((seg) => {
      if (seg.type === 'text') return escapeHtml(seg.content)
      return `<a href="${seg.href}" title="${escapeHtml(seg.title)}" class="ko-internal-link">${escapeHtml(seg.content)}</a>`
    })
    .join('')
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Segment listesini JSX için hazır veri dizisine dönüştürür.
 * Bileşen içinde .map() ile render edilebilir.
 */
export interface RenderSegment {
  key: string
  isLink: boolean
  content: string
  href?: string
  title?: string
  entityType?: string
}

export function segmentsToRenderData(segments: Segment[]): RenderSegment[] {
  return segments.map((seg, idx) => {
    if (seg.type === 'link') {
      return {
        key: `link-${idx}`,
        isLink: true,
        content: seg.content,
        href: seg.href,
        title: seg.title,
        entityType: seg.entityType,
      }
    }
    return {
      key: `text-${idx}`,
      isLink: false,
      content: seg.content,
    }
  })
}

// ─── Yardımcı: Belirli entity'ler için ilgili sayfalar ───────────────────────

/** Bir entity ile ilişkili diğer sayfaların listesini döndürür */
export function getRelatedLinks(entityHref: string): LinkEntity[] {
  const current = LINK_ENTITIES.find((e) => e.href === entityHref)
  if (!current) return []

  // Aynı türdeki ilgili entity'ler
  return LINK_ENTITIES.filter(
    (e) => e.href !== entityHref && e.type === current.type
  ).slice(0, 6)
}

/** Boss ile ilişkili harita linkini döndürür */
export function getBossMapLink(mapSlug: string | null): LinkEntity | undefined {
  if (!mapSlug) return undefined
  return LINK_ENTITIES.find((e) => e.type === 'map' && e.href === `/harita/${mapSlug}`)
}

/** Bir sınıfın tüm ilgili entity linklerini döndürür */
export function getClassRelatedLinks(classSlug: string): {
  builds: LinkEntity[]
  guides: LinkEntity[]
} {
  return {
    guides: LINK_ENTITIES.filter((e) => e.type === 'guide' && e.href === `/rehber/${classSlug}`),
    builds: LINK_ENTITIES.filter((e) => e.type === 'build'),
  }
}

// ─── Orphan kontrolü için sayfa envanteri ────────────────────────────────────

/**
 * Tüm indexlenebilir sayfa path'lerinin listesi.
 * SEO dashboard'da orphan page tespiti için kullanılır.
 * Yeni route eklendiğinde buraya da eklenmelidir.
 */
export const ALL_INDEXABLE_PATHS: string[] = [
  '/',
  '/youtube',
  '/instagram',
  '/wallpaper',
  // Rehberler
  '/rehber',
  '/rehber/asas',
  '/rehber/okcu',
  '/rehber/warrior',
  '/rehber/mage',
  '/rehber/priest',
  '/rehber/archer',
  '/rehber/battle-priest',
  // Boss'lar
  '/boss',
  '/boss/felankor',
  '/boss/isiloon',
  '/boss/apostle-of-god',
  '/boss/kundun',
  '/boss/talos',
  '/boss/titans',
  '/boss/bellon',
  // Haritalar
  '/harita',
  '/harita/ronark-land',
  '/harita/ardream',
  '/harita/forgotten-temple',
  '/harita/juraid-mountain',
  '/harita/ronark-land-base',
  '/harita/colony-zone',
  '/harita/eslant',
  '/harita/moradon',
  '/harita/el-morad',
  '/harita/delos',
  // İtemler
  '/item',
  '/item/raptor',
  '/item/dual-blade',
  '/item/chitins-staff',
  // Haberler (dinamik)
  '/haber',
  // Farm
  '/farm',
  // Build
  '/build',
]

/**
 * Bir path'in sitede en az bir yerden link aldığını kontrol eder.
 * LINK_ENTITIES içindeki href listesine bakılır.
 */
export function isOrphanPage(path: string): boolean {
  if (path === '/') return false
  return !LINK_ENTITIES.some((e) => e.href === path)
}
