import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

interface SectionHeadingProps {
  id?: string
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  action?: { label: string; href: string; external?: boolean }
  as?: 'h2' | 'h3'
}

/** Bölüm başlığı + sağda "tümünü gör" aksiyonu (doküman: KATEGORİLER / TÜM VİDEOLARI GÖR) */
export function SectionHeading({ id, eyebrow, title, description, action, as: Tag = 'h2' }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <Tag id={id} className="display-md mt-3">{title}</Tag>
        {description && <p className="mt-3 text-fg-3">{description}</p>}
      </div>
      {action &&
        (action.external ? (
          <a href={action.href} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm self-start sm:self-auto">
            {action.label}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        ) : (
          <Link href={action.href} className="btn btn-secondary btn-sm self-start sm:self-auto">
            {action.label}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        ))}
    </div>
  )
}
