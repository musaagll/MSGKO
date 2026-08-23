'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ExternalLink, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const REELS = [
  { id: 'DZFCMQMNr5C', title: 'Reel 1' },
  { id: 'DZCa-y9to-h', title: 'Reel 2' },
  { id: 'DYtiLyONbys', title: 'Reel 3' },
  { id: 'DYUHlKYNNQr', title: 'Reel 4' },
  { id: 'DYNgnvAt07I', title: 'Reel 5' },
  { id: 'DYKPanwNpfi', title: 'Reel 6' },
  { id: 'DYE_Tu9N4uv', title: 'Reel 7' },
  { id: 'DX_pfd_t1xP', title: 'Reel 8' },
  { id: 'DX6KPEytyCX', title: 'Reel 9' },
  { id: 'DXzjOZ5Nxa8', title: 'Reel 10' },
  { id: 'DXv-iDcNL0a', title: 'Reel 11' },
  { id: 'DXq0Km1DfQ6', title: 'Reel 12' },
  { id: 'DXoEMJUDSBA', title: 'Reel 13' },
  { id: 'DXl1vUejZSl', title: 'Reel 14' },
  { id: 'DXgdvWNDWyh', title: 'Reel 15' },
  { id: 'DXbMcCqjbXr', title: 'Reel 16' },
  { id: 'DXWoetPjX15', title: 'Reel 17' },
  { id: 'DXUDn4JjRYl', title: 'Reel 18' },
  { id: 'DXSSWESjaGs', title: 'Reel 19' },
  { id: 'DXOzYExjXJv', title: 'Reel 20' },
  { id: 'DXNOI5WjZBZ', title: 'Reel 21' },
  { id: 'DXMAS3fjaLa', title: 'Reel 22' },
  { id: 'DXJMISbjRVD', title: 'Reel 23' },
  { id: 'DXG7TZ0DX2m', title: 'Reel 24' },
  { id: 'DXEHR1IDRWb', title: 'Reel 25' },
  { id: 'DW90b_5Dbp2', title: 'Reel 26' },
  { id: 'DW8uVZrjeUx', title: 'Reel 27' },
  { id: 'DW6Cak5DeI2', title: 'Reel 28' },
  { id: 'DW3DeCWjUZd', title: 'Reel 29' },
  { id: 'DWyvRcuDUlG', title: 'Reel 30' },
  { id: 'DWw1EnRDTdC', title: 'Reel 31' },
  { id: 'DWvnFwqjTUJ', title: 'Reel 32' },
  { id: 'DWvRhQGDHhM', title: 'Reel 33' },
  { id: 'DWtN80ZDVrQ', title: 'Reel 34' },
  { id: 'DWqZ3iHjdUR', title: 'Reel 35' },
  { id: 'DWlZmGvjVYB', title: 'Reel 36' },
  { id: 'DWjIMAtDfEX', title: 'Reel 37' },
  { id: 'DWiZq2IjRF3', title: 'Reel 38' },
  { id: 'DWeoDvCDWMe', title: 'Reel 39' },
  { id: 'DWeZJ5jjeMD', title: 'Reel 40' },
  { id: 'DWdyTjZjQIH', title: 'Reel 41' },
  { id: 'DWcCBL-DeQQ', title: 'Reel 42' },
  { id: 'DWZmXwtjS9I', title: 'Reel 43' },
  { id: 'DWYwSQ7DUVM', title: 'Reel 44' },
  { id: 'DWXL1KkDdsc', title: 'Reel 45' },
  { id: 'DWV1n_IDZAm', title: 'Reel 46' },
  { id: 'DWUoY3aDfdE', title: 'Reel 47' },
  { id: 'DWTr_pVDURx', title: 'Reel 48' },
  { id: 'DWTN5vujUtQ', title: 'Reel 49' },
  { id: 'DWQwffwjZ4S', title: 'Reel 50' },
  { id: 'DWPZtlfDbfX', title: 'Reel 51' },
  { id: 'DWMrbW_DYMq', title: 'Reel 52' },
  { id: 'DWKRrfjjXyr', title: 'Reel 53' },
  { id: 'DWJI9i5jTYN', title: 'Reel 54' },
  { id: 'DWH4vTgjVZQ', title: 'Reel 55' },
  { id: 'DWG598njVs9', title: 'Reel 56' },
  { id: 'DWGSywMjZzm', title: 'Reel 57' },
  { id: 'DWE7LWajSXc', title: 'Reel 58' },
  { id: 'DWEZHLNjOK8', title: 'Reel 59' },
  { id: 'DWDtxG9jVIM', title: 'Reel 60' },
  { id: 'DWBtWb1jQxA', title: 'Reel 61' },
  { id: 'DWBC7KSDf1D', title: 'Reel 62' },
  { id: 'DV_CORuDdzf', title: 'Reel 63' },
  { id: 'DV5kqmpjSQG', title: 'Reel 64' },
  { id: 'DNY1icJNXlL', title: 'Reel 65' },
  { id: 'DM7gFXMtd-f', title: 'Reel 66' },
  { id: 'DM5nMouNAAu', title: 'Reel 67' },
  { id: 'DMKnZTztj3t', title: 'Reel 68' },
  { id: 'DMJC7SigMSk', title: 'Reel 69' },
  { id: 'DMFbs2kNeaN', title: 'Reel 70' },
  { id: 'DMABL95NvmS', title: 'Reel 71' },
  { id: 'DL9XyXcNhG6', title: 'Reel 72' },
]

export function InstagramPage() {
  const [activeReel, setActiveReel] = useState<string | null>(null)

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#07070B' }}>
      {/* Mesh arka plan */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 60% 50% at 20% 20%, rgba(131,58,180,0.10) 0%, transparent 60%),
          radial-gradient(ellipse 50% 60% at 80% 80%, rgba(253,29,29,0.07) 0%, transparent 55%)
        `
      }} />

      {/* Top accent line */}
      <div className="fixed top-0 left-0 right-0 h-px pointer-events-none z-10"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(131,58,180,0.7), rgba(253,29,29,0.5), transparent)' }}
      />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 flex-shrink-0 mt-16"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-200 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span className="text-[0.78rem] font-medium tracking-[0.06em]">Geri Dön</span>
        </Link>

        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <p className="text-[0.62rem] font-bold tracking-[0.3em] uppercase mb-0.5"
            style={{ color: 'rgba(131,58,180,0.8)' }}>MSGKO.NET</p>
          <h1 className="text-[1.1rem] font-black tracking-[0.12em] uppercase text-white"
            style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>Instagram</h1>
        </div>

        <a href="https://www.instagram.com/msgclip" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-1.5 text-[0.68rem] font-bold tracking-[0.06em] uppercase text-white hover:opacity-80 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d)' }}>
          <ExternalLink size={11} />
          Takip Et
        </a>
      </motion.header>

      {/* Profil şeridi */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        className="relative z-10 flex items-center justify-between px-6 md:px-12 py-4 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex-shrink-0 p-[2px]"
            style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)' }}>
            <div className="w-full h-full rounded-full bg-[#07070B] flex items-center justify-center overflow-hidden">
              <Image src="/logo.png" alt="msgclip" width={26} height={26}
                className="object-contain" style={{ mixBlendMode: 'screen' }} />
            </div>
          </div>
          <div>
            <p className="text-white font-bold text-[0.85rem]">msgclip</p>
            <p className="text-[0.62rem] text-white/30">@msgclip · Knight Online</p>
          </div>
        </div>
      </motion.div>

      {/* Reels Grid */}
      <div className="relative z-10 flex-1 px-6 md:px-12 py-8 pb-16">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {REELS.map((reel, i) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative cursor-pointer group"
              style={{ aspectRatio: '9/16' }}
              onClick={() => setActiveReel(reel.id)}
            >
              <div className="absolute inset-0 overflow-hidden"
                style={{ border: '1px solid rgba(131,58,180,0.2)', borderRadius: '10px', transition: 'border-color 0.3s ease, box-shadow 0.3s ease' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(131,58,180,0.5)'
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px rgba(0,0,0,0.5), 0 0 24px rgba(131,58,180,0.15)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(131,58,180,0.2)'
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
                }}
              >
                <div style={{ marginTop: '-56px', marginBottom: '-200px', height: 'calc(100% + 56px + 200px)', pointerEvents: 'none' }}>
                  <iframe
                    src={`https://www.instagram.com/reel/${reel.id}/embed/`}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    scrolling="no" title={reel.title} loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-transparent group-hover:bg-black/20 transition-colors duration-200" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(131,58,180,0.85)', backdropFilter: 'blur(4px)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </div>
                </div>
                <div className="absolute top-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  style={{ background: 'linear-gradient(90deg, #833ab4, #fd1d1d)', borderRadius: '10px 10px 0 0' }} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="max-w-[1400px] mx-auto mt-10">
          <a href="https://www.instagram.com/msgclip" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 text-[0.78rem] font-bold tracking-[0.1em] uppercase text-white hover:opacity-85 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 60%, #fcb045 100%)', borderRadius: '8px', boxShadow: '0 4px 24px rgba(131,58,180,0.3)' }}>
            Tümünü Instagram&apos;da Gör
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Fullscreen Reel */}
      <AnimatePresence>
        {activeReel && (
          <>
            <motion.div key="reel-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[500] bg-black/92" style={{ backdropFilter: 'blur(10px)' }}
              onClick={() => setActiveReel(null)} />
            <motion.div key="reel-content"
              initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[501]"
              style={{ width: 'min(380px, 88vw)', aspectRatio: '9/16' }}>
              <iframe src={`https://www.instagram.com/reel/${activeReel}/embed/`}
                className="w-full h-full" frameBorder="0" scrolling="no" title="Instagram Reel" />
              <button type="button" onClick={() => setActiveReel(null)}
                className="absolute -top-10 right-0 w-8 h-8 flex items-center justify-center text-white/70 hover:text-white"
                aria-label="Kapat">
                <X size={20} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
