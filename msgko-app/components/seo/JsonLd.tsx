/**
 * Structured data'yı sunucu HTML'ine native <script> olarak basar.
 * next/script JSON-LD için uygun değil (yalnızca hydration sonrası eklenir).
 * `<` kaçışı, veri ileride dinamik olursa script enjeksiyonunu önler.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
