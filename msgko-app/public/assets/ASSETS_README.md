# MSGKO Character Viewer — 3D Asset Structure

Bu klasör, Knight Online karakter ve item 3D modellerini içerir.

⚠️ **ÖNEMLİ:** Şu anda bu klasördeki modeller PLACEHOLDER'dır.
Gerçek Knight Online 3D assetleri henüz eklenmemiştir.

## Beklenen Klasör Yapısı

```
/public/assets/
├── models/
│   ├── bodies/               # Karakter base body modelleri
│   │   ├── barbarian_male_warrior.glb
│   │   ├── human_male_rogue.glb
│   │   ├── orc_1_male_rogue.glb
│   │   └── ... (race_gender_class.glb pattern)
│   │
│   ├── helmets/              # Kask modelleri
│   │   ├── placeholder_helmet.glb
│   │   └── ...
│   │
│   ├── armor/                # Zırh (pauldron) modelleri
│   │   ├── placeholder_armor.glb
│   │   └── ...
│   │
│   ├── pads/                 # Tayt modelleri
│   │   └── placeholder_pads.glb
│   │
│   ├── gloves/               # Eldiven modelleri
│   │   └── placeholder_gloves.glb
│   │
│   ├── boots/                # Bot modelleri
│   │   └── placeholder_boots.glb
│   │
│   ├── weapons/              # Silah modelleri
│   │   ├── placeholder_dagger.glb
│   │   ├── placeholder_sword.glb
│   │   ├── placeholder_staff.glb
│   │   └── ...
│   │
│   ├── shields/              # Kalkan modelleri
│   │   └── placeholder_shield.glb
│   │
│   ├── wings/                # Kanat modelleri
│   │   └── placeholder_wings.glb
│   │
│   ├── pets/                 # Pet modelleri
│   │   └── placeholder_pet.glb
│   │
│   └── cospre/               # Cospre modelleri
│       ├── placeholder_valkyrie.glb
│       ├── placeholder_pathos.glb
│       └── placeholder_wings_cospre.glb
│
└── icons/                    # Item icon'ları (PNG/WebP)
    ├── placeholder_helmet.png
    ├── placeholder_armor.png
    ├── placeholder_dagger.png
    └── ...
```

## Gerçek Knight Online Modellerini Eklemek İçin

### 1. Asset Conversion Pipeline

Knight Online'ın native formatları (`.n3pmesh`, `.dds`) web'de doğrudan çalışmaz.
Dönüşüm gerekir:

```
.n3pmesh + .dds
    ↓
[N3PMeshConverter veya Blender script]
    ↓
OBJ/FBX (intermediate)
    ↓
[Blender]
    ↓
GLB (web-optimized)
    ↓
Bu klasöre kopyala
```

### 2. Item ID → Model Mapping

`ko_items` tablosundaki `model_url` kolonunu güncelle:

```sql
UPDATE ko_items
SET model_url = '/assets/models/weapons/mirage_dagger.glb'
WHERE item_id = 389001234;  -- Gerçek KO item ID
```

Bu sayede frontend kodu değişmeden yeni modeller kullanılabilir.

### 3. Lisanslama ve Telif

⚠️ **UYARI:** Knight Online 3D assetleri MGame/NTTGame'e aittir.
Asset extraction ve kullanımı için gerekli izinler alınmalıdır.

Alternatif:
- Generic fantasy modeller (placeholder)
- Custom modeller (MSGKO için özel yapım)
- Resmi izinle KO assetleri

---

**Şu Anki Durum:** Placeholder modeller henüz eklenmedi.
Sistem çalışır durumda ancak 3D viewer hata gösterecek veya fallback gösterecektir.

Test için basit placeholder GLB dosyaları eklenebilir veya
sistem mock data ile çalıştırılabilir.
