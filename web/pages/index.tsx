import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>MineVote</title>
      </Head>
      <main className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold mb-3">MineVote</h1>
          <p className="text-gray-400">Next.js + Tailwind + Supabase yapılandırılıyor...</p>
        </div>
      </main>
    </>
  )
}


