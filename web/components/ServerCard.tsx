import React, { useState } from 'react'
import { VoteModal } from './VoteModal'

interface Server {
  id: string
  name: string
  description: string
  ip_address: string
  port: number
  categories: string[]
  current_players: number
  max_players: number
  total_votes: number
  daily_votes: number
  status: 'online' | 'offline' | 'unknown'
  banner_url?: string
  premium: boolean
}

export function ServerCard({ server, rank }: { server: Server; rank: number }) {
  const [showVoteModal, setShowVoteModal] = useState(false)

  const handleCopyIP = async () => {
    const ip = `${server.ip_address}:${server.port}`
    try { await navigator.clipboard.writeText(ip) } catch {}
  }

  return (
    <>
      <div className={`relative rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur p-0 transition hover:-translate-y-1 hover:shadow-lg ${server.premium ? 'ring-2 ring-yellow-400' : ''}`}>
        {/* Rank */}
        <div className="absolute top-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded">#{rank}</div>

        {/* Banner */}
        <div className="relative h-32">
          {server.banner_url ? (
            <img src={server.banner_url} alt={server.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{server.name.charAt(0)}</span>
            </div>
          )}
          <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {server.status === 'online' ? '🟢 online' : server.status === 'offline' ? '🔴 offline' : '🟡 unknown'}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <h3 className="text-lg font-semibold truncate">{server.name}</h3>
          <p className="text-sm text-gray-300 line-clamp-2">{server.description}</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1"><span>👥</span><span>{server.current_players}/{server.max_players}</span></div>
            <div className="flex items-center gap-1"><span>🗳️</span><span>{server.total_votes.toLocaleString()} oy</span></div>
          </div>
          <div className="flex flex-wrap gap-1">
            {server.categories.slice(0,3).map((c) => (
              <span key={c} className="text-xs border border-white/10 rounded px-2 py-0.5">{c}</span>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="flex-1 py-2 rounded bg-emerald-600 disabled:opacity-50" onClick={() => setShowVoteModal(true)} disabled={server.status !== 'online'}>🗳️ Oy Ver</button>
            <button className="px-3 py-2 rounded border border-white/10" onClick={handleCopyIP}>📋</button>
          </div>
          {server.daily_votes > 0 && (<div className="text-center text-xs text-gray-400">Bugün {server.daily_votes} oy aldı</div>)}
        </div>
      </div>

      <VoteModal server={server} isOpen={showVoteModal} onClose={() => setShowVoteModal(false)} onVoteSuccess={() => {}} />
    </>
  )
}


