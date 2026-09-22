"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

interface MobileHeaderProps {
  onSearchOpen: () => void;
}

export function MobileHeader({ onSearchOpen }: MobileHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 md:hidden transition-all duration-300"
      style={{
        background: scrolled ? "rgba(7,8,13,0.96)" : "rgba(7,8,13,0.80)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(201,168,76,0.1)",
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      <div className="flex items-center justify-between px-5" style={{ height: "58px" }}>
        <Link href="/" className="flex flex-col items-center leading-none" aria-label="MSGKO">
          <svg width="16" height="11" viewBox="0 0 36 22" fill="none" aria-hidden="true" style={{ marginBottom: 2 }}>
            <path d="M3 19 L3 22 L33 22 L33 19 Z" fill="#c9a84c"/>
            <path d="M0 8 L9 18 L18 6 L27 18 L36 8 L33 19 L3 19 Z" fill="#c9a84c"/>
            <circle cx="0"  cy="8" r="2.5" fill="#c9a84c"/>
            <circle cx="18" cy="4" r="2.5" fill="#e8c96a"/>
            <circle cx="36" cy="8" r="2.5" fill="#c9a84c"/>
          </svg>
          <span
            className="font-black leading-none"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "20px",
              background: "linear-gradient(135deg, #e8c96a 0%, #c9a84c 50%, #a07830 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "0.06em",
            }}
          >
            MSGKO
          </span>
          <span style={{ fontSize: "6px", color: "var(--text-muted)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Knight Online
          </span>
        </Link>

        <button
          onClick={onSearchOpen}
          className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 active:scale-90"
          style={{ color: "var(--text-muted)", background: "rgba(255,255,255,0.03)" }}
          aria-label="Ara"
        >
          <Search size={18} />
        </button>
      </div>
    </header>
  );
}
