import type { Metadata } from 'next'
import { CharacterSearchForm } from '@/components/character/CharacterSearchForm'

export const metadata: Metadata = {
  title: 'Karakter Bul | MSGKO',
  description: 'Knight Online karakterini ara, ekipmanlarını ve 3D görünümünü incele.',
}

export default function KarakterBulPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[0.62rem] font-black tracking-[0.3em] uppercase mb-3"
            style={{ color: 'rgba(139,92,246,0.65)' }}>
            Knight Online
          </p>
          <h1 className="text-3xl md:text-4xl font-black tracking-[0.08em] uppercase text-white mb-3"
            style={{ fontFamily: 'var(--font-rajdhani),sans-serif', textShadow: '0 0 40px rgba(139,92,246,0.3)' }}>
            Karakter Bul
          </h1>
          <p className="text-sm text-white/40 leading-relaxed">
            Server ve oyuncu adını girerek karakterin ekipmanlarını ve 3D görünümünü incele.
          </p>
        </div>

        {/* Search card */}
        <div className="rounded-xl p-6 sm:p-8"
          style={{ background: 'rgba(10,7,20,0.95)', border: '1px solid rgba(139,92,246,0.18)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
          <CharacterSearchForm />
        </div>

        {/* Demo hint */}
        <div className="mt-6 p-4 rounded-lg"
          style={{ background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.15)' }}>
          <p className="text-xs text-yellow-200/60 leading-relaxed">
            <strong className="text-yellow-300/80">Demo Mod:</strong> Şu an test verisiyle çalışıyor.
            Örnek aramalar:&nbsp;
            <code className="text-yellow-300/80 bg-black/30 px-1 py-0.5 rounded text-[0.7rem]">1stMSG</code> (Zero) &nbsp;
            <code className="text-yellow-300/80 bg-black/30 px-1 py-0.5 rounded text-[0.7rem]">TestWarrior</code> (Zero) &nbsp;
            <code className="text-yellow-300/80 bg-black/30 px-1 py-0.5 rounded text-[0.7rem]">MageLord</code> (Destan)
          </p>
        </div>

      </div>
    </main>
  )
}
