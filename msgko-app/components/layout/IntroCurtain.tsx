/**
 * Açılış perdesi: amblem bulanıklıktan netleşip 3D dönüşle oturur, üzerinden ışık geçer,
 * ardından alt kenarı kavisli perde yukarı kalkar. Tamamen CSS ile çalışır (globals.css → .intro).
 * Aynı oturumda tekrar oynamaması için app/layout.tsx'teki betik html'e .intro-done ekler.
 * Amblem (961×873) CSS arka planı olarak gelir: perde gizliyken tarayıcı görseli hiç indirmez.
 */
export function IntroCurtain() {
  return (
    <div aria-hidden="true" className="intro">
      <div className="intro-curtain">
        <div className="intro-stage">
          <div className="intro-obj">
            <div className="intro-emblem" />
            <div className="intro-sheen">
              <i />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
