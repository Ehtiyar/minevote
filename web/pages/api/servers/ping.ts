import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { status as pingStatus } from 'minecraft-server-util'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )

  try {
    const { serverId } = req.body as { serverId: string }

    const { data: server, error: serverError } = await supabase
      .from('servers')
      .select('*')
      .eq('id', serverId)
      .single()

    if (serverError || !server) {
      return res.status(404).json({ error: 'Server not found' })
    }

    try {
      const status = await pingStatus(server.ip_address, server.port || 25565, { timeout: 5000 })

      await supabase.from('servers').update({
        status: 'online',
        current_players: status.players?.online || 0,
        max_players: status.players?.max || server.max_players,
        version: (status.version as any)?.name || server.version,
        last_ping: new Date().toISOString()
      }).eq('id', serverId)

      await supabase.from('server_ping_history').insert({
        server_id: serverId,
        is_online: true,
        response_time: (status as any).latency || 0,
        player_count: status.players?.online || 0,
        max_players: status.players?.max || 0,
        version: (status.version as any)?.name || 'Unknown',
        motd: (status.motd as any)?.clean || ''
      })

      res.status(200).json({
        success: true,
        status: 'online',
        players: { online: status.players?.online || 0, max: status.players?.max || 0 },
        version: (status.version as any)?.name || 'Unknown'
      })

    } catch (pingError: any) {
      await supabase.from('servers').update({ status: 'offline', last_ping: new Date().toISOString() }).eq('id', serverId)
      await supabase.from('server_ping_history').insert({ server_id: serverId, is_online: false, error_message: pingError?.message || 'Unknown error' })
      res.status(200).json({ success: true, status: 'offline', error: pingError?.message || 'Server unreachable' })
    }

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}


