/**
 * İçerik ve stil bütünlük kontrolü — `npm run check` (CI'da da çalışır).
 *
 * 1. Sınıf rehberi verisi: slug'lar benzersiz mi, açıklamalar dolu mu?
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

const { KO_CLASSES } = await import(data('classes.ts'))

const errors: string[] = []
const warnings: string[] = []

// ── 1. Statik veri ──────────────────────────────────────────────────────────
const slugs = new Set<string>()
for (const c of KO_CLASSES as { guideSlug: string; description: string }[]) {
  if (slugs.has(c.guideSlug)) errors.push(`rehber: tekrar eden slug "${c.guideSlug}"`)
  slugs.add(c.guideSlug)
  if (!c.description) errors.push(`rehber/${c.guideSlug}: description boş`)
}


// ── 2. CSS değişkenleri ─────────────────────────────────────────────────────
const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? walk(p) : /\.(tsx?|css)$/.test(f) ? [p] : []
  })
const css = readFileSync(join(root, 'app/globals.css'), 'utf8')
const defined = new Set([...css.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((m) => m[1]))
defined.add('--font-body').add('--font-heading') // next/font (app/layout.tsx)
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
if (errors.length) {
  for (const e of [...new Set(errors)]) console.error('HATA:', e)
  process.exit(1)
}
console.log('✓ içerik ve CSS bütünlüğü temiz')
