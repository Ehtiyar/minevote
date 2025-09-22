import type { NextApiRequest, NextApiResponse } from 'next'
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL || '')

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

    try {
      const current = await redis.incr(key)
      if (current === 1) await redis.expire(key, Math.ceil(limit.windowMs / 1000))
      if (current > limit.requests) {
        const ttl = await redis.ttl(key)
        return res.status(429).json({ error: limit.message, retryAfter: ttl })
      }
      next()
    } catch (error) {
      next() // allow on redis failure
    }
  }
}


