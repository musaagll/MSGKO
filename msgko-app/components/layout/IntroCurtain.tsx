/**
 * Açılış perdesi: amblem belirir, ardından perde yukarı kalkar.
 * Tamamen CSS ile çalışır (globals.css → .intro); JS yüklenmesini beklemez.
 * Aynı oturumda tekrar oynamaması için app/layout.tsx'teki betik html'e .intro-done ekler.
 * Amblem logo.png'den küçültülmeden kırpıldı (961×873) — büyük ekranda da net kalır.
 */
export function IntroCurtain() {
  return (
    <div aria-hidden="true" className="intro">
      <div className="intro-curtain">
        <picture>
          <source srcSet="/brand/emblem-hd.webp" type="image/webp" />
          <img src="/brand/emblem-hd.png" alt="" width={961} height={873} fetchPriority="high" decoding="async" className="intro-emblem" />
        </picture>
      </div>
    </div>
  )
}
