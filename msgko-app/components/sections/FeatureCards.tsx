"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

const CARD_BG: Record<string, string> = {
  rehber:    "radial-gradient(ellipse 120% 100% at 50% 100%, #1a1205 0%, #0d0c08 60%, #07080d 100%)",
  wallpaper: "radial-gradient(ellipse 120% 100% at 50% 100%, #0d1508 0%, #090d07 60%, #07080d 100%)",
  gbTakip:   "radial-gradient(ellipse 120% 100% at 50% 100%, #150d05 0%, #0e0b06 60%, #07080d 100%)",
  iletisim:  "radial-gradient(ellipse 120% 100% at 50% 100%, #0a0f18 0%, #08090e 60%, #07080d 100%)",
};

function BookIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
}
function ImageIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>;
}
function CoinsIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>;
}
function MailIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
}

const cards = [
  {
    key: "rehber",
    Icon: BookIcon,
    title: "Rehber",
    description: "Karakter, job, item, görev ve daha fazlası için detaylı rehberler.",
    href: "/rehber",
  },
  {
    key: "wallpaper",
    Icon: ImageIcon,
    title: "Wallpaper",
    description: "Knight Online temalı yüksek kaliteli duvar kağıtları.",
    href: "/wallpaper",
  },
  {
    key: "gbTakip",
    Icon: CoinsIcon,
    title: "GB Takip",
    description: "Güncel GB fiyatlarını takip et, piyasayı kaçırma.",
    href: "/gb-fiyatlari",
  },
  {
    key: "iletisim",
    Icon: MailIcon,
    title: "İletişim",
    description: "Soru, öneri ve iş birlikleri için bizimle iletişime geç.",
    href: "/iletisim",
  },
];

function FeatureCard({ card }: { card: typeof cards[0] }) {
  const [hovered, setHovered] = useState(false);
  const { Icon, title, description, href, key } = card;

  return (
    <Link
      href={href}
      className="group relative flex flex-col rounded-xl overflow-hidden transition-all duration-300"
      style={{
        background: CARD_BG[key],
        border: hovered ? "1px solid rgba(201,168,76,0.3)" : "1px solid rgba(255,255,255,0.07)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.15)" : "0 4px 20px rgba(0,0,0,0.4)",
        minHeight: "200px",
        textDecoration: "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(201,168,76,0.06) 0%, transparent 70%)",
          opacity: hovered ? 1 : 0,
        }}
      />
      <div className="relative z-10 flex flex-col p-6 h-full">
        <div className="mb-4 transition-colors duration-300" style={{ color: hovered ? "#e8c96a" : "#c9a84c" }}>
          <Icon />
        </div>
        <h3
          className="font-bold mb-2 transition-colors duration-200"
          style={{ fontSize: "17px", color: hovered ? "#f0ead6" : "#d4c89a", letterSpacing: "-0.01em" }}
        >
          {title}
        </h3>
        <p className="text-sm leading-relaxed flex-1" style={{ fontSize: "13px", color: "#5a5448", lineHeight: 1.65 }}>
          {description}
        </p>
        <div className="flex justify-end mt-5">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-250"
            style={{
              background: hovered ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.04)",
              border: hovered ? "1px solid rgba(201,168,76,0.35)" : "1px solid rgba(255,255,255,0.08)",
              color: hovered ? "#c9a84c" : "#3a3530",
              transform: hovered ? "translateX(2px)" : "translateX(0)",
            }}
          >
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export function FeatureCards() {
  return (
    <section className="relative z-10" aria-label="Ana özellikler">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <FeatureCard key={card.key} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
