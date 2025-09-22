MineVote Web (Next.js + Supabase)

Setup

1. Copy .env:
   - Create a .env.local with keys from .env.example:
     - NEXT_PUBLIC_SUPABASE_URL
     - NEXT_PUBLIC_SUPABASE_ANON_KEY
     - SUPABASE_SERVICE_KEY
     - RECAPTCHA_SECRET_KEY, NEXT_PUBLIC_RECAPTCHA_SITE_KEY
     - REDIS_URL (optional)

2. Install dependencies:
   npm install

3. Dev:
   npm run dev

Supabase SQL

Run the schema in Supabase SQL editor. See /supabase/schema.sql (create this file) for tables: servers, votes, vote_statistics, server_ping_history, user_accounts.

Netlify Deploy

- Site settings:
  - Build command: npm run build
  - Publish directory: .next
  - Node version: 18 (set in netlify.toml)
- Add environment variables in Netlify UI (.env.local values)
- Install plugin automatically via netlify.toml: @netlify/plugin-nextjs


