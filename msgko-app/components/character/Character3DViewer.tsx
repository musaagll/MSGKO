'use client'

import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, ContactShadows } from '@react-three/drei'
import type { Character, EquipmentSlotKey } from '@/lib/types/character'
import { SLOT_INFO } from '@/lib/types/character'
import * as THREE from 'three'

interface Props {
  character: Character
  highlightedSlot?: EquipmentSlotKey | null
}

const CLASS_ACCENT: Record<string, string> = {
  warrior: '#ef4444',
  rogue:   '#a78bfa',
  mage:    '#60a5fa',
  priest:  '#34d399',
}

const CLASS_LABELS: Record<string, string> = {
  warrior: 'Warrior', rogue: 'Rogue', mage: 'Mage', priest: 'Priest',
}

const NATION_LABELS: Record<string, string> = {
  karus: 'Karus', el_morad: 'El Morad',
}

// ─── Waiting scene — spinning ring, no robot ─────────────────────────────────

function WaitingScene({ accent }: { accent: string }) {
  const color = new THREE.Color(accent)
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 3]} intensity={0.8} color={color} />

      {/* Outer ring */}
      <mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[1.4, 0.015, 16, 80]} />
        <meshBasicMaterial color={accent} transparent opacity={0.5} />
      </mesh>

      {/* Inner ring */}
      <mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[1.0, 0.01, 16, 80]} />
        <meshBasicMaterial color={accent} transparent opacity={0.25} />
      </mesh>

      {/* Center glow sphere */}
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={2}
          transparent
          opacity={0.9}
        />
      </mesh>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={1.5}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  )
}

// ─── Main Viewer ──────────────────────────────────────────────────────────────

export function Character3DViewer({ character, highlightedSlot }: Props) {
  const [ready, setReady] = useState(false)
  const accent = CLASS_ACCENT[character.class] ?? '#a78bfa'

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden select-none"
      style={{
        height: 'clamp(340px, 50vw, 600px)',
        background: `radial-gradient(ellipse 80% 70% at 50% 100%, ${accent}18 0%, transparent 65%),
                     linear-gradient(180deg, #06060e 0%, #09070f 100%)`,
        border: `1px solid ${accent}25`,
        boxShadow: `0 0 60px rgba(0,0,0,0.7), 0 0 0 1px ${accent}10`,
      }}
    >
      {/* Canvas */}
      <Canvas
        gl={{ antialias: true, alpha: true }}
        style={{ position: 'absolute', inset: 0 }}
        onCreated={() => setReady(true)}
      >
        <WaitingScene accent={accent} />
      </Canvas>

      {/* Scan line overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
          zIndex: 2,
        }}
      />

      {/* Character name + class badge — top left */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div
          className="px-3 py-2 rounded-lg backdrop-blur-sm"
          style={{
            background: 'rgba(6,6,14,0.8)',
            border: `1px solid ${accent}35`,
            boxShadow: `0 0 20px ${accent}15`,
          }}
        >
          <p
            className="text-base font-black tracking-wider uppercase text-white leading-none"
            style={{ fontFamily: 'var(--font-rajdhani),sans-serif', textShadow: `0 0 20px ${accent}80` }}
          >
            {character.character_name}
          </p>
          <p className="text-[0.58rem] tracking-[0.18em] uppercase mt-1" style={{ color: `${accent}90` }}>
            {CLASS_LABELS[character.class]} · {NATION_LABELS[character.nation]} · Lv.{character.level}
          </p>
        </div>
      </div>

      {/* Server badge — top right */}
      <div className="absolute top-4 right-4 z-10 pointer-events-none">
        <div
          className="px-2.5 py-1.5 rounded-lg backdrop-blur-sm flex items-center gap-1.5"
          style={{ background: 'rgba(6,6,14,0.75)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} />
          <span className="text-[0.58rem] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {character.server.server_name}
          </span>
        </div>
      </div>

      {/* Centre overlay — "3D model hazırlanıyor" */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-5 pointer-events-none">
        <div className="text-center">
          <p
            className="text-[0.62rem] font-bold tracking-[0.28em] uppercase mb-2"
            style={{ color: `${accent}60` }}
          >
            3D Model
          </p>
          <p
            className="text-[0.72rem] font-black tracking-[0.15em] uppercase"
            style={{ color: `${accent}45` }}
          >
            Hazırlanıyor
          </p>
        </div>
      </div>

      {/* Highlighted slot label */}
      {highlightedSlot && (
        <div className="absolute bottom-10 inset-x-0 flex justify-center z-10 pointer-events-none">
          <div
            className="px-3 py-1.5 rounded-full backdrop-blur-sm text-xs font-semibold"
            style={{
              background: `${accent}20`,
              border: `1px solid ${accent}45`,
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            {SLOT_INFO[highlightedSlot].slot_label_tr}
          </div>
        </div>
      )}

      {/* Controls hint */}
      <div className="absolute bottom-3 left-4 z-10 pointer-events-none">
        <p className="text-[0.55rem] tracking-wide" style={{ color: 'rgba(255,255,255,0.18)' }}>
          🖱 Sürükle · Döndür
        </p>
      </div>

      {/* Demo badge */}
      {character.data_source === 'mock' && (
        <div className="absolute bottom-3 right-4 z-10 pointer-events-none">
          <span
            className="text-[0.5rem] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)', color: 'rgba(234,179,8,0.5)' }}
          >
            DEMO
          </span>
        </div>
      )}
    </div>
  )
}
