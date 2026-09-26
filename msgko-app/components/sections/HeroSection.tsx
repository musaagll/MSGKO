"use client";

import Link from "next/link";
import { BookOpen, Play } from "lucide-react";
import { useState } from "react";
import { OkcuModal } from "@/components/ui/OkcuModal";
import { AsasModal } from "@/components/ui/AsasModal";

export function HeroSection() {
  const [okcuOpen, setOkcuOpen] = useState(false);
  const [asasOpen, setAsasOpen] = useState(false);

  return (
    <>
      <section
        className="relative overflow-hidden w-full"
        style={{ height: "calc(100vh - 68px)", minHeight: "580px", maxHeight: "780px", marginTop: "68px" }}
        aria-label="Hero"
        suppressHydrationWarning
      >
        {/* Full-width cinematic background */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Gorsel/arkaplan.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ filter: "brightness(0.72) saturate(0.9)" }}
          />

          {/* Left-side dark gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(7,8,13,0.92) 0%, rgba(7,8,13,0.75) 30%, rgba(7,8,13,0.35) 55%, rgba(7,8,13,0.10) 75%, transparent 100%)",
            }}
          />

          {/* Top dark fade */}
          <div
            className="absolute top-0 left-0 right-0"
            style={{ height: "120px", background: "linear-gradient(to bottom, rgba(7,8,13,0.85) 0%, transparent 100%)" }}
          />

          {/* Subtle gold tint overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 60% 80% at 30% 60%, rgba(201,168,76,0.04) 0%, transparent 70%)" }}
          />
        </div>

        {/* RIGHT: Decorative "MORE THAN A GAME" */}
        <div
          className="absolute right-8 top-16 z-10 hidden lg:flex flex-col items-end gap-1 select-none"
          aria-hidden="true"
        >
          <span className="text-xs font-semibold tracking-[0.22em] uppercase" style={{ color: "#5a5448" }}>More</span>
          <span className="text-xs font-semibold tracking-[0.22em] uppercase" style={{ color: "#5a5448" }}>Than A</span>
          <span className="text-xs font-semibold tracking-[0.22em] uppercase" style={{ color: "#5a5448" }}>Game</span>
        </div>

        {/* RIGHT: Quote block */}
        <div
          className="absolute right-8 top-32 z-10 hidden xl:block max-w-[220px] select-none"
          aria-hidden="true"
        >
          <p
            className="italic leading-relaxed"
            style={{ fontSize: "12px", color: "rgba(240,234,214,0.35)", fontFamily: "'Cinzel', serif" }}
          >
            &ldquo;Bazı oyunlar geçici, bazıları ise bir yaşam tarzıdır.&rdquo;
          </p>
        </div>

        {/* BOTTOM RIGHT: Knight Lives On */}
        <div
          className="absolute bottom-12 right-12 z-10 hidden lg:block select-none"
          style={{ fontFamily: "'Cinzel', serif", fontSize: "13px", color: "rgba(201,168,76,0.28)", fontStyle: "italic", letterSpacing: "0.08em" }}
          aria-hidden="true"
        >
          Knight Lives On
        </div>

        {/* LEFT: Text content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="section-container w-full">
            <div className="max-w-[540px]">

              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "#c9a84c", letterSpacing: "0.2em" }}>
                  Knight Online
                </span>
                <span className="gold-line" aria-hidden="true" />
              </div>

              {/* Main title */}
              <h1
                className="sr-only"
              >
                MSGKO — Knight Online Rehber Platformu
              </h1>
              <div
                aria-hidden="true"
                className="font-black leading-none mb-5"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "clamp(64px, 9vw, 110px)",
                  background: "linear-gradient(135deg, #ffffff 0%, #e8c96a 40%, #c9a84c 70%, #a07830 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "-0.01em",
                }}
              >
                MSGKO
              </div>

              {/* Sub-headline */}
              <h2
                className="font-bold uppercase tracking-wider mb-5"
                style={{ fontSize: "clamp(15px, 2vw, 22px)", color: "#f0ead6", letterSpacing: "0.08em", lineHeight: 1.2 }}
              >
                Oyuncular İçin Daha Fazlası
              </h2>

              {/* Description */}
              <p className="leading-relaxed mb-8" style={{ fontSize: "14px", color: "#9a9080", maxWidth: "420px" }}>
                Knight Online dünyasına dair rehberler, içerikler, araçlar ve daha fazlası.
                Tek bir yerde, oyuncular için.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setAsasOpen(true)}
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-lg font-semibold text-sm transition-all duration-200 group"
                  style={{ background: "transparent", border: "1px solid #c9a84c", color: "#f0ead6" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.12)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(201,168,76,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  <BookOpen size={16} strokeWidth={1.75} style={{ color: "#c9a84c" }} />
                  Asas Eğitimleri
                  <span style={{ color: "#c9a84c" }}>→</span>
                </button>

                <button
                  onClick={() => setOkcuOpen(true)}
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-lg font-semibold text-sm transition-all duration-200"
                  style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "#9a9080" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.22)";
                    (e.currentTarget as HTMLElement).style.color = "#f0ead6";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
                    (e.currentTarget as HTMLElement).style.color = "#9a9080";
                  }}
                >
                  <Play size={14} className="fill-current" />
                  Okçu Eğitimleri
                  <span>→</span>
                </button>

                <Link
                  href="/rehber"
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-lg font-semibold text-sm transition-all duration-200"
                  style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "#5a5448", textDecoration: "none" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#9a9080"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#5a5448"; }}
                >
                  Tüm Rehberler →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
          style={{ height: "160px", background: "linear-gradient(to top, #07080d 0%, rgba(7,8,13,0.7) 50%, transparent 100%)" }}
        />
      </section>

      <OkcuModal isOpen={okcuOpen} onClose={() => setOkcuOpen(false)} />
      <AsasModal isOpen={asasOpen} onClose={() => setAsasOpen(false)} />
    </>
  );
}
