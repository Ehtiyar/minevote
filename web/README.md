# MineVote Web

Minecraft sunucu voting platformu - Next.js ve Supabase ile geliştirilmiştir.

## 🚀 Özellikler

- ✅ **Supabase Tabanlı Rate Limiting** - Redis bağımlılığı olmadan
- ✅ **Next.js 14** - Modern React framework
- ✅ **TypeScript** - Type safety
- ✅ **Tailwind CSS** - Utility-first CSS framework
- ✅ **Responsive Tasarım** - Mobile-first approach
- ✅ **Dark/Light Mode** - Tema değiştirme
- ✅ **Multi-language Support** - TR/EN dil desteği
- ✅ **Glass Effect UI** - Modern cam efekti tasarım
- ✅ **Particle Effects** - Arka plan animasyonları
- ✅ **Accessibility** - ARIA etiketleri ve semantic HTML

## 📋 Gereksinimler

- Node.js 18.0.0 veya üzeri
- npm veya yarn
- Supabase hesabı

## 🛠️ Kurulum

1. **Repository'yi klonlayın:**
```bash
git clone <repository-url>
cd minevote/web
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Environment variables'ları ayarlayın:**
```bash
cp env.example .env.local
```

4. **`.env.local` dosyasını düzenleyin:**
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-key
```

5. **Supabase'de rate_limits tablosunu oluşturun:**
   - Supabase Dashboard'a gidin
   - SQL Editor'ı açın
   - `supabase/rate_limits.sql` dosyasındaki SQL'i çalıştırın

## 🚀 Geliştirme

```bash
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacak.

## 🏗️ Build

```bash
npm run build
```

## 🌐 Netlify Deploy

```bash
npm run build:netlify
```

### Netlify Environment Variables

Netlify'da aşağıdaki environment variables'ları ayarlayın:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`

## 📊 Supabase Veritabanı

### Rate Limits Tablosu

```sql
CREATE TABLE rate_limits (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  count INTEGER DEFAULT 1,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### RLS Politikaları

- Service role: Tam erişim
- Anon kullanıcılar: Sadece okuma

## 🎨 Tasarım Sistemi

### Renkler
- Primary: Minecraft yeşil tonları
- Secondary: Cam efekti (glass effect)
- Accent: Gradient renkler

### Tipografi
- Minecraft font (custom)
- System fallback fonts

### Bileşenler
- Glass effect cards
- Gradient text
- Particle backgrounds
- Floating elements

## 🔧 API Endpoints

### Rate Limiting
- `POST /api/vote` - Oy verme (1 gün/gün)
- `GET /api/servers` - Sunucu listesi (100/dakika)
- `GET /api/search` - Arama (30/dakika)

## 📱 Responsive Breakpoints

- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

## 🌍 Çoklu Dil Desteği

- Türkçe (varsayılan)
- İngilizce
- Dil değiştirme toggle'ı

## 🎮 Minecraft Entegrasyonu

- Server status kontrolü
- Version bilgileri
- Player count tracking
- IP kopyalama

## 🔒 Güvenlik

- Rate limiting
- Input validation
- CSRF protection
- XSS prevention
- SQL injection koruması

## 📈 Performans

- Font preloading
- Lazy loading
- Image optimization
- Code splitting
- Caching strategies

## 🧪 Test

```bash
npm run test
```

## 📦 Build Analizi

```bash
npm run analyze
```

## 🚀 Deployment

### Netlify
1. Repository'yi Netlify'a bağlayın
2. Build command: `npm run build:netlify`
3. Publish directory: `.next`
4. Environment variables'ları ayarlayın

### Vercel
1. Repository'yi Vercel'e bağlayın
2. Framework: Next.js
3. Environment variables'ları ayarlayın

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- Website: [MineVote](https://minevote.com)
- Discord: [MineVote Discord](https://discord.gg/minevote)
- Email: info@minevote.com

## 🙏 Teşekkürler

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Minecraft](https://minecraft.net/) - Oyun

---

**Not:** Bu proje eğitim amaçlı geliştirilmiştir. Production kullanımı için ek güvenlik önlemleri alınması önerilir.