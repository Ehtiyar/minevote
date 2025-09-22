import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function useRealtimeVotes(serverId: string) {
  const [voteCount, setVoteCount] = useState<number>(0)
  const [recentVotes, setRecentVotes] = useState<any[]>([])

  useEffect(() => {
    const fetchInitial = async () => {
      const { data: server } = await supabase.from('servers').select('total_votes').eq('id', serverId).single()
      if (server) setVoteCount(server.total_votes)
      const { data: votes } = await supabase
        .from('votes')
        .select('minecraft_username, created_at')
        .eq('server_id', serverId)
        .order('created_at', { ascending: false })
        .limit(5)
      if (votes) setRecentVotes(votes)
    }
    fetchInitial()

    const votesSub = supabase
      .channel('server_votes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes', filter: `server_id=eq.${serverId}` }, (payload) => {
        setVoteCount((v) => v + 1)
        setRecentVotes((prev) => [payload.new as any, ...prev.slice(0,4)])
      })
      .subscribe()

    const serverSub = supabase
      .channel('server_stats')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'servers', filter: `id=eq.${serverId}` }, (payload) => {
        // @ts-ignore
        setVoteCount((payload.new as any).total_votes)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(votesSub)
      supabase.removeChannel(serverSub)
    }
  }, [serverId])

  return { voteCount, recentVotes }
}


