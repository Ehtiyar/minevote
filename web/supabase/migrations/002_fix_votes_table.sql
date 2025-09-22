-- Fix votes table for existing schema
-- This migration handles the existing votes table structure

-- 1) Add user_id column if it doesn't exist
ALTER TABLE votes
  ADD COLUMN IF NOT EXISTS user_id uuid;

-- 2) Add foreign key constraint if it doesn't exist
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

-- 3) Drop existing unique index if it exists (to avoid conflicts)
DROP INDEX IF EXISTS idx_votes_user_server_day;

-- 4) Create proper unique indexes for daily vote limits
-- For authenticated users (user_id is not null) - using DATE() function
CREATE UNIQUE INDEX IF NOT EXISTS votes_unique_user_per_day
  ON votes (user_id, server_id, DATE(created_at))
  WHERE user_id IS NOT NULL;

-- For guest users (user_id is null) - using IP hash
CREATE UNIQUE INDEX IF NOT EXISTS votes_unique_ip_per_day
  ON votes (voter_ip_hash, server_id, DATE(created_at))
  WHERE user_id IS NULL;

-- 5) Add useful indexes for performance
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_server_id ON votes(server_id);
CREATE INDEX IF NOT EXISTS idx_votes_created_at ON votes(created_at);

-- 6) Update existing vote counts in profiles table (only if profiles table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
    UPDATE profiles 
    SET total_votes = (
      SELECT COUNT(*) 
      FROM votes 
      WHERE votes.user_id = profiles.id
    );
  END IF;
END $$;
