import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ClassData } from '@/lib/ko-data/classes'
import { CLASS_META } from '@/lib/class-meta'

interface ClassCardProps {
  cls: ClassData
  /** Ana sayfada h3, rehber index'inde h2 (mevcut başlık hiyerarşisi korunur) */
  as?: 'h2' | 'h3'
  variant?: 'portrait' | 'feature'
  sizes?: string
}

/** Karakter seçme ekranı tarzı sınıf kartı */
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

  return (
    <Link
      href={`/rehber/${cls.guideSlug}`}
      className="group card card-interactive relative block aspect-3/4 overflow-hidden lg:aspect-2/3"
      style={{ ['--cls' as string]: cls.color }}
    >
      <Image
        src={meta.art}
        alt={`${cls.name} karakter çizimi`}
        fill
        sizes={sizes ?? '(min-width: 1280px) 224px, (min-width: 1024px) 18vw, (min-width: 640px) 40vw, 72vw'}
        className="zoom-media object-cover"
        style={{ objectPosition: meta.focus }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink-950 via-ink-950/55 to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-[var(--cls)] opacity-80" />
      {/* Hover'da sınıf renginde iç parıltı */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: `inset 0 -60px 80px -40px ${cls.color}55, inset 0 0 0 1px ${cls.color}66` }}
      />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em]" style={{ color: cls.color }}>
          {meta.role}
        </span>
        <Heading lang={nameLang} className="mt-1.5 font-display text-2xl font-bold leading-none text-fg">{cls.name}</Heading>
        <p className="mt-2 text-sm text-fg-3">{meta.tagline}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-fg-2 transition-colors group-hover:text-fg">
          Rehberi Oku
          <ArrowRight size={15} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}
