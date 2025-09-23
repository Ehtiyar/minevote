import React, { useState } from 'react'
import { CATEGORY_OPTIONS } from '../lib/categories'

interface FilterOptions {
  category: string
  status: string
  sortBy: string
  searchTerm: string
  minPlayers: number
  maxPlayers: number
  premiumOnly: boolean
}

interface FilterSidebarProps {
  onFilterChange: (filters: FilterOptions) => void
  initialFilters?: Partial<FilterOptions>
}

const categories = [{ value: 'all', label: '🏠 Tümü' }, ...CATEGORY_OPTIONS.map(c => ({ value: c.slug, label: `${c.emoji ? c.emoji + ' ' : ''}${c.label}` }))]

const sortOptions = [
  { value: 'votes', label: '📈 En Çok Oy Alan' },
  { value: 'players', label: '👥 En Kalabalık' },
  { value: 'newest', label: '🆕 En Yeni' },
  { value: 'alphabetical', label: '🔤 Alfabetik' },
  { value: 'premium', label: '💎 Premium Önce' }
]

export function FilterSidebar({ onFilterChange, initialFilters = {} }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
    status: 'all',
    sortBy: 'votes',
    searchTerm: '',
    minPlayers: 0,
    maxPlayers: 1000,
    premiumOnly: false,
    ...initialFilters
  })

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const defaultFilters = {
      category: 'all',
      status: 'all',
      sortBy: 'votes',
      searchTerm: '',
      minPlayers: 0,
      maxPlayers: 1000,
      premiumOnly: false
    }
    setFilters(defaultFilters)
    onFilterChange(defaultFilters)
  }

  return (
    <div className="w-full bg-gray-800 rounded-lg p-6 h-fit">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">🔍 Filtreler</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Temizle
        </button>
      </div>

      <div className="space-y-6">
        {/* Arama */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            🔍 Sunucu Ara
          </label>
          <input
            type="text"
            placeholder="Sunucu adı, IP, kategori..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            🏷️ Kategori
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categories.map((category) => (
              <label key={category.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value={category.value}
                  checked={filters.category === category.value}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">{category.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Durum */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            🟢 Durum
          </label>
          <div className="space-y-2">
            {[
              { value: 'all', label: 'Tümü' },
              { value: 'online', label: '🟢 Online' },
              { value: 'offline', label: '🔴 Offline' }
            ].map((status) => (
              <label key={status.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={status.value}
                  checked={filters.status === status.value}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">{status.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Oyuncu Sayısı */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            👥 Oyuncu Sayısı
          </label>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Minimum</label>
              <input
                type="number"
                min="0"
                max="1000"
                value={filters.minPlayers}
                onChange={(e) => handleFilterChange('minPlayers', parseInt(e.target.value) || 0)}
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Maksimum</label>
              <input
                type="number"
                min="0"
                max="1000"
                value={filters.maxPlayers}
                onChange={(e) => handleFilterChange('maxPlayers', parseInt(e.target.value) || 1000)}
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
              />
            </div>
          </div>
        </div>

        {/* Premium */}
        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.premiumOnly}
              onChange={(e) => handleFilterChange('premiumOnly', e.target.checked)}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-300">💎 Sadece Premium</span>
          </label>
        </div>

        {/* Sıralama */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            📊 Sıralama
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Aktif Filtreler */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Aktif Filtreler</h4>
        <div className="flex flex-wrap gap-2">
          {filters.category !== 'all' && (
            <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
              {categories.find(c => c.value === filters.category)?.label}
            </span>
          )}
          {filters.status !== 'all' && (
            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">
              {filters.status === 'online' ? '🟢 Online' : '🔴 Offline'}
            </span>
          )}
          {filters.premiumOnly && (
            <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded">
              💎 Premium
            </span>
          )}
          {filters.minPlayers > 0 && (
            <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded">
              Min: {filters.minPlayers}
            </span>
          )}
          {filters.maxPlayers < 1000 && (
            <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded">
              Max: {filters.maxPlayers}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
