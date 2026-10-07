'use client'

import { Search } from 'lucide-react'

/** Sayfa içi arama kutusu görünümünde tetikleyici — header'daki site aramasını açar */
export function SearchBar({ placeholder = 'Rehber, boss, harita ya da item ara…', className = '' }: { placeholder?: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent('msgko:search'))}
      className={`flex min-h-13 w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/4 px-5 text-left text-fg-3 transition-colors hover:border-amethyst-400/40 hover:text-fg-2 ${className}`}
    >
      <Search size={19} aria-hidden="true" className="text-amethyst-300" />
      <span className="flex-1 truncate">{placeholder}</span>
      <span className="kbd hidden sm:inline-flex">Ctrl K</span>
    </button>
  )
}
