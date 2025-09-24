import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import ReCAPTCHA from 'react-google-recaptcha'

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    mcNick: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTOS: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const router = useRouter()
  const { user, signUp } = useAuth()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  // Password strength calculation
  useEffect(() => {
    const calculatePasswordStrength = (password: string) => {
      let strength = 0
      if (password.length >= 8) strength += 1
      if (password.length >= 12) strength += 1
      if (/[a-z]/.test(password)) strength += 1
      if (/[A-Z]/.test(password)) strength += 1
      if (/[0-9]/.test(password)) strength += 1
      if (/[^A-Za-z0-9]/.test(password)) strength += 1
      return strength
    }
    setPasswordStrength(calculatePasswordStrength(formData.password))
  }, [formData.password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (!formData.acceptTOS) {
      setError('Kullanım şartlarını kabul etmelisiniz')
      setLoading(false)
      return
    }

    if (!captchaToken) {
      setError('reCAPTCHA doğrulaması gerekli')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Şifre en az 8 karakter olmalı')
      setLoading(false)
      return
    }

    if (passwordStrength < 3) {
      setError('Şifre çok zayıf. Büyük harf, küçük harf ve rakam içermeli')
      setLoading(false)
      return
    }

    if (!formData.username.trim()) {
      setError('Kullanıcı adı gerekli')
      setLoading(false)
      return
    }

    if (!formData.mcNick.trim()) {
      setError('Minecraft nicki gerekli')
      setLoading(false)
      return
    }

    // Minecraft username validation
    const mcNickRegex = /^[a-zA-Z0-9_]{3,16}$/
    if (!mcNickRegex.test(formData.mcNick)) {
      setError('Minecraft nicki 3-16 karakter arası olmalı ve sadece harf, rakam, _ içermeli')
      setLoading(false)
      return
    }

    try {
      const { error } = await signUp(formData.email, formData.password, {
        username: formData.username,
        mc_nick: formData.mcNick
      })

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already been registered')) {
          setError('Bu e-posta adresi zaten kayıtlı')
        } else if (error.message.includes('username') || error.message.includes('mc_nick')) {
          setError('Bu kullanıcı adı veya Minecraft nicki zaten kullanılıyor')
        } else {
          setError(error.message)
        }
      } else {
        setSuccess(true)
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login?message=check_email')
        }, 3000)
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  const handleDiscordRegister = async () => {
    setLoading(true)
    setError('')

    try {
      const { error } = await signUp('', '', {}) // Discord OAuth will handle this
      if (error) {
        setError(error.message)
        setLoading(false)
      }
    } catch (err) {
      setError('Bir hata oluştu')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="text-emerald-400 text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-extrabold text-white">Kayıt Başarılı!</h2>
          <p className="text-gray-400">
            E-posta adresinize gönderilen doğrulama linkini kontrol edin.
          </p>
          <p className="text-sm text-gray-500">
            3 saniye sonra giriş sayfasına yönlendirileceksiniz...
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Kayıt Ol - MineVote</title>
        <meta name="description" content="MineVote hesabı oluşturun" />
      </Head>

      <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center space-x-2 text-emerald-400 text-2xl font-bold">
              <img src="/assets/img/grass-block.png" className="w-8 h-8" alt="MineVote" />
              <span>MineVote</span>
            </Link>
            <h2 className="mt-6 text-3xl font-extrabold text-white">
              Hesap oluşturun
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Zaten hesabınız var mı?{' '}
              <Link href="/auth/login" className="font-medium text-emerald-400 hover:text-emerald-300">
                Giriş yapın
              </Link>
            </p>
          </div>

          <div className="mt-8 space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Kullanıcı Adı *
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Kullanıcı adınızı girin"
                />
              </div>

              <div>
                <label htmlFor="mcNick" className="block text-sm font-medium text-gray-300 mb-2">
                  Minecraft Nicki *
                </label>
                <input
                  id="mcNick"
                  name="mcNick"
                  type="text"
                  required
                  value={formData.mcNick}
                  onChange={(e) => setFormData({ ...formData, mcNick: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Minecraft oyuncu adınızı girin"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  E-posta adresi *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="E-posta adresinizi girin"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Şifre *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Şifrenizi girin (en az 8 karakter)"
                />
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            passwordStrength < 2 ? 'bg-red-500' : 
                            passwordStrength < 4 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${(passwordStrength / 6) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">
                        {passwordStrength < 2 ? 'Zayıf' : 
                         passwordStrength < 4 ? 'Orta' : 'Güçlü'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Büyük harf, küçük harf, rakam ve özel karakter kullanın
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Şifre Tekrar *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Şifrenizi tekrar girin"
                />
              </div>

              <div>
                <div className="flex items-start space-x-2">
                  <input
                    id="acceptTOS"
                    type="checkbox"
                    checked={formData.acceptTOS}
                    onChange={(e) => setFormData({ ...formData, acceptTOS: e.target.checked })}
                    className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-600 rounded bg-gray-700"
                    required
                  />
                  <label htmlFor="acceptTOS" className="text-sm text-gray-300">
                    <Link href="/terms" className="text-emerald-400 hover:text-emerald-300">
                      Kullanım Şartları
                    </Link>
                    {' ve '}
                    <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300">
                      Gizlilik Politikası
                    </Link>
                    'nı okudum ve kabul ediyorum *
                  </label>
                </div>
              </div>

              <div>
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
                  onChange={(token) => setCaptchaToken(token)}
                  theme="dark"
                  size="normal"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || !formData.acceptTOS || !captchaToken}
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Kayıt oluşturuluyor...' : 'Kayıt Ol'}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-400">veya</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleDiscordRegister}
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  Discord ile Kayıt Ol
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}