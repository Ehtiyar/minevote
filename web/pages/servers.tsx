import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { getSupabaseAdmin } from '../lib/supabaseServer'
import { ServerCard } from '../components/ServerCard'

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
}

export default function ServersPage({ servers }: { servers: Server[] }) {
  return (
    <>
      <Head>
        <title>MineVote - Sunucular</title>
      </Head>
      <main className="min-h-screen bg-gray-900 text-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold mb-6">Sunucular</h1>
          {servers.length === 0 ? (
            <div className="text-gray-400">Henüz sunucu eklenmedi.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {servers.map((s, idx) => (
                <ServerCard key={s.id} server={s as any} rank={idx + 1} />
              ))}
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
      .select('id,name,description,ip_address,port,categories,current_players,max_players,total_votes,daily_votes,status,banner_url,premium')
      .order('premium', { ascending: false })
      .order('total_votes', { ascending: false })
      .limit(30)

    if (error) throw error

    return { props: { servers: data || [] } }
  } catch {
    return { props: { servers: [] } }
  }
}


