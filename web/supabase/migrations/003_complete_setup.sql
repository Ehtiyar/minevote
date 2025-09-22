-- Complete MineVote setup migration
-- This handles all tables and relationships safely

-- 1) Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2) Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  mc_nick TEXT NOT NULL,
  bio TEXT,
  discord_id TEXT,
  avatar_url TEXT,
  total_votes INTEGER DEFAULT 0,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3) Create servers table
CREATE TABLE IF NOT EXISTS servers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  port INTEGER DEFAULT 25565,
  description TEXT,
  banner_url TEXT,
  website_url TEXT,
  discord_url TEXT,
  categories TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'unknown')),
  current_players INTEGER DEFAULT 0,
  max_players INTEGER DEFAULT 0,
  total_votes INTEGER DEFAULT 0,
  daily_votes INTEGER DEFAULT 0,
  weekly_votes INTEGER DEFAULT 0,
  monthly_votes INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  premium BOOLEAN DEFAULT FALSE,
  premium_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4) Modify existing votes table to add user_id
ALTER TABLE votes
  ADD COLUMN IF NOT EXISTS user_id uuid;

-- 5) Add foreign key constraint for votes.user_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'votes_user_id_fkey'
  ) THEN
    ALTER TABLE votes
      ADD CONSTRAINT votes_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 6) Create badges table
CREATE TABLE IF NOT EXISTS badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  xp_required INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7) Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- 8) Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_mc_nick ON profiles(mc_nick);
CREATE INDEX IF NOT EXISTS idx_servers_owner_id ON servers(owner_id);
CREATE INDEX IF NOT EXISTS idx_servers_total_votes ON servers(total_votes DESC);
CREATE INDEX IF NOT EXISTS idx_servers_status ON servers(status);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_server_id ON votes(server_id);
CREATE INDEX IF NOT EXISTS idx_votes_created_at ON votes(created_at);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);

-- 9) Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 10) Add updated_at triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_servers_updated_at ON servers;
CREATE TRIGGER update_servers_updated_at BEFORE UPDATE ON servers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11) Insert default badges
INSERT INTO badges (name, description, icon, xp_required) VALUES
('Yeni Oyuncu', 'İlk oyunuzu verdiniz!', '🎖️', 0),
('Aktif Oy Veren', '10 oy verdiniz', '🏆', 100),
('Sadık Oyuncu', '50 oy verdiniz', '💎', 500),
('Sunucu Sahibi', 'İlk sunucunuzu eklediniz', '👑', 200),
('Popüler Sunucu', 'Sunucunuz 100 oy aldı', '⭐', 1000),
('Topluluk Lideri', 'Sunucunuz 500 oy aldı', '🌟', 2500)
ON CONFLICT (name) DO NOTHING;

-- 12) Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- 13) Create RLS policies
-- Profiles: Users can read all profiles, but only update their own
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Servers: Everyone can read, only owners can modify
DROP POLICY IF EXISTS "Servers are viewable by everyone" ON servers;
CREATE POLICY "Servers are viewable by everyone" ON servers
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own servers" ON servers;
CREATE POLICY "Users can insert their own servers" ON servers
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can update their own servers" ON servers;
CREATE POLICY "Users can update their own servers" ON servers
  FOR UPDATE USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can delete their own servers" ON servers;
CREATE POLICY "Users can delete their own servers" ON servers
  FOR DELETE USING (auth.uid() = owner_id);

-- Votes: Users can vote, can't see others' votes
DROP POLICY IF EXISTS "Users can insert their own votes" ON votes;
CREATE POLICY "Users can insert their own votes" ON votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own votes" ON votes;
CREATE POLICY "Users can view their own votes" ON votes
  FOR SELECT USING (auth.uid() = user_id);

-- Badges: Everyone can read
DROP POLICY IF EXISTS "Badges are viewable by everyone" ON badges;
CREATE POLICY "Badges are viewable by everyone" ON badges
  FOR SELECT USING (true);

-- User badges: Users can view their own badges
DROP POLICY IF EXISTS "Users can view their own badges" ON user_badges;
CREATE POLICY "Users can view their own badges" ON user_badges
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can insert user badges" ON user_badges;
CREATE POLICY "System can insert user badges" ON user_badges
  FOR INSERT WITH CHECK (true);
