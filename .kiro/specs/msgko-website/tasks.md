# Implementation Plan: MSG Knight Online Eğitim Websitesi

## Overview

Next.js App Router + TypeScript + Tailwind CSS + Framer Motion stack'i ile ultra premium dark fantasy temalı Knight Online eğitim websitesinin adım adım implementasyonu. Her görev bir öncekinin üzerine inşa edilir ve tüm bileşenler en sonda entegre edilir.

## Tasks

- [ ] 1. Proje altyapısını, tip sistemini ve tasarım sistemini kur
  - Next.js App Router + TypeScript projesini başlat; `tailwind.config.ts` içinde tasarım sistemi renklerini (`#0B0B0F`, `#111111`, `#171717`, accent, border değerleri) özel değerler olarak tanımla
  - `app/globals.css` dosyasına Tailwind direktiflerini ve CSS değişkenlerini ekle
  - `next/font/google` ile Inter fontunu (fallback: Poppins, system-ui) `app/layout.tsx`'e entegre et
  - `lib/types.ts` dosyasını oluştur: `Video`, `NavItem`, `FooterLink`, `FooterColumn`, `SocialLink`, `CategoryCard`, `Feature`, `HeroCTA`, `ButtonProps`, `VideoCardProps`, `SectionHeaderProps` interface'lerini tanımla
  - `lib/data.ts` dosyasını oluştur: 4 örnek video, 5 nav öğesi, 2 kategori kartı, 4 özellik bloğu ve footer verilerini statik olarak tanımla
  - _Gereksinimler: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 2. Yardımcı fonksiyonları uygula ve test et
  - [ ] 2.1 `lib/utils.ts` dosyasını oluştur: `formatViews` (0-999 → string, ≥1000 → "K"/"M" format) ve `formatDate` (ISO → Türkçe, geçersiz giriş → "" veya "—") fonksiyonlarını uygula
    - _Gereksinimler: 1.5, 11.1, 11.2, 11.3, 11.4_

  - [ ]* 2.2 `formatViews` için özellik tabanlı test yaz
    - **Özellik 3: formatViews Round-Trip Tutarlılığı**
    - fast-check ile arbitrary non-negative integers; 1000 altında formatViews(n) === String(n) olmalı
    - **Doğrular: Gereksinimler 6.11, 11.1, 11.2**

  - [ ]* 2.3 `formatDate` için özellik tabanlı test yaz
    - **Özellik 4: formatDate Geçersiz Giriş Toleransı**
    - fast-check ile arbitrary invalid strings; formatDate hiçbir zaman hata fırlatmamalı, "" veya "—" döndürmeli
    - **Doğrular: Gereksinimler 11.3, 11.4**

- [ ] 3. Kontrol nokta — Tüm testler geçiyor mu, hata var mı kontrol et. Sorular varsa kullanıcıya sor.

- [ ] 4. Hook'ları uygula
  - [ ] 4.1 `hooks/useScrollDetect.ts` dosyasını oluştur: 20px eşiğinde `isScrolled` boolean döndüren scroll dinleyicisi; cleanup ile birlikte
    - _Gereksinimler: 3.2_

  - [ ]* 4.2 `useScrollDetect` için özellik tabanlı test yaz
    - **Özellik 5: Scroll Detect Hook Doğruluğu**
    - Farklı scroll pozisyonları (0, 19, 20, 21, 500) ile hook'un doğru boolean döndürdüğünü doğrula
    - **Doğrular: Gereksinim 3.2**

  - [ ] 4.3 `hooks/useMobileMenu.ts` dosyasını oluştur: `isMobileMenuOpen`, `openMenu()`, `closeMenu()` — açıkken `document.body.style.overflow = 'hidden'`, kapalıyken kaldır
    - _Gereksinimler: 3.7, 3.8_

  - [ ]* 4.4 `useMobileMenu` için özellik tabanlı test yaz
    - **Özellik 6: Mobil Menü Body Lock Round-Trip**
    - Menü aç → body locked; menü kapat → body unlocked; her toggle döngüsünde geçerli
    - **Doğrular: Gereksinim 3.8**

- [ ] 5. UI primitif bileşenlerini oluştur
  - [ ] 5.1 `components/ui/Button.tsx` bileşenini uygula: `variant` (primary, secondary, ghost, dark), `size` (sm, md, lg), `href` (Link), `icon` desteği; Framer Motion hover geçişi; `aria-label` desteği
    - _Gereksinimler: 2.6, 2.7, 9.4, 10.7_

  - [ ] 5.2 `components/ui/SectionHeader.tsx` bileşenini uygula: başlık + opsiyonel aksiyon butonu/linki
    - _Gereksinimler: 5.1, 6.1_

  - [ ] 5.3 `components/ui/CategoryCard.tsx` bileşenini uygula: ikon, başlık, açıklama, ok işareti; Framer Motion hover (scale 1.03 + border glow); dark border; Next.js Link ile sarılı
    - _Gereksinimler: 5.3, 5.4, 5.5_

  - [ ] 5.4 `components/ui/VideoCard.tsx` bileşenini uygula: `next/image` thumbnail, kategori badge (renk sınıflandırma fonksiyonu), süre overlay, başlık, yazar, `formatViews` ile görüntülenme, `formatDate` ile tarih; Framer Motion hover (thumbnail zoom + shadow)
    - _Gereksinimler: 6.3, 6.4, 6.5, 6.6, 6.7, 6.11, 6.12_

  - [ ]* 5.5 `VideoCard` kategori badge renk ataması için özellik tabanlı test yaz
    - **Özellik 1: Kategori Badge Renk Ataması**
    - fast-check ile arbitrary 'asas' | 'okcu' değerleri; doğru CSS sınıfının döndüğünü doğrula
    - **Doğrular: Gereksinimler 6.5, 6.6**

  - [ ] 5.6 `components/ui/FeatureBlock.tsx` bileşenini uygula: ikon + başlık + açıklama, eşit spacing
    - _Gereksinimler: 7.2_

- [ ] 6. Kontrol nokta — UI primitive'ler çalışıyor mu, snapshot testleri geçiyor mu kontrol et. Sorular varsa kullanıcıya sor.

- [ ] 7. Layout bileşenlerini oluştur
  - [ ] 7.1 `components/layout/MobileMenu.tsx` bileşenini uygula: Framer Motion ile slide-in/out panel animasyonu, nav öğeleri listesi, kapatma butonu, `useMobileMenu` hook entegrasyonu
    - _Gereksinimler: 3.7, 3.8_

  - [ ] 7.2 `components/layout/Navbar.tsx` bileşenini uygula: sticky/fixed pozisyon; `useScrollDetect` ile backdrop-blur geçişi; logo (sol), nav öğeleri (orta), arama ikonu + YouTube butonu (sağ); `usePathname` ile aktif öğe vurgusu; hover underline animasyonu; `MobileMenu` entegrasyonu; hamburger ikonu (mobil)
    - _Gereksinimler: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.9_

  - [ ] 7.3 `components/layout/Footer.tsx` bileşenini uygula: 4 kolon grid (desktop) / stack (mobil); logo + açıklama + sosyal ikonlar; hızlı erişim linkleri; kategoriler linkleri; iletişim + "YOUTUBE KANALIMIZ" CTA; divider + copyright; dark gradient arka plan
    - _Gereksinimler: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9_

  - [ ]* 7.4 Navbar ve Footer için link href format testi yaz
    - **Özellik 2: Link Href Format Geçerliliği**
    - Tüm NavItem ve FooterLink href'lerinin / veya https:// ile başladığını doğrula
    - **Doğrular: Gereksinimler 3.4, 8.2, 8.3**

- [ ] 8. Section bileşenlerini oluştur
  - [ ] 8.1 `components/sections/HeroSection.tsx` bileşenini uygula: `min-h-[90vh]`; `next/image` priority arka plan; dark overlay + gradient; "KNIGHT ONLINE" etiketi, "EĞİTİM VİDEOLARI" başlığı, açıklama, 2 CTA butonu; desktop split / mobil stack layout; Framer Motion fade-in + slide-up giriş animasyonu
    - _Gereksinimler: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_

  - [ ] 8.2 `components/sections/CategorySection.tsx` bileşenini uygula: `SectionHeader` (başlık + "TÜM VİDEOLARI GÖR"); 2 `CategoryCard`; responsive grid (desktop: 2 kolon, mobil: 1 kolon)
    - _Gereksinimler: 5.1, 5.2, 5.6, 5.7_

  - [ ] 8.3 `components/sections/VideoSection.tsx` bileşenini uygula: `SectionHeader` (başlık + chevron); 4 `VideoCard`; responsive grid (desktop: 4 kolon, tablet: 2 kolon, mobil: 1 kolon); `lib/data.ts`'den veri
    - _Gereksinimler: 6.1, 6.2, 6.8, 6.9, 6.10_

  - [ ] 8.4 `components/sections/FeaturesSection.tsx` bileşenini uygula: 4 `FeatureBlock`; responsive grid (desktop: 4 kolon, tablet: 2×2, mobil: 1 kolon); Framer Motion InView fade-in; bloklar arası border ayırıcı
    - _Gereksinimler: 7.1, 7.3, 7.4, 7.5, 7.6, 7.7_

- [ ] 9. Kontrol nokta — Tüm section bileşenleri bağımsız olarak render ediliyor mu kontrol et. Sorular varsa kullanıcıya sor.

- [ ] 10. Ana sayfa ve layout entegrasyonu
  - [ ] 10.1 `app/layout.tsx` dosyasını uygula: RootLayout; Inter font entegrasyonu; `Navbar` ve `Footer` sarmalayıcısı; kapsamlı metadata (title, description, Open Graph, keywords); `<html lang="tr">`; `<body>` ile safe-area padding
    - _Gereksinimler: 1.6, 10.5, 10.6, 10.7, 10.8, 10.9_

  - [ ] 10.2 `app/page.tsx` dosyasını uygula: tüm section bileşenlerini sırayla birleştirir (`HeroSection`, `CategorySection`, `VideoSection`, `FeaturesSection`); `<main>` etiketi ile sarılı
    - _Gereksinimler: 10.6_

- [ ] 11. Performans ve SEO optimizasyonları
  - Tüm `next/image` kullanımlarında `width`/`height` veya `fill` + `aspect-ratio` tanımlarını ekle (CLS önlemi)
  - Above-the-fold dışındaki section'lar için `dynamic` import ile lazy loading uygula
  - Tüm tıklanabilir öğelere ve görsellere `aria-label` ekle; semantic HTML etiketlerini kontrol et
  - Harici linklere `rel="noopener noreferrer"` ekle
  - `next.config.js` içinde güvenli harici görsel domain'lerini tanımla
  - _Gereksinimler: 10.1, 10.2, 10.3, 10.4, 10.6, 10.7, 10.8, 10.9, 9.1, 9.2, 9.3, 9.4_

- [ ] 12. Responsive test ve ince ayar
  - Tüm breakpoint'lerde (1920, 1600, 1440, 1366, 1024, 820, 768, 430, 414, 390, 375, 360, 320px) layout bütünlüğünü kontrol et; overflow-x sorunlarını gider
  - Mobil safe-area padding'lerini ve touch target boyutlarını (min 44×44px) doğrula
  - Hamburger menü açma/kapama ve body scroll kilit davranışını mobil simülatörde test et
  - _Gereksinimler: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 13. Son kontrol noktası — Tüm testler geçiyor, responsive kontroller tamamlandı. Kullanıcıya teslim için hazır.

## Notes

- `*` ile işaretli görevler opsiyoneldir; MVP için atlanabilir
- Her görev belirli gereksinimlere referans verir (izlenebilirlik için)
- Kontrol noktaları artımlı doğrulama sağlar
- Özellik testleri `fast-check` ile, bileşen testleri `@testing-library/react` + `vitest` ile yazılır
- Tüm kod TypeScript ile tip güvenli olacak; `any` kullanımından kaçınılacak

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1"] },
    { "wave": 2, "tasks": ["2", "2.1", "2.2", "2.3"] },
    { "wave": 3, "tasks": ["3"] },
    { "wave": 4, "tasks": ["4", "4.1", "4.2", "4.3", "4.4", "5", "5.1", "5.2", "5.3", "5.4", "5.5", "5.6"] },
    { "wave": 5, "tasks": ["6"] },
    { "wave": 6, "tasks": ["7", "7.1", "7.2", "7.3", "7.4", "8", "8.1", "8.2", "8.3", "8.4"] },
    { "wave": 7, "tasks": ["9"] },
    { "wave": 8, "tasks": ["10", "10.1", "10.2"] },
    { "wave": 9, "tasks": ["11"] },
    { "wave": 10, "tasks": ["12"] },
    { "wave": 11, "tasks": ["13"] }
  ]
}
```
