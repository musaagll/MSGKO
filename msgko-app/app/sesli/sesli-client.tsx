'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Mic, MicOff, VolumeX, Volume2, PhoneOff, Plus, Lock, Unlock, Users, LogIn, Settings, RefreshCw, AlertCircle } from 'lucide-react'
import { LiveKitRoom, RoomAudioRenderer, useParticipants, useLocalParticipant, useIsSpeaking, useConnectionState } from '@livekit/components-react'
import '@livekit/components-styles'
import { ConnectionState, type Participant } from 'livekit-client'

// ─── Types ───────────────────────────────────────────────────────────────────
interface VoiceRoom { id: string; name: string; description: string; icon: string; isLocked: boolean; maxUsers: number; participants: number }

// ─── Volume localStorage helper ──────────────────────────────────────────────
const getVol = (id: string) => { try { return parseFloat(localStorage.getItem(`msgko_vol_${id}`) ?? '1') } catch { return 1 } }
const setVol = (id: string, v: number) => { try { localStorage.setItem(`msgko_vol_${id}`, String(v)) } catch {} }

// ─── Participant card (inside room) ──────────────────────────────────────────
function ParticipantCard({ p, localMutes, onVolumeChange, onLocalMute }: {
  p: Participant
  localMutes: Set<string>
  onVolumeChange: (id: string, v: number) => void
  onLocalMute: (id: string) => void
}) {
  const speaking = useIsSpeaking(p)
  const muted = !p.isMicrophoneEnabled
  const vol = getVol(p.identity)
  const [showVol, setShowVol] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      className="relative flex flex-col items-center gap-2 p-3 select-none"
      style={{
        background: speaking ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${speaking ? 'rgba(34,197,94,0.45)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 12,
        minWidth: 80,
        transition: 'border-color 0.15s, background 0.15s',
        boxShadow: speaking ? '0 0 16px rgba(34,197,94,0.18)' : 'none',
      }}
    >
      {/* Avatar */}
      <div className="relative">
        <div className="w-11 h-11 rounded-full flex items-center justify-center text-[1.1rem] font-black"
          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.35), rgba(236,72,153,0.2))' }}>
          {p.name?.[0]?.toUpperCase() ?? '?'}
        </div>
        {speaking && <motion.div animate={{ scale: [1, 1.35, 1] }} transition={{ repeat: Infinity, duration: 0.9 }}
          className="absolute -inset-1 rounded-full pointer-events-none"
          style={{ border: '2px solid rgba(34,197,94,0.55)' }} />}
      </div>

      {/* Name */}
      <span className="text-[0.65rem] text-white/75 text-center max-w-[76px] truncate font-semibold">{p.name ?? p.identity}</span>

      {/* Status icons */}
      <div className="flex items-center gap-1">
        {muted && <MicOff size={10} style={{ color: '#f87171' }} />}
        {localMutes.has(p.identity) && <VolumeX size={10} style={{ color: '#f87171' }} />}
        {speaking && !muted && <span className="text-[9px] text-green-400 font-bold">●</span>}
      </div>

      {/* Volume button */}
      <button type="button" onClick={() => setShowVol(v => !v)}
        className="text-[9px] text-white/30 hover:text-purple-400 transition-colors">
        {vol === 0 || localMutes.has(p.identity) ? '🔇' : vol >= 1.5 ? '🔊' : '🔉'}
      </button>

      {/* Volume popup */}
      {showVol && (
        <div className="absolute bottom-full mb-2 z-50 p-3 flex flex-col gap-2"
          style={{ background: 'rgba(10,10,18,0.98)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 10, minWidth: 130 }}>
          <span className="text-[0.62rem] text-white/40 text-center">{p.name ?? p.identity} — {Math.round(vol * 100)}%</span>
          <input type="range" min={0} max={2} step={0.05} defaultValue={vol}
            className="w-full accent-purple-500"
            onChange={e => { const v = parseFloat(e.target.value); setVol(p.identity, v); onVolumeChange(p.identity, v) }} />
          <button type="button" onClick={() => { onLocalMute(p.identity); setShowVol(false) }}
            className="text-[0.62rem] text-center py-1 transition-colors"
            style={{ color: localMutes.has(p.identity) ? '#4ade80' : '#f87171' }}>
            {localMutes.has(p.identity) ? 'Sesi Aç' : 'Sesi Kapat (Yerel)'}
          </button>
        </div>
      )}
    </motion.div>
  )
}

// ─── Room Inside (LiveKit context) ───────────────────────────────────────────
function RoomInside({ roomName, roomIcon, username, onLeave }: {
  roomName: string; roomIcon: string; username: string; onLeave: () => void
}) {
  const participants = useParticipants()
  const { localParticipant } = useLocalParticipant()
  const connState = useConnectionState()
  const [muted, setMuted] = useState(false)
  const [deafened, setDeafened] = useState(false)
  const [localMutes, setLocalMutes] = useState<Set<string>>(new Set())
  const gainNodes = useRef<Map<string, GainNode>>(new Map())
  const audioCtx = useRef<AudioContext | null>(null)
  const [connInfo, setConnInfo] = useState<{ ping: number; conn: string } | null>(null)
  const statsInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  // AudioContext — sadece user gesture sonrası
  const ensureAudioCtx = useCallback(() => {
    if (!audioCtx.current) audioCtx.current = new AudioContext()
    if (audioCtx.current.state === 'suspended') audioCtx.current.resume()
    return audioCtx.current
  }, [])

  // Volume control via GainNode
  const handleVolumeChange = useCallback((identity: string, vol: number) => {
    const node = gainNodes.current.get(identity)
    if (node) node.gain.value = vol
  }, [])

  // Local mute toggle
  const handleLocalMute = useCallback((identity: string) => {
    setLocalMutes(prev => {
      const next = new Set(prev)
      if (next.has(identity)) {
        next.delete(identity)
        const node = gainNodes.current.get(identity)
        if (node) node.gain.value = getVol(identity)
      } else {
        next.add(identity)
        const node = gainNodes.current.get(identity)
        if (node) node.gain.value = 0
      }
      return next
    })
  }, [])

  const toggleMic = useCallback(async () => {
    ensureAudioCtx()
    const next = !muted
    await localParticipant.setMicrophoneEnabled(!next)
    setMuted(next)
  }, [muted, localParticipant, ensureAudioCtx])

  const toggleDeafen = useCallback(async () => {
    ensureAudioCtx()
    const next = !deafened
    setDeafened(next)
    // Deafen = also mute mic
    if (next && !muted) {
      await localParticipant.setMicrophoneEnabled(false)
      setMuted(true)
    }
    // Mute/unmute all gain nodes
    gainNodes.current.forEach((node, id) => {
      node.gain.value = next ? 0 : (localMutes.has(id) ? 0 : getVol(id))
    })
  }, [deafened, muted, localMutes, localParticipant, ensureAudioCtx])

  // WebRTC stats
  useEffect(() => {
    statsInterval.current = setInterval(async () => {
      try {
        const pc = (localParticipant as any)?.engine?.pcManager?.publisher?.pc as RTCPeerConnection | undefined
        if (!pc) return
        const stats = await pc.getStats()
        let ping = 0; let conn = 'UDP'
        stats.forEach((r: any) => {
          if (r.type === 'candidate-pair' && r.state === 'succeeded') {
            ping = Math.round((r.currentRoundTripTime ?? 0) * 1000)
          }
          if (r.type === 'local-candidate' && r.candidateType === 'relay') conn = 'TURN'
        })
        setConnInfo({ ping, conn })
      } catch {}
    }, 2000)
    return () => { if (statsInterval.current) clearInterval(statsInterval.current) }
  }, [localParticipant])

  const connColor = connState === ConnectionState.Connected ? '#22c55e' : connState === ConnectionState.Reconnecting ? '#fbbf24' : '#ef4444'

  return (
    <div className="flex flex-col h-full">
      <RoomAudioRenderer />

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2">
          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }}
            className="w-2 h-2 rounded-full" style={{ background: connColor }} />
          <span className="text-[0.82rem] font-bold text-white">{roomIcon} {roomName}</span>
        </div>
        <div className="flex items-center gap-3">
          {connInfo && (
            <span className="text-[0.62rem]" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {connInfo.ping}ms · {connInfo.conn}
            </span>
          )}
          <span className="text-[0.68rem] text-white/30">@{username}</span>
        </div>
      </div>

      {/* Reconnecting banner */}
      {connState === ConnectionState.Reconnecting && (
        <div className="flex items-center gap-2 px-5 py-2 text-[0.72rem] text-yellow-400"
          style={{ background: 'rgba(251,191,36,0.07)', borderBottom: '1px solid rgba(251,191,36,0.2)' }}>
          <RefreshCw size={12} className="animate-spin" /> Yeniden bağlanıyor...
        </div>
      )}

      {/* Participants */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <p className="text-[0.62rem] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: 'rgba(139,92,246,0.6)' }}>
          {participants.length} Katılımcı
        </p>
        <AnimatePresence>
          <div className="flex flex-wrap gap-2">
            {participants.map(p => (
              <ParticipantCard key={p.identity} p={p}
                localMutes={localMutes}
                onVolumeChange={handleVolumeChange}
                onLocalMute={handleLocalMute} />
            ))}
          </div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="px-5 py-4 flex items-center justify-center gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {/* Mic */}
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }} onClick={toggleMic}
          className="flex flex-col items-center gap-1 group">
          <div className="w-12 h-12 flex items-center justify-center transition-all duration-200"
            style={{ background: muted ? 'rgba(239,68,68,0.15)' : 'rgba(139,92,246,0.15)', border: `1px solid ${muted ? 'rgba(239,68,68,0.5)' : 'rgba(139,92,246,0.5)'}`, borderRadius: '50%' }}>
            {muted ? <MicOff size={18} style={{ color: '#f87171' }} /> : <Mic size={18} style={{ color: '#a78bfa' }} />}
          </div>
          <span className="text-[0.58rem]" style={{ color: muted ? '#f87171' : 'rgba(255,255,255,0.3)' }}>{muted ? 'Kapalı' : 'Açık'}</span>
        </motion.button>

        {/* Deafen */}
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }} onClick={toggleDeafen}
          className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 flex items-center justify-center transition-all duration-200"
            style={{ background: deafened ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${deafened ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '50%' }}>
            {deafened ? <VolumeX size={18} style={{ color: '#f87171' }} /> : <Volume2 size={18} style={{ color: 'rgba(255,255,255,0.5)' }} />}
          </div>
          <span className="text-[0.58rem]" style={{ color: deafened ? '#f87171' : 'rgba(255,255,255,0.3)' }}>{deafened ? 'Sağır' : 'Dinliyor'}</span>
        </motion.button>

        {/* Leave */}
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }} onClick={onLeave}
          className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 flex items-center justify-center transition-all duration-200"
            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.5)', borderRadius: '50%' }}>
            <PhoneOff size={18} style={{ color: '#f87171' }} />
          </div>
          <span className="text-[0.58rem] text-red-400/70">Ayrıl</span>
        </motion.button>
      </div>
    </div>
  )
}

// ─── Ana Sayfa Bileşeni ───────────────────────────────────────────────────────
export function SesliClient() {
  const [username, setUsername] = useState('')
  const [rooms, setRooms] = useState<VoiceRoom[]>([])
  const [token, setToken] = useState<string | null>(null)
  const [lkUrl, setLkUrl] = useState<string | null>(null)
  const [activeRoom, setActiveRoom] = useState<VoiceRoom | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [showPwModal, setShowPwModal] = useState<VoiceRoom | null>(null)
  const [password, setPassword] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [newRoom, setNewRoom] = useState({ name: '', locked: false, password: '' })

  // Oda listesini API'den çek
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch('/api/voice-rooms')
        if (res.ok) { const data = await res.json(); if (Array.isArray(data) && data.length) setRooms(data) }
      } catch {}
    }
    fetchRooms()
    const t = setInterval(fetchRooms, 8000)
    return () => clearInterval(t)
  }, [])

  const joinRoom = useCallback(async (room: VoiceRoom, pw = '') => {
    if (!username.trim()) { setError('Önce kullanıcı adın gir'); return }
    setLoading(room.id); setError('')
    try {
      const res = await fetch('/api/livekit-token', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room: room.id, username: username.trim(), password: pw }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Bağlantı hatası'); return }
      setToken(data.token); setLkUrl(data.url); setActiveRoom(room)
      setShowPwModal(null); setPassword('')
    } catch { setError('Sunucuya bağlanılamadı') }
    finally { setLoading(null) }
  }, [username])

  const handleRoomClick = useCallback((room: VoiceRoom) => {
    if (room.isLocked) { setShowPwModal(room); setPassword('') }
    else joinRoom(room)
  }, [joinRoom])

  const leaveRoom = useCallback(() => {
    setToken(null); setLkUrl(null); setActiveRoom(null)
  }, [])

  const createRoom = useCallback(async () => {
    if (!newRoom.name.trim()) return
    const slug = newRoom.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 40)
    const fakeRoom: VoiceRoom = { id: slug, name: newRoom.name.trim(), description: 'Özel oda', icon: '🎙️', isLocked: newRoom.locked, maxUsers: 20, participants: 0 }
    setShowCreate(false)
    setNewRoom({ name: '', locked: false, password: '' })
    joinRoom(fakeRoom, newRoom.locked ? newRoom.password : '')
  }, [newRoom, joinRoom])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#07070B' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 20% 20%, rgba(109,40,217,0.08) 0%, transparent 60%)' }} />
      <div className="fixed top-0 left-0 right-0 h-px z-10 pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.7), rgba(236,72,153,0.5), transparent)' }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 mt-16" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-200 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-[0.78rem] font-medium tracking-[0.06em]">Geri Dön</span>
        </Link>
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <p className="text-[0.62rem] font-bold tracking-[0.3em] uppercase mb-0.5" style={{ color: 'rgba(139,92,246,0.7)' }}>MSGKO.NET</p>
          <h1 className="text-[1.1rem] font-black tracking-[0.12em] uppercase text-white" style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>Sesli Odalar</h1>
        </div>
        <div className="w-20" />
      </header>

      <div className="relative z-10 flex-1 px-4 md:px-8 py-8 max-w-[920px] mx-auto w-full">

        {/* Active room */}
        {token && lkUrl && activeRoom ? (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col" style={{ minHeight: 480, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(139,92,246,0.22)', borderRadius: 16, overflow: 'hidden' }}>
            <LiveKitRoom serverUrl={lkUrl} token={token} connect audio video={false} onDisconnected={leaveRoom}
              style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <RoomInside roomName={activeRoom.name} roomIcon={activeRoom.icon} username={username} onLeave={leaveRoom} />
            </LiveKitRoom>
          </motion.div>
        ) : (
          <>
            {/* Username input */}
            <div className="mb-6 p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 }}>
              <label className="text-[0.72rem] font-bold tracking-[0.18em] uppercase mb-2 block" style={{ color: 'rgba(139,92,246,0.8)' }}>Kullanıcı Adın</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value.slice(0, 28))}
                placeholder="Oyun nick'in (örn. WarriorKing)"
                className="w-full bg-white/[0.04] border border-white/10 text-white px-4 py-2.5 text-[0.85rem] outline-none focus:border-purple-500/50 transition-colors"
                style={{ borderRadius: 8 }} />
              {error && <p className="text-[0.72rem] text-red-400 mt-2 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
            </div>

            {/* Room list header */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[0.72rem] font-bold tracking-[0.18em] uppercase" style={{ color: 'rgba(139,92,246,0.8)' }}>Odalar</h2>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setShowCreate(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[0.72rem] font-bold tracking-wider uppercase"
                style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 6, color: 'rgba(167,139,250,0.9)' }}>
                <Plus size={12} /> Oda Oluştur
              </motion.button>
            </div>

            {/* Room grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rooms.map((room, i) => (
                <motion.button key={room.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoomClick(room)} disabled={!!loading}
                  className="text-left p-5 transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.35)'; e.currentTarget.style.background = 'rgba(139,92,246,0.05)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{room.icon}</span>
                      <span className="text-[0.9rem] font-bold text-white">{room.name}</span>
                    </div>
                    {room.isLocked ? <Lock size={13} style={{ color: 'rgba(251,191,36,0.7)' }} /> : <Unlock size={13} style={{ color: 'rgba(34,197,94,0.5)' }} />}
                  </div>
                  <p className="text-[0.72rem] mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>{room.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Users size={11} style={{ color: 'rgba(255,255,255,0.3)' }} />
                      <span className="text-[0.65rem]" style={{ color: room.participants > 0 ? 'rgba(34,197,94,0.8)' : 'rgba(255,255,255,0.3)' }}>
                        {room.participants} / {room.maxUsers}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <LogIn size={11} style={{ color: 'rgba(139,92,246,0.5)' }} />
                      <span className="text-[0.65rem]" style={{ color: 'rgba(139,92,246,0.6)' }}>
                        {loading === room.id ? 'Bağlanıyor...' : 'Giriş yap'}
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Password Modal */}
      <AnimatePresence>
        {showPwModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[300] bg-black/70" style={{ backdropFilter: 'blur(6px)' }}
              onClick={() => setShowPwModal(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[301] w-[90vw] max-w-sm p-6"
              style={{ background: 'rgba(10,10,18,0.98)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 16, boxShadow: '0 24px 64px rgba(0,0,0,0.8)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Lock size={16} style={{ color: 'rgba(251,191,36,0.8)' }} />
                <h3 className="text-[0.95rem] font-bold text-white">{showPwModal.icon} {showPwModal.name}</h3>
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Oda şifresi" autoFocus
                className="w-full bg-white/[0.04] border border-white/10 text-white px-4 py-2.5 text-[0.85rem] outline-none focus:border-purple-500/50 transition-colors mb-4"
                style={{ borderRadius: 8 }}
                onKeyDown={e => { if (e.key === 'Enter') joinRoom(showPwModal, password) }} />
              {error && <p className="text-[0.72rem] text-red-400 mb-3">{error}</p>}
              <div className="flex gap-2">
                <button onClick={() => { setShowPwModal(null); setError('') }}
                  className="flex-1 py-2.5 text-[0.78rem] font-bold uppercase text-white/40 border border-white/10 hover:border-white/20 transition-colors" style={{ borderRadius: 8 }}>
                  İptal
                </button>
                <button onClick={() => joinRoom(showPwModal, password)} disabled={!!loading}
                  className="flex-1 py-2.5 text-[0.78rem] font-bold uppercase text-white transition-all"
                  style={{ background: 'rgba(139,92,246,0.7)', borderRadius: 8, opacity: loading ? 0.5 : 1 }}>
                  {loading ? 'Bağlanıyor...' : 'Gir'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create Room Modal */}
      <AnimatePresence>
        {showCreate && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[300] bg-black/70" style={{ backdropFilter: 'blur(6px)' }}
              onClick={() => setShowCreate(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[301] w-[90vw] max-w-sm p-6"
              style={{ background: 'rgba(10,10,18,0.98)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 16, boxShadow: '0 24px 64px rgba(0,0,0,0.8)' }}>
              <h3 className="text-[0.95rem] font-bold text-white mb-4">Oda Oluştur</h3>
              <div className="flex flex-col gap-3 mb-4">
                <input type="text" value={newRoom.name} onChange={e => setNewRoom(p => ({ ...p, name: e.target.value }))}
                  placeholder="Oda adı" maxLength={32} autoFocus
                  className="w-full bg-white/[0.04] border border-white/10 text-white px-4 py-2.5 text-[0.85rem] outline-none focus:border-purple-500/50 transition-colors"
                  style={{ borderRadius: 8 }} />
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={newRoom.locked} onChange={e => setNewRoom(p => ({ ...p, locked: e.target.checked }))} className="accent-purple-500 w-4 h-4" />
                  <span className="text-[0.78rem] text-white/60">Şifreli oda</span>
                </label>
                {newRoom.locked && (
                  <input type="password" value={newRoom.password} onChange={e => setNewRoom(p => ({ ...p, password: e.target.value }))}
                    placeholder="Şifre" className="w-full bg-white/[0.04] border border-white/10 text-white px-4 py-2.5 text-[0.85rem] outline-none focus:border-purple-500/50 transition-colors"
                    style={{ borderRadius: 8 }} />
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowCreate(false)}
                  className="flex-1 py-2.5 text-[0.78rem] font-bold uppercase text-white/40 border border-white/10 hover:border-white/20 transition-colors" style={{ borderRadius: 8 }}>
                  İptal
                </button>
                <button onClick={createRoom} disabled={!newRoom.name.trim() || !!loading}
                  className="flex-1 py-2.5 text-[0.78rem] font-bold uppercase text-white transition-all"
                  style={{ background: 'rgba(139,92,246,0.7)', borderRadius: 8, opacity: (!newRoom.name.trim() || loading) ? 0.5 : 1 }}>
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
