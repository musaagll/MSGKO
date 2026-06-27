import type { Metadata } from 'next'
import { AsasCalculatorClient } from './asas-calculator-client'

export const metadata: Metadata = {
  title: 'Asas AP Hesaplayıcı — Knight Online | MSGKO',
  description:
    'Knight Online Asas (Rogue) AP ve DEX hesaplayıcısı. Silah, zırh, takı seçimi ile anlık AP hesaplama. Wolf premium, dual wield desteği.',
  keywords: [
    'knight online asas ap hesaplayıcı', 'knight online rogue ap calculator',
    'asas dex hesaplama', 'knight online asas build', 'knight online ap hesaplama',
  ],
  alternates: { canonical: 'https://msgko.net/asas' },
}

export default function AsasPage() {
  return <AsasCalculatorClient />
}
