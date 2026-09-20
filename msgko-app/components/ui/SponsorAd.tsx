'use client'

import { useRef, useEffect } from 'react'

/**
 * Sponsor reklam şeridi — sayfaya gömülü, sürekli dönen video.
 * Pencere/modal değil, sayfa içeriğinin parçası.
 */
export function SponsorAd() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = true
    const play = () => v.play().catch(() => {})
    if (v.readyState >= 3) { play() }
    else { v.addEventListener('canplay', play, { once: true }) }
    return () => v.removeEventListener('canplay', play)
  }, [])

  return (
    <div
      style={{
        width: '100%',
        background: '#000',
        borderTop: '2px solid #D4A832',
        borderBottom: '2px solid #D4A832',
        position: 'relative',
        overflow: 'hidden',
        lineHeight: 0,
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
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#F0C050' }} />
        <span style={{ fontSize: '0.48rem', fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#F0C050' }}>
          Sponsor
        </span>
      </div>

      {/* Video — doğal boyutunda, tam genişlik */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={videoRef}
        src="/Reklam/RomaEliteGif.mp4"
        loop
        muted
        playsInline
        autoPlay
        preload="auto"
        style={{ display: 'block', width: '100%', height: 'auto' }}
      />
    </div>
  )
}
