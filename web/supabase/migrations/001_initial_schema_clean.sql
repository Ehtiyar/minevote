-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
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

-- Create servers table
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

-- Note: votes table already exists, we'll modify it in the next migration

-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  xp_required INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_mc_nick ON profiles(mc_nick);
CREATE INDEX IF NOT EXISTS idx_servers_owner_id ON servers(owner_id);
CREATE INDEX IF NOT EXISTS idx_servers_total_votes ON servers(total_votes DESC);
CREATE INDEX IF NOT EXISTS idx_servers_status ON servers(status);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_servers_updated_at BEFORE UPDATE ON servers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default badges
INSERT INTO badges (name, description, icon, xp_required) VALUES
('Yeni Oyuncu', 'İlk oyunuzu verdiniz!', '🎖️', 0),
('Aktif Oy Veren', '10 oy verdiniz', '🏆', 100),
('Sadık Oyuncu', '50 oy verdiniz', '💎', 500),
('Sunucu Sahibi', 'İlk sunucunuzu eklediniz', '👑', 200),
('Popüler Sunucu', 'Sunucunuz 100 oy aldı', '⭐', 1000),
('Topluluk Lideri', 'Sunucunuz 500 oy aldı', '🌟', 2500)
ON CONFLICT (name) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles: Users can read all profiles, but only update their own
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Servers: Everyone can read, only owners can modify
CREATE POLICY "Servers are viewable by everyone" ON servers
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own servers" ON servers
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own servers" ON servers
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own servers" ON servers
  FOR DELETE USING (auth.uid() = owner_id);

-- Votes: Users can vote, can't see others' votes
CREATE POLICY "Users can insert their own votes" ON votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own votes" ON votes
  FOR SELECT USING (auth.uid() = user_id);

-- Badges: Everyone can read
CREATE POLICY "Badges are viewable by everyone" ON badges
  FOR SELECT USING (true);

-- User badges: Users can view their own badges
CREATE POLICY "Users can view their own badges" ON user_badges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert user badges" ON user_badges
  FOR INSERT WITH CHECK (true);
