// ============================================================
// Not Found — Character not in database
// ============================================================

import Link from 'next/link'

export default function CharacterNotFound() {
  return (
    <main className="min-h-screen pt-24 pb-16 px-6 mesh-bg flex items-center justify-center">
      <div className="text-center max-w-lg">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full
                        bg-purple-500/10 border border-purple-500/20">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-purple-400"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
            <path d="M11 8v3" />
            <path d="M11 15h.01" />
          </svg>
        </div>

        <h1
          className="text-2xl font-black tracking-wider uppercase text-white mb-3"
          style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}
        >
          Karakter Bulunamadı
        </h1>

        <p className="text-sm text-white/50 mb-8 leading-relaxed">
          Aradığınız karakter sistemde kayıtlı değil veya henüz eklenmemiş olabilir.
          <br />
          <span className="text-purple-300/70 text-xs">
            (Sistem şu an demo verisi ile çalışmaktadır.)
          </span>
        </p>

        <Link
          href="/karakter-bul"
          className="inline-flex items-center gap-2 px-6 py-3
                     bg-purple-600 hover:bg-purple-500
                     text-white font-bold text-sm tracking-wider uppercase
                     rounded-lg transition-colors duration-200"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Tekrar Ara
        </Link>
      </div>
    </main>
  )
}
