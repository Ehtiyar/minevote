import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>MineVote - Minecraft Sunucu Oylama</title>
      </Head>
      <main className="min-h-screen bg-gray-900 text-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6 gradient-text">MineVote</h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Minecraft'ın en iyi sunucularına oy verin, favorilerinizi keşfedin ve ödüller kazanın!
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/servers" className="btn btn-primary px-8 py-3 text-lg">
                🗳️ Sunucuları Keşfet
              </Link>
              <Link href="/add-server" className="btn btn-secondary px-8 py-3 text-lg">
                ➕ Sunucu Ekle
              </Link>
            </div>
          </div>
          
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">🖥️</div>
              <h3 className="text-xl font-semibold mb-2">1,247+ Sunucu</h3>
              <p className="text-gray-400">Türkiye'nin en büyük Minecraft sunucu listesi</p>
            </div>
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">45,892+ Oyuncu</h3>
              <p className="text-gray-400">Aktif oyuncu topluluğu</p>
            </div>
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">🗳️</div>
              <h3 className="text-xl font-semibold mb-2">892,441+ Oy</h3>
              <p className="text-gray-400">Toplam verilen oy sayısı</p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}


