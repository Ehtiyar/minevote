import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next'
import { CATEGORY_OPTIONS } from '../lib/categories'
import { useAuth } from '../contexts/AuthContext'
import { getSupabaseAdmin } from '../lib/supabaseServer'

type MiniServer = {
  id: string
  name: string
  total_votes: number
  banner_url?: string
  created_at?: string
}

interface Stats {
  totalServers: number
  totalPlayers: number
  totalVotes: number
  onlineServers: number
}

export default function Home({ popular, latest, stats }: { popular: MiniServer[]; latest: MiniServer[]; stats: Stats }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [clientStats, setClientStats] = useState<Stats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const { user, signOut } = useAuth()

  useEffect(() => {
    // Fetch client-side stats for real-time updates
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          setClientStats(data)
        } else {
          console.warn('Stats API returned:', response.status)
          // Use server-side stats as fallback
          setClientStats(stats)
        }
      } catch (error) {
        console.warn('Failed to fetch stats, using server-side data:', error)
        // Use server-side stats as fallback
        setClientStats(stats)
      } finally {
        setStatsLoading(false)
      }
    }

    fetchStats()
    
    // Counter animation
    const animateCounters = () => {
      const counters = document.querySelectorAll('.stat-number')
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count-to') || '0')
        const duration = 2000
        const increment = target / (duration / 16)
        let current = 0
        
        const timer = setInterval(() => {
          current += increment
          if (current >= target) {
            current = target
            clearInterval(timer)
          }
          counter.textContent = Math.floor(current).toLocaleString('tr-TR')
        }, 16)
      })
    }

    setTimeout(animateCounters, 500)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (showProfileDropdown && !target.closest('.profile-dropdown')) {
        setShowProfileDropdown(false)
      }
    }

    if (showProfileDropdown) {
      document.addEventListener('click', handleClickOutside)
    }
    
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showProfileDropdown])

  return (
    <>
      <Head>
        <title>MineVote - Minecraft Sunucu Oylama Platformu</title>
        <meta name="description" content="Türkiye'nin en büyük Minecraft sunucu voting platformu. Favori sunucularınızı keşfedin, oy verin ve ödüller kazanın!" />
        <meta name="keywords" content="minecraft, sunucu, oylama, vote, türkiye, server, minevote" />
        <meta name="author" content="MineVote" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://minevote.netlify.app" />
        
        {/* Open Graph */}
        <meta property="og:title" content="MineVote - Minecraft Sunucu Oylama" />
        <meta property="og:description" content="Türkiye'nin en büyük Minecraft sunucu voting platformu" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://minevote.netlify.app" />
        <meta property="og:image" content="https://minevote.netlify.app/assets/img/og-image.png" />
        <meta property="og:site_name" content="MineVote" />
        <meta property="og:locale" content="tr_TR" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MineVote - Minecraft Sunucu Oylama" />
        <meta name="twitter:description" content="Türkiye'nin en büyük Minecraft sunucu voting platformu" />
        <meta name="twitter:image" content="https://minevote.netlify.app/assets/img/og-image.png" />
        
        {/* Additional SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#10B981" />
        <link rel="icon" href="/assets/img/icon.png" />
        <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "MineVote",
              "url": "https://minevote.netlify.app",
              "description": "Türkiye'nin en büyük Minecraft sunucu voting platformu",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://minevote.netlify.app/servers?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </Head>

      <a className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-emerald-600 text-white px-4 py-2 rounded-md z-50" href="#main">
        İçeriğe atla
      </a>

      {/* Header */}
      <header className="site-header glass-effect">
        <div className="container header-inner">
          <Link href="/" className="brand" aria-label="MineVote Ana Sayfa">
            <span className="brand-icon" aria-hidden="true">🟩</span>
            <span className="brand-text">MineVote</span>
          </Link>

          <nav className="main-nav" aria-label="Ana Menü">
            <button 
              className="nav-toggle" 
              aria-expanded={isMenuOpen} 
              aria-controls="nav-menu" 
              aria-label="Menüyü aç/kapat"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="nav-toggle-bar"></span>
              <span className="nav-toggle-bar"></span>
              <span className="nav-toggle-bar"></span>
            </button>
            <ul id="nav-menu" className={`nav-list ${isMenuOpen ? 'open' : ''}`}>
              <li><Link href="/" className="nav-link active">🏠 Ana Sayfa</Link></li>
              <li><Link href="/servers" className="nav-link">🎯 Sunucular</Link></li>
              {/* Gelecek sayfalar hazır olana kadar mevcut rotalara yönlendir */}
              <li><Link href="/servers?sort=votes" className="nav-link">⭐ Popüler</Link></li>
              <li><Link href="/servers" className="nav-link">📊 Sıralamalar</Link></li>
              {user && (<li><Link href="/add" className="nav-link">➕ Sunucu Ekle</Link></li>)}
              <li><Link href="/auth/login" className="nav-link">📞 İletişim</Link></li>
            </ul>
          </nav>

          <div className="user-actions">
            {user ? (
              <>
                {/* Profile Dropdown */}
                <div className="relative profile-dropdown">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      console.log('Dropdown clicked, current state:', showProfileDropdown)
                      setShowProfileDropdown(!showProfileDropdown)
                    }}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white border border-gray-600 rounded-lg px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <img
                      src={`https://minotar.net/avatar/${user.user_metadata?.mc_nick || 'steve'}/32`}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full border-2 border-emerald-500"
                    />
                    <span className="text-sm font-medium">{user.user_metadata?.username || 'Kullanıcı'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showProfileDropdown && (
                    <div 
                      className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50"
                      onClick={(e) => e.stopPropagation()}
                      style={{ display: 'block' }}
                    >
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          🏠 Dashboard
                        </Link>
                        <Link
                          href="/profile/settings"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          🔧 Profil Ayarları
                        </Link>
                        <Link
                          href="/profile/change-password"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          🔒 Şifre Değiştir
                        </Link>
                        <Link
                          href="/profile/servers"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          🖥️ Sunucularım
                        </Link>
                        <Link
                          href="/add"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          ➕ Sunucu Ekle
                        </Link>
                        <hr className="my-1 border-gray-700" />
                        <button
                          onClick={() => {
                            signOut()
                            setShowProfileDropdown(false)
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300"
                        >
                          🚪 Çıkış Yap
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn btn-ghost">Giriş Yap</Link>
                <Link href="/auth/register" className="btn btn-primary">Kayıt Ol</Link>
              </>
            )}
            <div className="divider"></div>
            <button className="btn btn-ghost" id="lang-toggle" aria-label="Dili değiştir">TR/EN</button>
            <label className="theme-toggle" title="Tema">
              <input 
                type="checkbox" 
                id="theme-switch" 
                aria-label="Koyu/Açık mod"
                checked={isDarkMode}
                onChange={(e) => setIsDarkMode(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero particles" id="hero">
        <div className="container hero-inner">
          <h1 className="gradient-text">Minecraft'ın En İyi Sunucularına Oy Ver!</h1>
          <p>Türkiye'nin en büyük Minecraft sunucu listesi. Favorilerini keşfet, oy ver ve ödüller kazan!</p>
          <div className="hero-buttons">
            <Link href="/servers" className="btn btn-primary">Sunucuları Keşfet</Link>
            {user && (<Link href="/add" className="btn btn-secondary">Sunucu Ekle</Link>)}
          </div>
        </div>
        <div className="hero-floating" aria-hidden="true">
          <div className="float block-1"></div>
          <div className="float block-2"></div>
          <div className="float block-3"></div>
        </div>
        <div className="parallax" aria-hidden="true"></div>
      </section>

      {/* Stats */}
      <section className="stats">
        <div className="container stats-grid">
          <div className="stat-card glass-effect">
            <div className="stat-icon">🖥️</div>
            <div className="stat-content">
              <div className="stat-number" data-count-to={clientStats?.totalServers || stats?.totalServers || 0}>
                {statsLoading ? '—' : (clientStats?.totalServers || stats?.totalServers || 0).toLocaleString('tr-TR')}
              </div>
              <div className="stat-label">Toplam Sunucu</div>
            </div>
          </div>
          <div className="stat-card glass-effect">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-number" data-count-to={clientStats?.totalPlayers || stats?.totalPlayers || 0}>
                {statsLoading ? '—' : (clientStats?.totalPlayers || stats?.totalPlayers || 0).toLocaleString('tr-TR')}
              </div>
              <div className="stat-label">Aktif Oyuncu</div>
            </div>
          </div>
          <div className="stat-card glass-effect">
            <div className="stat-icon">🗳️</div>
            <div className="stat-content">
              <div className="stat-number" data-count-to={clientStats?.totalVotes || stats?.totalVotes || 0}>
                {statsLoading ? '—' : (clientStats?.totalVotes || stats?.totalVotes || 0).toLocaleString('tr-TR')}
              </div>
              <div className="stat-label">Toplam Oy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="filters">
        <div className="container">
          <div className="search-container glass-effect">
            <label htmlFor="server-search" className="sr-only">Sunucu ara</label>
            <input 
              id="server-search"
              type="text" 
              placeholder="Sunucu ara (isim, IP, kategori...)" 
              aria-label="Sunucu ara"
              aria-describedby="search-help"
            />
            <button 
              className="search-btn" 
              aria-label="Ara"
              type="button"
              onClick={() => {
                const searchInput = document.getElementById('server-search') as HTMLInputElement
                if (searchInput?.value) {
                  window.location.href = `/servers?search=${encodeURIComponent(searchInput.value)}`
                }
              }}
            >
              🔍
            </button>
            <div id="search-help" className="sr-only">
              Sunucu adı, IP adresi veya kategori yazarak arama yapabilirsiniz
            </div>
          </div>

          <div className="chip-group" role="group" aria-label="Kategoriler">
            <Link href="/servers" className="chip active">🏠 Tümü</Link>
            {CATEGORY_OPTIONS.map((c) => (
              <Link key={c.slug} href={`/servers?category=${c.slug}`} className="chip">
                {c.emoji ? `${c.emoji} ` : ''}{c.label}
              </Link>
            ))}
          </div>

          <div className="sort-row">
            <label htmlFor="sort" className="sr-only">Sırala</label>
            <select 
              id="sort" 
              className="sort-dropdown"
              aria-label="Sunucuları sırala"
              onChange={(e) => {
                const value = e.target.value
                if (value) {
                  window.location.href = `/servers?sort=${value.toLowerCase().replace(/\s+/g, '_')}`
                }
              }}
            >
              <option value="votes">📈 En Çok Oy Alan</option>
              <option value="players">👥 En Kalabalık</option>
              <option value="newest">🆕 En Yeni</option>
              <option value="active">📊 En Aktif</option>
              <option value="premium">💎 Premium Önce</option>
            </select>
          </div>
        </div>
      </section>

      <main id="main" className="container layout">
        {/* Main list */}
        <section className="server-list" id="servers">
          <div className="server-grid">
            {popular.length === 0 && latest.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 text-lg mb-4">
                  <span className="text-4xl mb-4 block">🎮</span>
                  Henüz sunucu eklenmedi
                </div>
                <p className="text-gray-500 mb-6">
                  İlk sunucuyu eklemek için giriş yapın
                </p>
                <Link 
                  href="/auth/login" 
                  className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Giriş Yap
                </Link>
              </div>
            ) : (
              <div className="col-span-full text-center py-8">
                <div className="text-gray-400 text-lg mb-4">
                  <span className="text-4xl mb-4 block">🔍</span>
                  Sunucuları keşfetmek için
                </div>
                <Link 
                  href="/servers" 
                  className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Tüm Sunucuları Gör
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-widget glass-effect">
            <h3>🔥 En Popülerler</h3>
            <div className="mini-server-list">
              {popular.length === 0 && (
                <div className="mini-server-item">
                  <div className="mini-info"><span>Henüz veri yok</span></div>
                </div>
              )}
              {popular.map((s, idx) => (
                <div key={s.id} className="mini-server-item">
                  <img src={s.banner_url || 'https://via.placeholder.co/32?text=L'} alt="Logo" />
                  <div className="mini-info">
                    <strong>{s.name}</strong>
                    <span>{s.total_votes.toLocaleString('tr-TR')} oy</span>
                  </div>
                  <span className="rank">#{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-widget glass-effect">
            <h3>✨ Yeni Sunucular</h3>
            <div className="mini-server-list">
              {latest.length === 0 && (
                <div className="mini-server-item">
                  <div className="mini-info"><span>Henüz veri yok</span></div>
                </div>
              )}
              {latest.map((s) => (
                <div key={s.id} className="mini-server-item">
                  <img src={s.banner_url || 'https://via.placeholder.co/32?text=L'} alt="Logo" />
                  <div className="mini-info">
                    <strong>{s.name}</strong>
                    <span>yeni eklendi</span>
                  </div>
                  <span className="rank">#—</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ad-widget glass-effect">
            <h4>Sponsorlu</h4>
            <div className="ad-content skeleton" aria-label="Reklam alanı"></div>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container footer-content">
          <div className="footer-section">
            <span className="footer-logo">MineVote</span>
            <p>Türkiye'nin en büyük Minecraft sunucu voting platformu</p>
            <div className="social-links">
              <a href="#" className="social-btn">📘 Facebook</a>
              <a href="#" className="social-btn">🐦 Twitter</a>
              <a href="#" className="social-btn">💬 Discord</a>
            </div>
          </div>
          <div className="footer-section">
            <h4>Hızlı Erişim</h4>
            <ul>
              <li><a href="#">Sunucu Ekle</a></li>
              <li><a href="#">API Dokümantasyon</a></li>
              <li><a href="#">Yardım</a></li>
              <li><a href="#">İletişim</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>📊 Canlı İstatistikler</h4>
            <div className="live-stats">
              <div className="stat-item">
                <span className="stat-number">
                  {statsLoading ? '—' : (clientStats?.totalServers || stats?.totalServers || 0).toLocaleString('tr-TR')}
                </span>
                <span className="stat-label">Sunucu</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {statsLoading ? '—' : (clientStats?.totalPlayers || stats?.totalPlayers || 0).toLocaleString('tr-TR')}
                </span>
                <span className="stat-label">Oyuncu</span>
              </div>
            </div>
          </div>
          <div className="footer-section">
            <h4>📧 Bülten</h4>
            <p>Yeni sunucular ve güncellemeler hakkında haberdar ol</p>
            <div className="newsletter-signup">
              <input type="email" placeholder="E-posta adresin" />
              <button className="btn btn-primary">Abone Ol</button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} MineVote. Tüm hakları saklıdır.</p>
          <div className="legal-links">
            <a href="/privacy" className="hover:text-emerald-400 transition-colors">Gizlilik Politikası</a>
            <span className="text-gray-500">·</span>
            <a href="/terms" className="hover:text-emerald-400 transition-colors">Kullanım Şartları</a>
          </div>
        </div>
      </footer>
    </>
  )
}


export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const supabase = getSupabaseAdmin()

    const { data: popular, error: popErr } = await supabase
      .from('servers')
      .select('id,name,total_votes,banner_url,created_at')
      .order('total_votes', { ascending: false })
      .limit(5)

    const { data: latest, error: newErr } = await supabase
      .from('servers')
      .select('id,name,total_votes,banner_url,created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    // Get stats
    const { count: totalServers, error: serversError } = await supabase
      .from('servers')
      .select('*', { count: 'exact', head: true })

    const { data: serversData, error: playersError } = await supabase
      .from('servers')
      .select('current_players')
      .eq('status', 'online')

    const { count: totalVotes, error: votesError } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })

    if (popErr || newErr || serversError || playersError || votesError) {
      throw popErr || newErr || serversError || playersError || votesError
    }

    const totalPlayers = serversData?.reduce((sum, server) => sum + (server.current_players || 0), 0) || 0

    const stats: Stats = {
      totalServers: totalServers || 0,
      totalPlayers: totalPlayers,
      totalVotes: totalVotes || 0,
      onlineServers: 0 // Will be calculated client-side
    }

    return { props: { popular: popular || [], latest: latest || [], stats } }
  } catch {
    return { 
      props: { 
        popular: [], 
        latest: [], 
        stats: { totalServers: 0, totalPlayers: 0, totalVotes: 0, onlineServers: 0 }
      } 
    }
  }
}


