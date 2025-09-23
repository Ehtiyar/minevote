import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '../../contexts/AuthContext'

export default function Dashboard() {
  const { user, profile, loading: authLoading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (authLoading) {
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
        <title>Dashboard - MineVote</title>
        <meta name="description" content="MineVote dashboard" />
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
                <button
                  onClick={handleSignOut}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    <img
                      src={`https://minotar.net/avatar/${profile?.mc_nick || 'steve'}`}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-white">{profile?.username || 'Kullanıcı'}</h2>
                  <p className="text-gray-400">@{profile?.mc_nick || 'steve'}</p>
                  {profile?.discord_id && (
                    <p className="text-sm text-gray-500 mt-1">
                      Discord: {profile.discord_id}
                    </p>
                  )}
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Toplam Oy:</span>
                    <span className="text-white font-semibold">{profile?.total_votes || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">XP:</span>
                    <span className="text-white font-semibold">{profile?.xp || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Seviye:</span>
                    <span className="text-white font-semibold">{profile?.level || 1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Üyelik:</span>
                    <span className="text-white font-semibold">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href="/profile/settings"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg block text-center"
                  >
                    Profili Düzenle
                  </Link>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">🗳️</div>
                    <div>
                      <p className="text-gray-400 text-sm">Bu Ay Oy</p>
                      <p className="text-white text-xl font-bold">0</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">🏆</div>
                    <div>
                      <p className="text-gray-400 text-sm">Sıralama</p>
                      <p className="text-white text-xl font-bold">#—</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">⭐</div>
                    <div>
                      <p className="text-gray-400 text-sm">Rozetler</p>
                      <p className="text-white text-xl font-bold">0</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Son Aktiviteler</h3>
                <div className="space-y-3">
                  <div className="text-gray-400 text-center py-8">
                    Henüz aktivite bulunmuyor
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Hızlı İşlemler</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    href="/servers"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg text-center"
                  >
                    🎯 Sunucuları Keşfet
                  </Link>
                  <Link
                    href="/add"
                    className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg text-center"
                  >
                    ➕ Sunucu Ekle
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}