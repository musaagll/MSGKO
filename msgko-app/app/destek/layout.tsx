import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Destek | MSGKO Knight Online',
  description: 'MSG Knight Online içeriklerini KoPazar, ByNoGame veya KnightPİN üzerinden destekleyebilirsin.',
  alternates: {
    canonical: `${SITE_URL}/destek`,
  },
}

export default function DestekLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
