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
      <div style={{ padding: 24 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Rehber Yönetimi</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>Karakter rehberlerini yönet</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {REHBERLER.map(r => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.renk }} />
                <span style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>{r.label}</span>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '4px 10px', letterSpacing: '0.08em', textTransform: 'uppercase',
                background: r.status === 'aktif' ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)',
                border: `1px solid ${r.status === 'aktif' ? 'rgba(34,197,94,0.3)' : 'rgba(245,158,11,0.3)'}`,
                color: r.status === 'aktif' ? '#4ade80' : '#fbbf24',
              }}>
                {r.status === 'aktif' ? 'Aktif' : 'Yakında'}
              </span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20, padding: 14, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', fontSize: 12, color: 'rgba(251,191,36,0.8)', lineHeight: 1.6 }}>
          Rehber içerik yönetimi ileride bu sayfadan yapılacak.
        </div>
      </div>
    </AdminLayout>
  )
}
