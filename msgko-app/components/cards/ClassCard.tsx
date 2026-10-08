import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import type { ClassData } from '@/lib/ko-data/classes'
import { CLASS_META } from '@/lib/class-meta'

interface ClassCardProps {
  cls: ClassData
  /** Ana sayfada h3, rehber index'inde h2 (mevcut başlık hiyerarşisi korunur) */
  as?: 'h2' | 'h3'
  variant?: 'portrait' | 'feature'
  sizes?: string
}

/** Sınıf kartı — portrait: ana sayfa vitrini · feature: rehber listesi */
export function ClassCard({ cls, as: Heading = 'h3', variant = 'portrait', sizes }: ClassCardProps) {
  const meta = CLASS_META[cls.slug]
  // İngilizce sınıf adları (Warrior, Mage, Priest) Türkçe büyük harf kuralıyla "İ" olmasın
  const nameLang = cls.name === cls.nameEn ? 'en' : undefined

  if (variant === 'feature') {
    return (
      <Link
        href={`/rehber/${cls.guideSlug}`}
        className="group card card-interactive grid grid-cols-1 overflow-hidden sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
        style={{ ['--cls' as string]: cls.color }}
      >
        <div className="relative aspect-16/10 overflow-hidden sm:aspect-auto sm:min-h-68">
          <Image
            src={meta.art}
            alt={`${cls.name} karakter çizimi`}
            fill
            sizes={sizes ?? '(min-width: 1024px) 400px, (min-width: 640px) 40vw, 100vw'}
            className="zoom-media object-cover"
            style={{ objectPosition: meta.focus }}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink-950/80 via-transparent to-transparent sm:bg-linear-to-r sm:from-transparent sm:via-transparent sm:to-ink-950/90" />
        </div>
        <div className="relative flex flex-col p-6 sm:p-7">
          <div aria-hidden="true" className="absolute left-0 top-0 h-px w-full bg-linear-to-r from-[var(--cls)] to-transparent opacity-70" />
          <span className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: cls.color }}>
            {meta.role}
          </span>
          <Heading lang={nameLang} className="mt-2 font-display text-2xl font-bold text-fg">{cls.name}</Heading>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-fg-3">{cls.description}</p>
          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div className="col-span-2">
              <dt className="text-xs uppercase tracking-[0.12em] text-fg-4">Ana stat</dt>
              <dd className="mt-0.5 font-semibold text-fg-2">{cls.primaryStat}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.12em] text-fg-4">Human</dt>
              <dd className="mt-0.5 font-semibold text-fg-2">{cls.masterTitle.human}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.12em] text-fg-4">Karus</dt>
              <dd className="mt-0.5 font-semibold text-fg-2">{cls.masterTitle.karus}</dd>
            </div>
          </dl>
          <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-fg transition-colors group-hover:text-amethyst-200">
            Rehberi Oku
            <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    )
  }

  // Ana sayfa kartı: üstte karakter çizimi, altında ✓ listesi; kartın tamamı rehbere gider
  const facts = [
    `Ana stat: ${cls.primaryStat}`,
    `Human: ${cls.masterTitle.human}`,
    `Karus: ${cls.masterTitle.karus}`,
  ]
  return (
    <Link
      href={`/rehber/${cls.guideSlug}`}
      className="group card card-interactive relative flex h-full flex-col overflow-hidden"
    >
      <div className="relative h-44 overflow-hidden sm:h-48">
        <Image
          src={meta.art}
          alt={`${cls.name} karakter çizimi`}
          fill
          sizes={sizes ?? '(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw'}
          className="zoom-media object-cover"
          style={{ objectPosition: meta.focus }}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink-850 via-ink-850/30 to-transparent" />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 opacity-80" style={{ background: cls.color }} />
      </div>
      <div className="relative -mt-8 flex flex-1 flex-col px-7 pb-7">
        <span className="icon-tile bg-ink-900/90 backdrop-blur" style={{ borderColor: `${cls.color}55` }}>
          <Image src={meta.weapon} alt="" width={26} height={26} className="h-6.5 w-6.5 object-contain" />
        </span>
        <span className="mt-5 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: cls.color }}>
          {meta.role}
        </span>
        <Heading lang={nameLang} className="mt-2 text-2xl font-bold tracking-tight text-fg">{cls.name}</Heading>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-fg-3">{meta.tagline}</p>
        <div aria-hidden="true" className="my-6 h-px bg-white/8" />
        <ul className="space-y-3 text-[0.9375rem] text-fg-2">
          {facts.map((fact) => (
            <li key={fact} className="flex items-start gap-3">
              <Check size={17} aria-hidden="true" className="mt-0.5 shrink-0 text-amethyst-400" />
              {fact}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-8">
          <span className="btn btn-primary btn-sm">
            Rehberi İncele
            <ArrowRight size={15} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
