'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import type { CategoryCardData } from '@/lib/types'

interface CategoryCardProps {
  card: CategoryCardData
}

export function CategoryCard({ card }: CategoryCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.2)' }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <Link
        href={card.href}
        className="flex items-center gap-5 p-6 border border-white/[0.08] bg-[#111111] group transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        aria-label={`${card.title} kategorisine git`}
      >
        {/* Icon */}
        <div
          className="w-[52px] h-[52px] flex-shrink-0 border border-white/[0.08] bg-[#2A2A2A] flex items-center justify-center text-xl"
          aria-hidden="true"
        >
          {card.icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-[0.88rem] font-extrabold tracking-[0.1em] uppercase text-white mb-1">
            {card.title}
          </p>
          <p className="text-[0.78rem] text-[#999999]">{card.description}</p>
        </div>

        {/* Arrow */}
        <ChevronRight
          size={18}
          className="text-[#999999] flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </Link>
    </motion.div>
  )
}
