import Head from 'next/head'
import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Gizlilik Politikası - MineVote</title>
        <meta name="description" content="MineVote gizlilik politikası. Kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında bilgiler." />
        <meta name="keywords" content="minevote, gizlilik, politika, kişisel veri, gdpr, minecraft" />
      </Head>

      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link href="/" className="flex items-center space-x-2 text-emerald-400 text-xl font-bold">
                <span className="w-8 h-8 flex items-center justify-center">🟩</span>
                <span>MineVote</span>
              </Link>
              
              <div className="flex items-center space-x-4">
                <Link href="/" className="text-gray-300 hover:text-white">
                  Ana Sayfa
                </Link>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  İletişim
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">🔒 Gizlilik Politikası</h1>
            <p className="text-gray-400 text-lg">
              Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Giriş</h2>
              <p className="text-gray-400 leading-relaxed">
                MineVote olarak, kullanıcılarımızın gizliliğini korumak bizim için çok önemlidir. 
                Bu gizlilik politikası, MineVote platformunu kullanırken kişisel verilerinizin 
                nasıl toplandığı, kullanıldığı, saklandığı ve korunduğu hakkında bilgi vermektedir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Toplanan Bilgiler</h2>
              
              <h3 className="text-xl font-medium text-white mb-3">2.1 Kişisel Bilgiler</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Hesap oluştururken aşağıdaki bilgileri topluyoruz:
              </p>
              <ul className="text-gray-400 space-y-2 ml-6">
                <li>• E-posta adresi</li>
                <li>• Kullanıcı adı</li>
                <li>• Minecraft kullanıcı adı</li>
                <li>• Discord kullanıcı adı (isteğe bağlı)</li>
                <li>• Şifre (şifrelenmiş olarak saklanır)</li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3 mt-6">2.2 Otomatik Toplanan Bilgiler</h3>
              <ul className="text-gray-400 space-y-2 ml-6">
                <li>• IP adresi</li>
                <li>• Tarayıcı bilgileri</li>
                <li>• İşletim sistemi</li>
                <li>• Sayfa ziyaretleri ve kullanım istatistikleri</li>
                <li>• Çerezler (cookies)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Bilgilerin Kullanımı</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Topladığımız bilgileri aşağıdaki amaçlarla kullanıyoruz:
              </p>
              <ul className="text-gray-400 space-y-2 ml-6">
                <li>• Platform hizmetlerini sağlamak</li>
                <li>• Kullanıcı hesaplarını yönetmek</li>
                <li>• Oylama işlemlerini gerçekleştirmek</li>
                <li>• Güvenlik ve dolandırıcılık önleme</li>
                <li>• Platform performansını iyileştirmek</li>
                <li>• Yasal yükümlülükleri yerine getirmek</li>
                <li>• Kullanıcı deneyimini geliştirmek</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Bilgi Paylaşımı</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Kişisel bilgilerinizi aşağıdaki durumlar dışında üçüncü taraflarla paylaşmayız:
              </p>
              <ul className="text-gray-400 space-y-2 ml-6">
                <li>• Kullanıcının açık rızası ile</li>
                <li>• Yasal zorunluluklar gereği</li>
                <li>• Platform güvenliği için gerekli durumlarda</li>
                <li>• Hizmet sağlayıcılarımızla (veri işleme sözleşmeleri ile)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Veri Güvenliği</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Verilerinizin güvenliği için aşağıdaki önlemleri alıyoruz:
              </p>
              <ul className="text-gray-400 space-y-2 ml-6">
                <li>• SSL/TLS şifreleme</li>
                <li>• Güvenli veri tabanı yapılandırması</li>
                <li>• Düzenli güvenlik güncellemeleri</li>
                <li>• Erişim kontrolü ve yetkilendirme</li>
                <li>• Veri yedekleme ve kurtarma planları</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Çerezler (Cookies)</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Platformumuzda aşağıdaki çerez türlerini kullanıyoruz:
              </p>
              <ul className="text-gray-400 space-y-2 ml-6">
                <li>• <strong>Zorunlu Çerezler:</strong> Platform işlevselliği için gerekli</li>
                <li>• <strong>Performans Çerezleri:</strong> Platform performansını analiz etmek için</li>
                <li>• <strong>İşlevsel Çerezler:</strong> Kullanıcı tercihlerini hatırlamak için</li>
                <li>• <strong>Pazarlama Çerezleri:</strong> Reklam ve pazarlama amaçlı</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Kullanıcı Hakları</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                KVKK ve GDPR kapsamında aşağıdaki haklara sahipsiniz:
              </p>
              <ul className="text-gray-400 space-y-2 ml-6">
                <li>• Kişisel verilerinize erişim hakkı</li>
                <li>• Yanlış verilerin düzeltilmesi hakkı</li>
                <li>• Verilerin silinmesi hakkı</li>
                <li>• Veri işlemeye itiraz etme hakkı</li>
                <li>• Veri taşınabilirliği hakkı</li>
                <li>• Otomatik karar verme süreçlerine itiraz hakkı</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Veri Saklama</h2>
              <p className="text-gray-400 leading-relaxed">
                Kişisel verilerinizi, yasal yükümlülüklerimizi yerine getirmek ve 
                platform hizmetlerini sağlamak için gerekli olduğu sürece saklarız. 
                Hesabınızı sildiğinizde, verileriniz 30 gün içinde güvenli bir şekilde silinir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Üçüncü Taraf Hizmetler</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Platformumuzda aşağıdaki üçüncü taraf hizmetleri kullanıyoruz:
              </p>
              <ul className="text-gray-400 space-y-2 ml-6">
                <li>• <strong>Supabase:</strong> Veri tabanı ve kimlik doğrulama</li>
                <li>• <strong>Google reCAPTCHA:</strong> Güvenlik ve bot koruması</li>
                <li>• <strong>Netlify:</strong> Hosting ve CDN hizmetleri</li>
                <li>• <strong>Minotar API:</strong> Minecraft avatar görselleri</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Çocukların Gizliliği</h2>
              <p className="text-gray-400 leading-relaxed">
                Platformumuz 13 yaş altındaki çocuklardan bilerek kişisel bilgi toplamaz. 
                13 yaş altındaki bir çocuğun bilgilerini topladığımızı fark edersek, 
                bu bilgileri derhal sileriz.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Politika Değişiklikleri</h2>
              <p className="text-gray-400 leading-relaxed">
                Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler 
                olduğunda, kullanıcıları e-posta veya platform bildirimleri ile bilgilendiririz. 
                Değişikliklerin yürürlüğe girdiği tarih, politikanın başında belirtilir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. İletişim</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Gizlilik politikamız hakkında sorularınız varsa, bizimle iletişime geçin:
              </p>
              <ul className="text-gray-400 space-y-2 ml-6">
                <li>• E-posta: privacy@minevote.com</li>
                <li>• <Link href="/contact" className="text-emerald-400 hover:text-emerald-300">İletişim Formu</Link></li>
                <li>• Discord: discord.gg/minevote</li>
              </ul>
            </section>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </main>
      </div>
    </>
  )
}
