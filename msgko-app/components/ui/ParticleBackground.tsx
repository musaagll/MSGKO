'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number; vx: number; vy: number
  size: number; opacity: number; color: string
}

const COLORS = ['139,92,246', '236,72,153', '167,139,250']

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let lastFrame = 0
    const particles: Particle[] = []
    const COUNT = 20 // 35'ten 20'ye düşürüldü

    let debounceTimer: ReturnType<typeof setTimeout>
    const resize = () => {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }, 150)
    }
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    window.addEventListener('resize', resize)

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 1.8 + 0.4,
        opacity: Math.random() * 0.4 + 0.08,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      })
    }

    const draw = (ts: number) => {
      animId = requestAnimationFrame(draw)
      // 30fps cap — 60fps'e gerek yok, partiküller çok yavaş
      if (ts - lastFrame < 33) return
      lastFrame = ts

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        else if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        else if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color},${p.opacity})`
        ctx.fill()
      }
      // Bağlantı çizimi kaldırıldı — O(n²) döngü yoktu
    }
    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      clearTimeout(debounceTimer)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
