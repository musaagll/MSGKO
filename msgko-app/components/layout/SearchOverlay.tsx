"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import Link from "next/link";
import { X, Search, BookOpen, Package, MapPin } from "lucide-react";

interface Props { isOpen: boolean; onClose: () => void; }

const suggestions = [
  { icon: BookOpen, label: "Rehber ara",  href: "/rehber",  hint: "Tüm rehberleri gör" },
  { icon: Package,  label: "Item ara",    href: "/item",    hint: "Item veritabanı" },
  { icon: MapPin,   label: "Görev ara",   href: "/rehber",  hint: "Görev rehberleri" },
];

export function SearchOverlay({ isOpen, onClose }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  const handleKey = useCallback((e: KeyboardEvent) => { if (e.key === "Escape") onClose(); }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [isOpen, handleKey]);

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col items-center pt-20 px-4 transition-all duration-200"
      style={{
        background: "rgba(7,8,13,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? "auto" : "none",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Arama"
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{
          background: "rgba(12,11,16,0.98)",
          border: "1px solid rgba(201,168,76,0.15)",
          transform: isOpen ? "translateY(0)" : "translateY(-12px)",
          transition: "transform 0.2s ease-out",
        }}
      >
        <div className="flex items-center gap-3 px-5" style={{ height: "58px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <Search size={17} style={{ color: "#c9a84c", flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Knight Online'da ara..."
            className="flex-1 bg-transparent outline-none font-medium placeholder:font-normal"
            style={{ color: "var(--text-primary)", fontSize: "15px" }}
            aria-label="Arama"
          />
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 transition-all duration-150 hover:bg-white/5"
            style={{ color: "#5a5448" }}
            aria-label="Kapat"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-3">
          {!query ? (
            <>
              <p className="px-3 py-2 text-xs uppercase tracking-widest" style={{ color: "#3a3530", letterSpacing: "0.12em" }}>
                Hızlı Erişim
              </p>
              <ul>
                {suggestions.map(({ icon: Icon, label, href, hint }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 hover:bg-white/[0.03]"
                      style={{ color: "var(--text-secondary)", textDecoration: "none" }}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0" style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.12)", color: "#c9a84c" }}>
                        <Icon size={14} strokeWidth={1.75} />
                      </div>
                      <div>
                        <span className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>{label}</span>
                        <span className="block text-xs" style={{ color: "#3a3530" }}>{hint}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="px-3 py-8 text-center">
              <p className="mb-1 font-medium text-sm" style={{ color: "#5a5448" }}>&quot;{query}&quot; için sonuç bulunamadı</p>
              <p className="text-xs" style={{ color: "#3a3530" }}>Arama sistemi yakında aktif olacak.</p>
            </div>
          )}
        </div>
      </div>
      <p className="mt-4 text-xs" style={{ color: "#3a3530" }} aria-hidden="true">ESC ile kapat</p>
    </div>
  );
}
