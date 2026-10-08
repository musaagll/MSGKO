/**
 * Açılış perdesi: amblem belirir, ardından kavisli perde yukarı kalkar.
 * Tamamen CSS ile çalışır (globals.css → .intro); JS yüklenmesini beklemez.
 * Aynı oturumda tekrar oynamaması için app/layout.tsx'teki betik html'e .intro-done ekler.
 */
export function IntroCurtain() {
  return (
    <div aria-hidden="true" className="intro">
      <div className="intro-curtain">
        {/* eslint-disable-next-line @next/next/no-img-element -- dekoratif, ilk boyamada hazır olmalı */}
        <img src="/brand/emblem.png" alt="" width={282} height={256} className="intro-emblem" />
      </div>
    </div>
  )
}
