'use client'

/**
 * Sponsor reklam şeridi — sayfaya gömülü, sürekli dönen video.
 */
export function SponsorAd() {
  return (
    <div
      style={{
        width: '100%',
        background: '#000',
        borderTop: '3px solid #D4A832',
        borderBottom: '3px solid #D4A832',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 150,
      }}
    >
      {/* SPONSOR etiketi */}
      <div style={{
        position: 'absolute', top: 8, left: 12, zIndex: 5,
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '2px 10px',
        background: 'rgba(6,8,15,0.85)',
        border: '1px solid #D4A832',
      }}>
        <div style={{
          width: 5, height: 5, borderRadius: '50%',
          background: '#F0C050',
        }} />
        <span style={{
          fontSize: '0.5rem', fontWeight: 800,
          letterSpacing: '0.3em', textTransform: 'uppercase',
          color: '#F0C050',
        }}>
          Sponsor
        </span>
      </div>

      {/* Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        preload="auto"
        style={{
          display: 'block',
          width: '100%',
          height: '150px',
          objectFit: 'cover',
        }}
        onError={(e) => console.error('Video yüklenemedi:', e)}
      >
        <source src="/Reklam/RomaEliteGif.mp4" type="video/mp4" />
      </video>
    </div>
  )
}
