import { createClient } from '@supabase/supabase-js'

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const serviceKey = process.env.SUPABASE_SERVICE_KEY as string
  if (!url || !serviceKey) {
    throw new Error('Supabase environment variables are missing')
  }
  return createClient(url, serviceKey)
}


