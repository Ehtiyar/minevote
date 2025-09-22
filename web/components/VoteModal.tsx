import React, { useState } from 'react'

interface Server {
  id: string
  name: string
  ip_address: string
  port: number
  banner_url?: string
  total_votes: number
}

interface VoteModalProps {
  server: Server
  isOpen: boolean
  onClose: () => void
  onVoteSuccess: () => void
}

export function VoteModal({ server, isOpen, onClose, onVoteSuccess }: VoteModalProps) {
  const [minecraftUsername, setMinecraftUsername] = useState('')
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleVoteSubmit = async () => {
    try {
      setIsSubmitting(true)
      setError(null)

      if (!minecraftUsername.trim()) {
        setError('Minecraft kullanıcı adınızı girin')
        return
      }
      if (!/^[a-zA-Z0-9_]{3,16}$/.test(minecraftUsername)) {
        setError('Geçersiz Minecraft kullanıcı adı (3-16 karakter, harf/rakam/alt çizgi)')
        return
      }
      if (!captchaToken) {
        setError('Lütfen CAPTCHA\'yı tamamlayın')
        return
      }

      const response = await fetch('/api/vote/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serverId: server.id, minecraftUsername, captchaToken })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Vote submission failed')

      setSuccess('Oyunuz başarıyla kaydedildi!')
      onVoteSuccess()
      setTimeout(() => { onClose(); setSuccess(null); setMinecraftUsername(''); setCaptchaToken(null) }, 1500)
    } catch (err: any) {
      setError(err?.message || 'Bir hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-gray-900 border border-white/10 rounded-xl p-4 w-full max-w-md">
        <button onClick={onClose} className="absolute right-3 top-3 text-gray-400 hover:text-white">✖</button>
        <div className="flex items-center gap-3 mb-3">
          {server.banner_url ? (
            <img src={server.banner_url} alt={server.name} className="w-12 h-12 rounded object-cover" />
          ) : (
            <div className="w-12 h-12 rounded bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
              {server.name.charAt(0)}
            </div>
          )}
          <div>
            <div className="font-semibold">{server.name}</div>
            <div className="text-xs text-gray-400">{server.ip_address}:{server.port}</div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Minecraft Kullanıcı Adı</label>
            <input
              type="text"
              className="w-full rounded-md bg-gray-800 border border-white/10 p-2 outline-none"
              value={minecraftUsername}
              onChange={(e) => setMinecraftUsername(e.target.value)}
              maxLength={16}
            />
            <p className="text-xs text-gray-500 mt-1">Ödüllerin gönderileceği oyun içi kullanıcı adınız</p>
          </div>

          {/* Placeholder CAPTCHA */}
          <div className="bg-gray-800 border border-white/10 rounded-md p-3 text-center">
            <button
              className="px-3 py-1 text-sm bg-blue-600 rounded"
              onClick={() => setCaptchaToken('mock')}>
              reCAPTCHA (mock)
            </button>
          </div>

          {error && <div className="text-sm text-red-400">{error}</div>}
          {success && <div className="text-sm text-green-400">{success}</div>}

          <button
            onClick={handleVoteSubmit}
            disabled={isSubmitting || !captchaToken || !minecraftUsername.trim()}
            className="w-full py-2 rounded-md bg-emerald-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Oy Veriliyor...' : '🗳️ Oy Ver!'}
          </button>
          <div className="text-xs text-gray-500 text-center">Her sunucuya günde bir kez oy verebilirsiniz</div>
        </div>
      </div>
    </div>
  )
}


