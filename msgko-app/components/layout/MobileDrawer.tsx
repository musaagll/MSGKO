"use client";

import { useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ExternalLink } from "lucide-react";

interface Props {
  isOpen:          boolean;
  onClose:         () => void;
  onYoutubeOpen:   () => void;
  onInstagramOpen: () => void;
  onIletisimOpen:  () => void;
  onAsasOpen:      () => void;
  onWallpaperOpen: () => void;
}

const drawerNavItems = [
  { label: "Anasayfa",    href: "/" },
  { label: "Rehber",      href: "/rehber" },
  { label: "Wallpaper",   href: "/wallpaper" },
  { label: "GB Takip",    href: "/gb-fiyatlari" },
  { label: "Videolar",    href: "/youtube" },
  { label: "İletişim",    href: "/iletisim" },
];

export function MobileDrawer({ isOpen, onClose, onYoutubeOpen, onInstagramOpen, onIletisimOpen }: Props) {
  const pathname = usePathname();

  useEffect(() => { onClose(); }, [pathname, onClose]);

  const handleKey = useCallback((e: KeyboardEvent) => { if (e.key === "Escape") onClose(); }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [isOpen, handleKey]);

  return (
    <>
      <div
        className="fixed inset-0 z-[60] md:hidden transition-opacity duration-300"
        style={{ background: "rgba(0,0,0,0.7)", opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none" }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed top-0 right-0 bottom-0 z-[61] md:hidden w-[80vw] max-w-[320px] flex flex-col transition-transform duration-300 ease-out"
        style={{
          background: "rgba(10,9,13,0.98)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderLeft: "1px solid rgba(201,168,76,0.12)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Menü"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(201,168,76,0.08)" }}>
          <div className="flex flex-col leading-none">
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: "18px", background: "linear-gradient(135deg, #e8c96a, #c9a84c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontWeight: 900, letterSpacing: "0.06em" }}>
              MSGKO
            </span>
            <span style={{ fontSize: "6.5px", color: "#3a3530", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "1px" }}>Menü</span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg active:scale-90"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#5a5448" }}
            aria-label="Kapat"
          >
            <X size={15} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <ul className="flex flex-col gap-0.5">
            {drawerNavItems.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200"
                    style={{
                      background: active ? "rgba(201,168,76,0.07)" : "transparent",
                      border: active ? "1px solid rgba(201,168,76,0.15)" : "1px solid transparent",
                      color: active ? "var(--text-primary)" : "#5a5448",
                      textDecoration: "none",
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="my-5 h-px" style={{ background: "rgba(201,168,76,0.08)" }} />

          <p className="px-4 mb-2 text-xs uppercase tracking-widest" style={{ color: "#3a3530", letterSpacing: "0.14em" }}>Sosyal</p>
          {[
            { label: "YouTube Kanalı", action: () => onYoutubeOpen() },
            { label: "Instagram",      action: () => onInstagramOpen() },
            { label: "İletişim",       action: () => onIletisimOpen() },
          ].map(({ label, action }) => (
            <button
              key={label}
              onClick={action}
              className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm transition-colors duration-200"
              style={{ color: "#5a5448", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
            >
              <span className="font-medium">{label}</span>
              <ExternalLink size={12} className="opacity-40" />
            </button>
          ))}

          {[
            { label: "Instagram", href: "https://instagram.com/msgclip" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-colors duration-200"
              style={{ color: "#5a5448", textDecoration: "none" }}
            >
              <span className="font-medium">{label}</span>
              <ExternalLink size={12} className="opacity-40" />
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
