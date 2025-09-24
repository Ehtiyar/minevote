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

  // Always return fallback stats for now to prevent 404 errors
  const fallbackStats: StatsResponse = {
    totalServers: 0,
    totalPlayers: 0,
    totalVotes: 0,
    onlineServers: 0
  }

  try {
    // Check if environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      console.log('Missing Supabase environment variables, returning fallback stats')
      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')
      return res.status(200).json(fallbackStats)
    }

    const supabase = getSupabaseAdmin()

    // Get total servers
    const { count: totalServers, error: serversError } = await supabase
      .from('servers')
      .select('*', { count: 'exact', head: true })

    if (serversError) {
      console.log('Servers query error:', serversError)
      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')
      return res.status(200).json(fallbackStats)
    }

    // Get online servers
    const { count: onlineServers, error: onlineError } = await supabase
      .from('servers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'online')

    if (onlineError) {
      console.log('Online servers query error:', onlineError)
      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')
      return res.status(200).json(fallbackStats)
    }

    // Get total players (sum of current_players)
    const { data: serversData, error: playersError } = await supabase
      .from('servers')
      .select('current_players')
      .eq('status', 'online')

    if (playersError) {
      console.log('Players query error:', playersError)
      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')
      return res.status(200).json(fallbackStats)
    }

    const totalPlayers = serversData?.reduce((sum, server) => sum + (server.current_players || 0), 0) || 0

    // Get total votes
    const { count: totalVotes, error: votesError } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })

    if (votesError) {
      console.log('Votes query error:', votesError)
      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')
      return res.status(200).json(fallbackStats)
    }

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
    console.log('Stats API error:', error)
    
    // Always return 200 with fallback stats
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')
    res.status(200).json(fallbackStats)
  }
}
