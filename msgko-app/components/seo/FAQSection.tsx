/**
 * FAQSection — Sık Sorulan Sorular bölümü.
 * <details>/<summary> ile erişilebilir accordion. FAQPage schema için
 * buildFAQSchema() fonksiyonu sayfanın Script'inde ayrıca çağrılmalıdır.
 */

interface FAQItem {
  question: string
  answer: string
}

interface Props {
  title?: string
  items: FAQItem[]
  className?: string
}

export function FAQSection({ title = 'Sık Sorulan Sorular', items, className = '' }: Props) {
  if (!items.length) return null

  return (
    <section className={className} aria-labelledby="faq-baslik">
      <h2
        id="faq-baslik"
        className="text-lg font-black tracking-[0.06em] uppercase text-white mb-4 pb-3 border-b border-white/[0.06]"
        style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}
      >
        {title}
      </h2>

      <div className="flex flex-col gap-3">
        {items.map((faq, i) => (
          <details
            key={i}
            className="group border border-white/[0.06] p-4"
            style={{ background: 'rgba(255,255,255,0.015)' }}
          >
            <summary
              className="text-[0.82rem] font-semibold text-white/80 cursor-pointer list-none
                flex items-center justify-between gap-3 group-open:text-white"
            >
              <span>{faq.question}</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <p className="mt-3 text-[0.78rem] leading-[1.8] text-white/45">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
