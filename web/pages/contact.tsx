import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '../contexts/AuthContext'

export default function Contact() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <>
      <Head>
        <title>İletişim - MineVote</title>
        <meta name="description" content="MineVote ile iletişime geçin. Sorularınız, önerileriniz ve destek talepleriniz için bizimle iletişime geçin." />
        <meta name="keywords" content="minevote, iletişim, destek, yardım, minecraft, sunucu" />
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
                {user ? (
                  <Link href="/dashboard" className="text-gray-300 hover:text-white">
                    Dashboard
                  </Link>
                ) : (
                  <Link href="/auth/login" className="text-gray-300 hover:text-white">
                    Giriş Yap
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">📞 İletişim</h1>
            <p className="text-gray-400 text-lg">
              Sorularınız, önerileriniz veya destek talepleriniz için bizimle iletişime geçin
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gray-800 rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Mesaj Gönder</h2>
              
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-900 border border-green-700 rounded-lg">
                  <p className="text-green-300">✅ Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Adınız ve soyadınız"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="ornek@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Konu *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Konu seçin</option>
                    <option value="general">Genel Soru</option>
                    <option value="support">Teknik Destek</option>
                    <option value="suggestion">Öneri</option>
                    <option value="bug">Hata Bildirimi</option>
                    <option value="partnership">İş Birliği</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Mesaj *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    placeholder="Mesajınızı buraya yazın..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  {isSubmitting ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-semibold text-white mb-6">İletişim Bilgileri</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">📧</div>
                    <div>
                      <h3 className="text-lg font-medium text-white">E-posta</h3>
                      <p className="text-gray-400">info@minevote.com</p>
                      <p className="text-sm text-gray-500">24 saat içinde yanıt veriyoruz</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">💬</div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Discord</h3>
                      <p className="text-gray-400">discord.gg/minevote</p>
                      <p className="text-sm text-gray-500">Canlı destek için Discord sunucumuzu ziyaret edin</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">🐦</div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Twitter</h3>
                      <p className="text-gray-400">@minevote</p>
                      <p className="text-sm text-gray-500">Güncellemeler ve duyurular</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">⏰</div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Yanıt Süresi</h3>
                      <p className="text-gray-400">24-48 saat</p>
                      <p className="text-sm text-gray-500">Ortalama yanıt süremiz</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-semibold text-white mb-6">Sık Sorulan Sorular</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Sunucumu nasıl ekleyebilirim?</h3>
                    <p className="text-gray-400 text-sm">
                      <Link href="/add" className="text-emerald-400 hover:text-emerald-300">
                        Sunucu Ekle
                      </Link> sayfasından sunucunuzu kolayca ekleyebilirsiniz.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">API kullanımı ücretsiz mi?</h3>
                    <p className="text-gray-400 text-sm">
                      Evet, temel API kullanımı tamamen ücretsizdir. 
                      <Link href="/api-docs" className="text-emerald-400 hover:text-emerald-300">
                        API Dokümantasyon
                      </Link> sayfasından detayları inceleyebilirsiniz.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Hesabımı nasıl silebilirim?</h3>
                    <p className="text-gray-400 text-sm">
                      Hesap silme işlemi için lütfen bizimle iletişime geçin. 
                      Verilerinizin güvenliği bizim için önemlidir.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
