import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const faqCategories = [
    { id: 'all', label: 'Tümü', icon: '📚' },
    { id: 'getting-started', label: 'Başlangıç', icon: '🚀' },
    { id: 'server-management', label: 'Sunucu Yönetimi', icon: '🖥️' },
    { id: 'voting', label: 'Oylama', icon: '🗳️' },
    { id: 'api', label: 'API', icon: '⚙️' },
    { id: 'account', label: 'Hesap', icon: '👤' },
  ]

  const faqItems = [
    {
      id: 1,
      category: 'getting-started',
      question: 'MineVote nedir ve nasıl çalışır?',
      answer: 'MineVote, Minecraft sunucularının popülerliğini artırmak için oy toplama platformudur. Oyuncular favori sunucularına oy vererek onları destekler ve sunucular da bu oylar sayesinde daha fazla oyuncuya ulaşır.'
    },
    {
      id: 2,
      category: 'getting-started',
      question: 'Hesap oluşturmak zorunlu mu?',
      answer: 'Hayır, hesap oluşturmadan da sunuculara oy verebilirsiniz. Ancak hesap oluşturarak oy geçmişinizi takip edebilir, rozetler kazanabilir ve daha fazla özellikten yararlanabilirsiniz.'
    },
    {
      id: 3,
      category: 'server-management',
      question: 'Sunucumu nasıl ekleyebilirim?',
      answer: 'Sunucunuzu eklemek için önce giriş yapmanız gerekiyor. Ardından "Sunucu Ekle" sayfasından sunucu bilgilerinizi doldurarak sunucunuzu platforma ekleyebilirsiniz.'
    },
    {
      id: 4,
      category: 'server-management',
      question: 'Sunucu bilgilerimi nasıl güncelleyebilirim?',
      answer: 'Dashboard > Sunucularım bölümünden sunucularınızı yönetebilir, bilgilerini güncelleyebilir ve istatistiklerini görüntüleyebilirsiniz.'
    },
    {
      id: 5,
      category: 'voting',
      question: 'Ne sıklıkla oy verebilirim?',
      answer: 'Her sunucuya günde bir kez oy verebilirsiniz. Oylama süresi 24 saat sonra sıfırlanır.'
    },
    {
      id: 6,
      category: 'voting',
      question: 'Oy verme işlemi güvenli mi?',
      answer: 'Evet, tüm oylama işlemleri güvenli protokoller kullanılarak gerçekleştirilir. reCAPTCHA ve rate limiting gibi güvenlik önlemleri alınmıştır.'
    },
    {
      id: 7,
      category: 'api',
      question: 'API kullanımı ücretsiz mi?',
      answer: 'Temel API kullanımı tamamen ücretsizdir. Günlük 1000 istek limiti vardır. Daha fazla istek için premium planlarımızı inceleyebilirsiniz.'
    },
    {
      id: 8,
      category: 'api',
      question: 'API dokümantasyonu nerede?',
      answer: 'API dokümantasyonumuz /api-docs sayfasında bulunmaktadır. Tüm endpoint\'ler, parametreler ve örnek kullanımlar detaylı olarak açıklanmıştır.'
    },
    {
      id: 9,
      category: 'account',
      question: 'Şifremi nasıl değiştirebilirim?',
      answer: 'Dashboard > Profil Ayarları > Şifre Değiştir bölümünden şifrenizi güvenli bir şekilde değiştirebilirsiniz.'
    },
    {
      id: 10,
      category: 'account',
      question: 'Hesabımı nasıl silebilirim?',
      answer: 'Hesap silme işlemi için lütfen bizimle iletişime geçin. Verilerinizin güvenliği bizim için önemlidir ve silme işlemi geri alınamaz.'
    }
  ]

  const filteredFaqs = faqItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <>
      <Head>
        <title>Yardım - MineVote</title>
        <meta name="description" content="MineVote kullanımı hakkında sık sorulan sorular ve yardım konuları. Sunucu ekleme, oylama, API kullanımı ve daha fazlası." />
        <meta name="keywords" content="minevote, yardım, sss, faq, minecraft, sunucu, oylama" />
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
                <Link href="/servers" className="text-gray-300 hover:text-white">
                  Sunucular
                </Link>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  İletişim
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">❓ Yardım Merkezi</h1>
            <p className="text-gray-400 text-lg">
              MineVote kullanımı hakkında merak ettiğiniz her şey burada
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Sorunuzu arayın..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {faqCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {category.icon} {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map(item => (
                <div key={item.id} className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {item.question}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">Sonuç bulunamadı</h3>
                <p className="text-gray-400">
                  Aradığınız kriterlere uygun soru bulunamadı. Farklı anahtar kelimeler deneyin.
                </p>
              </div>
            )}
          </div>

          {/* Contact Section */}
          <div className="mt-12 bg-gray-800 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">Hala yardıma mı ihtiyacınız var?</h2>
            <p className="text-gray-400 mb-6">
              Sorunuzu bulamadınız mı? Bizimle iletişime geçin, size yardımcı olmaktan mutluluk duyarız.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                📞 İletişime Geç
              </Link>
              <a
                href="https://discord.gg/minevote"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                💬 Discord'da Sor
              </a>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
