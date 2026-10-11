/**
 * Açılış perdesi: amblem belirir, ardından perde yukarı kalkar.
 * Tamamen CSS ile çalışır (globals.css → .intro); JS yüklenmesini beklemez.
 * Aynı oturumda tekrar oynamaması için app/layout.tsx'teki betik html'e .intro-done ekler.
 * Amblem (961×873) CSS arka planı olarak gelir: perde gizliyken tarayıcı görseli hiç indirmez.
 */
export function IntroCurtain() {
  return (
    <div aria-hidden="true" className="intro">
      <div className="intro-curtain">
        <div className="intro-emblem" />
      </div>
    </div>
  )
}
