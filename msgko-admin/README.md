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

### 3. JWT Secret (zorunlu)

En az **32 karakterlik** rastgele bir secret üret ve `.env.local` + Vercel'e ekle.
Tanımlı değilse veya daha kısaysa panel kimseye açılmaz (fail-closed):
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```
```
ADMIN_JWT_SECRET=<yukarıdaki çıktı>
```

### 4. Kullanıcı ve Şifre (zorunlu)

```
ADMIN_USERNAME=<kullanıcı adı>          # tanımlı değilse "admin"
ADMIN_PASSWORD_HASH=<bcrypt hash>       # önerilen
```
Hash üretmek için:
```bash
node -e "require('bcryptjs').hash(process.argv[1],12).then(console.log)" "GucluSifren"
```
`ADMIN_PASSWORD` (düz metin) hâlâ destekleniyor ama önerilmez; ikisi de boşsa giriş yapılamaz.

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
- Login 15 dakikada 8 başarısız denemeden sonra o IP için kilitlenir
- 2FA ayarı okunamazsa giriş reddedilir; QR kod tarayıcıda üretilir
- Supabase güvenlik düzeltmeleri: `supabase-security-fixes.sql`
