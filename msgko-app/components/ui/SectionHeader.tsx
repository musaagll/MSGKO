import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { SectionHeaderProps } from '@/lib/types'
import { cn } from '@/lib/utils'

export function SectionHeader({
  title,
  actionLabel,
  actionHref,
  actionIcon,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-10', className)}>
      <h2 className="text-[0.95rem] font-extrabold tracking-[0.15em] uppercase text-white">
        {title}
      </h2>
      {actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1.5 text-[0.78rem] font-semibold text-[#999999] tracking-[0.08em] uppercase border border-white/[0.08] px-4 py-2 transition-all duration-200 hover:text-white hover:border-white/20 hover:bg-[#2A2A2A]"
          aria-label={actionLabel}
        >
          {actionLabel}
          {actionIcon ?? <ChevronRight size={14} />}
        </Link>
      )}
    </div>
  )
}
