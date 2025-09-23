import type { NextApiRequest, NextApiResponse } from 'next'
import { getSupabaseAdmin } from '../../lib/supabaseServer'

interface StatsResponse {
  totalServers: number
  totalPlayers: number
  totalVotes: number
  onlineServers: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const supabase = getSupabaseAdmin()

    // Get total servers
    const { count: totalServers, error: serversError } = await supabase
      .from('servers')
      .select('*', { count: 'exact', head: true })

    if (serversError) throw serversError

    // Get online servers
    const { count: onlineServers, error: onlineError } = await supabase
      .from('servers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'online')

    if (onlineError) throw onlineError

    // Get total players (sum of current_players)
    const { data: serversData, error: playersError } = await supabase
      .from('servers')
      .select('current_players')
      .eq('status', 'online')

    if (playersError) throw playersError

    const totalPlayers = serversData?.reduce((sum, server) => sum + (server.current_players || 0), 0) || 0

    // Get total votes
    const { count: totalVotes, error: votesError } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })

    if (votesError) throw votesError

    const stats: StatsResponse = {
      totalServers: totalServers || 0,
      totalPlayers: totalPlayers,
      totalVotes: totalVotes || 0,
      onlineServers: onlineServers || 0
    }

    // Cache for 5 minutes
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    res.status(200).json(stats)

  } catch (error) {
    console.error('Stats API error:', error)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
}
