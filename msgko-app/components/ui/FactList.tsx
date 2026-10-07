export interface Fact {
  label: string
  value: React.ReactNode
}

/** Anahtar-değer bilgi listesi (sidebar ve sayfa başı özetleri) */
export function FactList({ facts, columns = 1 }: { facts: Fact[]; columns?: 1 | 2 }) {
  return (
    <dl className={`grid gap-x-6 gap-y-4 ${columns === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
      {facts.map((f) => (
        <div key={f.label} className="min-w-0">
          <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-fg-4">{f.label}</dt>
          <dd className="mt-1 break-words font-semibold text-fg">{f.value}</dd>
        </div>
      ))}
    </dl>
  )
}
