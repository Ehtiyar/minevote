export interface LinkConfig {
  href: string
  label: string
  icon?: string
  external?: boolean
}

export const navigationLinks: LinkConfig[] = [
  { href: '/', label: 'Ana Sayfa', icon: '🏠' },
  { href: '/servers', label: 'Sunucular', icon: '🎯' },
  { href: '/servers?sort=votes', label: 'Popüler', icon: '⭐' },
  { href: '/servers', label: 'Sıralamalar', icon: '📊' },
  { href: '/contact', label: 'İletişim', icon: '📞' },
]

export const quickAccessLinks: LinkConfig[] = [
  { href: '/add', label: 'Sunucu Ekle', icon: '➕' },
  { href: '/api-docs', label: 'API Dokümantasyon', icon: '📚' },
  { href: '/help', label: 'Yardım', icon: '❓' },
  { href: '/contact', label: 'İletişim', icon: '📞' },
]

export const legalLinks: LinkConfig[] = [
  { href: '/privacy-policy', label: 'Gizlilik Politikası' },
  { href: '/terms-of-use', label: 'Kullanım Şartları' },
]

export const socialLinks: LinkConfig[] = [
  { 
    href: 'https://facebook.com/minevote', 
    label: 'Facebook', 
    icon: '📘',
    external: true 
  },
  { 
    href: 'https://twitter.com/minevote', 
    label: 'Twitter', 
    icon: '🐦',
    external: true 
  },
  { 
    href: 'https://discord.gg/minevote', 
    label: 'Discord', 
    icon: '💬',
    external: true 
  },
]
