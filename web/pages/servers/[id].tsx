import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

interface Server {
  id: string
  name: string
  ip_address: string
  port: number
  description: string
  banner_url?: string
  website_url?: string
  discord_url?: string
  categories: string[]
  status: 'online' | 'offline' | 'unknown'
  current_players: number
  max_players: number
  total_votes: number
  daily_votes: number
  weekly_votes: number
  monthly_votes: number
  verified: boolean
  premium: boolean
  created_at: string
  owner: {
    username: string
    mc_nick: string
  }
}

export default function ServerDetail() {
  const { user } = useAuth()
  const router = useRouter()
  const { id } = router.query
  const [server, setServer] = useState<Server | null>(null)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [hasVoted, setHasVoted] = useState(false)

  useEffect(() => {
    if (id) {
      fetchServer()
      if (user) {
        checkVoteStatus()
      }
    }
  }, [id, user])

  const fetchServer = async () => {
    try {
      const { data, error } = await supabase
        .from('servers')
        .select(`
          *,
          owner:profiles!servers_owner_id_fkey(username, mc_nick)
        `)
        .eq('id', id)
        .single()

      if (error) {
        setError('Sunucu bulunamadı')
      } else {
        setServer(data)
      }
    } catch (error) {
      setError('Sunucu yüklenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const checkVoteStatus = async () => {
    if (!user || !id) return

    try {
      const { data, error } = await supabase
        .from('votes')
        .select('id')
        .eq('user_id', user.id)
        .eq('server_id', id)
        .gte('created_at', new Date().toISOString().split('T')[0])
        .single()

      if (data) {
        setHasVoted(true)
      }
    } catch (error) {
      // No vote found, which is fine
    }
  }

  const handleVote = async () => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    if (hasVoted) {
      setError('Bu sunucuya bugün zaten oy verdiniz')
      return
    }

    setVoting(true)
    setError('')
    setSuccess('')

    try {
      const { error } = await supabase
        .from('votes')
        .insert({
          user_id: user.id,
          server_id: id as string
        })

      if (error) {
        setError(error.message)
      } else {
        setSuccess('Oy başarıyla verildi!')
        setHasVoted(true)
        // Refresh server data to update vote count
        fetchServer()
      }
    } catch (error) {
      setError('Oy verilirken bir hata oluştu')
    } finally {
      setVoting(false)
    }
  }

  const copyIP = async () => {
    if (server) {
      const ip = `${server.ip_address}:${server.port}`
      try {
        await navigator.clipboard.writeText(ip)
        setSuccess('IP adresi kopyalandı!')
      } catch (error) {
        setError('IP adresi kopyalanamadı')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-white">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!server) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Sunucu Bulunamadı</h1>
          <Link href="/servers" className="text-emerald-400 hover:text-emerald-300">
            Sunuculara Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{server.name} - MineVote</title>
        <meta name="description" content={server.description} />
      </Head>

      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link href="/" className="flex items-center space-x-2 text-emerald-400 text-xl font-bold">
                <img src="/assets/img/grass-block.png" className="w-8 h-8" alt="MineVote" />
                <span>MineVote</span>
              </Link>
              
              <div className="flex items-center space-x-4">
                <Link href="/servers" className="text-gray-300 hover:text-white">
                  Sunucular
                </Link>
                {user && (
                  <Link href="/dashboard" className="text-gray-300 hover:text-white">
                    Dashboard
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Server Banner */}
          <div className="relative h-64 rounded-lg overflow-hidden mb-8">
            {server.banner_url ? (
              <img src={server.banner_url} alt={server.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-emerald-500 to-blue-600 flex items-center justify-center">
                <span className="text-6xl font-bold text-white">{server.name.charAt(0)}</span>
              </div>
            )}
            <div className="absolute top-4 right-4 flex space-x-2">
              {server.verified && (
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  ✅ Doğrulandı
                </span>
              )}
              {server.premium && (
                <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  ⭐ Premium
                </span>
              )}
            </div>
            <div className="absolute bottom-4 left-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                server.status === 'online' 
                  ? 'bg-green-600 text-white' 
                  : server.status === 'offline'
                  ? 'bg-red-600 text-white'
                  : 'bg-yellow-600 text-white'
              }`}>
                {server.status === 'online' ? '🟢 Online' : server.status === 'offline' ? '🔴 Offline' : '🟡 Bilinmiyor'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Server Info */}
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{server.name}</h1>
                    <p className="text-gray-400">
                      Sahibi: <span className="text-emerald-400">{server.owner.username}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-400">{server.total_votes.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">Toplam Oy</p>
                  </div>
                </div>

                <p className="text-gray-300 mb-6">{server.description}</p>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {server.categories.map((category) => (
                    <span key={category} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                      {category}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex space-x-4">
                  {server.website_url && (
                    <a
                      href={server.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                      🌐 Website
                    </a>
                  )}
                  {server.discord_url && (
                    <a
                      href={server.discord_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                    >
                      💬 Discord
                    </a>
                  )}
                </div>
              </div>

              {/* Vote Section */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Oy Ver</h2>
                
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg mb-4">
                    {success}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 mb-2">
                      {hasVoted 
                        ? 'Bu sunucuya bugün zaten oy verdiniz' 
                        : 'Bu sunucuya oy vererek destekleyin'
                      }
                    </p>
                    <p className="text-sm text-gray-400">
                      IP: {server.ip_address}:{server.port}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={copyIP}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                    >
                      📋 IP Kopyala
                    </button>
                    <button
                      onClick={handleVote}
                      disabled={voting || hasVoted || server.status !== 'online'}
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg"
                    >
                      {voting ? 'Veriliyor...' : hasVoted ? 'Oy Verildi' : '🗳️ Oy Ver'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Server Stats */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">İstatistikler</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Oyuncular:</span>
                    <span className="text-white">{server.current_players}/{server.max_players}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bugünkü Oy:</span>
                    <span className="text-white">{server.daily_votes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bu Hafta:</span>
                    <span className="text-white">{server.weekly_votes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bu Ay:</span>
                    <span className="text-white">{server.monthly_votes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Eklenme:</span>
                    <span className="text-white">
                      {new Date(server.created_at).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Owner Info */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Sunucu Sahibi</h3>
                <div className="flex items-center space-x-3">
                  <img
                    src={`https://minotar.net/avatar/${server.owner.mc_nick}`}
                    alt="Owner Avatar"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="text-white font-medium">{server.owner.username}</p>
                    <p className="text-gray-400 text-sm">@{server.owner.mc_nick}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
