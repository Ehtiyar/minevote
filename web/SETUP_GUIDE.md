# MineVote Kurulum Rehberi

## 🚀 Hızlı Başlangıç

### 1. Gereksinimler
- Node.js 18+ 
- npm veya yarn
- Supabase hesabı
- Discord Developer hesabı (OAuth için)

### 2. Projeyi Klonlama ve Kurulum

```bash
# Projeyi klonlayın
git clone <repository-url>
cd minevote/web

# Bağımlılıkları yükleyin
npm install

# Environment dosyasını oluşturun
cp env.example .env.local
```

### 3. Environment Variables

`.env.local` dosyanızı düzenleyin:

```env
# Supabase (Supabase Dashboard'dan alın)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# Discord OAuth (Discord Developer Portal'dan alın)
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret

# reCAPTCHA (Opsiyonel)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
```

### 4. Supabase Kurulumu

1. [Supabase Dashboard](https://supabase.com/dashboard)'a gidin
2. Yeni proje oluşturun
3. SQL Editor'da `supabase/migrations/001_initial_schema.sql` dosyasını çalıştırın
4. Authentication > Providers'da Discord'u etkinleştirin
5. Discord OAuth ayarlarını yapın (DISCORD_OAUTH_SETUP.md'ye bakın)

### 5. Discord OAuth Kurulumu

Detaylı rehber için `DISCORD_OAUTH_SETUP.md` dosyasına bakın.

### 6. Uygulamayı Çalıştırma

```bash
# Geliştirme modunda çalıştırın
npm run dev

# Tarayıcıda http://localhost:3000 adresini açın
```

### 7. Netlify Deploy

1. Projeyi GitHub'a push edin
2. [Netlify](https://netlify.com)'a gidin
3. "New site from Git" seçin
4. Repository'nizi bağlayın
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Environment variables'ları Netlify'da ayarlayın
7. Deploy edin!

## 📁 Proje Yapısı

```
minevote/web/
├── components/          # React bileşenleri
├── contexts/           # React context'leri
├── hooks/              # Custom hooks
├── lib/                # Utility fonksiyonları
├── middleware/         # Next.js middleware
├── pages/              # Sayfa bileşenleri
│   ├── api/           # API routes
│   ├── auth/          # Auth sayfaları
│   ├── dashboard/     # Dashboard sayfaları
│   ├── profile/       # Profil sayfaları
│   └── servers/       # Sunucu sayfaları
├── public/            # Statik dosyalar
├── styles/            # CSS dosyaları
├── supabase/          # Supabase migration'ları
└── ...
```

## 🔧 Özellikler

### ✅ Tamamlanan
- [x] Kullanıcı kayıt/giriş sistemi
- [x] Discord OAuth2 entegrasyonu
- [x] Profil sistemi ve ayarlar
- [x] Minecraft skin avatar entegrasyonu
- [x] Sunucu ekleme/düzenleme
- [x] Oy verme sistemi
- [x] Responsive tasarım
- [x] Dark mode desteği

### 🚧 Geliştirilecek
- [ ] Sunucu doğrulama sistemi
- [ ] Rozet ve XP sistemi
- [ ] Admin paneli
- [ ] API dokümantasyonu
- [ ] Bildirim sistemi
- [ ] Arama ve filtreleme

## 🎨 Tema Özelleştirme

Tema renklerini `tailwind.config.js` dosyasından özelleştirebilirsiniz:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#10B981', // Emerald
        secondary: '#3B82F6', // Blue
        // ... diğer renkler
      }
    }
  }
}
```

## 🔒 Güvenlik

- Tüm API endpoint'leri Supabase RLS ile korunuyor
- Kullanıcı verileri şifreleniyor
- CORS ayarları yapılandırılmış
- Rate limiting (gelecekte eklenecek)

## 📊 Veritabanı Şeması

### Tablolar
- `profiles` - Kullanıcı profilleri
- `servers` - Sunucu bilgileri
- `votes` - Oy kayıtları
- `badges` - Rozet tanımları
- `user_badges` - Kullanıcı rozetleri

### İlişkiler
- Her kullanıcının bir profili var
- Her sunucunun bir sahibi var
- Kullanıcılar sunuculara oy verebilir
- Kullanıcılar rozet kazanabilir

## 🐛 Sorun Giderme

### Yaygın Sorunlar

1. **"Supabase environment variables are missing"**
   - `.env.local` dosyasını kontrol edin
   - Environment variables'ların doğru olduğundan emin olun

2. **Discord OAuth çalışmıyor**
   - Discord Developer Portal'da redirect URL'leri kontrol edin
   - Supabase'de Discord provider ayarlarını kontrol edin

3. **Build hatası**
   - `npm run build` komutunu çalıştırın
   - TypeScript hatalarını kontrol edin

4. **Database connection hatası**
   - Supabase projenizin aktif olduğundan emin olun
   - Migration'ların çalıştırıldığından emin olun

## 📞 Destek

Sorunlarınız için:
- GitHub Issues kullanın
- Discord sunucumuzu ziyaret edin
- E-posta: support@minevote.com

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
