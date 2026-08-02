'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mic, MicOff, Volume2, VolumeX, Phone, PhoneOff, Plus, Lock, Unlock, Users, LogIn } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// LiveKit bileşenleri
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useParticipants,
  useLocalParticipant,
  useTracks,
  ParticipantTile,
  TrackLoop,
  ControlBar,
} from '@livekit/components-react'
import '@livekit/components-styles'
import { Track } from 'livekit-client'

// ─── Sabit oda listesi (başlangıç için) ───────────────────────────
const DEFAULT_ROOMS = [
  { id: 'genel', name: 'Genel', icon: '🗣️', locked: false, description: 'Herkese açık genel sohbet' },
  { id: 'asas', name: 'Asas', icon: '⚔️', locked: false, description: 'Asas oyuncuları için' },
  { id: 'okcu', name: 'Okçu', icon: '🏹', locked: false, description: 'Okçu oyuncuları için' },
  { id: 'ws', name: 'WS Takım', icon: '🛡️', locked: true, description: 'Şifreli WS takım odası' },
]

// ─── Oda İçi Bileşen ─────────────────────────────────────────────
function RoomInside({ onLeave }: { onLeave: () => void }) {
  const participants = useParticipants()
  const { localParticipant } = useLocalParticipant()
  const [muted, setMuted] = useState(false)

  const toggleMic = useCallback(async () => {
    await localParticipant.setMicrophoneEnabled(muted)
    setMuted(!muted)
  }, [muted, localParticipant])

  return (
    <div className="flex flex-col h-full">
      <RoomAudioRenderer />

      {/* Katılımcılar */}
      <div className="flex-1 p-4">
        <p className="text-[0.65rem] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: 'rgba(139,92,246,0.7)' }}>
          {participants.length} katılımcı
        </p>
        <div className="flex flex-wrap gap-3">
          {participants.map(p => (
            <motion.div key={p.identity}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-1.5 p-3 min-w-[72px]"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px',
              }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.2))' }}>
                {p.name?.[0]?.toUpperCase() ?? '?'}
              </div>
              <span className="text-[0.68rem] text-white/70 text-center max-w-[72px] truncate">{p.name ?? p.identity}</span>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.isMicrophoneEnabled ? '#22c55e' : '#ef4444' }} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Kontroller */}
      <div className="p-4 flex items-center justify-center gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
          onClick={toggleMic}
          className="w-12 h-12 flex items-center justify-center transition-all duration-200"
          style={{
            background: muted ? 'rgba(239,68,68,0.15)' : 'rgba(139,92,246,0.15)',
            border: `1px solid ${muted ? 'rgba(239,68,68,0.4)' : 'rgba(139,92,246,0.4)'}`,
            borderRadius: '50%',
          }}>
          {muted ? <MicOff size={18} style={{ color: '#f87171' }} /> : <Mic size={18} style={{ color: '#a78bfa' }} />}
        </motion.button>

        <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
          onClick={onLeave}
          className="w-12 h-12 flex items-center justify-center transition-all duration-200"
          style={{
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: '50%',
          }}>
          <PhoneOff size={18} style={{ color: '#f87171' }} />
        </motion.button>
      </div>
    </div>
  )
}

// ─── Ana Bileşen ──────────────────────────────────────────────────
export function SesliClient() {
  const [username, setUsername] = useState('')
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [roomPassword, setRoomPassword] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [livekitUrl, setLivekitUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [customRoom, setCustomRoom] = useState('')
  const [customLocked, setCustomLocked] = useState(false)
  const [customPassword, setCustomPassword] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const rooms = DEFAULT_ROOMS

  const joinRoom = async (roomId: string, password = '') => {
    if (!username.trim()) { setError('Önce kullanıcı adı gir'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/livekit-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room: roomId, username: username.trim(), password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Hata'); return }
      setToken(data.token)
      setLivekitUrl(data.url)
      setSelectedRoom(roomId)
      setShowPasswordModal(false)
    } catch { setError('Bağlantı hatası') }
    finally { setLoading(false) }
  }

  const handleRoomClick = (room: typeof DEFAULT_ROOMS[0]) => {
    if (room.locked) {
      setSelectedRoom(room.id)
      setShowPasswordModal(true)
    } else {
      joinRoom(room.id)
    }
  }

  const leaveRoom = () => {
    setToken(null); setLivekitUrl(null); setSelectedRoom(null); setRoomPassword('')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#07070B' }}>
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 50% at 20% 20%, rgba(109,40,217,0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 80% 80%, rgba(236,72,153,0.05) 0%, transparent 55%)'
      }} />
      <div className="fixed top-0 left-0 right-0 h-px z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.7), rgba(236,72,153,0.5), transparent)' }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 mt-16"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-200 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span className="text-[0.78rem] font-medium tracking-[0.06em]">Geri Dön</span>
        </Link>
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <p className="text-[0.62rem] font-bold tracking-[0.3em] uppercase mb-0.5" style={{ color: 'rgba(139,92,246,0.7)' }}>MSGKO.NET</p>
          <h1 className="text-[1.1rem] font-black tracking-[0.12em] uppercase text-white" style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
            Sesli Odalar
          </h1>
        </div>
        <div className="w-20" />
      </header>

      <div className="relative z-10 flex-1 px-4 md:px-8 py-8 max-w-[900px] mx-auto w-full">

        {/* Aktif oda — LiveKit bağlı */}
        {token && livekitUrl && selectedRoom ? (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="h-[500px] flex flex-col"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '16px', overflow: 'hidden' }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" style={{ boxShadow: '0 0 6px rgba(34,197,94,0.8)' }} />
                <span className="text-[0.82rem] font-bold text-white">{rooms.find(r => r.id === selectedRoom)?.name ?? selectedRoom}</span>
              </div>
              <span className="text-[0.68rem] text-white/30">@{username}</span>
            </div>
            <LiveKitRoom serverUrl={livekitUrl} token={token} connect={true} audio={true} video={false}
              onDisconnected={leaveRoom}
              style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <RoomInside onLeave={leaveRoom} />
            </LiveKitRoom>
          </motion.div>
        ) : (
          <>
            {/* Kullanıcı adı */}
            <div className="mb-6 p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px' }}>
              <label className="text-[0.72rem] font-bold tracking-[0.18em] uppercase mb-3 block" style={{ color: 'rgba(139,92,246,0.8)' }}>
                Kullanıcı Adın
              </label>
              <input
                type="text" value={username} onChange={e => setUsername(e.target.value)}
                placeholder="Oyun nick'in (örn. WarriorKing)"
                maxLength={24}
                className="w-full bg-white/[0.04] border border-white/10 text-white px-4 py-2.5 text-[0.85rem] outline-none focus:border-purple-500/50 transition-colors"
                style={{ borderRadius: '8px' }}
              />
              {error && <p className="text-[0.72rem] text-red-400 mt-2">{error}</p>}
            </div>

            {/* Odalar */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[0.72rem] font-bold tracking-[0.18em] uppercase" style={{ color: 'rgba(139,92,246,0.8)' }}>Odalar</h2>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[0.72rem] font-bold tracking-wider uppercase transition-all"
                style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '6px', color: 'rgba(167,139,250,0.9)' }}>
                <Plus size={12} /> Oda Oluştur
              </motion.button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rooms.map((room, i) => (
                <motion.button key={room.id}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoomClick(room)}
                  disabled={loading}
                  className="text-left p-5 transition-all duration-200 group"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.35)'; e.currentTarget.style.background = 'rgba(139,92,246,0.05)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{room.icon}</span>
                      <span className="text-[0.9rem] font-bold text-white">{room.name}</span>
                    </div>
                    {room.locked
                      ? <Lock size={13} style={{ color: 'rgba(251,191,36,0.7)' }} />
                      : <Unlock size={13} style={{ color: 'rgba(34,197,94,0.6)' }} />
                    }
                  </div>
                  <p className="text-[0.72rem]" style={{ color: 'rgba(255,255,255,0.3)' }}>{room.description}</p>
                  <div className="flex items-center gap-1.5 mt-3">
                    <LogIn size={11} style={{ color: 'rgba(139,92,246,0.5)' }} />
                    <span className="text-[0.65rem]" style={{ color: 'rgba(139,92,246,0.6)' }}>
                      {loading && selectedRoom === room.id ? 'Bağlanıyor...' : 'Giriş yap'}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Şifre Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[300] bg-black/70" style={{ backdropFilter: 'blur(6px)' }}
              onClick={() => setShowPasswordModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[301] w-[90vw] max-w-sm p-6"
              style={{ background: 'rgba(10,10,18,0.98)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: '16px', boxShadow: '0 24px 64px rgba(0,0,0,0.8)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Lock size={16} style={{ color: 'rgba(251,191,36,0.8)' }} />
                <h3 className="text-[0.95rem] font-bold text-white">Şifreli Oda</h3>
              </div>
              <p className="text-[0.75rem] text-white/40 mb-4">Bu oda şifreli. Şifreyi gir.</p>
              <input type="password" value={roomPassword} onChange={e => setRoomPassword(e.target.value)}
                placeholder="Oda şifresi"
                className="w-full bg-white/[0.04] border border-white/10 text-white px-4 py-2.5 text-[0.85rem] outline-none focus:border-purple-500/50 transition-colors mb-4"
                style={{ borderRadius: '8px' }}
                onKeyDown={e => { if (e.key === 'Enter') joinRoom(selectedRoom!, roomPassword) }}
              />
              <div className="flex gap-2">
                <button onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2.5 text-[0.78rem] font-bold uppercase text-white/40 border border-white/10 hover:border-white/20 transition-colors"
                  style={{ borderRadius: '8px' }}>
                  İptal
                </button>
                <button onClick={() => joinRoom(selectedRoom!, roomPassword)} disabled={loading}
                  className="flex-1 py-2.5 text-[0.78rem] font-bold uppercase text-white transition-all"
                  style={{ background: 'rgba(139,92,246,0.7)', borderRadius: '8px', opacity: loading ? 0.5 : 1 }}>
                  {loading ? 'Bağlanıyor...' : 'Gir'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Oda Oluştur Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[300] bg-black/70" style={{ backdropFilter: 'blur(6px)' }}
              onClick={() => setShowCreateModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[301] w-[90vw] max-w-sm p-6"
              style={{ background: 'rgba(10,10,18,0.98)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: '16px', boxShadow: '0 24px 64px rgba(0,0,0,0.8)' }}>
              <h3 className="text-[0.95rem] font-bold text-white mb-4">Oda Oluştur</h3>
              <div className="flex flex-col gap-3 mb-4">
                <input type="text" value={customRoom} onChange={e => setCustomRoom(e.target.value)}
                  placeholder="Oda adı (örn. Asas Grubu)" maxLength={32}
                  className="w-full bg-white/[0.04] border border-white/10 text-white px-4 py-2.5 text-[0.85rem] outline-none focus:border-purple-500/50 transition-colors"
                  style={{ borderRadius: '8px' }}
                />
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={customLocked} onChange={e => setCustomLocked(e.target.checked)} className="accent-purple-500 w-4 h-4" />
                  <span className="text-[0.78rem] text-white/60">Şifreli oda</span>
                </label>
                {customLocked && (
                  <input type="password" value={customPassword} onChange={e => setCustomPassword(e.target.value)}
                    placeholder="Oda şifresi"
                    className="w-full bg-white/[0.04] border border-white/10 text-white px-4 py-2.5 text-[0.85rem] outline-none focus:border-purple-500/50 transition-colors"
                    style={{ borderRadius: '8px' }}
                  />
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 text-[0.78rem] font-bold uppercase text-white/40 border border-white/10 hover:border-white/20 transition-colors"
                  style={{ borderRadius: '8px' }}>
                  İptal
                </button>
                <button
                  onClick={() => {
                    if (!customRoom.trim()) return
                    setShowCreateModal(false)
                    joinRoom(customRoom.trim().toLowerCase().replace(/\s+/g, '-'), customLocked ? customPassword : '')
                  }}
                  disabled={!customRoom.trim() || loading}
                  className="flex-1 py-2.5 text-[0.78rem] font-bold uppercase text-white transition-all"
                  style={{ background: 'rgba(139,92,246,0.7)', borderRadius: '8px', opacity: (!customRoom.trim() || loading) ? 0.5 : 1 }}>
                  Oluştur & Gir
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
