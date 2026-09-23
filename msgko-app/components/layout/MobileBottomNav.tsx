"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

function HomeIcon()   { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
function BookIcon()   { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>; }
function ImageIcon()  { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>; }
function CoinsIcon()  { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>; }

const navItems = [
  { Icon: HomeIcon,  label: "Anasayfa", href: "/" },
  { Icon: BookIcon,  label: "Rehber",   href: "/rehber" },
  { Icon: ImageIcon, label: "Wallpaper",href: "/wallpaper" },
  { Icon: CoinsIcon, label: "GB",       href: "/gb-fiyatlari" },
];

interface Props { onMenuOpen: () => void; }

export function MobileBottomNav({ onMenuOpen }: Props) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: "rgba(7,8,13,0.94)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(201,168,76,0.1)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
      aria-label="Mobil navigasyon"
    >
      <div className="flex items-center justify-around" style={{ height: "62px" }}>
        {navItems.map(({ Icon, label, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all duration-200 active:scale-90"
              style={{ minWidth: "44px" }}
              aria-label={label}
              aria-current={active ? "page" : undefined}
            >
              <span style={{ color: active ? "#c9a84c" : "#3a3530" }}>
                <Icon />
              </span>
              <span style={{ fontSize: "9.5px", fontWeight: 500, color: active ? "var(--text-primary)" : "#3a3530", lineHeight: 1 }}>
                {label}
              </span>
              {active && (
                <span
                  className="absolute bottom-0 rounded-full"
                  style={{ width: "24px", height: "2px", background: "linear-gradient(90deg, #c9a84c, #e8c96a)" }}
                />
              )}
            </Link>
          );
        })}
        <button
          onClick={onMenuOpen}
          className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full active:scale-90"
          style={{ minWidth: "44px", color: "#3a3530", background: "none", border: "none", cursor: "pointer" }}
          aria-label="Menü"
        >
          <Menu size={20} strokeWidth={1.8} />
          <span style={{ fontSize: "9.5px", fontWeight: 500, color: "#3a3530" }}>Menü</span>
        </button>
      </div>
    </nav>
  );
}
