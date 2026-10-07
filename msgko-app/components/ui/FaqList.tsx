import { Plus } from 'lucide-react'

/**
 * SSS listesi — native <details>/<summary>: JavaScript gerektirmez, klavye ve
 * ekran okuyucu uyumludur, kapalı cevaplar da HTML'de bulunur (FAQPage şemasıyla tutarlı).
 */
export function FaqList({ faqs }: { faqs: { question: string; answer: string }[] }) {
  return (
    <div className="divide-y divide-white/7 overflow-hidden rounded-2xl border border-white/8 bg-white/2">
      {faqs.map((faq, i) => (
        <details key={faq.question} className="group" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 text-left font-semibold text-fg transition-colors hover:bg-white/3 sm:px-6 [&::-webkit-details-marker]:hidden">
            <span>{faq.question}</span>
            <Plus
              size={18}
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-amethyst-300 transition-transform duration-300 group-open:rotate-45"
            />
          </summary>
          <p className="px-5 pb-5 leading-relaxed text-fg-3 sm:px-6">{faq.answer}</p>
        </details>
      ))}
    </div>
  )
}
