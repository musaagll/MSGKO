import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

interface SectionHeadingProps {
  id?: string
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  as?: 'h2' | 'h3'
}

/** Ortalanmış bölüm başlığı: mor etiket + büyük başlık + kısa açıklama */
export function SectionHeading({ id, eyebrow, title, description, as: Tag = 'h2' }: SectionHeadingProps) {
  return (
    <div className="reveal mx-auto mb-12 max-w-2xl text-center sm:mb-16">
      {eyebrow && <p className="eyebrow justify-center">{eyebrow}</p>}
      <Tag id={id} className="display-md mt-4">{title}</Tag>
      {description && <p className="mt-5 text-base leading-relaxed text-fg-3 sm:text-lg">{description}</p>}
    </div>
  )
}

/** Bölümün altında ortalanmış "tümünü gör" butonu */
export function SectionAction({ label, href, external }: { label: string; href: string; external?: boolean }) {
  return (
    <div className="mt-12 flex justify-center">
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          {label}
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      ) : (
        <Link href={href} className="btn btn-primary">
          {label}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}
