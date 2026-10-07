'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="section-container flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
      <p className="page-header-eyebrow">Beklenmeyen Hata</p>
      <h1 className="page-header-title">Bir şeyler ters gitti</h1>
      <p className="page-header-desc mx-auto mb-10">
        Sayfa yüklenirken bir sorun oluştu. Tekrar deneyebilir ya da ana sayfaya dönebilirsin.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="card-gaming px-5 py-2.5 text-sm font-semibold"
          style={{ color: 'var(--text-primary)', borderRadius: 8 }}
        >
          Tekrar dene
        </button>
        <Link
          href="/"
          className="card-gaming px-5 py-2.5 text-sm font-semibold"
          style={{ color: 'var(--gold-mid)', borderRadius: 8 }}
        >
          Ana sayfa
        </Link>
      </div>
    </section>
  )
}
