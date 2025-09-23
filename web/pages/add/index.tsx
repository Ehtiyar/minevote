import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { CATEGORY_OPTIONS, normalizeCategories, getLabelBySlug, toSlug } from '../../lib/categories'

interface ServerFormData {
  name: string
  ip_address: string
  port: string
  description: string
  website_url: string
  discord_url: string
  categories: string[]
}

const CATEGORIES = CATEGORY_OPTIONS

export default function AddServer() {
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const [formData, setFormData] = useState<ServerFormData>({
    name: '',
    ip_address: '',
    port: '25565',
    description: '',
    website_url: '',
    discord_url: '',
    categories: []
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
      return
    }

    setLoading(false)
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const { data, error } = await supabase
        .from('servers')
        .insert({
          owner_id: user?.id,
          name: formData.name,
          ip_address: formData.ip_address,
          port: parseInt(formData.port),
          description: formData.description,
          website_url: formData.website_url || null,
          discord_url: formData.discord_url || null,
          categories: normalizeCategories(formData.categories.map(toSlug)),
        })
        .select()
        .single()

      if (error) {
        setError(error.message)
      } else {
        setSuccess('Sunucunuz başarıyla eklendi!')
        // Reset form
        setFormData({
          name: '',
          ip_address: '',
          port: '25565',
          description: '',
          website_url: '',
          discord_url: '',
          categories: []
        })
        // Redirect to server page after 2 seconds
        setTimeout(() => {
          router.push(`/servers/${data.id}`)
        }, 2000)
      }
    } catch (error) {
      setError('Sunucu eklenirken bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-white">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Head>
        <title>Sunucu Ekle - MineVote</title>
        <meta name="description" content="Minecraft sunucunuzu MineVote'a ekleyin" />
      </Head>

      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link href="/" className="flex items-center space-x-2 text-emerald-400 text-xl font-bold">
                <img src="/assets/img/grass-block.png" className="w-8 h-8" alt="MineVote" />
                <span>MineVote</span>
              </Link>
              
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-gray-300 hover:text-white">
                  Dashboard
                </Link>
                <Link href="/servers" className="text-gray-300 hover:text-white">
                  Sunucular
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Sunucu Ekle</h1>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg mb-6">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Server Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Sunucu Adı *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Sunucunuzun adını girin"
                  required
                />
              </div>

              {/* IP Address and Port */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ip_address" className="block text-sm font-medium text-gray-300 mb-2">
                    IP Adresi *
                  </label>
                  <input
                    type="text"
                    id="ip_address"
                    value={formData.ip_address}
                    onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="play.example.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="port" className="block text-sm font-medium text-gray-300 mb-2">
                    Port
                  </label>
                  <input
                    type="number"
                    id="port"
                    value={formData.port}
                    onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="25565"
                    min="1"
                    max="65535"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Açıklama *
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Sunucunuz hakkında detaylı bilgi verin..."
                  required
                />
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Kategoriler
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {CATEGORIES.map((category) => (
                    <label key={category.slug} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(getLabelBySlug(category.slug)) || formData.categories.includes(category.slug)}
                        onChange={() => handleCategoryToggle(getLabelBySlug(category.slug))}
                        className="rounded border-gray-600 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-gray-300 text-sm">{category.emoji ? category.emoji + ' ' : ''}{category.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Website URL */}
              <div>
                <label htmlFor="website_url" className="block text-sm font-medium text-gray-300 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  id="website_url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="https://example.com"
                />
              </div>

              {/* Discord URL */}
              <div>
                <label htmlFor="discord_url" className="block text-sm font-medium text-gray-300 mb-2">
                  Discord URL
                </label>
                <input
                  type="url"
                  id="discord_url"
                  value={formData.discord_url}
                  onChange={(e) => setFormData({ ...formData, discord_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="https://discord.gg/example"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Link
                  href="/servers"
                  className="px-6 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700"
                >
                  İptal
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Ekleniyor...' : 'Sunucuyu Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
