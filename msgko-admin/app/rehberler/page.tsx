import { isAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'

const REHBERLER = [
  { id: 'asas',    label: 'Asas Rehberi',    status: 'aktif',   renk: '#a78bfa' },
  { id: 'okcu',    label: 'Okçu Rehberi',    status: 'aktif',   renk: '#93c5fd' },
  { id: 'warrior', label: 'Warrior Rehberi', status: 'yakında', renk: '#fca5a5' },
  { id: 'mage',    label: 'Mage Rehberi',    status: 'yakında', renk: '#a5f3fc' },
  { id: 'priest',  label: 'Priest Rehberi',  status: 'yakında', renk: '#86efac' },
]

export default async function RehberlerPage() {
  if (!await isAuthenticated()) redirect('/login')
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white">Rehber Yönetimi</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Karakter rehberlerini yönet</p>
        </div>

        <div className="space-y-2">
          {REHBERLER.map(r => (
            <div key={r.id} className="flex items-center justify-between p-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ background: r.renk }} />
                <span className="text-sm font-medium text-white">{r.label}</span>
              </div>
              <span className="text-xs px-2.5 py-1 font-semibold tracking-wider uppercase"
                style={{
                  background: r.status === 'aktif' ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)',
                  border: `1px solid ${r.status === 'aktif' ? 'rgba(34,197,94,0.3)' : 'rgba(245,158,11,0.3)'}`,
                  color: r.status === 'aktif' ? '#4ade80' : '#fbbf24',
                }}>
                {r.status === 'aktif' ? 'Aktif' : 'Yakında'}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <p className="text-xs" style={{ color: 'rgba(251,191,36,0.8)' }}>
            Rehber içerik yönetimi ileride bu sayfadan yapılacak. Şu an için
            search-index.ts dosyasından manuel güncelleme yapabilirsin.
          </p>
        </div>
      </div>
    </AdminLayout>
  )
}
