'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search, AlertCircle, CheckCircle2, ExternalLink,
  Globe, FileText, Map, Sword, BookOpen, TrendingUp,
  Link2, BarChart3, ArrowRight, RefreshCw,
} from 'lucide-react'

// ── Statik SEO envanteri (msgko-app lib/internal-links.ts ile eşleşmeli) ──────
const INDEXABLE_PAGES = [
  // Ana
  { path: '/',           title: 'Ana Sayfa',           section: 'core' },
  { path: '/youtube',    title: 'YouTube',              section: 'core' },
  { path: '/instagram',  title: 'Instagram',            section: 'core' },
  { path: '/wallpaper',  title: 'Wallpaper',            section: 'core' },
  // Rehberler
  { path: '/rehber',           title: 'Rehber İndex',         section: 'rehber' },
  { path: '/rehber/asas',      title: 'Asas Rehberi',         section: 'rehber' },
  { path: '/rehber/okcu',      title: 'Okçu Rehberi',         section: 'rehber' },
  { path: '/rehber/warrior',   title: 'Warrior Rehberi',      section: 'rehber' },
  { path: '/rehber/mage',      title: 'Mage Rehberi',         section: 'rehber' },
  { path: '/rehber/priest',    title: 'Priest Rehberi',       section: 'rehber' },
  { path: '/rehber/battle-priest', title: 'Battle Priest',    section: 'rehber' },
  // Boss'lar
  { path: '/boss',                    title: 'Boss İndex',      section: 'boss' },
  { path: '/boss/felankor',           title: 'Felankor',         section: 'boss' },
  { path: '/boss/isiloon',            title: 'Isiloon',          section: 'boss' },
  { path: '/boss/apostle-of-god',     title: 'Apostle of God',   section: 'boss' },
  { path: '/boss/kundun',             title: 'Kundun',           section: 'boss' },
  { path: '/boss/talos',              title: 'Talos',            section: 'boss' },
  { path: '/boss/titans',             title: 'Titans',           section: 'boss' },
  { path: '/boss/bellon',             title: 'Bellon',           section: 'boss' },
  // Haritalar
  { path: '/harita',                  title: 'Harita İndex',     section: 'harita' },
  { path: '/harita/ronark-land',      title: 'Ronark Land (CZ)', section: 'harita' },
  { path: '/harita/ardream',          title: 'Ardream',          section: 'harita' },
  { path: '/harita/forgotten-temple', title: 'Forgotten Temple', section: 'harita' },
  { path: '/harita/juraid-mountain',  title: 'Juraid Mountain',  section: 'harita' },
  { path: '/harita/ronark-land-base', title: 'RLB',              section: 'harita' },
  { path: '/harita/colony-zone',      title: 'Colony Zone',      section: 'harita' },
  { path: '/harita/eslant',           title: 'Eslant',           section: 'harita' },
  { path: '/harita/moradon',          title: 'Moradon',          section: 'harita' },
  { path: '/harita/el-morad',         title: 'El Morad',         section: 'harita' },
  { path: '/harita/delos',            title: 'Delos',            section: 'harita' },
  // Item'lar
  { path: '/item',               title: 'Item İndex',    section: 'item' },
  { path: '/item/raptor',        title: 'Raptor',         section: 'item' },
  { path: '/item/dual-blade',    title: 'Dual Blade',     section: 'item' },
  { path: '/item/chitins-staff', title: 'Chitins Staff',  section: 'item' },
  // Hub sayfaları
  { path: '/build',  title: 'Build İndex',  section: 'hub' },
  { path: '/farm',   title: 'Farm İndex',   section: 'hub' },
  { path: '/haber',  title: 'Haber İndex',  section: 'hub' },
]

const NOINDEX_PAGES = [
  { path: '/destek',   reason: 'İçerik değeri düşük' },
  { path: '/iletisim', reason: 'Kişisel iletişim sayfası' },
  { path: '/login',    reason: 'Admin giriş — index dışı' },
]

// SEO kontrol kuralları
const SEO_RULES = [
  {
    id: 'title',
    label: 'Unique Title',
    description: 'Her sayfanın benzersiz başlığı var mı?',
    check: 'Tüm yeni sayfalar buildGuide/Item/BossTitle() factory\'leri kullanıyor.',
    status: 'ok' as const,
  },
  {
    id: 'description',
    label: 'Meta Description',
    description: 'Her sayfa için meta description oluşturuluyor mu?',
    check: 'lib/seo.ts\'deki factory fonksiyonlar otomatik üretiyor.',
    status: 'ok' as const,
  },
  {
    id: 'canonical',
    label: 'Canonical URL',
    description: 'Tüm sayfalarda canonical link var mı?',
    check: 'buildMetadata() her çağrıda alternates.canonical ekliyor.',
    status: 'ok' as const,
  },
  {
    id: 'schema',
    label: 'Structured Data',
    description: 'Schema.org JSON-LD doğru ekleniyor mu?',
    check: 'Article + FAQPage + BreadcrumbList her içerik sayfasında mevcut.',
    status: 'ok' as const,
  },
  {
    id: 'breadcrumb',
    label: 'Breadcrumb',
    description: 'Her sayfada breadcrumb navigasyon var mı?',
    check: 'Tüm detail sayfaları breadcrumb kullanıyor.',
    status: 'ok' as const,
  },
  {
    id: 'sitemap',
    label: 'Sitemap',
    description: 'Sitemap dinamik ve güncel mi?',
    check: 'app/sitemap.ts statik veri ile otomatik üretiliyor.',
    status: 'ok' as const,
  },
  {
    id: 'robots',
    label: 'Robots.txt',
    description: 'Değerli sayfalar izin verilmiş, gereksizler engellendi mi?',
    check: 'app/robots.ts tüm yeni route\'ları allow ediyor.',
    status: 'ok' as const,
  },
  {
    id: 'internal-links',
    label: 'Internal Linking',
    description: 'Entity\'ler arası otomatik link oluşturuluyor mu?',
    check: 'lib/internal-links.ts LINK_ENTITIES ile otomatik bağlama yapılıyor.',
    status: 'ok' as const,
  },
  {
    id: 'images-alt',
    label: 'Image Alt Text',
    description: 'Tüm görseller alt text içeriyor mu?',
    check: 'Mevcut görsellerde kontrol edilmeli — manuel inceleme gerekli.',
    status: 'warn' as const,
  },
  {
    id: 'orphan',
    label: 'Orphan Pages',
    description: 'Hiçbir yerden bağlantı almayan sayfa var mı?',
    check: 'Navbar + Footer + ilgili içerik bölümleri tüm sayfaları linkliyor.',
    status: 'ok' as const,
  },
]

const SECTION_ICONS: Record<string, React.ReactNode> = {
  core:   <Globe size={14} />,
  rehber: <BookOpen size={14} />,
  boss:   <Sword size={14} />,
  harita: <Map size={14} />,
  item:   <FileText size={14} />,
  hub:    <BarChart3 size={14} />,
}

const SECTION_LABELS: Record<string, string> = {
  core: 'Çekirdek', rehber: 'Rehber', boss: 'Boss',
  harita: 'Harita', item: 'Item', hub: 'Hub',
}

const S = {
  card: {
    padding: 20,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
  } as React.CSSProperties,
  label: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: 'rgba(255,255,255,0.35)',
    marginBottom: 6,
  } as React.CSSProperties,
  value: {
    fontSize: 28,
    fontWeight: 800,
    color: '#fff',
    lineHeight: 1.1,
  } as React.CSSProperties,
}

interface Props {
  initialCounts: Record<string, { total: number; published: number; missing_seo: number }>
  redirectCount: number
}

export function SeoClient({ initialCounts, redirectCount }: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'pages' | 'rules' | 'redirects'>('overview')

  const totalIndexable = INDEXABLE_PAGES.length
  const totalNoindex   = NOINDEX_PAGES.length
  const okRules  = SEO_RULES.filter((r) => r.status === 'ok').length
  const warnRules = SEO_RULES.filter((r) => r.status === 'warn').length

  const groupedPages = INDEXABLE_PAGES.reduce<Record<string, typeof INDEXABLE_PAGES>>((acc, p) => {
    ;(acc[p.section] ??= []).push(p)
    return acc
  }, {})

  return (
    <div style={{ padding: 24 }}>
      {/* Başlık */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4 }}>SEO Dashboard</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>MSGKO.NET — Topical Authority Durumu</p>
        </div>
        <a
          href="https://msgko.net"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, color: 'rgba(124,58,237,0.7)',
            textDecoration: 'none', padding: '6px 12px',
            border: '1px solid rgba(124,58,237,0.25)',
          }}
        >
          <ExternalLink size={12} />
          msgko.net
        </a>
      </div>

      {/* Özet Kartlar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
        <div style={S.card}>
          <p style={S.label}>İndexlenebilir Sayfa</p>
          <p style={S.value}>{totalIndexable}</p>
          <p style={{ fontSize: 11, color: 'rgba(16,185,129,0.7)', marginTop: 4 }}>Google'a açık</p>
        </div>
        <div style={S.card}>
          <p style={S.label}>Noindex Sayfa</p>
          <p style={{ ...S.value, color: 'rgba(245,158,11,0.9)' }}>{totalNoindex}</p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Kasıtlı gizlendi</p>
        </div>
        <div style={S.card}>
          <p style={S.label}>SEO Kuralı</p>
          <p style={S.value}>{okRules}/{SEO_RULES.length}</p>
          <p style={{ fontSize: 11, color: warnRules > 0 ? 'rgba(245,158,11,0.7)' : 'rgba(16,185,129,0.7)', marginTop: 4 }}>
            {warnRules > 0 ? `${warnRules} uyarı` : 'Tümü tamam'}
          </p>
        </div>
        <div style={S.card}>
          <p style={S.label}>Aktif Redirect</p>
          <p style={S.value}>{redirectCount}</p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>301/302</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 0 }}>
        {([
          { id: 'overview',  label: 'Genel Bakış' },
          { id: 'pages',     label: 'Sayfa Envanteri' },
          { id: 'rules',     label: 'SEO Kuralları' },
          { id: 'redirects', label: 'Redirect Listesi' },
        ] as const).map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px', fontSize: 12, fontWeight: 500, border: 'none',
              background: 'transparent', cursor: 'pointer',
              color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.35)',
              borderBottom: activeTab === tab.id ? '2px solid rgba(124,58,237,0.8)' : '2px solid transparent',
              marginBottom: -1,
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Genel Bakış */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* İçerik Sayaçları */}
          <div style={S.card}>
            <p style={{ ...S.label, marginBottom: 12 }}>Veritabanı İçerik Durumu</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
              {Object.entries(initialCounts).map(([table, data]) => (
                <div key={table} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>
                    {table}
                  </p>
                  <p style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{data.total}</p>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <span style={{ fontSize: 10, color: 'rgba(16,185,129,0.7)' }}>{data.published} yayında</span>
                    {data.missing_seo > 0 && (
                      <span style={{ fontSize: 10, color: 'rgba(245,158,11,0.7)' }}>{data.missing_seo} SEO eksik</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 10 }}>
              * Supabase migration v2 çalıştırılmadıysa sayılar 0 görünür.
            </p>
          </div>

          {/* Sitemap Durumu */}
          <div style={S.card}>
            <p style={{ ...S.label, marginBottom: 12 }}>Sitemap Durumu</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { url: 'https://msgko.net/sitemap.xml', label: 'Ana Sitemap', pages: totalIndexable },
              ].map((sm) => (
                <div key={sm.url} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle2 size={14} color="rgba(16,185,129,0.8)" />
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{sm.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{sm.pages} URL</span>
                    <a href={sm.url} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(124,58,237,0.6)', textDecoration: 'none' }}>
                      <ExternalLink size={11} />
                      Görüntüle
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hızlı Aksiyonlar */}
          <div style={S.card}>
            <p style={{ ...S.label, marginBottom: 12 }}>Hızlı Aksiyonlar</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {[
                { label: 'Google Search Console',  href: 'https://search.google.com/search-console', external: true },
                { label: 'Rich Results Test',       href: 'https://search.google.com/test/rich-results', external: true },
                { label: 'Schema Validator',        href: 'https://validator.schema.org/', external: true },
                { label: 'PageSpeed Insights',      href: 'https://pagespeed.web.dev/', external: true },
              ].map((action) => (
                <a key={action.label} href={action.href} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    fontSize: 12, color: 'rgba(124,58,237,0.7)',
                    textDecoration: 'none', padding: '7px 14px',
                    border: '1px solid rgba(124,58,237,0.2)',
                    background: 'rgba(124,58,237,0.05)',
                  }}>
                  {action.label}
                  <ExternalLink size={10} />
                </a>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Sayfa Envanteri */}
      {activeTab === 'pages' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {Object.entries(groupedPages).map(([section, pages]) => (
            <div key={section} style={S.card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ color: 'rgba(124,58,237,0.7)' }}>{SECTION_ICONS[section]}</span>
                <p style={{ ...S.label, marginBottom: 0 }}>{SECTION_LABELS[section]} ({pages.length})</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {pages.map((page) => (
                  <div key={page.path} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '7px 10px', background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.04)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle2 size={12} color="rgba(16,185,129,0.6)" />
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{page.title}</span>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>{page.path}</span>
                    </div>
                    <a href={`https://msgko.net${page.path}`} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'rgba(124,58,237,0.5)', textDecoration: 'none' }}>
                      <ExternalLink size={10} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={S.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <AlertCircle size={14} color="rgba(245,158,11,0.7)" />
              <p style={{ ...S.label, marginBottom: 0 }}>NOINDEX Sayfalar ({NOINDEX_PAGES.length})</p>
            </div>
            {NOINDEX_PAGES.map((page) => (
              <div key={page.path} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '7px 10px', marginBottom: 4,
                background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.12)',
              }}>
                <span style={{ fontSize: 12, color: 'rgba(245,158,11,0.7)' }}>{page.path}</span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{page.reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEO Kuralları */}
      {activeTab === 'rules' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SEO_RULES.map((rule) => (
            <div key={rule.id} style={{
              ...S.card,
              display: 'flex', alignItems: 'flex-start', gap: 12,
              borderLeft: rule.status === 'ok'
                ? '3px solid rgba(16,185,129,0.6)'
                : '3px solid rgba(245,158,11,0.6)',
            }}>
              {rule.status === 'ok'
                ? <CheckCircle2 size={16} color="rgba(16,185,129,0.8)" style={{ flexShrink: 0, marginTop: 2 }} />
                : <AlertCircle  size={16} color="rgba(245,158,11,0.8)" style={{ flexShrink: 0, marginTop: 2 }} />
              }
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 3 }}>{rule.label}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{rule.description}</p>
                <p style={{ fontSize: 11, color: rule.status === 'ok' ? 'rgba(16,185,129,0.7)' : 'rgba(245,158,11,0.7)' }}>
                  {rule.check}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Redirect Listesi */}
      {activeTab === 'redirects' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={S.card}>
            <p style={{ ...S.label, marginBottom: 12 }}>Aktif 301 Redirect Kuralları</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                { from: '/kategoriler/asas',  to: '/rehber/asas',  code: 301 },
                { from: '/kategoriler/okcu',  to: '/rehber/okcu',  code: 301 },
                { from: '/kategoriler',       to: '/rehber',       code: 301 },
              ].map((r) => (
                <div key={r.from} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 12px', background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', background: 'rgba(16,185,129,0.1)', color: 'rgba(16,185,129,0.8)' }}>
                    {r.code}
                  </span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{r.from}</span>
                  <ArrowRight size={12} color="rgba(255,255,255,0.2)" />
                  <span style={{ fontSize: 12, color: 'rgba(124,58,237,0.7)' }}>{r.to}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 10 }}>
              Ek redirect&#39;ler Supabase seo_redirects tablosundan veya next.config.ts&#39;den yönetilir.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
