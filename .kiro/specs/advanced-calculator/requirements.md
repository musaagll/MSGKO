# Requirements Document

## Introduction

Bu özellik, Knight Online'ın popüler referans sitesi kobugda.com'daki Advanced Calculator'ın birebir işlevsel eşdeğerini MSGKO Next.js sitesine entegre etmeyi amaçlamaktadır. Hesap makinesi, oyuncuların karakter sınıfına, seviyesine, ekipmanlarına, buff/debuff'larına ve set bonuslarına göre AP (Attack Power), AC (Defense), HP, MP ve direniş (FR/IR/LR) değerlerini anlık olarak hesaplamasına olanak tanır. Tüm hesaplama mantığı client-side olarak TypeScript'e taşınacak; harici API çağrısı gerektiren item veritabanı dışındaki tüm veriler statik veri dosyalarında tutulacaktır.

---

## Glossary

- **Calculator**: Knight Online karakter stat hesaplama aracının tamamı — sınıf seçimi, ekipman yönetimi, buff/debuff paneli ve sonuç gösterimi dahil.
- **AP (Attack Power)**: Karakterin saldırı gücü. Formül: `FLOOR(FLOOR(0.005 × weapon × (stat+40) + coeff × weapon × level × stat + 3) × bonus_multiplier) + extra`
- **AC (Defense)**: Karakterin savunma değeri. Item AC + buff'lar + pasif skill + pet toplamından oluşur.
- **HP / MP**: Karakterin can / mana puanları. Base değer + stat bazlı + item bonusları + buff'ların toplamı.
- **Stat**: STR, DEX, HP (health), MP (magicpower), INT — beş temel karakter istatistiği.
- **Rebirth**: 83. seviyeden sonra başlayan 83/1 – 83/15 arası ek level sistemi. Her rebirth seviyesi 2 ek stat puanı verir.
- **Buff**: Karakter üzerine eklenen geçici güçlendirme efekti (Wolf, Scroll of Attack, Priest Book vb.).
- **Debuff**: Rakipten gelen ve karakterin değerlerini düşüren efekt (Malice, Torment, Parasite vb.).
- **Set Bonus**: Aynı setin birden fazla parçası takılı olduğunda devreye giren ek istatistik bonusu.
- **Achievement Bonus**: Oyun içi başarımlara bağlı kalıcı AP, AC ve stat bonusları.
- **Pet Buff**: Evcil hayvanın sağladığı HP+200, AC+20 veya AP+5 bonuslarından yalnızca biri aktif olabilir.
- **Weapon AP**: Silahın temel saldırı gücü değeri.
- **Coeff (Coefficient)**: Sınıf ve level aralığına göre değişen çarpan katsayısı (getRogueCoefficients, getWarriorCoefficients vb.).
- **Equip Slot**: Sağ El, Sol El, Zırh, Aksesuar, Sol Pathos, Sağ Pathos, Tattoo, Wings, Emblem ekipman yuvaları.
- **Item Grade**: Normal, Reverse, Rare, Unique, Draki gibi item kalite seviyeleri.
- **StatPoints**: Kullanıcının level bazlı dağıtabileceği stat noktası havuzu.
- **Warrior_Calculator / Rogue_Calculator / Priest_Calculator / Mage_Calculator / Kurian_Calculator**: Her sınıfa ait hesaplama alt-sistemi.

---

## Requirements

### Requirement 1: Sınıf ve Seviye Seçimi

**User Story:** Bir Knight Online oyuncusu olarak, karakterimin sınıfını ve seviyesini seçmek istiyorum; böylece hesaplamalar doğru sınıf katsayıları ve stat noktası sınırları kullanılarak yapılsın.

#### Acceptance Criteria

1. THE Calculator SHALL kullanıcıya Warrior, Rogue (Assassin/Archer), Priest, Mage ve Kurian sınıflarından birini seçme imkânı sunmalıdır.
2. WHEN kullanıcı bir sınıf seçtiğinde, THE Calculator SHALL o sınıfa özgü buff seçeneklerini, pasif skill dropdown'larını ve stat dağılımı arayüzünü aktif hâle getirmelidir.
3. THE Calculator SHALL 1 ile 83 arasındaki tam sayı seviyeleri ve 83/1 ile 83/15 arasındaki rebirth seviyelerini içeren bir seviye listesi sunmalıdır.
4. WHEN seviye 1 seçildiğinde, THE Calculator SHALL kullanılabilir stat puanını 10 olarak hesaplamalıdır.
5. WHEN seviye 2–83 arasında bir değer seçildiğinde, THE Calculator SHALL stat puanını `(level-1)*3 + (level > 60 ? level-60 : 0) + 10` formülüyle hesaplamalıdır.
6. WHEN rebirth seviyesi seçildiğinde, THE Calculator SHALL normal stat puanını 302 olarak sabitlemeli ve ek rebirth puanını `(rebirthLevel - 83) * 2` formülüyle hesaplamalıdır.
7. WHEN seviye değiştiğinde, THE Calculator SHALL ekipman gereksinim seviyesi kontrolünü yeniden çalıştırmalı ve gereksinim karşılanmıyorsa item adını kırmızı renkle göstermelidir.

---

### Requirement 2: Stat Noktası Dağıtımı

**User Story:** Bir Knight Online oyuncusu olarak, STR, DEX, HP, MP ve INT stat noktalarımı manuel olarak dağıtmak istiyorum; böylece farklı build'lerin AP/AC etkisini görebileyim.

#### Acceptance Criteria

1. THE Calculator SHALL STR, DEX, HP (health), MP (magicpower) ve INT için ayrı sayısal giriş alanları sunmalıdır.
2. WHEN bir stat değeri değiştiğinde, THE Calculator SHALL kullanılmakta olan toplam stat puanını ve kalan serbest stat puanını anlık olarak güncellemelidir.
3. IF toplam dağıtılan stat puanı kullanılabilir limiti aşarsa, THEN THE Calculator SHALL kullanıcıyı uyarmalı ve aşan değeri sıfırlamalıdır.
4. THE Calculator SHALL rebirth stat puanlarını normal stat puanlarından ayrı olarak takip etmelidir.
5. WHEN bir buff (örneğin Battle Cry, STR Scroll) aktif edildiğinde, THE Calculator SHALL ilgili stat'a buff bonusunu eklenmeli ve stat ekranını güncellenmelidir.

---

### Requirement 3: Item ve Ekipman Sistemi

**User Story:** Bir Knight Online oyuncusu olarak, karakterime ekipman takmak istiyorum; böylece item istatistikleri hesaplamaya dahil edilsin.

#### Acceptance Criteria

1. THE Calculator SHALL ekipman kategorisi, item adı, item türü (Normal/Reverse/Rare/Unique/Draki) ve item grade/level seçimi yapılmasına olanak tanıyan hiyerarşik dropdown'lar sunmalıdır.
2. WHEN bir item seçildiğinde, THE Calculator SHALL o item'in AP, AC, stat bonusu, HP/MP bonusu, direniş değerleri ve gereksinim bilgilerini item panelinde görüntülemelidir.
3. THE Calculator SHALL Sağ El, Sol El, Zırh, Aksesuar, Sol Pathos, Sağ Pathos, Tattoo, Wings ve Emblem yuvaları için bağımsız equip butonları sunmalıdır.
4. WHEN bir item Sol El yuvasına takıldığında, THE Calculator SHALL Sol El weapon AP'sini ana AP formülünde `floor(leftHandAP * 0.5)` olarak hesaba katmalıdır.
5. WHEN Pathos, Tattoo, Wings veya Emblem yuvasına item takıldığında, THE Calculator SHALL o item'in `damagePercentage` değerini bonus çarpanına eklemelidir.
6. THE Calculator SHALL item gereksinim seviyesi karşılanmıyorsa item adını kırmızı renkle, karşılanıyorsa beyaz renkle göstermelidir.
7. WHEN Weapon Enchant Scroll aktif iken bir silah takılıysa, THE Calculator SHALL silahın AP değerine 5 eklemeli ve sonuca 1 daha eklemelidir.

---

### Requirement 4: Buff ve Debuff Sistemi

**User Story:** Bir Knight Online oyuncusu olarak, aktif/pasif buff ve debuff'larımı seçmek istiyorum; böylece gerçek savaş koşullarındaki AP, AC, HP ve direniş değerlerimi görebileyim.

#### Acceptance Criteria

1. THE Calculator SHALL aşağıdaki buff toggle'larını sunmalıdır: STR+ Scroll (+15 STR), DEX+ Scroll (+15 DEX), HP+ Scroll (+15 HP), MP+ Scroll (+15 MP), INT+ Scroll (+15 INT), Power of Lion (+10 tüm stat'lar), Wolf (+20% AP), Scroll of Attack (+22% AP), Red Potion (+10% AP), Blue Potion (+60 AC), Weapon Enchant Scroll, Armor Enchant Scroll, Battle Cry (+15 tüm stat'lar), Berserker (+20% AP), War Commander Determination (+30% AP), Priest Book (+50% AP), Priest Limited Book (+55% AP), Priest STR (+30 STR — yalnızca Priest sınıfına), Mage Immunity Fire (+80 FR), Mage Immunity Cold (+80 IR), Mage Immunity Lightning (+80 LR), Frozen Armor (+60 AC), Frozen Shell (+120 AC), Ice Barrier (+180 AC), Gem of Defense, Gem of Life, Spell of Life (HP buff seçeneği), HP Buff (1500/2000/60%/2200 seçenekleri), AC Buff (200/300/350/380 seçenekleri).
2. THE Calculator SHALL aşağıdaki debuff toggle'larını sunmalıdır: Malice, Torment, Parasite, Superior Parasite, Confusion (-30 MP), Massive (-20% AP), Subside (-20% AP).
3. WHEN Wolf aktif edildiğinde, THE Calculator SHALL Priest Book, Priest Limited Book, Scroll of Attack ve War Commander Determination toggle'larını devre dışı bırakmalıdır.
4. WHEN Priest Book aktif edildiğinde, THE Calculator SHALL Priest Limited Book, Wolf, War Commander Determination ve Scroll of Attack toggle'larını devre dışı bırakmalıdır.
5. WHEN Priest Limited Book aktif edildiğinde, THE Calculator SHALL Wolf, Priest Book, War Commander Determination ve Scroll of Attack toggle'larını devre dışı bırakmalıdır.
6. WHEN War Commander Determination aktif edildiğinde, THE Calculator SHALL Wolf, Priest Book, Priest Limited Book ve Scroll of Attack toggle'larını devre dışı bırakmalıdır.
7. WHEN Scroll of Attack aktif edildiğinde, THE Calculator SHALL Wolf, Priest Book, Priest Limited Book ve War Commander Determination toggle'larını devre dışı bırakmalıdır.
8. WHEN Power of Lion aktif edildiğinde, THE Calculator SHALL bireysel stat scroll'larını (STR/DEX/HP/MP/INT) devre dışı bırakmalıdır.
9. WHEN herhangi bir bireysel stat scroll'u aktif edildiğinde, THE Calculator SHALL Power of Lion toggle'unu devre dışı bırakmalıdır.
10. WHEN Frozen Armor aktif edildiğinde, THE Calculator SHALL Frozen Shell, Ice Barrier ve AC Buff dropdown'unu devre dışı bırakmalıdır; ve tam tersi de geçerli olmalıdır.
11. WHEN Mage FR, Mage IR veya Mage LR immunity buflarından biri aktif edildiğinde, THE Calculator SHALL diğer iki immunity ve Magic Shield toggle'larını devre dışı bırakmalıdır.
12. WHEN Massive veya Subside debuff'larından biri aktif edildiğinde, THE Calculator SHALL AP bonus çarpanından 20 düşürmelidir; eğer aktif değilse diğer AP buff'ları normal uygulanmalıdır.

---

### Requirement 5: Pet Buff Sistemi

**User Story:** Bir Knight Online oyuncusu olarak, evcil hayvanımın sağladığı buff'ı seçmek istiyorum; böylece pet etkisi hesaplamaya dahil edilsin.

#### Acceptance Criteria

1. THE Calculator SHALL HP (+200), Defense (+20) ve Attack (+5) pet buff seçeneklerini sunmalıdır.
2. WHEN HP pet buff'u aktif edildiğinde, THE Calculator SHALL Defense ve Attack pet buff toggle'larını devre dışı bırakmalıdır.
3. WHEN Defense pet buff'u aktif edildiğinde, THE Calculator SHALL HP ve Attack pet buff toggle'larını devre dışı bırakmalıdır.
4. WHEN Attack pet buff'u aktif edildiğinde, THE Calculator SHALL HP ve Defense pet buff toggle'larını devre dışı bırakmalıdır.
5. WHEN HP pet buff aktifken, THE Calculator SHALL karakterin toplam HP değerine 200 eklemelidir.
6. WHEN Defense pet buff aktifken, THE Calculator SHALL karakterin toplam AC değerine 20 eklemelidir.
7. WHEN Attack pet buff aktifken, THE Calculator SHALL karakterin toplam AP değerine 5 eklemelidir.

---

### Requirement 6: Set Bonusu Sistemi

**User Story:** Bir Knight Online oyuncusu olarak, karakterimde aktif olan set kombinasyonunu seçmek istiyorum; böylece set bonuslarının stat'larıma ve AP/AC'ye etkisi hesaplansın.

#### Acceptance Criteria

1. THE Calculator SHALL Krowaz, Mithril (Basic), Secret, HolyKnight ve Rosetta set bonusu seçeneklerini sunmalıdır.
2. THE Calculator SHALL her set için takılı parça sayısına (Helm, Pauldron, Pads, Boots, Gauntlets kombinasyonları) göre farklılaşan bonusları, ilgili set veri tablosundan (örn. `WARRIOR_KROWAZ`) okuyarak uygulamalıdır.
3. WHEN set seçimi değiştiğinde, THE Calculator SHALL STR, DEX, HP, MP, INT, AC ve direniş değerlerini set bonusuna göre yeniden hesaplamalı ve AP/AC'yi güncellemelidir.
4. THE Calculator SHALL Kurian sınıfı için Krowaz Kurian ve HolyKnight Kurian gibi sınıfa özgü set tablolarını kullanmalıdır.

---

### Requirement 7: Achievement Bonus Sistemi

**User Story:** Bir Knight Online oyuncusu olarak, kazandığım başarımı seçmek istiyorum; böylece achievement'ın sağladığı AP, AC ve stat bonusu hesaplamaya dahil edilsin.

#### Acceptance Criteria

1. THE Calculator SHALL oyundaki tüm hesaplama ile ilgili achievement'ları (AP, AC, STR, DEX, HP, INT, MP, FR, IR, LR bonusu olanlar) içeren aranabilir bir dropdown sunmalıdır.
2. WHEN bir achievement seçildiğinde, THE Calculator SHALL achievement'ın AP, AC, STR, DEX, HP, MP, INT, flameres, iceres ve electricres bonuslarını anlık olarak hesaplamaya eklemeli ve sonuçları güncellenmelidir.
3. WHEN achievement seçimi temizlendiğinde, THE Calculator SHALL tüm achievement bonuslarını sıfırlamalı ve hesaplamayı güncellenmelidir.

---

### Requirement 8: AP Hesaplama Formülü

**User Story:** Bir Knight Online oyuncusu olarak, seçtiğim tüm parametrelere göre doğru AP değerini görmek istiyorum; böylece build optimizasyonu yapabileyim.

#### Acceptance Criteria

1. THE Warrior_Calculator SHALL AP'yi `FLOOR(FLOOR(0.005 × weaponAP × (totalStr+40) + coeff × weaponAP × level × totalStr + 3) × bonusMultiplier) + extraStr` formülüyle hesaplamalıdır; burada `extraStr = max(0, baseStr - 150) - (baseStr === 160 ? 1 : 0)`.
2. THE Rogue_Calculator SHALL Assassin modunda AP'yi dagger katsayısıyla `FLOOR(FLOOR(0.005 × effectiveAP × (totalDex+40) + coeff × effectiveAP × level × totalDex + 3) × bonusMultiplier)` formülüyle; sol elde silah varsa `effectiveAP = rightHandAP + FLOOR(leftHandAP × 0.5)` olarak hesaplamalıdır.
3. THE Rogue_Calculator SHALL Archer modunda, sadece sağ el yayı kullanarak AP'yi bow katsayısıyla hesaplamalıdır.
4. THE Priest_Calculator SHALL AP'yi kullandığı silah türüne (sword veya club) göre uygun katsayı ile hesaplamalıdır; Priest Book veya Limited Book aktifken AP bonus çarpanını sırasıyla +50 ve +55 artırmalıdır.
5. THE Mage_Calculator SHALL AP'yi STR tabanlı staff katsayısıyla hesaplamalıdır.
6. THE Kurian_Calculator SHALL AP'yi sword katsayısıyla ve sol el silahı olmaksızın yalnızca sağ el AP değeriyle hesaplamalıdır.
7. WHEN Wolf aktif olduğunda, THE Calculator SHALL bonus çarpanını 20 artırmalıdır; WHEN Scroll of Attack aktifken 22, WHEN War Commander Determination aktifken 30 artırmalıdır.
8. WHEN Red Potion aktif olduğunda, THE Calculator SHALL bonus çarpanını 10 artırmalıdır.
9. WHEN Berserker aktif olduğunda (yalnızca Warrior), THE Calculator SHALL bonus çarpanını 20 artırmalıdır.
10. THE Calculator SHALL katsayı değerini karakter level aralığına göre doğru lookup tablosundan seçmelidir: level < 10 ise düşük tier, 10 ≤ level < 60 ise orta tier, level ≥ 60 ise yüksek tier katsayısı.
11. FOR ALL geçerli (sınıf, seviye, stat, silah AP, buff) kombinasyonları, THE Calculator SHALL hesaplama sonucunu kobugda.com referans sitesiyle aynı üretmelidir (round-trip doğruluğu).

---

### Requirement 9: AC (Defense) Hesaplama

**User Story:** Bir Knight Online oyuncusu olarak, karakter savunma değerimin doğru hesaplanmasını istiyorum; böylece hayatta kalma optimizasyonu yapabileyim.

#### Acceptance Criteria

1. THE Calculator SHALL toplam AC değerini `itemAC + armorEnchantBonus + frozenArmorBonus + acBuffValue + bluePotionBonus + petAcBonus + gemDefBonus + setBonusAC + achievementAC + passiveSkillAC` formülüyle hesaplamalıdır.
2. WHEN Armor Enchant Scroll aktif olduğunda, THE Calculator SHALL AC'ye Armor Enchant Scroll'un katkısını eklemelidir.
3. WHEN Frozen Armor aktif olduğunda, THE Calculator SHALL AC'ye 60 eklemeli; Frozen Shell aktifken 120, Ice Barrier aktifken 180 eklemelidir (yalnızca biri aktif olabilir).
4. WHEN Warrior pasif defense skill seçildiğinde, THE Calculator SHALL sınıfa özgü pasif defense yüzdesini AC'ye uygulamalıdır (Hinder %10 — Iron Body %40).
5. WHEN Kurian pasif defense skill seçildiğinde, THE Calculator SHALL Kurian'a özgü pasif defense yüzdesini AC'ye uygulamalıdır (Hinder %5 — Iron Linker %20).

---

### Requirement 10: HP ve MP Hesaplama

**User Story:** Bir Knight Online oyuncusu olarak, gerçek HP ve MP değerlerimi görmek istiyorum; böylece hayatta kalma ve mana optimizasyonu yapabileyim.

#### Acceptance Criteria

1. THE Calculator SHALL HP değerini `baseHP + statBonusHP + itemBonusHP + buffBonusHP + setBonusHP + achievementHP + petHpBonus + gemLifeBonus + spellOfLifeBonus` formülüyle hesaplamalıdır.
2. THE Calculator SHALL MP değerini `baseMP + statBonusMP + itemBonusMP + buffBonusMP + setBonusMP + achievementMP` formülüyle hesaplamalıdır.
3. WHEN HP buff dropdown'undan bir değer seçildiğinde, THE Calculator SHALL HP'ye sabit değeri eklemelidir (1500, 2000 veya 2200); yüzdelik "Undying" seçeneği seçildiğinde ise toplam HP'nin %60'ını eklemeli değil, ayrıca göstermelidir.
4. WHEN Spell of Life aktif olduğunda, THE Calculator SHALL HP buff dropdown'unu devre dışı bırakmalıdır.

---

### Requirement 11: Direniş (Resistance) Hesaplama

**User Story:** Bir Knight Online oyuncusu olarak, ateş (FR), buz (IR) ve şimşek (LR) direniş değerlerimi görmek istiyorum; böylece eleman hasarına karşı savunmamı optimize edebileyim.

#### Acceptance Criteria

1. THE Calculator SHALL FR, IR ve LR değerlerini `itemResistance + setBonusResistance + achievementResistance + mageImmunityBonus` formülüyle hesaplamalıdır.
2. WHEN Mage Immunity Fire aktif olduğunda, THE Calculator SHALL FR değerine 80 eklemeli; Mage Immunity Cold aktifken IR'ye 80, Mage Immunity Lightning aktifken LR'ye 80 eklemelidir.
3. WHEN bir Mage immunity buff'u seçildiğinde, THE Calculator SHALL diğer iki immunity ve Magic Shield toggle'ını devre dışı bırakmalıdır.

---

### Requirement 12: Warrior Pasif Skill Sistemi

**User Story:** Bir Warrior olarak, defense ve direniş pasif skilllerimi seçmek istiyorum; böylece hesaplamalara pasif skill bonusları dahil edilsin.

#### Acceptance Criteria

1. WHERE sınıf Warrior olduğunda, THE Calculator SHALL defense pasif skill dropdown'unu sunmalıdır: Hinder (%10), Arrest (%15), Bulwark (%20), Evading (%25), Iron Skin (%30), Iron Body (%40).
2. WHERE sınıf Warrior olduğunda, THE Calculator SHALL resistance pasif skill dropdown'unu sunmalıdır: Resist (%30), Endure (%60), Immunity (%90).
3. WHEN Warrior defense pasif skill seçildiğinde, THE Calculator SHALL seçilen yüzdeyi toplam AC'ye uygulamalıdır.
4. WHEN Warrior resistance pasif skill seçildiğinde, THE Calculator SHALL seçilen yüzdeyi FR, IR ve LR değerlerine uygulamalıdır.

---

### Requirement 13: Kurian Pasif Skill Sistemi

**User Story:** Bir Kurian olarak, defense ve direniş pasif skilllerimi seçmek istiyorum; böylece Kurian'a özgü pasif bonus hesaplamaya dahil edilsin.

#### Acceptance Criteria

1. WHERE sınıf Kurian olduğunda, THE Calculator SHALL defense pasif skill dropdown'unu sunmalıdır: Hinder (%5), Arrest (%8), Bulwark (%10), Evading (%13), Iron Skin (%15), Iron Linker (%20).
2. WHERE sınıf Kurian olduğunda, THE Calculator SHALL resistance pasif skill dropdown'unu sunmalıdır: Resist (+15 flat), Endure (+30 flat), Immunity (+45 flat).
3. WHEN Kurian resistance pasif skill seçildiğinde, THE Calculator SHALL flat değeri FR, IR ve LR değerlerine eklemeli (yüzde değil, sabit artış olarak) uygulamalıdır.

---

### Requirement 14: Gerçek Zamanlı Hesaplama ve Sonuç Gösterimi

**User Story:** Bir Knight Online oyuncusu olarak, herhangi bir parametre değişikliğinde sonuçların anında güncellenmesini istiyorum; böylece hızlı karşılaştırma yapabileyim.

#### Acceptance Criteria

1. WHEN herhangi bir giriş değeri (sınıf, seviye, stat, item, buff, set, achievement) değiştiğinde, THE Calculator SHALL AP, AC, HP, MP, FR, IR ve LR değerlerini 100 ms içinde yeniden hesaplamalı ve ekranda göstermelidir.
2. THE Calculator SHALL hesaplanan AP değerini belirgin bir sonuç alanında sayısal olarak görüntülemelidir.
3. THE Calculator SHALL hesaplanan AC, HP, MP, FR, IR ve LR değerlerini ayrı, etiketlenmiş alanlarda görüntülemelidir.
4. THE Calculator SHALL kalan serbest stat puanını ve toplam dağıtılan stat puanını anlık olarak görüntülemelidir.
5. IF herhangi bir hesaplama girişi geçersiz ya da eksik ise, THEN THE Calculator SHALL hesaplama sonucunu 0 olarak göstermeli, hata fırlatmamalıdır.

---

### Requirement 15: Navbar Entegrasyonu

**User Story:** Bir MSGKO sitesi ziyaretçisi olarak, Advanced Calculator'a navbar'dan kolayca erişmek istiyorum; böylece hesap makinesini hızlıca açabileyim.

#### Acceptance Criteria

1. THE Navbar SHALL mevcut navigasyon yapısına uyumlu bir "Hesap Makinesi" (veya "Calculator") başlığı/linki eklemelidir.
2. WHEN kullanıcı "Hesap Makinesi" linkine tıkladığında, THE Navbar SHALL kullanıcıyı `/hesap-makinesi` route'una yönlendirmelidir.
3. THE Calculator SHALL `/hesap-makinesi` route'unda tam sayfa olarak yüklenmelidir ve sitenin mevcut Navbar ile Footer bileşenlerini korumalıdır.
4. THE Navbar SHALL aktif route `/hesap-makinesi` olduğunda, hesap makinesi linkini aktif/vurgulu hâlde göstermelidir.
5. THE Calculator SHALL mevcut sitenin koyu tema renk paletine (mor/pembe aksanlar, `#07070B` arka plan) ve Tailwind CSS stiline uygun şekilde tasarlanmalıdır.

---

### Requirement 16: Veri Yönetimi ve Mimari

**User Story:** Bir geliştirici olarak, hesap makinesinin veri katmanının iyi organize edilmesini istiyorum; böylece bakım ve güncelleme kolaylığı sağlanabilsin.

#### Acceptance Criteria

1. THE Calculator SHALL achievement verilerini (`ACHIEVEMENTS` dizisi) ve set bonus verilerini (`WARRIOR_KROWAZ`, `ROGUE_KROWAZ` vb. diziler) TypeScript statik veri dosyaları olarak `lib/calculator/` dizininde tutmalıdır.
2. THE Calculator SHALL sınıf katsayılarını (Warrior, Rogue, Priest, Mage, Kurian) ayrı bir TypeScript lookup tablosu olarak `lib/calculator/coefficients.ts` içinde barındırmalıdır.
3. THE Calculator SHALL item veritabanı için harici API çağrısı gerektiğinde, Next.js API route (`/api/calculator/items`) üzerinden erişim sağlamalıdır; bu route Supabase veya statik JSON dosyasından veri okuyabilmelidir.
4. THE Calculator SHALL tüm hesaplama fonksiyonlarını saf (pure) TypeScript fonksiyonları olarak `lib/calculator/formulas.ts` içinde tanımlamalı; UI bileşenlerinden bağımsız olarak test edilebilir olmalıdır.
5. THE Calculator SHALL hesaplama durumunu (seçili sınıf, seviye, stat'lar, buff'lar, item'lar, set seçimleri) tek bir React state veya reducer içinde yönetmelidir; Supabase ile senkronizasyon gerekmemektedir.
