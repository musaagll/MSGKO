"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

interface NavbarProps {
  onSearchOpen: () => void;
}

const navLinks = [
  { label: "Anasayfa",  href: "/",             icon: "home"   },
  { label: "Pazar",     href: "/pazar",         icon: "shop"   },
  { label: "Rehber",    href: "/rehber",        icon: "book"   },
  { label: "Wallpaper", href: "/wallpaper",     icon: "image"  },
  { label: "GB Takip",  href: "/gb-fiyatlari",  icon: "globe"  },
  { label: "İletişim",  href: "/iletisim",      icon: "grid"   },
];

function NavIcon({ type }: { type: string }) {
  const cls = "w-4 h-4 flex-shrink-0";
  switch (type) {
    case "home":  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
    case "shop":  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
    case "book":  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
    case "image": return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>;
    case "globe": return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
    case "grid":  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>;
    default: return null;
  }
}


export function Navbar({ onSearchOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 hidden md:block transition-all duration-300"
      style={{
        background: scrolled ? "rgba(7,8,13,0.96)" : "rgba(7,8,13,0.72)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(201,168,76,0.12)",
      }}
    >
      <div className="section-container">
        <nav className="flex items-center justify-between" style={{ height: "68px" }} aria-label="Ana menü">

          {/* Logo */}
          <Link href="/" className="flex flex-col items-center leading-none group" aria-label="MSGKO Anasayfa">
            <svg width="18" height="12" viewBox="0 0 36 22" fill="none" className="mb-0.5" aria-hidden="true">
              <path d="M3 19 L3 22 L33 22 L33 19 Z" fill="#c9a84c"/>
              <path d="M0 8 L9 18 L18 6 L27 18 L36 8 L33 19 L3 19 Z" fill="#c9a84c"/>
              <circle cx="0"  cy="8" r="2.5" fill="#c9a84c"/>
              <circle cx="18" cy="4" r="2.5" fill="#e8c96a"/>
              <circle cx="36" cy="8" r="2.5" fill="#c9a84c"/>
            </svg>
            <span
              className="font-black tracking-wider leading-none"
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "26px",
                background: "linear-gradient(135deg, #e8c96a 0%, #c9a84c 50%, #a07830 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "0.08em",
              }}
            >
              MSGKO
            </span>
            <span
              className="uppercase tracking-[0.18em] leading-none mt-0.5"
              style={{ fontSize: "7px", color: "var(--text-muted)", letterSpacing: "0.22em" }}
            >
              Knight Online Community
            </span>
          </Link>

          {/* Nav links */}
          <ul className="flex items-center gap-1" role="list">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200"
                    style={{ color: isActive ? "var(--text-primary)" : "var(--text-secondary)" }}
                    aria-current={isActive ? "page" : undefined}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
                  >
                    <NavIcon type={item.icon} />
                    <span>{item.label}</span>
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full"
                        style={{ background: "linear-gradient(90deg, #c9a84c, #e8c96a, #c9a84c)" }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right */}
          <div className="flex items-center gap-3">
            <button
              onClick={onSearchOpen}
              className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200"
              style={{ color: "var(--text-muted)" }}
              aria-label="Ara"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--gold-mid)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
            >
              <Search size={17} />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
