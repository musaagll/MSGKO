import { isAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'

const REHBERLER = [
  { id: 'asas',         label: 'Asas Rehberi',    status: 'aktif'   },
  { id: 'okcu',         label: 'Okçu Rehberi',    status: 'aktif'   },
  { id: 'warrior',      label: 'Warrior Rehberi', status: 'yakında' },
  { id: 'mage',         label: 'Mage Rehberi',    status: 'yakında' },
  { id: 'priest',       label: 'Priest Rehberi',  status: 'yakında' },
  { id: 'battle-priest',label: 'Battle Priest',   status: 'yakında' },
]

const SECTION_LABEL: React.CSSProperties = {
  fontSize: 9, fontWeight: 700, letterSpacing: '0.24em',
  textTransform: 'uppercase', color: 'rgba(201,168,76,0.55)',
  marginBottom: 14, display: 'block',
}

export default async function RehberlerPage() {
  if (!await isAuthenticated()) redirect('/login')
  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 16, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(242,242,244,0.9)', marginBottom: 3 }}>
            Rehber Yönetimi
          </h1>
          <p style={{ fontSize: 11, color: 'rgba(160,160,184,0.38)' }}>Karakter rehberleri</p>
        </div>

        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.18), transparent)', marginBottom: 20 }} />

        <span style={SECTION_LABEL}>Rehberler</span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxWidth: 520 }}>
          {REHBERLER.map(r => (
            <div key={r.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px',
              background: 'rgba(12,12,19,1)',
              border: '1px solid rgba(255,255,255,0.055)',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.18)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.055)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 2, height: 14, borderRadius: 1,
                  background: r.status === 'aktif' ? 'rgba(201,168,76,0.7)' : 'rgba(160,160,184,0.2)',
                }} />
                <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(242,242,244,0.75)' }}>{r.label}</span>
              </div>
              <span style={{
                fontSize: 9, fontWeight: 800, padding: '3px 9px',
                letterSpacing: '0.16em', textTransform: 'uppercase',
                background: r.status === 'aktif' ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${r.status === 'aktif' ? 'rgba(201,168,76,0.28)' : 'rgba(255,255,255,0.07)'}`,
                color: r.status === 'aktif' ? 'rgba(201,168,76,0.85)' : 'rgba(160,160,184,0.35)',
              }}>
                {r.status === 'aktif' ? 'Aktif' : 'Yakında'}
              </span>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 18, padding: '11px 14px',
          background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.15)',
          fontSize: 11, color: 'rgba(201,168,76,0.55)', lineHeight: 1.65, maxWidth: 520,
        }}>
          Rehber içerik yönetimi ileride bu sayfadan yapılacak.
        </div>
      </div>
    </AdminLayout>
  )
}
