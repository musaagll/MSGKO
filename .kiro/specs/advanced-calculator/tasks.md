# Implementation Plan: Advanced Calculator

## Overview

Knight Online Advanced Calculator'ı MSGKO Next.js sitesine entegre eden bu plan, statik veri katmanından başlayıp pure hesaplama fonksiyonlarına, state yönetimine ve son olarak UI bileşenlerine ilerler. Tüm dosyalar `msgko-app/` dizini altında oluşturulur. Proje: Next.js 14 App Router, TypeScript, Tailwind CSS, mevcut koyu tema.

## Tasks

- [x] 1. TypeScript tip tanımları oluştur
  - [x] 1.1 `lib/calculator/types.ts` dosyasını oluştur
    - `CharacterClass`, `StatPoints`, `EquippedItem`, `EquippedItems`, `ItemStat`, `BuffState`, `SetBonus`, `AchievementBonus`, `CalculatorState`, `CalculatorResult` interface ve type'larını tanımla
    - Design dokümanındaki tüm veri modellerini birebir uygula
    - _Requirements: 16.4, 8.1, 9.1, 10.1, 11.1_

- [x] 2. Statik veri dosyalarını oluştur
  - [x] 2.1 `lib/calculator/coefficients.ts` dosyasını oluştur
    - `COEFFICIENTS` lookup tablosunu tier 0/1/2 katsayılarıyla tanımla (Warrior/axe, Rogue/dagger, Rogue/bow, Priest/sword, Priest/club, Mage/staff, Kurian/sword)
    - `getWarriorCoefficients`, `getRogueCoefficients`, `getPriestCoefficients`, `getMageCoefficients`, `getKurianCoefficients` yardımcı fonksiyonlarını ekle
    - Warrior/Kurian pasif defense skill yüzdelerini (`WARRIOR_DEFENSE_SKILLS`, `KURIAN_DEFENSE_SKILLS`) ve resistance skill değerlerini içer
    - _Requirements: 16.2, 8.10, 12.1, 12.2, 13.1, 13.2_

  - [x] 2.2 `lib/calculator/achievements.ts` dosyasını oluştur
    - `Achievement` interface'ini ve `ACHIEVEMENTS` dizisini tanımla
    - kobugda.com achievementsdata kaynağından AP, AC, STR, DEX, HP, MP, INT, flameres, iceres, lightingres bonusu olan tüm achievement'ları ekle
    - _Requirements: 16.1, 7.1, 7.2_

  - [x] 2.3 `lib/calculator/sets.ts` dosyasını oluştur
    - Her sınıf için Krowaz, Mithril, Secret, HolyKnight, Rosetta set tablolarını 0-5 parça dizisi olarak tanımla (`WARRIOR_KROWAZ`, `ROGUE_KROWAZ`, `PRIEST_KROWAZ`, `MAGE_KROWAZ`, `KURIAN_KROWAZ_KURIAN`, `KURIAN_HOLY_KNIGHT_KURIAN` vb.)
    - `getAllSetBonuses(state)` yardımcı fonksiyonunu ekle; tüm aktif set bonuslarını topla
    - _Requirements: 16.1, 6.1, 6.2, 6.4_

  - [x] 2.4 `lib/calculator/items.ts` dosyasını oluştur
    - Temel silah ve zırh kategorilerini, item adlarını, Normal/Reverse/Rare türlerini ve grade/level seçeneklerini içeren statik veri yapısını oluştur
    - `ItemCategory`, `ItemEntry`, `ItemGrade` yapılarını tanımla
    - Gereksinim seviyesi, stat bonus ve AP/AC değerlerini içer
    - _Requirements: 16.1, 3.1, 3.2, 3.6_

- [x] 3. Pure hesaplama fonksiyonlarını yaz
  - [x] 3.1 `lib/calculator/formulas.ts` — AP hesaplama fonksiyonlarını yaz
    - `calculateWarriorAP`, `calculateRogueAP`, `calculatePriestAP`, `calculateMageAP`, `calculateKurianAP` fonksiyonlarını yaz
    - `calculateAP(state)` ana fonksiyonunu yaz; sınıfa göre ilgili fonksiyonu çağır
    - Weapon Enchant, Pet AP, Achievement AP bonuslarını uygula
    - `getTotalBonusStr`, `getTotalBonusDex` yardımcı fonksiyonlarını ekle (buff/set/achievement katkıları)
    - Buff conflict mantığını (Massive/Subside, Wolf/PriestBook vb.) bonus çarpanında yansıt
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 8.10, 3.4, 3.5, 3.7_

  - [x] 3.2 `lib/calculator/formulas.ts` — AC, HP, MP, FR/IR/LR hesaplama fonksiyonlarını yaz
    - `calculateAC(state)` fonksiyonunu yaz; item AC + buff'lar + pasif skill + pet + set + achievement
    - `calculateHP(state)` ve `calculateMP(state)` fonksiyonlarını yaz
    - `calculateFR`, `calculateIR`, `calculateLR` fonksiyonlarını yaz
    - `recalculate(state): CalculatorResult` ana fonksiyonunu yaz; tüm değerleri tek geçişte hesapla
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 10.1, 10.2, 10.3, 11.1, 11.2, 12.3, 12.4, 13.3_

  - [ ]* 3.3 `lib/calculator/formulas.ts` için birim testleri yaz
    - Warrior AP formülünü bilinen değerlerle doğrula (level 83, STR 150, sword AP 90 vb.)
    - Rogue Assassin / Archer AP farklılığını test et
    - Buff conflict kurallarını test et (Massive aktifken Wolf ile AP düşmeli)
    - AC pasif skill yüzdesi uygulamasını test et
    - _Requirements: 8.11, 16.4_

- [x] 4. Checkpoint — Formüller tamamlandı
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. State reducer ve başlangıç state'ini yaz
  - [x] 5.1 `lib/calculator/reducer.ts` dosyasını oluştur
    - `Action` union type'ını tanımla (`SET_CLASS`, `SET_LEVEL`, `SET_STAT`, `TOGGLE_BUFF`, `SET_BUFF_VALUE`, `EQUIP_ITEM`, `SET_ACHIEVEMENT`, `SET_WARRIOR_DEFENSE_SKILL`, `SET_WARRIOR_RESIST_SKILL`, `SET_KURIAN_DEFENSE_SKILL`, `SET_KURIAN_RESIST_SKILL`, `SET_SET_BONUS`)
    - `initialState: CalculatorState` nesnesini tanımla (Warrior, level 1, tüm stat'lar 0, buff'lar false)
    - `calculatorReducer(state, action)` fonksiyonunu uygula
    - Her action sonrasında buff conflict kurallarını uygula (Req 4.3–4.12, 5.2–5.4, 10.4)
    - Level değişikliğinde stat puanı hesaplamasını güncelle (Req 1.4, 1.5, 1.6)
    - _Requirements: 16.5, 1.4, 1.5, 1.6, 2.2, 2.3, 2.4, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10, 4.11, 4.12, 5.2, 5.3, 5.4, 10.4_

  - [ ]* 5.2 `lib/calculator/reducer.ts` için birim testleri yaz
    - `SET_CLASS` action'ının ilgili buff'ları sıfırladığını test et
    - Buff conflict: Wolf aktifken PriestBook pasif olmalı
    - Bireysel scroll aktifken Power of Lion pasif olmalı
    - Pet buff exclusive constraint'ini test et
    - _Requirements: 4.3, 4.8, 4.9, 5.2, 5.3, 5.4_

- [x] 6. ResultPanel bileşenini oluştur
  - [x] 6.1 `components/calculator/ResultPanel.tsx` dosyasını oluştur
    - AP değerini büyük, belirgin kart olarak `text-purple-400` rengiyle göster
    - AC, HP, MP değerlerini yan yana etiketlenmiş kartlarda göster
    - FR, IR, LR değerlerini yan yana etiketlenmiş kartlarda göster
    - `CalculatorResult` prop'unu al; tüm değerler anlık güncellenir
    - Mevcut koyu tema stilini kullan (`bg-white/[0.03]`, `border-white/[0.08]`)
    - _Requirements: 14.1, 14.2, 14.3_

- [x] 7. ClassLevelPanel bileşenini oluştur
  - [x] 7.1 `components/calculator/ClassLevelPanel.tsx` dosyasını oluştur
    - Sınıf `<select>`: Warrior, Rogue (Assassin), Rogue (Archer), Priest, Mage, Kurian
    - Seviye `<select>`: 1–83 + 83/1–83/15 listesi
    - Kalan serbest stat puanı (`freeStatPoints`) ve kalan rebirth puanı (`freeRebirthPoints`) gösterimi
    - Warrior/Kurian için pasif defense ve resistance skill dropdown'larını göster/gizle
    - Priest için silah türü (Sword / Club 1H / Club 2H) seçimini ekle
    - `onClassChange`, `onLevelChange`, `onSkillChange` callback'lerini dispatch üzerinden aktar
    - _Requirements: 1.1, 1.2, 1.3, 12.1, 12.2, 13.1, 13.2, 14.4_

- [x] 8. StatPanel bileşenini oluştur
  - [x] 8.1 `components/calculator/StatPanel.tsx` dosyasını oluştur
    - STR, DEX, HP, MP, INT için `<input type="number">` alanları
    - Her input'un altında aktif buff'lardan gelen stat bonusunu göster (örn. `+15 (STR Scroll)`)
    - Toplam kullanılan / toplam limit progress bar
    - Rebirth stat noktaları için ayrı bölüm
    - Limit aşıldığında kullanıcıyı uyar (Req 2.3)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 9. ItemPanel bileşenini oluştur
  - [x] 9.1 `components/calculator/ItemPanel.tsx` dosyasını oluştur
    - Kategori → Item → Normal/Reverse/Rare → Grade/Level hiyerarşik dropdown'larını oluştur
    - Seçili item'ın stat kartını göster (AP, AC, bonus statlar, gereksinimler)
    - Equip Right, Equip Left, Equip (normal) butonlarını ekle
    - Item gereksinim seviyesi karşılanmıyorsa item adını `text-red-400`, karşılanıyorsa beyaz renkle göster
    - Set item algılandığında "Equip Set" butonu göster
    - _Requirements: 3.1, 3.2, 3.3, 3.6, 1.7_

- [x] 10. BuffPanel bileşenini oluştur
  - [x] 10.1 `components/calculator/BuffPanel.tsx` dosyasını oluştur
    - `<details>` toggle ile açılır/kapanır panel yapısı
    - Sol kolon: stat scroll'ları, AP buff'ları, AC buff'ları, HP buff dropdown, sınıfa özgü buff'lar
    - Sağ kolon: debuff'lar + pet buff'ları
    - Aktif toggle'lar `bg-purple-500/20 border-purple-500/40` stilinde vurgulanır
    - Devre dışı toggle'lar `disabled` ve soluk görünür
    - AC Buff ve HP Buff için `<select>` dropdown'ları kullan
    - Sınıfa özgü buff'ları (Berserker → Warrior, PriestBook → Priest vb.) `characterClass`'a göre göster/gizle
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10, 4.11, 4.12, 5.1, 5.2, 5.3, 5.4_

- [x] 11. SetBonusPanel bileşenini oluştur
  - [x] 11.1 `components/calculator/SetBonusPanel.tsx` dosyasını oluştur
    - Krowaz, Mithril, Secret, HolyKnight, Rosetta için parça sayısı (0-5) dropdown'ları
    - Kurian sınıfı seçildiğinde Krowaz Kurian / HolyKnight Kurian dropdown'larını göster
    - Her set seçiminde `SET_SET_BONUS` action dispatch et
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 12. AdvancedCalculator ana bileşenini oluştur
  - [x] 12.1 `components/calculator/AdvancedCalculator.tsx` dosyasını oluştur
    - `'use client'` directive ekle
    - `useReducer(calculatorReducer, initialState)` ile state yönetimini başlat
    - `useMemo(() => recalculate(state), [state])` ile `CalculatorResult` hesapla
    - Tüm alt bileşenleri (`ClassLevelPanel`, `StatPanel`, `ItemPanel`, `BuffPanel`, `SetBonusPanel`, `ResultPanel`) aktar ve dispatch'i prop olarak geçir
    - Responsive grid layout: mobil tek kolon, tablet+ iki/üç kolon
    - _Requirements: 14.1, 14.5, 16.5_

- [x] 13. Next.js route sayfasını ve Navbar entegrasyonunu tamamla
  - [x] 13.1 `app/hesap-makinesi/page.tsx` dosyasını oluştur
    - `Metadata` export et: title, description
    - `AdvancedCalculator` bileşenini `<main>` içinde render et
    - Server Component olarak bırak; `'use client'` ekleme
    - _Requirements: 15.3_

  - [x] 13.2 `lib/data.ts` dosyasına Hesap Makinesi linkini ekle
    - `NAV_ITEMS` dizisine `{ label: 'Hesap Makinesi', href: '/hesap-makinesi' }` ekle
    - Mevcut Navbar kodu `NAV_ITEMS` map'ini zaten `isActive` kontrolüyle kullandığından, aktif route vurgusu otomatik çalışır
    - _Requirements: 15.1, 15.2, 15.4_

- [x] 14. Final Checkpoint — Tüm bileşenler entegre edildi
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Kobugda.com kaynak dosyaları (`achievementsdata`, `setsdata`, `advancedcalc`, `calculatorformulas`) referans olarak `DENEME KNIGHTONLINE/1Js/` dizininde mevcut; gerçek katsayı ve veri değerleri oradan doğrulanacak
- Design'da Correctness Properties bölümü bulunmadığından property-based test task'ları eklenmedi; birim testleri ile coverage sağlanır
- Item veritabanı opsiyonel API route (`/api/calculator/items`) aracılığıyla Supabase'den de beslenebilir; MVP için `lib/calculator/items.ts` statik verisi kullanılır
- Tüm hesaplama fonksiyonları pure (side-effect-free) olduğundan `formulas.ts` bağımsız test edilebilir

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3", "2.4"] },
    { "id": 2, "tasks": ["3.1", "3.2"] },
    { "id": 3, "tasks": ["3.3", "5.1"] },
    { "id": 4, "tasks": ["5.2", "6.1", "7.1", "8.1", "9.1", "10.1", "11.1"] },
    { "id": 5, "tasks": ["12.1"] },
    { "id": 6, "tasks": ["13.1", "13.2"] }
  ]
}
```
