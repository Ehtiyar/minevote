-- Enable required extensions
create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

-- 1. Servers
create table if not exists public.servers (
  id uuid primary key default gen_random_uuid(),
  name varchar(100) not null,
  description text,
  ip_address varchar(255) not null,
  port integer default 25565,
  website_url varchar(255),
  discord_url varchar(255),
  votifier_host varchar(255),
  votifier_port integer default 8192,
  votifier_public_key text,
  voting_enabled boolean default true,
  version varchar(20),
  max_players integer,
  current_players integer default 0,
  banner_url text,
  server_icon_url text,
  categories text[] default '{}',
  tags text[] default '{}',
  total_votes integer default 0,
  monthly_votes integer default 0,
  weekly_votes integer default 0,
  daily_votes integer default 0,
  status varchar(20) default 'online',
  verified boolean default false,
  premium boolean default false,
  featured boolean default false,
  slug varchar(100) unique,
  meta_title varchar(200),
  meta_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  last_ping timestamptz,
  last_vote timestamptz,
  constraint servers_ip_port_unique unique (ip_address, port)
);

create index if not exists idx_servers_status on public.servers (status);
create index if not exists idx_servers_categories on public.servers using gin (categories);
create index if not exists idx_servers_total_votes on public.servers (total_votes desc);
create index if not exists idx_servers_monthly_votes on public.servers (monthly_votes desc);
create index if not exists idx_servers_premium_featured on public.servers (premium desc, featured desc);

-- 2. Votes
create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  server_id uuid references public.servers(id) on delete cascade,
  minecraft_username varchar(16) not null,
  voter_ip_hash varchar(64) not null,
  user_agent_hash varchar(64),
  voting_site_username varchar(50),
  reward_claimed boolean default false,
  votifier_sent boolean default false,
  votifier_response text,
  plugin_notified boolean default false,
  is_valid boolean default true,
  fraud_score integer default 0,
  validation_notes text,
  created_at timestamptz default now(),
  processed_at timestamptz
);

create index if not exists idx_votes_server_id on public.votes (server_id);
create index if not exists idx_votes_username on public.votes (minecraft_username);
create index if not exists idx_votes_created_at on public.votes (created_at desc);
create index if not exists idx_votes_daily_stats on public.votes (server_id, created_at);

-- 3. Vote Statistics
create table if not exists public.vote_statistics (
  id uuid primary key default gen_random_uuid(),
  server_id uuid references public.servers(id) on delete cascade,
  period_type varchar(10) not null,
  period_date date not null,
  total_votes integer default 0,
  unique_voters integer default 0,
  valid_votes integer default 0,
  fraud_votes integer default 0,
  avg_votes_per_hour decimal(10,2) default 0,
  peak_hour_votes integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint vote_stats_unique unique (server_id, period_type, period_date)
);

-- 4. Server Ping History
create table if not exists public.server_ping_history (
  id uuid primary key default gen_random_uuid(),
  server_id uuid references public.servers(id) on delete cascade,
  is_online boolean not null,
  response_time integer,
  player_count integer,
  max_players integer,
  version varchar(50),
  motd text,
  error_message text,
  ping_timestamp timestamptz default now(),
  constraint ping_history_retention check (ping_timestamp > now() - interval '30 days')
);
create index if not exists idx_ping_history_server_timestamp on public.server_ping_history (server_id, ping_timestamp desc);

-- 5. User Accounts (optional)
create table if not exists public.user_accounts (
  id uuid primary key default gen_random_uuid(),
  email varchar(255) unique,
  username varchar(50) unique,
  minecraft_username varchar(16),
  avatar_url text,
  owned_servers uuid[] default '{}',
  auth_provider varchar(20) default 'email',
  auth_provider_id varchar(100),
  role varchar(20) default 'user',
  is_banned boolean default false,
  ban_reason text,
  last_login timestamptz,
  total_votes_given integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);


