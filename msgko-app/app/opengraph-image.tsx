import { ImageResponse } from 'next/og'

export const runtime = 'edge'
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
          background: 'linear-gradient(135deg, #07070B 0%, #0e0e18 50%, #14101f 100%)',
          padding: '80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Arka plan efekti */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(109,40,217,0.3) 0%, transparent 70%)',
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
            background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Üst çizgi */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #7c3aed, #a855f7, #ec4899, transparent)',
          }}
        />

        {/* Domain badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(109,40,217,0.15)',
            border: '1px solid rgba(139,92,246,0.35)',
            padding: '8px 16px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#a78bfa',
            }}
          />
          <span
            style={{
              color: '#a78bfa',
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
              color: 'white',
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
              background: 'linear-gradient(125deg, #e0d7ff, #a78bfa, #ec4899)',
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
            color: 'rgba(200,200,216,0.65)',
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
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '8px 16px',
                color: 'rgba(255,255,255,0.6)',
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
