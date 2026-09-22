"use client";

import { useState, useCallback, useEffect } from "react";
import { Navbar } from "./Navbar";
import { MobileHeader } from "./MobileHeader";
import { MobileBottomNav } from "./MobileBottomNav";
import { MobileDrawer } from "./MobileDrawer";
import { SearchOverlay } from "./SearchOverlay";
import { Footer } from "./Footer";
import { ChatWidget } from "@/components/ui/ChatWidget";
import { IletisimModal } from "@/components/ui/IletisimModal";
import { AsasModal } from "@/components/ui/AsasModal";
import { WallpaperModal } from "@/components/ui/WallpaperModal";
import { InstagramModal } from "@/components/ui/InstagramModal";
import { SidePanel } from "@/components/ui/SidePanel";
import { YoutubePanel } from "@/components/ui/YoutubePanel";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [searchOpen,    setSearchOpen]    = useState(false);
  const [drawerOpen,    setDrawerOpen]    = useState(false);
  const [iletisimOpen,  setIletisimOpen]  = useState(false);
  const [asasOpen,      setAsasOpen]      = useState(false);
  const [wallpaperOpen, setWallpaperOpen] = useState(false);
  const [instagramOpen, setInstagramOpen] = useState(false);
  const [youtubeOpen,   setYoutubeOpen]   = useState(false);

  const handleGlobalModal = useCallback((e: Event) => {
    const { modal } = (e as CustomEvent<{ modal: string }>).detail;
    if (modal === "iletisim")  setIletisimOpen(true);
    if (modal === "asas")      setAsasOpen(true);
    if (modal === "wallpaper") setWallpaperOpen(true);
    if (modal === "instagram") setInstagramOpen(true);
    if (modal === "youtube")   setYoutubeOpen(true);
  }, []);

  useEffect(() => {
    window.addEventListener("msgko:openModal", handleGlobalModal);
    return () => window.removeEventListener("msgko:openModal", handleGlobalModal);
  }, [handleGlobalModal]);

  return (
    <>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <MobileHeader onSearchOpen={() => setSearchOpen(true)} />

      <main className="relative z-10 has-bottom-nav">
        {children}
      </main>

      {/* Footer — desktop only */}
      <div className="hidden md:block relative z-10">
        <Footer />
      </div>

      <MobileBottomNav onMenuOpen={() => setDrawerOpen(true)} />
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onYoutubeOpen={() => { setYoutubeOpen(true); setDrawerOpen(false); }}
        onInstagramOpen={() => { setInstagramOpen(true); setDrawerOpen(false); }}
        onIletisimOpen={() => { setIletisimOpen(true); setDrawerOpen(false); }}
        onAsasOpen={() => { setAsasOpen(true); setDrawerOpen(false); }}
        onWallpaperOpen={() => { setWallpaperOpen(true); setDrawerOpen(false); }}
      />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <IletisimModal  isOpen={iletisimOpen}  onClose={() => setIletisimOpen(false)} />
      <AsasModal      isOpen={asasOpen}      onClose={() => setAsasOpen(false)} />
      <WallpaperModal isOpen={wallpaperOpen} onClose={() => setWallpaperOpen(false)} />
      <InstagramModal isOpen={instagramOpen} onClose={() => setInstagramOpen(false)} />

      <SidePanel
        isOpen={youtubeOpen}
        onClose={() => setYoutubeOpen(false)}
        title="Videolar"
        subtitle="@musaagll kanalı"
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        }
        accentColor="#c9a84c"
        externalUrl="https://www.youtube.com/@musaagll/videos"
        externalLabel="Tüm Videolar"
      >
        <YoutubePanel />
      </SidePanel>

      <ChatWidget />
    </>
  );
}
