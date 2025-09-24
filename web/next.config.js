/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['bcrypt', 'canvas', 'sqlite3', 'minecraft-server-util', 'discord.js', 'styled-components', 'cookie']
  },
  compiler: {
    styledComponents: true
  },
  webpack: (config, { isServer, isEdge }) => {
    // Handle native modules for server-side rendering
    if (isServer && !isEdge) {
      config.externals.push('bcrypt', 'canvas', 'sqlite3', 'minecraft-server-util', 'discord.js', 'styled-components', 'cookie');
    }
    
    // For edge runtime, completely exclude native modules
    if (isEdge) {
      config.externals = config.externals || [];
      config.externals.push('bcrypt', 'canvas', 'sqlite3', 'minecraft-server-util', 'discord.js', 'styled-components', 'cookie');
    }
    
    // Handle optional dependencies gracefully
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'bcrypt': false,
      'discord.js': false,
      'canvas': false,
      'sqlite3': false,
      'minecraft-server-util': false,
      'styled-components': false,
      'cookie': false
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