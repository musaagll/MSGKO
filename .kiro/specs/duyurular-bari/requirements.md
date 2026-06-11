# Gereksinimler Dokümanı

## Giriş

Bu özellik, mevcut MSGKO Next.js + Supabase web sitesine bir "Duyurular" yan paneli ekler. Panel, navbar'daki Instagram butonu yanına yerleştirilen bir buton aracılığıyla açılır ve nttgame.com/knight adresindeki resmi Knight Online duyurularını otomatik olarak çekerek kullanıcılara premium bir görünümle sunar. Duyurular tarihe göre sıralı (yeniden eskiye) ve son 3 ay ile filtreli şekilde gösterilir.

## Sözlük

- **Duyurular_Bari**: Navbar'dan açılan, resmi Knight Online duyurularını gösteren yan panel bileşeni
- **Duyuru_Karti**: Tek bir duyuruyu title, kategori etiketi, tarih ve özet içeriğiyle gösteren kart bileşeni
- **Duyuru_Servisi**: nttgame.com/knight'tan duyuru verilerini çeken Next.js API route'u
- **Onbellek**: Duyuru verilerinin geçici olarak depolandığı sunucu taraflı veri deposu
- **SidePanel**: Mevcut projede sağdan kayan panel bileşeni (re-use edilecek)
- **Kategori_Etiketi**: Duyuruların [UPDATE], [EVENT], [ANNOUNCEMENT] gibi önceden belirlenmiş tipler içeren kategori bilgisi
- **Yenileme_Araligi**: Duyuruların yeniden çekileceği zaman dilimi (60 dakika)

---

## Gereksinimler

### Gereksinim 1: Duyurular Butonunun Navbar'a Eklenmesi

**Kullanıcı Hikayesi:** Bir Knight Online oyuncusu olarak, siteye girdiğimde navbar'dan duyurulara hızlıca erişebilmek istiyorum; böylece oyun içi güncellemelerden ve etkinliklerden haberdar olabilirim.

#### Kabul Kriterleri

1. THE Navbar SHALL render a "Duyurular" button positioned adjacent to the Instagram navigation button in the desktop navigation bar.
2. THE Navbar SHALL style the Duyurular button with a distinct amber/gold accent color (`#f59e0b` base) to visually differentiate it from YouTube (red) and Instagram (purple) buttons.
3. WHEN the Duyurular button is clicked, THE Navbar SHALL open the Duyurular_Bari side panel without page navigation.
4. WHERE the mobile menu is active, THE MobileMenu SHALL include a "Duyurular" entry consistent with the existing YouTube and Instagram entries.

---

### Gereksinim 2: Duyuru Verilerinin Çekilmesi (API Route)

**Kullanıcı Hikayesi:** Bir site kullanıcısı olarak, paneli her açtığımda güncel duyuruları görmek istiyorum; böylece en son Knight Online haberlerini kaçırmam.

#### Kabul Kriterleri

1. THE Duyuru_Servisi SHALL expose a Next.js API route at `/api/announcements` that returns Knight Online announcements as a JSON array.
2. WHEN a request is made to `/api/announcements`, THE Duyuru_Servisi SHALL fetch announcement data from `https://www.nttgame.com/knight` by scraping the ANNOUNCEMENT section.
3. WHEN fetching is successful, THE Duyuru_Servisi SHALL return announcements sorted by date descending (newest first).
4. WHEN fetching is successful, THE Duyuru_Servisi SHALL return only announcements published within the last 3 months (90 days from current date).
5. THE Duyuru_Servisi SHALL apply server-side caching with a `revalidate` interval of 3600 seconds (60 minutes) so that repeated requests do not re-scrape the source within one hour.
6. IF the source site is unreachable or returns an error, THEN THE Duyuru_Servisi SHALL return a JSON error response with HTTP status 503 and a descriptive message field.
7. IF the scraped content contains no announcements matching the 3-month filter, THEN THE Duyuru_Servisi SHALL return an empty array with HTTP status 200.
8. THE Duyuru_Servisi SHALL parse each announcement and return objects containing the fields: `title` (string), `category` (string), `date` (ISO 8601 string), `summary` (string), `url` (string), and `thumbnailUrl` (string or null).

---

### Gereksinim 3: Duyurular Yan Panelinin Görüntülenmesi

**Kullanıcı Hikayesi:** Bir oyuncu olarak, duyurular panelini açtığımda bilgilerin temiz, okunabilir ve premium görünümlü bir şekilde listelenmesini istiyorum; böylece duyuruları kolayca tarayabilirim.

#### Kabul Kriterleri

1. THE Duyurular_Bari SHALL reuse the existing SidePanel component with an amber/gold accent color (`#f59e0b`) for visual consistency with the Duyurular button.
2. WHEN the Duyurular_Bari is opened, THE Duyurular_Bari SHALL fetch announcements from `/api/announcements` and display a loading skeleton while the request is in progress.
3. WHEN announcements are loaded successfully, THE Duyurular_Bari SHALL render each announcement as a Duyuru_Karti in chronological descending order (newest first).
4. WHEN the API returns an error, THE Duyurular_Bari SHALL display a user-friendly Turkish error message ("Duyurular şu anda yüklenemiyor.") with a retry button.
5. WHEN the announcements list is empty after filtering, THE Duyurular_Bari SHALL display an empty-state message in Turkish ("Son 3 ayda yeni duyuru bulunamadı.").
6. THE Duyurular_Bari SHALL display a header section showing the nttgame.com/knight logo or icon, the panel title "DUYURULAR", and a subtitle indicating the data source.
7. THE Duyurular_Bari SHALL include a footer link that navigates to `https://www.nttgame.com/knight` in a new tab.
8. WHILE the Duyurular_Bari is open, THE SidePanel SHALL disable background page scroll consistent with existing panel behavior.

---

### Gereksinim 4: Duyuru Kartı Görsel Tasarımı

**Kullanıcı Hikayesi:** Bir oyuncu olarak, her duyurunun içeriğini, kategorisini ve tarihini net bir şekilde görmek istiyorum; böylece hangi duyuruların beni ilgilendirdiğini hızla anlayabilirim.

#### Kabul Kriterleri

1. THE Duyuru_Karti SHALL display the announcement `category` as a styled pill badge using color-coded variants: amber for `[UPDATE]`, green for `[EVENT]`, red for `[ANNOUNCEMENT]`, and gray for unknown categories.
2. THE Duyuru_Karti SHALL display the announcement `title` truncated to a maximum of 2 lines using CSS `line-clamp`.
3. THE Duyuru_Karti SHALL display the announcement `date` formatted in Turkish locale (e.g., "11 Haziran 2026").
4. THE Duyuru_Karti SHALL display the `summary` text truncated to a maximum of 3 lines.
5. WHEN the Duyuru_Karti is clicked, THE Duyuru_Karti SHALL open the announcement `url` in a new browser tab.
6. THE Duyuru_Karti SHALL render with a dark background (`rgba(255,255,255,0.03)`), a subtle amber border on hover (`rgba(245,158,11,0.3)`), and a smooth transition animation consistent with the existing card design language.
7. WHERE a `thumbnailUrl` is available, THE Duyuru_Karti SHALL display a small thumbnail image on the right side of the card.

---

### Gereksinim 5: Otomatik Güncelleme ve Önbellek Yönetimi

**Kullanıcı Hikayesi:** Bir site yöneticisi olarak, manuel müdahale olmaksızın duyuruların saatte bir otomatik güncellenmesini istiyorum; böylece kullanıcılar her zaman güncel bilgiye erişebilir.

#### Kabul Kriterleri

1. THE Duyuru_Servisi SHALL use Next.js `revalidate = 3600` (ISR) so that cached announcement data is refreshed automatically every 60 minutes without manual deployment.
2. WHEN a client requests announcements and the cache is still valid (under 60 minutes old), THE Duyuru_Servisi SHALL return the cached data without re-fetching from nttgame.com.
3. WHEN a client requests announcements and the cache has expired, THE Duyuru_Servisi SHALL re-scrape nttgame.com/knight and update the cache before responding.
4. IF the re-scrape attempt fails after cache expiry, THEN THE Duyuru_Servisi SHALL return the most recently cached data with an HTTP header `X-Cache-Status: stale` rather than an error, to ensure continuous availability.

---

### Gereksinim 6: Erişilebilirlik ve Responsive Davranış

**Kullanıcı Hikayesi:** Her kullanıcı olarak, duyurular panelini farklı ekran boyutlarında ve klavye ile erişebildiğimde rahat kullanabilmek istiyorum.

#### Kabul Kriterleri

1. THE Duyurular_Bari SHALL be fully keyboard-navigable: the panel SHALL trap focus while open and return focus to the trigger button upon close, consistent with existing SidePanel behavior.
2. WHEN the Escape key is pressed while the Duyurular_Bari is open, THE Duyurular_Bari SHALL close and return focus to the Duyurular navbar button.
3. THE Duyuru_Karti SHALL provide a visible focus indicator (`focus-visible:outline`) for keyboard users.
4. THE Duyurular_Bari SHALL be fully usable on viewport widths from 320px to 1920px, with the panel width respecting the existing `max-w-xl` constraint on desktop and expanding to full width on mobile.
5. THE Duyuru_Karti SHALL include an `aria-label` attribute containing the announcement title for screen reader accessibility.
