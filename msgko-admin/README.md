# MSGKO Admin Panel

PWA tabanlı yönetim paneli. Android, iPhone ve Windows'ta uygulama gibi kurulabilir.

## Kurulum Adımları

### 1. Supabase Tabloları

Supabase Dashboard → SQL Editor → `supabase-setup.sql` dosyasını yapıştır ve çalıştır.

### 2. Service Role Key

Supabase Dashboard → Settings → API → **service_role** key'i kopyala.
`.env.local` dosyasına ekle:
```
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 3. JWT Secret Değiştir

`.env.local` dosyasında güçlü bir secret belirle:
```
ADMIN_JWT_SECRET=cok-uzun-ve-guclu-bir-secret-buraya
```

### 4. İlk Şifre Hash'i

Varsayılan şifre: `msgko2026`

Değiştirmek için terminalde:
```bash
node -e "const b=require('bcryptjs'); b.hash('YeniSifren',12).then(h=>console.log(h))"
```
Çıkan hash'i `.env.local` içindeki `ADMIN_PASSWORD_HASH` alanına yapıştır.

### 5. Uygulamayı Başlat

```bash
cd msgko-admin
npm install
npm run dev   # localhost:3001
```

### 6. Vercel Deploy

```bash
vercel --prod
```

Vercel'de Environment Variables olarak `.env.local` değerlerini ekle.

---

## PWA Kurulumu

### Android
1. Chrome'da admin URL'yi aç
2. Üst menü → "Ana ekrana ekle"

### iPhone
1. Safari'de admin URL'yi aç
2. Paylaş butonu → "Ana Ekrana Ekle"

### Windows (Chrome/Edge)
1. Tarayıcıda admin URL'yi aç
2. Adres çubuğundaki kurulum ikonuna tıkla

---

## 2FA Kurulumu

1. Ayarlar → Güvenlik (2FA) → Etkinleştir
2. Google Authenticator ile QR kodu tara
3. Kodu girerek doğrula

---

## Güvenlik Notları

- Admin URL'yi kimseyle paylaşma
- `SUPABASE_SERVICE_ROLE_KEY` asla frontend'e expose edilmemelidir
- Sadece `NEXT_PUBLIC_` prefix'li değişkenler tarayıcıya gider
- Tüm API route'ları JWT doğrulaması yapar
