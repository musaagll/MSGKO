'use client'

/**
 * Sponsor reklam şeridi — sayfaya gömülü, sürekli dönen video.
 * Pencere/modal değil, sayfa içeriğinin parçası.
 */
export function SponsorAd() {
  return (
    <section
      aria-label="Sponsor"
      style={{
        width: '100%',
        background: '#000',
        borderTop: '2px solid rgba(212,168,50,0.4)',
        borderBottom: '2px solid rgba(212,168,50,0.4)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Sol/sağ altın parıltı */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 100, zIndex: 2,
        background: 'linear-gradient(90deg, rgba(212,168,50,0.15) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 100, zIndex: 2,
        background: 'linear-gradient(270deg, rgba(212,168,50,0.15) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* SPONSOR etiketi */}
      <div style={{
        position: 'absolute', top: 8, left: 12, zIndex: 5,
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '2px 8px',
        background: 'rgba(6,8,15,0.8)',
        border: '1px solid rgba(212,168,50,0.4)',
      }}>
        <div style={{
          width: 5, height: 5, borderRadius: '50%',
          background: '#F0C050',
          animation: 'dotPulse 2s infinite',
        }} />
        <span style={{
          fontSize: '0.48rem', fontWeight: 800,
          letterSpacing: '0.3em', textTransform: 'uppercase',
          color: 'rgba(212,168,50,0.9)',
        }}>
          Sponsor
        </span>
      </div>

      {/* Video — inline block, kendi boyutlarıyla */}
      <video
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        style={{
          display: 'block',
          width: '100%',
          height: '150px',
          objectFit: 'cover',
        }}
      >
        <source src="/Reklam/RomaEliteGif.mp4" type="video/mp4" />
      </video>
    </section>
  )
}
