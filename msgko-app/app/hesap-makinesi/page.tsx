import type { Metadata } from 'next'
import { AdvancedCalculator } from '@/components/calculator/AdvancedCalculator'

export const metadata: Metadata = {
  title: 'Hesap Makinesi',
  description:
    'Knight Online karakter stat hesaplama aracı — AP, AC, HP, MP ve direniş değerlerini anlık hesapla. Ekipman, buff ve set bonuslarını birleştirerek optimum kombinasyonu bul.',
  keywords: ['Knight Online', 'AP hesaplama', 'stat calculator', 'hesap makinesi', 'KO calculator'],
}

export default function HesapMakinesiPage() {
  return (
    <main className="pt-16">
      <AdvancedCalculator />
    </main>
  )
}
