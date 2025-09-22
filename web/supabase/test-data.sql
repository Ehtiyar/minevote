-- Test data for MineVote servers
-- Run this in Supabase SQL Editor

INSERT INTO servers (
  name, 
  description, 
  ip_address, 
  port, 
  categories, 
  tags,
  current_players, 
  max_players, 
  total_votes, 
  daily_votes,
  status, 
  premium, 
  featured,
  banner_url,
  voting_enabled
) VALUES 
(
  'AwesomeCraft Network',
  'En eğlenceli survival deneyimi! Ekonomi, job sistemi, özel eventler ve aktif topluluk.',
  'play.awesomecraft.net',
  25565,
  ARRAY['Survival', 'Economy', 'PvP'],
  ARRAY['1.19.4', 'Turkish', 'Active'],
  248,
  500,
  1247,
  23,
  'online',
  true,
  true,
  '/assets/img/server-banner.jpg',
  true
),
(
  'MineWorld',
  'Türkiye''nin en büyük Minecraft sunucusu! Skyblock, Prison, Creative ve daha fazlası.',
  'play.mineworld.net',
  25565,
  ARRAY['Skyblock', 'Prison', 'Creative'],
  ARRAY['1.20.1', 'Turkish', 'Popular'],
  156,
  300,
  892,
  15,
  'online',
  false,
  true,
  '/assets/img/server-banner-2.jpg',
  true
),
(
  'PixelmonCraft',
  'Pokemon modlu Minecraft sunucusu! Pixelmon, Economy ve özel eventler.',
  'pixelmon.minevote.net',
  25565,
  ARRAY['Pixelmon', 'Modded', 'Economy'],
  ARRAY['1.19.2', 'Modded', 'Pokemon'],
  89,
  200,
  456,
  8,
  'online',
  false,
  false,
  '/assets/img/server-banner-3.jpg',
  true
),
(
  'FactionCraft',
  'Savaş ve ittifaklar! Faction sistemi ile rekabetçi oyun deneyimi.',
  'faction.minevote.net',
  25565,
  ARRAY['Faction', 'PvP', 'War'],
  ARRAY['1.20.1', 'PvP', 'Competitive'],
  67,
  150,
  234,
  5,
  'online',
  false,
  false,
  '/assets/img/server-banner-4.jpg',
  true
),
(
  'CreativeBuild',
  'Yaratıcılığınızı konuşturun! Creative mod, WorldEdit ve özel araçlar.',
  'creative.minevote.net',
  25565,
  ARRAY['Creative', 'Building', 'WorldEdit'],
  ARRAY['1.20.1', 'Creative', 'Building'],
  34,
  100,
  123,
  2,
  'online',
  false,
  false,
  '/assets/img/server-banner-5.jpg',
  true
);

-- Update server statistics
UPDATE servers SET 
  weekly_votes = daily_votes * 7,
  monthly_votes = daily_votes * 30,
  last_ping = NOW(),
  last_vote = NOW() - INTERVAL '2 hours'
WHERE name IN ('AwesomeCraft Network', 'MineWorld', 'PixelmonCraft', 'FactionCraft', 'CreativeBuild');
