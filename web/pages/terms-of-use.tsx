import Head from 'next/head'
import Link from 'next/link'

export default function TermsOfUse() {
  return (
    <>
      <Head>
        <title>Kullanım Şartları - MineVote</title>
        <meta name="description" content="MineVote kullanım şartları. Platform kullanımı, kullanıcı yükümlülükleri ve hizmet koşulları hakkında bilgiler." />
        <meta name="keywords" content="minevote, kullanım şartları, hizmet koşulları, minecraft, sunucu, oylama" />
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
            <h1 className="text-4xl font-bold text-white mb-4">📋 Kullanım Şartları</h1>
            <p className="text-gray-400 text-lg">
              Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Giriş</h2>
              <p className="text-gray-400 leading-relaxed">
                MineVote platformunu kullanarak bu kullanım şartlarını kabul etmiş sayılırsınız. 
                Bu şartlar, platformumuzu kullanımınızı düzenler ve hem sizin hem de bizim 
                haklarınızı ve yükümlülüklerinizi belirler.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Hizmet Tanımı</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                MineVote, Minecraft sunucularının popülerliğini artırmak için oy toplama 
                platformudur. Hizmetlerimiz şunları içerir:
              </p>
              <ul className="text-gray-400 space-y-2 ml-6">
                <li>• Minecraft sunucularını listeleme ve tanıtma</li>
                <li>• Oyuncuların favori sunucularına oy vermesi</li>
                <li>• Sunucu istatistikleri ve sıralamaları</li>
                <li>• API hizmetleri</li>
                <li>• Kullanıcı hesapları ve profil yönetimi</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Kullanıcı Yükümlülükleri</h2>
              
              <h3 className="text-xl font-medium text-white mb-3">3.1 Genel Yükümlülükler</h3>
              <ul className="text-gray-400 space-y-2 ml-6">
                <li>• Doğru ve güncel bilgiler sağlamak</li>
                <li>• Hesap güvenliğini sağlamak</li>
                <li>• Platform kurallarına uymak</li>
                <li>• Yasalara uygun davranmak</li>
                <li>• Diğer kullanıcılara saygı göstermek</li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3 mt-6">3.2 Yasaklanan Faaliyetler</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Aşağıdaki faaliyetler kesinlikle yasaktır:
              </p>
              <ul className="text-gray-400 space-y-2 ml-6">
                <li>• Sahte oy verme veya bot kullanma</li>
                <li>• Spam, troll veya rahatsız edici içerik paylaşma</li>
                <li>• Telif hakkı ihlali yapma</li>
                <li>• Zararlı yazılım yayma</li>
                <li>• Başkalarının hesaplarını ele geçirme</li>
                <li>• Platform güvenliğini tehdit etme</li>
                <li>• Yasadışı içerik paylaşma</li>
                <li>• Kişisel bilgileri kötüye kullanma</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Sunucu Sahipleri İçin Kurallar</h2>
              <ul className="text-gray-400 space-y-2 ml-6">
                <li>• Sunucu bilgileri doğru ve güncel olmalıdır</li>
                <li>• Uygunsuz içerikli sunucular kabul edilmez</li>
                <li>• Telif hakkı ihlali yapan sunucular yasaktır</li>
                <li>• Sunucu durumu düzenli olarak güncellenmelidir</li>
                <li>• Oy satın alma veya değiş tokuş yasaktır</li>
                <li>• Sunucu kuralları açık ve adil olmalıdır</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Oylama Kuralları</h2>
              <ul className="text-gray-400 space-y-2 ml-6">
                <li>• Her kullanıcı günde bir kez oy verebilir</li>
                <li>• Sahte oy verme tespit edilirse hesap askıya alınır</li>
                <li>• Bot veya otomatik oy verme yasaktır</li>
                <li>• Oy verme işlemi geri alınamaz</li>
                <li>• Oylama geçmişi saklanır ve denetlenebilir</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Hesap Yönetimi</h2>
              
              <h3 className="text-xl font-medium text-white mb-3">6.1 Hesap Oluşturma</h3>
              <ul className="text-gray-400 space-y-2 ml-6">
                <li>• 13 yaş ve üzeri olmak zorunludur</li>
                <li>• Geçerli e-posta adresi gereklidir</li>
                <li>• Güçlü şifre kullanılmalıdır</li>
                <li>• Bir kişi sadece bir hesap açabilir</li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3 mt-6">6.2 Hesap Askıya Alma ve Silme</h3>
              <p className="text-gray-400 leading-relaxed">
                Kuralları ihlal eden hesaplar uyarı, geçici askıya alma veya kalıcı silme 
                ile cezalandırılabilir. Hesap sahibi, kararın gerekçesini talep edebilir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Fikri Mülkiyet</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Platformumuz ve içeriği telif hakkı ile korunmaktadır. Kullanıcılar:
              </p>
              <ul className="text-gray-400 space-y-2 ml-6">
                <li>• Kendi içeriklerinin telif hakkına sahiptir</li>
                <li>• İçeriklerini paylaşma hakkını bize verir</li>
                <li>• Başkalarının telif haklarına saygı göstermelidir</li>
                <li>• Telif hakkı ihlali bildirimi yapabilir</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Hizmet Kesintileri</h2>
              <p className="text-gray-400 leading-relaxed">
                Platformumuzu 7/24 erişilebilir tutmaya çalışırız, ancak bakım, güncelleme 
                veya teknik sorunlar nedeniyle geçici kesintiler olabilir. Bu durumlardan 
                dolayı sorumluluk kabul etmeyiz.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Sorumluluk Sınırlaması</h2>
              <p className="text-gray-400 leading-relaxed">
                MineVote, platform kullanımından kaynaklanan doğrudan veya dolaylı zararlardan 
                sorumlu değildir. Kullanıcılar platformu kendi sorumluluklarında kullanır.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Değişiklikler</h2>
              <p className="text-gray-400 leading-relaxed">
                Bu kullanım şartlarını zaman zaman güncelleyebiliriz. Önemli değişiklikler 
                olduğunda kullanıcıları bilgilendiririz. Değişikliklerin yürürlüğe girdiği 
                tarih, şartların başında belirtilir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Uygulanacak Hukuk</h2>
              <p className="text-gray-400 leading-relaxed">
                Bu kullanım şartları Türkiye Cumhuriyeti hukukuna tabidir. Herhangi bir 
                anlaşmazlık durumunda Türkiye mahkemeleri yetkilidir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. İletişim</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Kullanım şartları hakkında sorularınız varsa, bizimle iletişime geçin:
              </p>
              <ul className="text-gray-400 space-y-2 ml-6">
                <li>• E-posta: legal@minevote.com</li>
                <li>• <Link href="/contact" className="text-emerald-400 hover:text-emerald-300">İletişim Formu</Link></li>
                <li>• Discord: discord.gg/minevote</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">13. Kabul</h2>
              <p className="text-gray-400 leading-relaxed">
                MineVote platformunu kullanarak bu kullanım şartlarını okuduğunuzu, 
                anladığınızı ve kabul ettiğinizi beyan edersiniz. Bu şartlara uymamanız 
                durumunda hesabınız askıya alınabilir veya silinebilir.
              </p>
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
