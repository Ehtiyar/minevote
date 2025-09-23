import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/router'
import { normalizeCategories } from '../lib/categories'
import { getSupabaseAdmin } from '../lib/supabaseServer'
import { ServerCard } from '../components/ServerCard'
import { FilterSidebar } from '../components/FilterSidebar'

type Server = {
  id: string
  name: string
  description: string
  ip_address: string
  port: number
  categories: string[]
  current_players: number
  max_players: number
  total_votes: number
  daily_votes: number
  status: 'online' | 'offline' | 'unknown'
  banner_url?: string
  premium: boolean
  created_at?: string
}

type FilterOptions = {
  category: string
  status: string
  sortBy: string
  searchTerm: string
  minPlayers: number
  maxPlayers: number
  premiumOnly: boolean
}

export default function ServersPage({ servers }: { servers: Server[] }) {
  const router = useRouter()
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
    status: 'all',
    sortBy: 'votes',
    searchTerm: '',
    minPlayers: 0,
    maxPlayers: 1000,
    premiumOnly: false
  })
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Initialize category from query (?category=slug)
  useEffect(() => {
    const q = (router.query.category as string) || ''
    if (q && q !== filters.category) {
      setFilters((f) => ({ ...f, category: q }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.category])

  const filteredServers = useMemo(() => {
    let filtered = [...servers]

    // Arama filtresi
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(server =>
        server.name.toLowerCase().includes(searchLower) ||
        server.description.toLowerCase().includes(searchLower) ||
        server.ip_address.toLowerCase().includes(searchLower) ||
        server.categories.some(cat => cat.toLowerCase().includes(searchLower))
      )
    }

    // Kategori filtresi
    if (filters.category !== 'all') {
      filtered = filtered.filter(server =>
        normalizeCategories(server.categories).includes(filters.category)
      )
    }

    // Durum filtresi
    if (filters.status !== 'all') {
      filtered = filtered.filter(server => server.status === filters.status)
    }

    // Oyuncu sayısı filtresi
    filtered = filtered.filter(server =>
      server.current_players >= filters.minPlayers &&
      server.current_players <= filters.maxPlayers
    )

    // Premium filtresi
    if (filters.premiumOnly) {
      filtered = filtered.filter(server => server.premium)
    }

    // Sıralama
    switch (filters.sortBy) {
      case 'votes':
        filtered.sort((a, b) => b.total_votes - a.total_votes)
        break
      case 'players':
        filtered.sort((a, b) => b.current_players - a.current_players)
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
        break
      case 'alphabetical':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'premium':
        filtered.sort((a, b) => Number(b.premium) - Number(a.premium))
        break
    }

    return filtered
  }, [servers, filters])

  return (
    <>
      <Head>
        <title>MineVote - Sunucular</title>
        <meta name="description" content="Minecraft sunucularını keşfedin ve filtreleyin" />
      </Head>
      <main className="min-h-screen bg-gray-900 text-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex gap-8">
            {/* Sol Sidebar - Filtreler */}
            <div className="hidden lg:block w-80">
              <div className="sticky top-4">
                <FilterSidebar
                  onFilterChange={setFilters}
                  initialFilters={filters}
                />
              </div>
            </div>

            {/* Ana İçerik */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Sunucular</h1>
                <div className="flex items-center gap-4">
                  <div className="text-gray-400">
                    {filteredServers.length} sunucu bulundu
                  </div>
                  {/* Mobil Filtre Butonu */}
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    🔍 Filtreler
                  </button>
                </div>
              </div>

              {filteredServers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-2">
                    {servers.length === 0 ? 'Henüz sunucu eklenmedi.' : 'Filtrelere uygun sunucu bulunamadı.'}
                  </div>
                  {servers.length > 0 && (
                    <button
                      onClick={() => setFilters({
                        category: 'all',
                        status: 'all',
                        sortBy: 'votes',
                        searchTerm: '',
                        minPlayers: 0,
                        maxPlayers: 1000,
                        premiumOnly: false
                      })}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Filtreleri temizle
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredServers.map((server, idx) => (
                    <ServerCard key={server.id} server={server as any} rank={idx + 1} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobil Filtre Modal */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/60" onClick={() => setShowMobileFilters(false)} />
              <div className="absolute right-0 top-0 h-full w-80 bg-gray-800 p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">🔍 Filtreler</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✖
                  </button>
                </div>
                <FilterSidebar
                  onFilterChange={(newFilters) => {
                    setFilters(newFilters)
                    setShowMobileFilters(false)
                  }}
                  initialFilters={filters}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('servers')
      .select('id,name,description,ip_address,port,categories,current_players,max_players,total_votes,daily_votes,status,banner_url,premium,created_at')
      .order('premium', { ascending: false })
      .order('total_votes', { ascending: false })
      .limit(100)

    if (error) throw error

    return { props: { servers: data || [] } }
  } catch {
    return { props: { servers: [] } }
  }
}


