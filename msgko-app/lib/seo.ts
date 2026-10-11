/**
 * MSGKO — Merkezi SEO Yardımcı Kütüphanesi
 *
 * Tüm sayfa türleri için title, description, metadata, breadcrumb ve schema
 * üretimi bu dosyadan merkezi olarak yapılır.
 *
 * Kullanım:
 *   import { buildMetadata, buildBreadcrumbSchema, buildFAQSchema } from '@/lib/seo'
 */

import type { Metadata } from 'next'
import type { BreadcrumbItem, SeoConfig } from '@/lib/types'
import type { ClassData } from '@/lib/ko-data/classes'

// ─── Sabitler ─────────────────────────────────────────────────────────────────

import { SITE_URL as BASE_URL } from '@/lib/site'
const SITE_NAME = 'MSGKO — Knight Online Rehber ve Eğitim Sitesi'
const DEFAULT_OG_IMAGE = `${BASE_URL}/opengraph-image`
const DEFAULT_AUTHOR = 'musaagll'
const SUFFIX = 'MSGKO'

// ─── Ortak OpenGraph tabanı ───────────────────────────────────────────────────

/**
 * Next.js, sayfadaki `openGraph` nesnesini layout'unkiyle birleştirmez, tamamen
 * değiştirir. Kendi openGraph'ını yazan sayfalar görseli/site adını kaybetmesin
 * diye bu tabanı spread eder.
 */
export const BASE_OPEN_GRAPH = {
  siteName: SITE_NAME,
  locale: 'tr_TR',
  type: 'website' as const,
  images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
}

// ─── Temel Metadata Builder ───────────────────────────────────────────────────

/**
 * Herhangi bir SeoConfig nesnesini Next.js Metadata nesnesine dönüştürür.
 * Tüm sayfa türlerinin ortak kullandığı temel fonksiyondur.
 */
export function buildMetadata(cfg: SeoConfig): Metadata {
  const { title, description, canonical, ogImage, ogType, robots, publishedAt, updatedAt, author } = cfg

  return {
    // Başlıklar zaten "| MSGKO" ile bitiyor; layout şablonunun ikinci kez eklemesini engelle
    title: { absolute: title },
    description,
    authors: [{ name: author ?? DEFAULT_AUTHOR, url: BASE_URL }],
    creator: DEFAULT_AUTHOR,
    publisher: SUFFIX,
    alternates: {
      canonical,
      languages: { 'tr-TR': canonical },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: 'tr_TR',
      type: (ogType as 'website' | 'article') ?? 'article',
      images: [
        {
          url: ogImage ?? DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedAt ? { publishedTime: publishedAt } : {}),
      ...(updatedAt ? { modifiedTime: updatedAt } : {}),
      ...(author ? { authors: [author] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      site: '@musaagll',
      creator: '@musaagll',
      title,
      description,
      images: [ogImage ?? DEFAULT_OG_IMAGE],
    },
    robots: robots ?? { index: true, follow: true },
  }
}

// ─── Title Oluşturucular ──────────────────────────────────────────────────────

/**
 * Rehber sayfası başlığı
 */
export function buildGuideTitle(classData: ClassData): string {
  const cls = classData.name
  return `Knight Online ${cls} Rehberi | Skill, Stat, Build ve Master Açma | ${SUFFIX}`
}

export function buildGuideDescription(classData: ClassData): string {
  return `Knight Online ${classData.name} rehberi — ${classData.description.substring(0, 120)}... Skill ağaçları, stat dağılımı ve Master açma için tam rehber.`
}




/**
 * Haber sayfası başlığı
 */
export function buildNewsTitle(news: { title: string }): string {
  return `${news.title} | Knight Online Haberleri | ${SUFFIX}`
}

/**
 * Build sayfası başlığı
 */
export function buildBuildTitle(build: { title: string; character_class: string }): string {
  return `Knight Online ${build.title} | ${build.character_class} Build Rehberi | ${SUFFIX}`
}

/**
 * Farm sayfası başlığı
 */
export function buildFarmTitle(farm: { title: string }): string {
  return `Knight Online ${farm.title} | Farm Rotası ve Rehber | ${SUFFIX}`
}

/**
 * Quest sayfası başlığı
 */
export function buildQuestTitle(quest: { name: string }): string {
  return `Knight Online ${quest.name} | Görev Rehberi | ${SUFFIX}`
}

// ─── Description Oluşturucular ────────────────────────────────────────────────




export function buildFarmDescription(farm: { title: string; excerpt: string | null; map_slug: string | null }): string {
  return farm.excerpt ?? `Knight Online ${farm.title} farm rotası rehberi. En verimli exp ve item farm için detaylı anlatım MSGKO'da.`
}

// ─── Breadcrumb Builder ───────────────────────────────────────────────────────

export function buildBreadcrumbs(items: BreadcrumbItem[]): BreadcrumbItem[] {
  return [{ label: 'Ana Sayfa', href: '/' }, ...items]
}

export function buildGuideBreadcrumbs(classData: ClassData): BreadcrumbItem[] {
  return buildBreadcrumbs([
    { label: 'Rehberler', href: '/rehber' },
    { label: `${classData.name} Rehberi`, href: `/rehber/${classData.guideSlug}` },
  ])
}



export function buildNewsBreadcrumbs(news: { title: string; slug: string }): BreadcrumbItem[] {
  return buildBreadcrumbs([
    { label: 'Haberler', href: '/haber' },
    { label: news.title, href: `/haber/${news.slug}` },
  ])
}

export function buildFarmBreadcrumbs(farm: { title: string; slug: string }): BreadcrumbItem[] {
  return buildBreadcrumbs([
    { label: 'Farm Rehberleri', href: '/farm' },
    { label: farm.title, href: `/farm/${farm.slug}` },
  ])
}

export function buildBuildBreadcrumbs(build: { title: string; slug: string }): BreadcrumbItem[] {
  return buildBreadcrumbs([
    { label: 'Build Rehberleri', href: '/build' },
    { label: build.title, href: `/build/${build.slug}` },
  ])
}

// ─── Schema.org Oluşturucular ─────────────────────────────────────────────────

/** BreadcrumbList schema */
export function buildBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.label,
      item: item.href.startsWith('http') ? item.href : `${BASE_URL}${item.href}`,
    })),
  }
}

/** Article schema — rehber ve içerik sayfaları için */
export function buildArticleSchema(opts: {
  title: string
  description: string
  url: string
  image?: string
  publishedAt?: string
  updatedAt?: string
  author?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    url: opts.url.startsWith('http') ? opts.url : `${BASE_URL}${opts.url}`,
    image: opts.image ?? DEFAULT_OG_IMAGE,
    datePublished: opts.publishedAt ?? new Date().toISOString(),
    dateModified: opts.updatedAt ?? new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: opts.author ?? DEFAULT_AUTHOR,
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'MSGKO',
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
    inLanguage: 'tr',
    isPartOf: { '@type': 'WebSite', url: BASE_URL, name: SITE_NAME },
  }
}

/** FAQPage schema — soru/cevap bölümleri için */
export function buildFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/** HowTo schema — adım adım rehberler için */
export function buildHowToSchema(opts: {
  name: string
  description: string
  steps: { name: string; text: string; url?: string }[]
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: opts.name,
    description: opts.description,
    image: opts.image ?? DEFAULT_OG_IMAGE,
    inLanguage: 'tr',
    step: opts.steps.map((step, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: step.name,
      text: step.text,
      ...(step.url ? { url: step.url.startsWith('http') ? step.url : `${BASE_URL}${step.url}` } : {}),
    })),
  }
}

/** ItemList schema — index/listing sayfaları için */
export function buildItemListSchema(opts: {
  name: string
  description: string
  url: string
  items: { name: string; url: string; description?: string }[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: opts.name,
    description: opts.description,
    url: opts.url.startsWith('http') ? opts.url : `${BASE_URL}${opts.url}`,
    numberOfItems: opts.items.length,
    itemListElement: opts.items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      url: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
      ...(item.description ? { description: item.description } : {}),
    })),
  }
}

/** WebPage schema — genel sayfa için */
export function buildWebPageSchema(opts: {
  name: string
  description: string
  url: string
  breadcrumbs?: BreadcrumbItem[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: opts.name,
    description: opts.description,
    url: opts.url.startsWith('http') ? opts.url : `${BASE_URL}${opts.url}`,
    inLanguage: 'tr',
    isPartOf: { '@type': 'WebSite', url: BASE_URL, name: SITE_NAME },
    ...(opts.breadcrumbs ? { breadcrumb: buildBreadcrumbSchema(opts.breadcrumbs) } : {}),
  }
}


// ─── Sayfa Tiplerine Özel Tam Metadata ───────────────────────────────────────

/** Rehber sayfası için tam Metadata */
export function buildGuideMetadata(classData: ClassData): Metadata {
  const title = buildGuideTitle(classData)
  const description = buildGuideDescription(classData)
  const canonical = `${BASE_URL}/rehber/${classData.guideSlug}`

  return buildMetadata({
    title,
    description,
    canonical,
    keywords: [],
    ogType: 'article',
  })
}




/** Haber sayfası için tam Metadata */
export function buildNewsMetadata(news: { title: string; slug: string; excerpt: string | null; seo_title: string | null; seo_description: string | null; seo_keywords: string[] | null; published_at: string | null; updated_at: string }): Metadata {
  const title = news.seo_title ?? buildNewsTitle(news)
  const description = news.seo_description ?? news.excerpt ?? `Knight Online haberi: ${news.title}`
  const canonical = `${BASE_URL}/haber/${news.slug}`

  return buildMetadata({
    title,
    description,
    canonical,
    keywords: news.seo_keywords ?? ['knight online haber', 'knight online güncelleme'],
    ogType: 'article',
    publishedAt: news.published_at ?? undefined,
    updatedAt: news.updated_at,
  })
}

// ─── Rehber Sayfasına Özel FAQ'lar ───────────────────────────────────────────

/** Bir sınıf için standart FAQ listesi üretir */
export function buildClassFAQs(classData: ClassData): { question: string; answer: string }[] {
  const cls = classData.name
  return [
    {
      question: `Knight Online ${cls} nasıl oynanır?`,
      answer: classData.description,
    },
    {
      question: `Knight Online ${cls} Master nasıl açılır?`,
      answer: `${cls} Master açmak için: ${classData.masterRequirements.items.join(' / ')}. ${classData.masterRequirements.npcLocation} NPC\'sine giderek 2nd Job Change görevini tamamlayın.`,
    },
    {
      question: `Knight Online ${cls} ileri seviye skill\'leri nasıl açılır?`,
      answer: `${cls} sınıfı, 70. seviye skill için ${classData.highSkillRequirements.level70}x, 80. seviye skill için ${classData.highSkillRequirements.level80}x Spell Stone Powder\'a ihtiyaç duymaktadır. Bu gereksinimler 21 Şubat 2019 güncellemesiyle basitleştirildi.`,
    },
    ...(classData.statBuilds.length > 0 ? [{
      question: `Knight Online ${cls} için önerilen build nedir?`,
      answer: classData.statBuilds.map((b) => `${b.name}: ${b.distribution}`).join(' / '),
    }] : []),
    {
      question: `Knight Online ${cls} ırk seçeneği nasıl olmalı?`,
      answer: `${cls} için seçilebilecek ırklar: ${classData.races.join(', ')}.`,
    },
  ]
}



/** Farm sayfası için standart FAQ listesi */
export function buildFarmFAQs(farm: { title: string; map_slug: string | null; min_level: number | null; max_level: number | null; best_classes: string[] }): { question: string; answer: string }[] {
  return [
    {
      question: `Knight Online ${farm.title} nasıl yapılır?`,
      answer: `${farm.title} farm rotası${farm.map_slug ? ` ${farm.map_slug.replace(/-/g, ' ')} haritasında` : ''} yapılır. Detaylı rehber için MSGKO farm sayfasını ziyaret edin.`,
    },
    {
      question: `${farm.title} için kaç level gerekir?`,
      answer: farm.min_level
        ? `${farm.title} için minimum ${farm.min_level} level gereklidir${farm.max_level ? `, en verimli aralık ${farm.min_level}-${farm.max_level}` : ''}.`
        : `Level gereksinimleri için MSGKO'daki farm rehberini inceleyin.`,
    },
    {
      question: `${farm.title} için en iyi sınıf hangisi?`,
      answer: farm.best_classes.length
        ? `${farm.title} için en uygun sınıflar: ${farm.best_classes.join(', ')}.`
        : `Tüm sınıflar bu farm alanını kullanabilir.`,
    },
  ]
}

// ─── Canonical URL Yardımcıları ───────────────────────────────────────────────

export const CANONICAL = {
  home: BASE_URL,
  rehber: (slug?: string) => slug ? `${BASE_URL}/rehber/${slug}` : `${BASE_URL}/rehber`,
  haber: (slug?: string) => slug ? `${BASE_URL}/haber/${slug}` : `${BASE_URL}/haber`,
  build: (slug?: string) => slug ? `${BASE_URL}/build/${slug}` : `${BASE_URL}/build`,
  farm: (slug?: string) => slug ? `${BASE_URL}/farm/${slug}` : `${BASE_URL}/farm`,
  wallpaper: `${BASE_URL}/wallpaper`,
  youtube: `${BASE_URL}/youtube`,
}

export { BASE_URL, SITE_NAME, DEFAULT_OG_IMAGE }
