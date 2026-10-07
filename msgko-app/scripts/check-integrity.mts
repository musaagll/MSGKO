/**
 * İçerik ve stil bütünlük kontrolü — `npm run check` (CI'da da çalışır).
 *
 * 1. Statik veride slug'lar benzersiz mi, SEO alanları dolu mu?
 * 2. Kodda kullanılan her CSS değişkeni (var(--x)) globals.css'te ya da next/font ile tanımlı mı?
 *    (23 Eylül tasarım güncellemesinde 17 değişkenin silinip sayfaların stilsiz kalması gibi
 *    regresyonları yakalar.)
 *
 * Node 22.18+ TypeScript'i doğrudan çalıştırır: node scripts/check-integrity.mts
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const data = (f: string) => new URL(`../lib/ko-data/${f}`, import.meta.url).href

const { KO_BOSSES } = await import(data('bosses.ts'))
const { KO_ITEMS } = await import(data('items.ts'))
const { KO_MAPS } = await import(data('maps.ts'))
const { KO_CLASSES } = await import(data('classes.ts'))

const errors: string[] = []
const warnings: string[] = []

// ── 1. Statik veri ──────────────────────────────────────────────────────────
type Rec = { slug: string; is_published?: boolean; seo_title?: string | null; seo_description?: string | null }
for (const [name, list] of [['boss', KO_BOSSES], ['item', KO_ITEMS], ['harita', KO_MAPS]] as [string, Rec[]][]) {
  const seen = new Set<string>()
  for (const r of list) {
    if (seen.has(r.slug)) errors.push(`${name}: tekrar eden slug "${r.slug}"`)
    seen.add(r.slug)
    if (!/^[a-z0-9-]+$/.test(r.slug)) errors.push(`${name}: geçersiz slug "${r.slug}"`)
    if (r.is_published && !r.seo_description) warnings.push(`${name}/${r.slug}: seo_description boş`)
  }
}
for (const c of KO_CLASSES as { guideSlug: string; description: string }[]) {
  if (!c.description) errors.push(`rehber/${c.guideSlug}: description boş`)
}

// Yayınlanmamış hedeflere giden referanslar sayfada düz metin olarak basılır; bilgi amaçlı listele
const pub = (list: Rec[]) => new Set(list.filter((r) => r.is_published).map((r) => r.slug))
const bosses = pub(KO_BOSSES), items = pub(KO_ITEMS), maps = pub(KO_MAPS)
let unlinked = 0
for (const b of KO_BOSSES) for (const d of b.drop_list) if (d.item_slug && !items.has(d.item_slug)) unlinked++
for (const m of KO_MAPS) for (const b of m.bosses_here) if (!bosses.has(b.boss_slug)) unlinked++
for (const b of KO_BOSSES) if (b.map_slug && !maps.has(b.map_slug)) unlinked++

// ── 2. CSS değişkenleri ─────────────────────────────────────────────────────
const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? walk(p) : /\.(tsx?|css)$/.test(f) ? [p] : []
  })
const css = readFileSync(join(root, 'app/globals.css'), 'utf8')
const defined = new Set([...css.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((m) => m[1]))
defined.add('--font-inter').add('--font-cinzel') // next/font (app/layout.tsx)
// Tailwind'in kendi değişkenleri
const isTailwind = (v: string) => /^--(tw-|color-|spacing|radius|font-(sans|mono|serif|display)|text-|leading-|tracking-)/.test(v)

for (const file of [...walk(join(root, 'app')), ...walk(join(root, 'components'))]) {
  const src = readFileSync(file, 'utf8')
  // Aynı dosyada style prop'u ile atanan değişkenler (ör. style={{ ['--cls']: renk }})
  const local = new Set([...src.matchAll(/['"](--[a-z0-9-]+)['"]/gi)].map((m) => m[1]))
  for (const m of src.matchAll(/var\((--[a-z0-9-]+)/gi)) {
    if (!defined.has(m[1]) && !local.has(m[1]) && !isTailwind(m[1])) {
      errors.push(`${relative(root, file)}: tanımsız CSS değişkeni ${m[1]}`)
    }
  }
}

// ── Sonuç ───────────────────────────────────────────────────────────────────
for (const w of warnings) console.warn('uyarı:', w)
console.log(`bilgi: yayında olmayan sayfalara ${unlinked} referans düz metin olarak gösteriliyor`)
if (errors.length) {
  for (const e of [...new Set(errors)]) console.error('HATA:', e)
  process.exit(1)
}
console.log('✓ içerik ve CSS bütünlüğü temiz')
