import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

interface Server {
  id: string
  name: string
  description: string
  ip: string
  port: number
  website?: string
  discord?: string
  status: string
  current_players: number
  max_players: number
  created_at: string
}

export default function MyServers() {
  const [servers, setServers] = useState<Server[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    fetchMyServers()
  }, [user, router])

  const fetchMyServers = async () => {
    try {
      const { data, error } = await supabase
        .from('servers')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching servers:', error)
      } else {
        setServers(data || [])
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const deleteServer = async (serverId: string) => {
    if (!confirm('Bu sunucuyu silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('servers')
        .delete()
        .eq('id', serverId)
        .eq('owner_id', user?.id)

      if (error) {
        console.error('Error deleting server:', error)
        alert('Sunucu silinirken bir hata oluştu')
      } else {
        setServers(servers.filter(server => server.id !== serverId))
        alert('Sunucu başarıyla silindi')
      }
    } catch (err) {
      console.error('Error:', err)
      alert('Bir hata oluştu')
    }
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Head>
        <title>Sunucularım - MineVote</title>
        <meta name="description" content="MineVote sunucularım" />
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
                <Link href="/add" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg">
                  ➕ Sunucu Ekle
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Sunucularım</h1>
            <p className="text-gray-400 mt-2">Eklediğiniz sunucuları yönetin</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <p className="text-white">Yükleniyor...</p>
            </div>
          ) : servers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🖥️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Henüz sunucu eklemediniz</h3>
              <p className="text-gray-400 mb-6">İlk sunucunuzu ekleyerek başlayın!</p>
              <Link
                href="/add"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg inline-flex items-center"
              >
                ➕ Sunucu Ekle
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servers.map((server) => (
                <div key={server.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-white">{server.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      server.status === 'online' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {server.status === 'online' ? '🟢 Online' : '🔴 Offline'}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {server.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-300">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                      {server.ip}:{server.port}
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {server.current_players}/{server.max_players} oyuncu
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      href={`/servers/${server.id}`}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg text-center text-sm"
                    >
                      Görüntüle
                    </Link>
                    <button
                      onClick={() => deleteServer(server.id)}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
