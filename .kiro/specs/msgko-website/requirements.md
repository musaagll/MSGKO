# Requirements Document

## Introduction

Bu belge, MSG Knight Online eğitim websitesi için gereksinimler içermektedir. Site; Knight Online oyun topluluğuna yönelik Asas ve Okçu karakterlere özel eğitim videoları sunan, Next.js (App Router) tabanlı ultra premium dark fantasy temalı bir web uygulamasıdır. Referans tasarıma birebir sadık kalınarak, 90+ Lighthouse skoru, tam responsive davranış ve premium gaming estetiği hedeflenmektedir.

---

## Glossary
- **Site**: MSG Knight Online eğitim websitesi uygulaması
- **Navbar**: Sayfanın üstündeki yapışık (sticky) navigasyon çubuğu bileşeni
- **HeroSection**: Ana sayfanın tam genişlikli sinematik giriş bölümü
- **CategorySection**: Asas ve Okçu kategori kartlarını listeleyen bölüm
- **VideoSection**: Son eklenen eğitim videolarını gösteren bölüm
- **FeaturesSection**: Sitenin özelliklerini tanıtan bilgi blokları bölümü
- **Footer**: Sayfanın alt kısmındaki 4 kolonlu bileşen
- **VideoCard**: Tek bir videoyu thumbnail, başlık, badge, süre, görüntülenme ve tarih ile temsil eden kart
- **CategoryCard**: Bir oyun kategorisini ikon, başlık ve açıklama ile temsil eden kart
- **MobileMenu**: Mobil cihazlarda hamburger ikonuyla açılan slide panel navigasyon bileşeni
- **Button**: Yeniden kullanılabilir CTA buton bileşeni
- **SectionHeader**: Bölüm başlığı ve opsiyonel aksiyon butonu içeren üst satır bileşeni
- **Asas**: Knight Online'da kılıç kullanan yakın dövüş karakteri sınıfı
- **Okçu**: Knight Online'da yay kullanan uzak menzil karakteri sınıfı
- **formatViews**: Görüntülenme sayısını okunabilir formata (ör. "1.2K") dönüştüren yardımcı fonksiyon
- **formatDate**: ISO tarih string'ini yerelleştirilmiş görüntüleme formatına dönüştüren yardımcı fonksiyon

---

## Requirements

### Gereksinim 1: Proje Yapısı ve Teknik Altyapı

**Kullanıcı Hikayesi:** Bir geliştirici olarak, projenin temiz ve modüler bir mimariye sahip olmasını istiyorum, böylece bakımı ve genişletmesi kolaylaşsın.

#### Kabul Kriterleri

1. THE Site SHALL Next.js App Router, TypeScript, Tailwind CSS ve Framer Motion kullanılarak oluşturulmalıdır.
2. THE Site SHALL `app/`, `components/layout/`, `components/sections/`, `components/ui/`, `hooks/`, `lib/`, `public/` klasör yapısına sahip olmalıdır.
3. THE Site SHALL `lib/types.ts` dosyasında tüm TypeScript interface ve type tanımlarını içermelidir.
4. THE Site SHALL `lib/data.ts` dosyasında statik video, özellik, navigasyon ve footer verilerini barındırmalıdır.
5. THE Site SHALL `lib/utils.ts` dosyasında `formatViews` ve `formatDate` yardımcı fonksiyonlarını içermelidir.
6. THE Site SHALL Inter fontunu `next/font/google` ile preload ederek yüklemelidir; fallback olarak Poppins ve system-ui kullanılmalıdır.
7. THE Site SHALL Vercel deployment'ına uyumlu olmalıdır.

---

### Gereksinim 2: Tasarım Sistemi ve Tema

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, sitenin premium dark fantasy gaming estetiğini hissetmesini istiyorum, böylece içeriğe odaklanmam ve markayı tanımam kolaylaşsın.

#### Kabul Kriterleri

1. THE Site SHALL arka plan renkleri olarak `#0B0B0F`, `#111111` ve `#171717` değerlerini kullanmalıdır.
2. THE Site SHALL metin renkleri olarak `#FFFFFF`, `#D8D8D8` ve `#999999` değerlerini kullanmalıdır.
3. THE Site SHALL vurgu renkleri olarak `#2A2A2A` ve `#404040` değerlerini kullanmalıdır.
4. THE Site SHALL kenar çizgisi rengi olarak `rgba(255, 255, 255, 0.08)` değerini kullanmalıdır.
5. THE Site SHALL Tailwind CSS `tailwind.config.ts` içinde yukarıdaki renk sistemini özel değerler olarak tanımlamalıdır.
6. WHEN bir kart veya bileşen hover durumuna geçtiğinde, THE Site SHALL Framer Motion ile `scale: 1.03` geçişi uygulamalıdır.
7. THE Site SHALL tüm geçişlerde smooth easing kullanmalı; agresif veya ani animasyonlardan kaçınmalıdır.

---

### Gereksinim 3: Navbar Bileşeni

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, sayfanın üstünde her zaman erişilebilir ve görsel olarak premium bir navigasyon çubuğu görmek istiyorum, böylece sitede kolayca gezinebileyim.

#### Kabul Kriterleri

1. THE Navbar SHALL sayfanın üstüne yapışık (sticky/fixed) olarak konumlandırılmalıdır.
2. WHEN kullanıcı sayfayı 20 piksel veya daha fazla aşağı kaydırdığında, THE Navbar SHALL `backdrop-blur` ve arka plan opaklık geçişi uygulamalıdır.
3. THE Navbar SHALL solda MSG Knight Online logosunu, ortada navigasyon öğelerini, sağda arama ikonu ve YouTube CTA butonunu içermelidir.
4. THE Navbar SHALL şu menü öğelerini içermelidir: Ana Sayfa, Asas Eğitimleri, Okçu Eğitimleri, Rehberler, İletişim.
5. WHEN bir menü öğesinin üzerine gelindiğinde, THE Navbar SHALL smooth underline animasyonu uygulamalıdır.
6. WHERE ekran genişliği 768 pikselin altında olduğunda, THE Navbar SHALL masaüstü menü öğeleri yerine hamburger menü ikonu göstermelidir.
7. WHEN hamburger menü ikonuna tıklandığında, THE MobileMenu SHALL slide panel animasyonuyla açılmalıdır.
8. WHEN MobileMenu açık olduğunda, THE Site SHALL `body` üzerinde `overflow: hidden` uygulayarak arka plan scroll'u engellemeli; MobileMenu kapandığında bu kilidi kaldırmalıdır.
9. THE Navbar SHALL aktif sayfa öğesini görsel olarak vurgulamalıdır.

---

### Gereksinim 4: Hero Bölümü

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, siteye girdiğimde hemen etkileyici ve içeriği açıklayan bir karşılama bölümü görmek istiyorum, böylece sitenin ne sunduğunu anında anlayayım.

#### Kabul Kriterleri

1. THE HeroSection SHALL tam genişlikte ve en az `90vh` yüksekliğinde görüntülenmelidir.
2. THE HeroSection SHALL `next/image` bileşeniyle optimize edilmiş sinematik bir arka plan görseli içermeli ve üzerinde dark overlay + gradient uygulanmalıdır.
3. THE HeroSection SHALL şu içerik öğelerini içermelidir: "KNIGHT ONLINE" küçük etiketi, "EĞİTİM VİDEOLARI" ana başlığı, açıklama metni ve iki CTA butonu.
4. THE HeroSection SHALL iki CTA butonunu içermelidir: "⚔ ASAS EĞİTİMLERİ" ve "🏹 OKÇU EĞİTİMLERİ".
5. WHERE ekran genişliği 768 piksel ve üzerinde olduğunda, THE HeroSection SHALL içeriği solda, görseli sağda konumlandıran split layout kullanmalıdır.
6. WHERE ekran genişliği 768 pikselin altında olduğunda, THE HeroSection SHALL içerik öğelerini dikey olarak yığan stack layout kullanmalıdır.
7. WHEN HeroSection ekrana girdiğinde, THE HeroSection SHALL Framer Motion ile içerik öğelerine fade-in ve slide-up giriş animasyonu uygulamalıdır.
8. THE HeroSection SHALL arkaplan görselini `priority={true}` ile yükleyerek LCP optimizasyonu sağlamalıdır.

---

### Gereksinim 5: Kategori Bölümü

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, karakterime uygun eğitim kategorisini kolayca bulup seçmek istiyorum, böylece ilgili videoları hızlıca görebileyim.

#### Kabul Kriterleri

1. THE CategorySection SHALL "KATEGORİLER" başlıklı bir section header ve sağ tarafta "TÜM VİDEOLARI GÖR" bağlantı butonu içermelidir.
2. THE CategorySection SHALL iki CategoryCard içermelidir: "ASAS EĞİTİMLERİ" (kılıç ikonu) ve "OKÇU EĞİTİMLERİ" (yay ikonu).
3. THE CategoryCard SHALL başlık, açıklama metni ve yönlendirme ok işareti içermelidir.
4. THE CategoryCard SHALL `rgba(255,255,255,0.08)` renginde kenar çizgisi ve dark arka plan içermelidir.
5. WHEN bir CategoryCard'ın üzerine gelindiğinde, THE CategoryCard SHALL Framer Motion ile scale animasyonu ve border glow efekti uygulamalıdır.
6. WHERE ekran genişliği 768 piksel ve üzerinde olduğunda, THE CategorySection SHALL kartları 2 kolon grid içinde göstermelidir.
7. WHERE ekran genişliği 768 pikselin altında olduğunda, THE CategorySection SHALL kartları tek kolon halinde yığmalıdır.

---

### Gereksinim 6: Video Bölümü

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, en son eklenen eğitim videolarını görsel olarak zengin ve bilgi içeren kartlarla görmek istiyorum, böylece izlemek istediğim videoyu kolayca seçebileyim.

#### Kabul Kriterleri

1. THE VideoSection SHALL "SON VİDEOLAR" başlıklı bir section header ve sağ tarafta chevron bağlantısı içermelidir.
2. THE VideoSection SHALL en az 4 VideoCard görüntülemelidir.
3. THE VideoCard SHALL video thumbnail görseli, kategori badge'i, video süresi (sağ alt köşede overlay olarak), başlık, yazar bilgisi (MSG logosu ile), görüntülenme sayısı ve tarih içermelidir.
4. THE VideoCard SHALL thumbnail görselini `next/image` ile optimize ederek göstermelidir.
5. WHEN bir VideoCard'ın kategorisi `'asas'` olduğunda, THE VideoCard SHALL mavi tonlu bir kategori badge'i göstermelidir.
6. WHEN bir VideoCard'ın kategorisi `'okcu'` olduğunda, THE VideoCard SHALL turuncu/amber tonlu bir kategori badge'i göstermelidir.
7. WHEN bir VideoCard'ın üzerine gelindiğinde, THE VideoCard SHALL Framer Motion ile thumbnail zoom animasyonu ve shadow büyümesi uygulamalıdır.
8. WHERE ekran genişliği 1024 piksel ve üzerinde olduğunda, THE VideoSection SHALL kartları 4 kolon grid içinde göstermelidir.
9. WHERE ekran genişliği 768 piksel ile 1023 piksel arasında olduğunda, THE VideoSection SHALL kartları 2 kolon grid içinde göstermelidir.
10. WHERE ekran genişliği 768 pikselin altında olduğunda, THE VideoSection SHALL kartları tek kolon halinde yığmalıdır.
11. THE VideoCard SHALL görüntülenme sayısını `formatViews` fonksiyonu aracılığıyla okunabilir formatta göstermelidir (ör. "1.2K").
12. THE VideoCard SHALL tarihi `formatDate` fonksiyonu aracılığıyla yerelleştirilmiş formatta göstermelidir.

---

### Gereksinim 7: Özellikler Bölümü

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, sitenin sunduğu değerleri kısa ve çarpıcı biçimde görmek istiyorum, böylece içerik kalitesine güvenim artsın.

#### Kabul Kriterleri

1. THE FeaturesSection SHALL şu 4 özellik bloğunu içermelidir: "Güncel İçerik", "Detaylı Anlatım", "Profesyonel Taktikler", "Kaliteli İçerik".
2. THE FeaturesSection SHALL her blokta ikon, başlık ve açıklama metni göstermelidir.
3. WHERE ekran genişliği 1024 piksel ve üzerinde olduğunda, THE FeaturesSection SHALL 4 bloğu yatay tek sıra olarak göstermelidir.
4. WHERE ekran genişliği 768 piksel ile 1023 piksel arasında olduğunda, THE FeaturesSection SHALL blokları 2×2 grid içinde göstermelidir.
5. WHERE ekran genişliği 768 pikselin altında olduğunda, THE FeaturesSection SHALL blokları tek kolon halinde yığmalıdır.
6. WHEN FeaturesSection viewport'a girdiğinde, THE FeaturesSection SHALL Framer Motion InView ile hafif fade-in animasyonu uygulamalıdır.
7. THE FeaturesSection SHALL bloklar arasında eşit spacing ve görsel ayırıcı border kullanmalıdır.

---

### Gereksinim 8: Footer Bileşeni

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, sayfanın altında kapsamlı ve düzenli bir bilgi ve bağlantı bölümü görmek istiyorum, böylece siteyi ve sosyal kanalları kolayca keşfedebileyim.

#### Kabul Kriterleri

1. THE Footer SHALL dört kolon içermelidir: (1) Logo + açıklama + sosyal medya ikonları, (2) Hızlı Erişim linkleri, (3) Kategoriler linkleri, (4) İletişim alanı.
2. THE Footer SHALL "HIZLI ERİŞİM" kolonunda şu linkleri içermelidir: Ana Sayfa, Asas Eğitimleri, Okçu Eğitimleri, Rehberler, İletişim.
3. THE Footer SHALL "KATEGORİLER" kolonunda şu linkleri içermelidir: Asas PK Taktikleri, Asas Farm Rotaları, Okçu PK Taktikleri, Okçu Skill Rehberleri, Okçu Farm Rotaları.
4. THE Footer SHALL iletişim kolonunda "YOUTUBE KANALIMIZ" CTA butonu içermelidir.
5. THE Footer SHALL sosyal medya ikonları olarak YouTube, Instagram, Discord ve X (Twitter) içermelidir.
6. WHERE ekran genişliği 1024 piksel ve üzerinde olduğunda, THE Footer SHALL 4 kolon yatay grid içinde gösterilmelidir.
7. WHERE ekran genişliği 1024 pikselin altında olduğunda, THE Footer SHALL kolonları dikey olarak yığmalıdır.
8. THE Footer SHALL en altta divider çizgisi ve copyright bilgisi içermelidir.
9. THE Footer SHALL dark gradient arka plan uygulamalıdır.

---

### Gereksinim 9: Responsive Davranış

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, siteyi hangi cihazda açarsam açayım düzgün görüntülenmesini ve kullanılabilir olmasını istiyorum.

#### Kabul Kriterleri

1. THE Site SHALL şu breakpoint'lerde layout bozulması içermemelidir: 1920, 1600, 1440, 1366, 1024, 820, 768, 430, 414, 390, 375, 360, 320 piksel.
2. THE Site SHALL hiçbir breakpoint'te yatay scroll (overflow-x) oluşturmamalıdır.
3. THE Site SHALL mobil cihazlarda `safe-area-inset` değerlerine uyumlu padding uygulamalıdır.
4. THE Site SHALL mobil buton ve tıklanabilir alanlarda en az 44×44 piksel dokunma hedefi boyutu sağlamalıdır (thumb-zone usability).
5. THE Site SHALL mobil performans için görsel ve kod varlıklarını optimize etmelidir.

---

### Gereksinim 10: Performans ve SEO

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, sitenin hızlı yüklenmesini ve arama motorlarında görünür olmasını istiyorum, böylece içeriklere kolayca erişebileyim.

#### Kabul Kriterleri

1. THE Site SHALL Lighthouse performans skoru 90 veya üzerinde olmalıdır.
2. THE Site SHALL `next/image` bileşenini tüm görseller için kullanmalı; WebP/AVIF formatını desteklemelidir.
3. THE Site SHALL hero görselini `priority={true}` ile yükleyerek LCP değerini optimize etmelidir.
4. THE Site SHALL above-the-fold dışındaki bileşenler için lazy loading uygulamalıdır.
5. THE Site SHALL `app/layout.tsx` içinde kapsamlı Open Graph ve metadata tanımları içermelidir.
6. THE Site SHALL semantik HTML etiketleri kullanmalıdır (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` vb.).
7. THE Site SHALL tüm tıklanabilir öğelerde ve görsellerde uygun `aria-label` değerleri içermelidir.
8. THE Site SHALL klavye navigasyonunu desteklemeli ve tüm interaktif öğelerde görünür focus state'i sağlamalıdır.
9. THE Site SHALL WCAG kontrast oranı standartlarına uygun renk kombinasyonları kullanmalıdır.

---

### Gereksinim 11: Yardımcı Fonksiyonlar

**Kullanıcı Hikayesi:** Bir geliştirici olarak, veri formatlama işlemlerini merkezi ve test edilebilir fonksiyonlarla yönetmek istiyorum, böylece tutarlılık sağlanabilsin.

#### Kabul Kriterleri

1. THE formatViews fonksiyonu SHALL sayısal görüntülenme değerini okunabilir kısa forma dönüştürmelidir (ör. 1200 → "1.2K", 1500000 → "1.5M").
2. IF görüntülenme sayısı 1000'in altında ise, THEN THE formatViews fonksiyonu SHALL sayıyı olduğu gibi string olarak döndürmelidir.
3. THE formatDate fonksiyonu SHALL ISO 8601 tarih string'ini yerelleştirilmiş Türkçe tarih formatına dönüştürmelidir (ör. "15 Ocak 2025").
4. IF geçersiz bir tarih string'i verildiğinde, THEN THE formatDate fonksiyonu SHALL boş string veya "—" döndürmelidir.
5. THE formatViews ve formatDate fonksiyonları SHALL `lib/utils.ts` dosyasında dışa aktarılmalıdır.
