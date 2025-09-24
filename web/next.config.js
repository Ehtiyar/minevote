/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['bcrypt', 'canvas', 'sqlite3', 'minecraft-server-util']
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('bcrypt', 'canvas', 'sqlite3', 'minecraft-server-util');
    }
    return config;
  },
  images: {
    domains: ['minotar.net', 'via.placeholder.com'],
    unoptimized: true
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  }
}

module.exports = nextConfig