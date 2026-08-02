import type { Metadata } from 'next'
import { SesliClient } from './sesli-client'

export const metadata: Metadata = {
  title: 'Sesli Odalar — MSGKO Knight Online',
  description: 'Knight Online oyuncuları için ücretsiz sesli oda sistemi. Oda oluştur, arkadaşlarını davet et, sesli konuş.',
  alternates: { canonical: 'https://msgko.net/sesli' },
}

export default function SesliPage() {
  return <SesliClient />
}
