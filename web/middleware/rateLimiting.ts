import { NextApiRequest, NextApiResponse } from 'next'

interface RateLimitConfig {
  windowMs: number
  max: number
  message: string
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export function rateLimit(config: RateLimitConfig) {
  return (req: NextApiRequest, res: NextApiResponse, next?: () => void) => {
    const key = getKey(req)
    const now = Date.now()
    const windowMs = config.windowMs
    const max = config.max

    // Clean up expired entries
    Object.keys(store).forEach(k => {
      if (store[k].resetTime < now) {
        delete store[k]
      }
    })

    // Get or create entry
    if (!store[key]) {
      store[key] = {
        count: 0,
        resetTime: now + windowMs
      }
    }

    const entry = store[key]

    // Check if window has expired
    if (now > entry.resetTime) {
      entry.count = 0
      entry.resetTime = now + windowMs
    }

    // Increment counter
    entry.count++

    // Check if limit exceeded
    if (entry.count > max) {
      res.setHeader('Retry-After', Math.ceil((entry.resetTime - now) / 1000))
      res.setHeader('X-RateLimit-Limit', max.toString())
      res.setHeader('X-RateLimit-Remaining', '0')
      res.setHeader('X-RateLimit-Reset', entry.resetTime.toString())
      
      return res.status(429).json({
        error: config.message,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000)
      })
    }

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', max.toString())
    res.setHeader('X-RateLimit-Remaining', (max - entry.count).toString())
    res.setHeader('X-RateLimit-Reset', entry.resetTime.toString())

    if (next) {
      next()
    }
  }
}

function getKey(req: NextApiRequest): string {
  // Use IP address as key
  const forwarded = req.headers['x-forwarded-for']
  const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded || req.socket.remoteAddress || 'unknown'
  return `rate_limit:${ip}`
}

// Predefined rate limiters
export const voteRateLimit = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 1, // 1 vote per day per IP
  message: 'Günde sadece bir kez oy verebilirsiniz'
})

export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: 'Çok fazla istek gönderdiniz. Lütfen bekleyin.'
})

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 auth attempts per 15 minutes
  message: 'Çok fazla giriş denemesi. Lütfen bekleyin.'
})