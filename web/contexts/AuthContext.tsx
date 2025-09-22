import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, auth, db } from '../lib/supabase'

interface Profile {
  id: string
  username: string
  mc_nick: string
  bio?: string
  discord_id?: string
  avatar_url?: string
  total_votes: number
  xp: number
  level: number
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signUp: (email: string, password: string, metadata?: any) => Promise<{ data: any; error: any }>
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signInWithDiscord: () => Promise<{ data: any; error: any }>
  signOut: () => Promise<{ error: any }>
  updateProfile: (updates: Partial<Profile>) => Promise<{ data: any; error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { session } = await auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await loadProfile(session.user.id)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await loadProfile(session.user.id)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await db.getProfile(userId)
      
      if (error) {
        console.error('Profile load error:', error)
        // Create profile if it doesn't exist
        await createProfile(userId)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Profile load error:', error)
    }
  }

  const createProfile = async (userId: string) => {
    try {
      const { data: userData } = await auth.getCurrentUser()
      if (!userData.user) return

      const profileData = {
        id: userId,
        username: userData.user.user_metadata?.username || userData.user.email?.split('@')[0] || 'User',
        mc_nick: userData.user.user_metadata?.mc_nick || '',
        bio: '',
        discord_id: userData.user.user_metadata?.discord_id || null,
        total_votes: 0,
        xp: 0,
        level: 1
      }

      const { data, error } = await db.createProfile(profileData)
      if (error) {
        console.error('Profile creation error:', error)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Profile creation error:', error)
    }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    const result = await auth.signUp(email, password, metadata)
    return result
  }

  const signIn = async (email: string, password: string) => {
    const result = await auth.signIn(email, password)
    return result
  }

  const signInWithDiscord = async () => {
    const result = await auth.signInWithDiscord()
    return result
  }

  const signOut = async () => {
    const result = await auth.signOut()
    setProfile(null)
    return result
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { data: null, error: new Error('No user logged in') }
    
    const result = await db.updateProfile(user.id, updates)
    if (result.data) {
      setProfile(result.data)
    }
    return result
  }

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signInWithDiscord,
    signOut,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}