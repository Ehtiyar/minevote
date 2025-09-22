# MineVote Web

Minecraft server voting platform built with Next.js and Supabase.

## Features

- User authentication (email/password + Discord OAuth)
- Server voting system
- User profiles with Minecraft integration
- Server management for owners
- Responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Auth + Database)
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 18+
- npm 8+
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

Run the SQL migrations in your Supabase project:

1. Go to Supabase Dashboard > SQL Editor
2. Run the migration files in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_fix_votes_table.sql`
   - `supabase/migrations/003_complete_setup.sql`
   - `supabase/migrations/004_safe_migration.sql`

## Deployment

### Netlify

1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push

### Environment Variables

Make sure to set these in your deployment platform:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Project Structure

```
web/
├── components/          # React components
├── contexts/           # React contexts (Auth)
├── lib/               # Utility functions
├── pages/             # Next.js pages
├── styles/            # CSS files
├── supabase/          # Database migrations
└── public/            # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License