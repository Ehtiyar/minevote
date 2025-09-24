import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

export default function ProfileSettings() {
  const [formData, setFormData] = useState({
    username: '',
    mc_nick: '',
    bio: '',
    discord_id: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user, profile, updateProfile } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    if (!user) {
      router.push('/auth/login')
      return
    }

    if (profile) {
      setFormData({
        username: profile.username || '',
        mc_nick: profile.mc_nick || '',
        bio: profile.bio || '',
        discord_id: profile.discord_id || ''
      })
    }
  }, [user, profile, router, mounted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!formData.username.trim()) {
      setError('Kullanıcı adı gerekli')
      setLoading(false)
      return
    }

    if (!formData.mc_nick.trim()) {
      setError('Minecraft nicki gerekli')
      setLoading(false)
      return
    }

    // Minecraft username validation
    const mcNickRegex = /^[a-zA-Z0-9_]{3,16}$/
    if (!mcNickRegex.test(formData.mc_nick)) {
      setError('Minecraft nicki 3-16 karakter arası olmalı ve sadece harf, rakam, _ içermeli')
      setLoading(false)
      return
    }

    try {
      const { error } = await updateProfile({
        username: formData.username,
        mc_nick: formData.mc_nick,
        bio: formData.bio,
        discord_id: formData.discord_id
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
        }, 3000)
      }
    } catch (err) {
      setError('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Head>
        <title>Profil Ayarları - MineVote</title>
        <meta name="description" content="MineVote profil ayarları" />
      </Head>

      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link href="/dashboard" className="flex items-center space-x-2 text-emerald-400 text-xl font-bold">
                <span className="w-8 h-8 flex items-center justify-center">🟩</span>
                <span>MineVote</span>
              </Link>
              
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-gray-300 hover:text-white">
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Profil Ayarları</h1>
            <p className="text-gray-400 mt-2">Profil bilgilerinizi düzenleyin</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg mb-6">
                Profil başarıyla güncellendi!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Kullanıcı Adı *
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Kullanıcı adınızı girin"
                />
              </div>

              <div>
                <label htmlFor="mc_nick" className="block text-sm font-medium text-gray-300 mb-2">
                  Minecraft Nicki *
                </label>
                <input
                  id="mc_nick"
                  type="text"
                  required
                  value={formData.mc_nick}
                  onChange={(e) => setFormData({ ...formData, mc_nick: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Minecraft oyuncu adınızı girin"
                />
                <p className="text-xs text-gray-400 mt-1">3-16 karakter arası, sadece harf, rakam ve _</p>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
                  Hakkımda
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Kendiniz hakkında kısa bir açıklama yazın..."
                />
              </div>

              <div>
                <label htmlFor="discord_id" className="block text-sm font-medium text-gray-300 mb-2">
                  Discord ID
                </label>
                <input
                  id="discord_id"
                  type="text"
                  value={formData.discord_id}
                  onChange={(e) => setFormData({ ...formData, discord_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Discord kullanıcı adınızı girin"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Güncelleniyor...' : 'Güncelle'}
                </button>
                <Link
                  href="/dashboard"
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-center"
                >
                  İptal
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}