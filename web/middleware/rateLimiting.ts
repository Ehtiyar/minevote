import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

interface RateLimit { requests: number; windowMs: number; message: string }
const rateLimits: Record<string, RateLimit> = {
  vote: { requests: 1, windowMs: 24 * 60 * 60 * 1000, message: 'Only 1 vote per day allowed' },
  api: { requests: 100, windowMs: 60 * 1000, message: 'Too many requests' },
  search: { requests: 30, windowMs: 60 * 1000, message: 'Search rate limit exceeded' }
}

export function rateLimit(type: keyof typeof rateLimits) {
  return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    const limit = rateLimits[type]
    const clientIP = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown'
    const key = `ratelimit:${type}:${clientIP}`
    const now = Date.now()

    try {
      // Supabase'de rate limiting için basit bir tablo kullanabilirsiniz
      const { data, error } = await supabase
        .from('rate_limits')
        .select('*')
        .eq('key', key)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Rate limit check error:', error)
        next() // allow on error
        return
      }

      if (!data) {
        // İlk istek
        await supabase
          .from('rate_limits')
          .insert({
            key,
            count: 1,
            expires_at: new Date(now + limit.windowMs).toISOString()
          })
        next()
        return
      }

      if (new Date(data.expires_at) < new Date()) {
        // Süre dolmuş, sıfırla
        await supabase
          .from('rate_limits')
          .update({
            count: 1,
            expires_at: new Date(now + limit.windowMs).toISOString()
          })
          .eq('key', key)
        next()
        return
      }

      if (data.count >= limit.requests) {
        const retryAfter = Math.ceil((new Date(data.expires_at).getTime() - now) / 1000)
        return res.status(429).json({ error: limit.message, retryAfter })
      }

      // Sayacı artır
      await supabase
        .from('rate_limits')
        .update({ count: data.count + 1 })
        .eq('key', key)

      next()
    } catch (error) {
      console.error('Rate limiting error:', error)
      next() // allow on error
    }
  }
}


