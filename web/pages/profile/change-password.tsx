import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Yeni şifreler eşleşmiyor')
      setLoading(false)
      return
    }

    if (formData.newPassword.length < 8) {
      setError('Yeni şifre en az 8 karakter olmalı')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        if (mounted) {
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        }
      }
    } catch (err) {
      setError('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  if (!user) {
    if (mounted) {
      router.push('/auth/login')
    }
    return null
  }

  return (
    <>
      <Head>
        <title>Şifre Değiştir - MineVote</title>
        <meta name="description" content="MineVote şifre değiştirme" />
      </Head>

      <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href="/dashboard" className="inline-flex items-center space-x-2 text-emerald-400 text-2xl font-bold">
              <img src="/assets/img/grass-block.png" className="w-8 h-8" alt="MineVote" />
              <span>MineVote</span>
            </Link>
            <h2 className="mt-6 text-3xl font-extrabold text-white">
              Şifre Değiştir
            </h2>
          </div>

          <div className="mt-8 space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg">
                Şifre başarıyla değiştirildi! Dashboard'a yönlendiriliyorsunuz...
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Yeni Şifre *
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Yeni şifrenizi girin (en az 8 karakter)"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Yeni Şifre Tekrar *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Yeni şifrenizi tekrar girin"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Şifre değiştiriliyor...' : 'Şifre Değiştir'}
                </button>
              </div>
            </form>

            <div className="text-center">
              <Link href="/dashboard" className="text-emerald-400 hover:text-emerald-300">
                ← Dashboard'a Dön
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
