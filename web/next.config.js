/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['bcrypt', 'canvas', 'sqlite3', 'minecraft-server-util', 'discord.js', 'styled-components']
  },
  compiler: {
    styledComponents: true
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('bcrypt', 'canvas', 'sqlite3', 'minecraft-server-util', 'discord.js', 'styled-components');
    }
    // Handle optional dependencies gracefully
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'discord.js': false,
      'canvas': false,
      'sqlite3': false,
      'minecraft-server-util': false,
      'styled-components': false
    };
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