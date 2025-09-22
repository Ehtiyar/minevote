import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

interface ProfileData {
  username: string
  mc_nick: string
  bio: string
  discord_id?: string
}

export default function ProfileSettings() {
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const [profileData, setProfileData] = useState<ProfileData>({
    username: '',
    mc_nick: '',
    bio: '',
    discord_id: ''
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
      return
    }

    if (user) {
      fetchProfile()
    }
  }, [user, authLoading, router])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, mc_nick, bio, discord_id')
        .eq('id', user?.id)
        .single()

      if (error) {
        console.error('Profile fetch error:', error)
        setError('Profil bilgileri yüklenemedi')
      } else {
        setProfileData(data)
      }
    } catch (error) {
      console.error('Profile fetch error:', error)
      setError('Profil bilgileri yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: profileData.username,
          mc_nick: profileData.mc_nick,
          bio: profileData.bio,
        })
        .eq('id', user?.id)

      if (error) {
        setError(error.message)
      } else {
        setSuccess('Profil başarıyla güncellendi!')
      }
    } catch (error) {
      setError('Profil güncellenirken bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user?.id)

      if (error) {
        setError(error.message)
      } else {
        // Sign out and redirect
        await supabase.auth.signOut()
        router.push('/')
      }
    } catch (error) {
      setError('Hesap silinirken bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-white">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Head>
        <title>Profil Ayarları - MineVote</title>
        <meta name="description" content="Profil ayarlarınızı düzenleyin" />
      </Head>

      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link href="/dashboard" className="flex items-center space-x-2 text-emerald-400 text-xl font-bold">
                <img src="/assets/img/grass-block.png" className="w-8 h-8" alt="MineVote" />
                <span>MineVote</span>
              </Link>
              
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-gray-300 hover:text-white">
                  Dashboard
                </Link>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Ana Sayfa
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Profil Ayarları</h1>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg mb-6">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Preview */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full overflow-hidden">
                  <img
                    src={`https://minotar.net/avatar/${profileData.mc_nick || 'steve'}`}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-white font-medium">Profil Resmi</p>
                  <p className="text-gray-400 text-sm">
                    Minecraft skininiz otomatik olarak kullanılır
                  </p>
                </div>
              </div>

              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Kullanıcı Adı
                </label>
                <input
                  type="text"
                  id="username"
                  value={profileData.username}
                  onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>

              {/* Minecraft Nick */}
              <div>
                <label htmlFor="mc_nick" className="block text-sm font-medium text-gray-300 mb-2">
                  Minecraft Nicki
                </label>
                <input
                  type="text"
                  id="mc_nick"
                  value={profileData.mc_nick}
                  onChange={(e) => setProfileData({ ...profileData, mc_nick: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
                <p className="text-gray-400 text-sm mt-1">
                  Bu nick profil resminiz için kullanılır
                </p>
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
                  Biyografi
                </label>
                <textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Kendiniz hakkında kısa bir açıklama yazın..."
                />
              </div>

              {/* Discord Info */}
              {profileData.discord_id && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Discord Hesabı
                  </label>
                  <div className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-300">
                    Bağlı Discord ID: {profileData.discord_id}
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    Discord hesabınız otomatik olarak bağlandı
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </form>

            {/* Danger Zone */}
            <div className="mt-12 pt-6 border-t border-gray-700">
              <h2 className="text-lg font-semibold text-red-400 mb-4">Tehlikeli Bölge</h2>
              
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <h3 className="text-red-400 font-medium mb-2">Hesabı Sil</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Hesabınızı silmek istediğinizde tüm verileriniz kalıcı olarak silinir. 
                  Bu işlem geri alınamaz.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  disabled={saving}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hesabı Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
