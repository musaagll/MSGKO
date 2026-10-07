'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { RefreshCw, TriangleAlert } from 'lucide-react'

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
    <section className="container-site flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-ember-400/30 bg-ember-500/10 text-ember-300">
        <TriangleAlert size={26} aria-hidden="true" />
      </span>
      <h1 className="display-md mt-6">Bir şeyler ters gitti</h1>
      <p className="mx-auto mt-4 max-w-md text-fg-3">
        Sayfa yüklenirken bir sorun oluştu. Tekrar deneyebilir ya da ana sayfaya dönebilirsin.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn btn-primary">
          <RefreshCw size={17} aria-hidden="true" />
          Tekrar dene
        </button>
        <Link href="/" className="btn btn-secondary">Ana sayfa</Link>
      </div>
    </section>
  )
}
