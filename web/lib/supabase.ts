import { createClient } from '@supabase/supabase-js'

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Auth helper functions
export const auth = {
  // Sign up with email and password
  async signUp(email: string, password: string, metadata?: any) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { data, error }
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign in with Discord
  async signInWithDiscord() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Listen to auth changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helper functions
export const db = {
  // Profiles
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  async createProfile(profile: any) {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single()
    return { data, error }
  },

  async updateProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },

  // Servers
  async getServers() {
    const { data, error } = await supabase
      .from('servers')
      .select(`
        *,
        owner:profiles!servers_owner_id_fkey(username, mc_nick)
      `)
      .order('total_votes', { ascending: false })
    return { data, error }
  },

  async getServer(serverId: string) {
    const { data, error } = await supabase
      .from('servers')
      .select(`
        *,
        owner:profiles!servers_owner_id_fkey(username, mc_nick)
      `)
      .eq('id', serverId)
      .single()
    return { data, error }
  },

  async createServer(server: any) {
    const { data, error } = await supabase
      .from('servers')
      .insert(server)
      .select()
      .single()
    return { data, error }
  },

  // Votes
  async vote(serverId: string, userId: string) {
    const { data, error } = await supabase
      .from('votes')
      .insert({
        server_id: serverId,
        user_id: userId
      })
      .select()
      .single()
    return { data, error }
  },

  async getUserVotes(userId: string) {
    const { data, error } = await supabase
      .from('votes')
      .select(`
        *,
        server:servers!votes_server_id_fkey(name, ip_address, port)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async hasVotedToday(serverId: string, userId: string) {
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('votes')
      .select('id')
      .eq('server_id', serverId)
      .eq('user_id', userId)
      .gte('created_at', today)
      .single()
    return { data: !!data, error }
  }
}