import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import crypto from 'crypto'

interface VoteSubmissionRequest {
  serverId: string
  minecraftUsername: string
  captchaToken?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const supabase = createServerSupabaseClient({ req, res })
    const { serverId, minecraftUsername, captchaToken } = req.body as VoteSubmissionRequest

    if (!serverId || !minecraftUsername) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const minecraftUsernameRegex = /^[a-zA-Z0-9_]{3,16}$/
    if (!minecraftUsernameRegex.test(minecraftUsername)) {
      return res.status(400).json({ error: 'Invalid Minecraft username' })
    }

    const clientIP = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown'
    const ipHash = crypto.createHash('sha256').update(clientIP.toString()).digest('hex')

    const { data: server, error: serverError } = await supabase
      .from('servers')
      .select('*')
      .eq('id', serverId)
      .single()

    if (serverError || !server) {
      return res.status(404).json({ error: 'Server not found' })
    }

    if (!server.voting_enabled) {
      return res.status(403).json({ error: 'Voting disabled for this server' })
    }

    const today = new Date().toISOString().split('T')[0]

    const { data: existingVotes, error: voteCheckError } = await supabase
      .from('votes')
      .select('id')
      .eq('server_id', serverId)
      .eq('minecraft_username', minecraftUsername)
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`)

    if (voteCheckError) {
      return res.status(500).json({ error: 'Database error' })
    }

    if (existingVotes && existingVotes.length > 0) {
      return res.status(429).json({ 
        error: 'Already voted today',
        nextVoteTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      })
    }

    if (captchaToken) {
      const captchaValid = await verifyCaptcha(captchaToken, clientIP.toString())
      if (!captchaValid) {
        return res.status(400).json({ error: 'Invalid CAPTCHA' })
      }
    }

    const { data: vote, error: voteError } = await supabase
      .from('votes')
      .insert({
        server_id: serverId,
        minecraft_username: minecraftUsername,
        voter_ip_hash: ipHash,
        user_agent_hash: crypto.createHash('sha256').update(req.headers['user-agent'] || 'unknown').digest('hex')
      })
      .select()
      .single()

    if (voteError) {
      return res.status(500).json({ error: 'Failed to record vote' })
    }

    const votifierResult = await sendToVotifier(server, minecraftUsername, clientIP.toString())

    await supabase
      .from('votes')
      .update({
        votifier_sent: votifierResult.success,
        votifier_response: votifierResult.response,
        plugin_notified: votifierResult.success,
        processed_at: new Date().toISOString()
      })
      .eq('id', vote.id)

    await updateServerVoteStats(supabase, serverId)

    res.status(200).json({
      success: true,
      message: 'Vote recorded successfully',
      voteId: vote.id,
      pluginNotified: votifierResult.success,
      nextVoteTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    })

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

async function sendToVotifier(server: any, username: string, voterIP: string) {
  try {
    if (!server.votifier_host || !server.votifier_port || !server.votifier_public_key) {
      return { success: false, response: 'Votifier not configured' }
    }

    const net = await import('net')
    const cryptoMod = await import('crypto')

    const payloadString = `VOTE\nMineVote\n${username}\n${voterIP}\n${Date.now().toString()}\n`

    const encryptedPayload = cryptoMod.publicEncrypt({
      key: server.votifier_public_key,
      padding: cryptoMod.constants.RSA_PKCS1_PADDING
    }, Buffer.from(payloadString))

    return await new Promise<{ success: boolean; response: string }>((resolve) => {
      const socket = new (net as any).Socket()
      socket.setTimeout(5000)
      socket.connect(server.votifier_port, server.votifier_host, () => {
        socket.write(encryptedPayload)
      })
      socket.on('data', (data: Buffer) => { socket.destroy(); resolve({ success: true, response: data.toString() }) })
      socket.on('error', (err: Error) => { socket.destroy(); resolve({ success: false, response: err.message }) })
      socket.on('timeout', () => { socket.destroy(); resolve({ success: false, response: 'Connection timeout' }) })
    })
  } catch (error: any) {
    return { success: false, response: error?.message || 'Unknown error' }
  }
}

async function updateServerVoteStats(supabase: any, serverId: string) {
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const { data: daily } = await supabase.from('votes').select('id').eq('server_id', serverId).gte('created_at', `${today}T00:00:00.000Z`)
  const { data: weekly } = await supabase.from('votes').select('id').eq('server_id', serverId).gte('created_at', new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString())
  const { data: monthly } = await supabase.from('votes').select('id').eq('server_id', serverId).gte('created_at', new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString())
  const { data: total } = await supabase.from('votes').select('id').eq('server_id', serverId)

  await supabase.from('servers').update({
    daily_votes: daily?.length || 0,
    weekly_votes: weekly?.length || 0,
    monthly_votes: monthly?.length || 0,
    total_votes: total?.length || 0,
    last_vote: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }).eq('id', serverId)
}

async function verifyCaptcha(token: string, clientIP: string): Promise<boolean> {
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}&remoteip=${clientIP}`
    })
    const data = await response.json()
    return data.success === true
  } catch {
    return false
  }
}


