import Link from 'next/link'

/**
 * Hedef sayfa yayında değilse link yerine düz metin basar.
 * Yayınlanmamış slug'lara giden iç linklerin 404 üretmesini önler.
 */
export function MaybeLink({
  href,
  className,
  children,
}: {
  href: string | null
  className?: string
  children: React.ReactNode
}) {
  if (!href) return <span className={className}>{children}</span>
  return <Link href={href} className={className}>{children}</Link>
}
