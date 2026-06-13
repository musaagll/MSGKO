import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Destek | MSGKO Knight Online',
  description: 'MSG Knight Online içeriklerini KoPazar, ByNoGame veya KnightPİN üzerinden destekleyebilirsin.',
  alternates: {
    canonical: 'https://msgko.net/destek',
  },
}

export default function DestekLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
