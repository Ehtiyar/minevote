import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
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

  return (
    <>
      <Head>
        <title>MineVote - Minecraft Sunucu Oylama</title>
        <meta name="description" content="Türkiye'nin en büyük Minecraft sunucu voting platformu" />
        <link rel="preload" href="/assets/fonts/minecraft.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="icon" href="/assets/img/icon.png" />
      </Head>

      <a className="sr-only" href="#main">İçeriğe atla</a>

      {/* Header */}
      <header className="site-header glass-effect">
        <div className="container header-inner">
          <Link href="/" className="brand" aria-label="MineVote Ana Sayfa">
            <img src="/assets/img/grass-block.png" className="brand-icon" alt="Grass" />
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
              <li><Link href="/popular" className="nav-link">⭐ Popüler</Link></li>
              <li><Link href="/leaderboard" className="nav-link">📊 Sıralamalar</Link></li>
              <li><Link href="/add" className="nav-link">➕ Sunucu Ekle</Link></li>
              <li><Link href="/contact" className="nav-link">📞 İletişim</Link></li>
            </ul>
          </nav>

          <div className="user-actions">
            <button className="btn btn-ghost" id="btn-login">Giriş Yap</button>
            <button className="btn btn-primary" id="btn-register">Kayıt Ol</button>
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
            <Link href="/add" className="btn btn-secondary">Sunucu Ekle</Link>
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
              <div className="stat-number" data-count-to="1247">0</div>
              <div className="stat-label">Toplam Sunucu</div>
            </div>
          </div>
          <div className="stat-card glass-effect">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-number" data-count-to="45892">0</div>
              <div className="stat-label">Aktif Oyuncu</div>
            </div>
          </div>
          <div className="stat-card glass-effect">
            <div className="stat-icon">🗳️</div>
            <div className="stat-content">
              <div className="stat-number" data-count-to="892441">0</div>
              <div className="stat-label">Toplam Oy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="filters">
        <div className="container">
          <div className="search-container glass-effect">
            <input type="text" placeholder="Sunucu ara (isim, IP, kategori...)" aria-label="Sunucu ara" />
            <button className="search-btn" aria-label="Ara">🔍</button>
          </div>

          <div className="chip-group" role="group" aria-label="Kategoriler">
            <button className="chip active">🏠 Tümü</button>
            <button className="chip">⚔️ PvP</button>
            <button className="chip">🏗️ Survival</button>
            <button className="chip">🌌 Skyblock</button>
            <button className="chip">⛏️ Prison</button>
            <button className="chip">🏛️ Faction</button>
            <button className="chip">🎭 Roleplay</button>
            <button className="chip">🎨 Creative</button>
            <button className="chip">🎮 Minigames</button>
            <button className="chip">🐉 Pixelmon</button>
          </div>

          <div className="sort-row">
            <label htmlFor="sort" className="sr-only">Sırala</label>
            <select id="sort" className="sort-dropdown">
              <option>📈 En Çok Oy Alan</option>
              <option>👥 En Kalabalık</option>
              <option>🆕 En Yeni</option>
              <option>📊 En Aktif</option>
              <option>💎 Premium Önce</option>
            </select>
          </div>
        </div>
      </section>

      <main id="main" className="container layout">
        {/* Main list */}
        <section className="server-list" id="servers">
          <div className="server-grid">
            {/* Example server card */}
            <article className="server-card premium">
              <div className="server-image">
                <img src="/assets/img/server-banner.jpg" alt="Sunucu Banner" loading="lazy" />
                <div className="status-badge">🟢 Online</div>
                <div className="rank-badge">#1</div>
                <div className="premium-badge">⭐ Premium</div>
              </div>
              <div className="server-info">
                <h3 className="server-name">AwesomeCraft Network</h3>
                <p className="server-description">En eğlenceli survival deneyimi! Ekonomi, job sistemi, özel eventler...</p>
                <div className="server-stats">
                  <span className="stat">👥 248/500</span>
                  <span className="stat">📊 1.19.4</span>
                  <span className="stat">🎯 847 oy</span>
                  <span className="stat">🌍 TR</span>
                </div>
                <div className="server-tags">
                  <span className="tag">Survival</span>
                  <span className="tag">Economy</span>
                  <span className="tag">PvP</span>
                </div>
              </div>
              <div className="server-actions">
                <button className="btn vote-btn" data-server="AwesomeCraft">🗳️ Oy Ver</button>
                <button className="btn btn-ghost copy-ip-btn" data-ip="play.awesomecraft.net">📋 IP Kopyala</button>
                <button className="btn btn-ghost details-btn">ℹ️ Detaylar</button>
              </div>
            </article>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-widget glass-effect">
            <h3>🔥 En Popülerler</h3>
            <div className="mini-server-list">
              <div className="mini-server-item">
                <img src="/assets/img/small-logo.png" alt="Logo" />
                <div className="mini-info">
                  <strong>Sunucu Adı</strong>
                  <span>847 oy</span>
                </div>
                <span className="rank">#1</span>
              </div>
            </div>
          </div>

          <div className="sidebar-widget glass-effect">
            <h3>✨ Yeni Sunucular</h3>
            <div className="mini-server-list">
              <div className="mini-server-item">
                <img src="/assets/img/small-logo.png" alt="Logo" />
                <div className="mini-info">
                  <strong>YeniCraft</strong>
                  <span>1 gün önce</span>
                </div>
                <span className="rank">#—</span>
              </div>
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
            <img src="/assets/img/logo.png" alt="MineVote" className="footer-logo" />
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
                <span className="stat-number">1,247</span>
                <span className="stat-label">Sunucu</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">45,892</span>
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
          <p>© 2024 MineVote. Tüm hakları saklıdır.</p>
          <div className="legal-links">
            <a href="#">Gizlilik Politikası</a>
            <a href="#">Kullanım Şartları</a>
          </div>
        </div>
      </footer>
    </>
  )
}


