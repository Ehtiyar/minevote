# Discord OAuth2 Kurulum Rehberi

## 1. Discord Developer Portal'da Uygulama Oluşturma

1. [Discord Developer Portal](https://discord.com/developers/applications)'a gidin
2. "New Application" butonuna tıklayın
3. Uygulama adını girin (örn: "MineVote")
4. "Create" butonuna tıklayın

## 2. OAuth2 Ayarları

1. Sol menüden "OAuth2" > "General" seçin
2. "Redirects" bölümüne şu URL'leri ekleyin:
   - `https://huxcnmixercmycayeqsd.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (geliştirme için)

## 3. Client ID ve Secret Alma

1. "OAuth2" > "General" sayfasında:
   - **Client ID**: Kopyalayın
   - **Client Secret**: "Reset Secret" butonuna tıklayıp yeni secret oluşturun

## 4. Supabase'de Discord Provider Ayarlama

1. [Supabase Dashboard](https://supabase.com/dashboard)'a gidin
2. Projenizi seçin
3. "Authentication" > "Providers" sayfasına gidin
4. "Discord" provider'ını bulun ve etkinleştirin
5. Şu bilgileri girin:
   - **Client ID**: Discord'dan aldığınız Client ID
   - **Client Secret**: Discord'dan aldığınız Client Secret
   - **Redirect URL**: `https://huxcnmixercmycayeqsd.supabase.co/auth/v1/callback`

## 5. Environment Variables

`.env.local` dosyanızda şu değişkenlerin olduğundan emin olun:

```env
NEXT_PUBLIC_SUPABASE_URL=https://huxcnmixercmycayeqsd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
```

## 6. Test Etme

1. Uygulamayı çalıştırın: `npm run dev`
2. `/auth/login` sayfasına gidin
3. "Discord ile Giriş Yap" butonuna tıklayın
4. Discord'da giriş yapın ve yetkilendirin
5. Geri yönlendirildiğinizde dashboard'da olmalısınız

## 7. Sorun Giderme

- **Redirect URL hatası**: Discord'da redirect URL'lerin doğru olduğundan emin olun
- **Client Secret hatası**: Supabase'de Discord provider ayarlarını kontrol edin
- **CORS hatası**: Supabase'de site URL'inin doğru olduğundan emin olun

## 8. Discord Bot Permissions (Opsiyonel)

Eğer Discord bot özellikleri eklemek isterseniz:

1. Discord Developer Portal'da "Bot" sekmesine gidin
2. "Add Bot" butonuna tıklayın
3. Gerekli izinleri verin:
   - Read Messages
   - Send Messages
   - Embed Links
   - Read Message History
