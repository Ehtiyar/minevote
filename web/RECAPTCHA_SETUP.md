# reCAPTCHA Kurulum Rehberi

## 1. Google reCAPTCHA Hesabı Oluşturma

1. [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin) adresine gidin
2. "Create" butonuna tıklayın
3. Aşağıdaki bilgileri doldurun:
   - **Label**: MineVote (veya istediğiniz isim)
   - **reCAPTCHA type**: reCAPTCHA v2
   - **Subtype**: "I'm not a robot" Checkbox
   - **Domains**: 
     - `localhost` (geliştirme için)
     - `your-domain.com` (production için)
     - `netlify.app` (Netlify için)

## 2. Site Key ve Secret Key Alma

Kurulum tamamlandıktan sonra:
- **Site Key**: Frontend'de kullanılacak (public)
- **Secret Key**: Backend'de kullanılacak (private)

## 3. Environment Variables Ayarlama

### Geliştirme (.env.local):
```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key-here
RECAPTCHA_SECRET_KEY=your-secret-key-here
```

### Production (Netlify):
Netlify Dashboard > Site Settings > Environment Variables:
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` = your-site-key-here
- `RECAPTCHA_SECRET_KEY` = your-secret-key-here

## 4. Test reCAPTCHA (Geliştirme)

Geliştirme aşamasında test reCAPTCHA kullanabilirsiniz:

### Test Site Key:
```
6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
```

### Test Secret Key:
```
6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
```

**Not**: Test keys sadece localhost'ta çalışır ve her zaman başarılı döner.

## 5. Production reCAPTCHA

Production'da gerçek keys kullanın:
1. Google reCAPTCHA'da yeni site oluşturun
2. Domain'inizi ekleyin
3. Site Key ve Secret Key'i alın
4. Environment variables'a ekleyin

## 6. Sorun Giderme

### reCAPTCHA Görünmüyor:
- Site Key'in doğru olduğundan emin olun
- Domain'in reCAPTCHA'da kayıtlı olduğundan emin olun
- Network sekmesinde hata var mı kontrol edin

### reCAPTCHA Doğrulama Başarısız:
- Secret Key'in doğru olduğundan emin olun
- Backend'de doğrulama fonksiyonunu kontrol edin
- IP adresinin doğru gönderildiğinden emin olun

## 7. Güvenlik Notları

- **Site Key** public olabilir (frontend'de görünür)
- **Secret Key** asla public yapmayın
- Production'da test keys kullanmayın
- Rate limiting uygulayın
- reCAPTCHA doğrulamasını backend'de yapın

## 8. Özelleştirme

VoteModal.tsx dosyasında reCAPTCHA özelliklerini değiştirebilirsiniz:

```tsx
<ReCAPTCHA
  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
  onChange={(token) => setCaptchaToken(token)}
  theme="dark"        // "light" veya "dark"
  size="normal"       // "compact" veya "normal"
  hl="tr"            // Dil kodu (opsiyonel)
/>
```
