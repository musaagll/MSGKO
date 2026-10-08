import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { IntroCurtain } from './IntroCurtain'

/**
 * Site iskeleti. Server component: sayfa içerikleri istemciye taşınmaz.
 * Yalnızca header (menü/arama durumu) istemci tarafında çalışır.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#icerik" className="skip-link">İçeriğe geç</a>
      <Navbar />
      <main id="icerik" tabIndex={-1} className="pt-(--header-h) outline-none">
        {children}
      </main>
      <Footer />
      <IntroCurtain />
    </>
  )
}
