import { ImageResponse } from 'next/og'

export const alt = 'MSGKO - Knight Online Gelişim & Strateji Rehberi'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #06080F 0%, #0A0E1C 50%, #0D1525 100%)',
          padding: '80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Arka plan efekti — altın glow */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,168,50,0.20) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-50px',
            left: '-50px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(58,74,107,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Üst altın çizgi */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #D4A832, #F0C050, #D4A832, transparent)',
          }}
        />

        {/* Domain badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(212,168,50,0.10)',
            border: '1px solid rgba(212,168,50,0.35)',
            padding: '8px 16px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#F0C050',
            }}
          />
          <span
            style={{
              color: '#F0C050',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            msgko.net
          </span>
        </div>

        {/* Başlık */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            marginBottom: '24px',
          }}
        >
          <span
            style={{
              color: '#E8ECF0',
              fontSize: '72px',
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
            }}
          >
            KNIGHT ONLINE
          </span>
          <span
            style={{
              fontSize: '72px',
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              background: 'linear-gradient(125deg, #F5E8B8, #F0C050, #D4A832)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            GELİŞİM REHBERİ
          </span>
        </div>

        {/* Alt yazı */}
        <p
          style={{
            color: 'rgba(138,155,176,0.8)',
            fontSize: '22px',
            lineHeight: 1.5,
            maxWidth: '680px',
            margin: 0,
          }}
        >
          Asas & Okçu build rehberleri, PK taktikleri, farm rotaları ve skill kombo videoları
        </p>

        {/* Tag'ler */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '40px',
          }}
        >
          {['Asas Rehberi', 'Okçu Rehberi', 'PK Taktikleri', 'Farm Rotaları'].map((tag) => (
            <div
              key={tag}
              style={{
                background: 'rgba(212,168,50,0.08)',
                border: '1px solid rgba(212,168,50,0.25)',
                padding: '8px 16px',
                color: 'rgba(240,192,80,0.7)',
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0.05em',
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
