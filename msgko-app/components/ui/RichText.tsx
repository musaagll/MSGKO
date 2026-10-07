/**
 * Veri dosyalarındaki basit markdown metnini ("## Başlık", paragraflar, "- madde")
 * anlamlı HTML'e çevirir. Önceden bu metin "##" işaretleriyle düz yazı olarak görünüyordu.
 */
export function RichText({ text }: { text: string }) {
  const blocks = text.trim().split(/\n{2,}/)
  return (
    <div className="prose-ko">
      {blocks.map((block, i) => {
        const trimmed = block.trim()
        if (trimmed.startsWith('## ')) {
          return <h3 key={i}>{trimmed.slice(3).trim()}</h3>
        }
        const lines = trimmed.split('\n')
        if (lines.every((l) => /^[-*] /.test(l.trim()))) {
          return (
            <ul key={i} className="list-disc space-y-1.5 pl-5 marker:text-amethyst-400">
              {lines.map((l, j) => <li key={j}>{l.trim().slice(2)}</li>)}
            </ul>
          )
        }
        return <p key={i}>{lines.join(' ')}</p>
      })}
    </div>
  )
}
