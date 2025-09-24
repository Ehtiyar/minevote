-- Create users table (if not exists)
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  username text unique,
  email text unique,
  mc_nick text,
  discord_id text,
  total_votes int default 0,
  xp int default 0,
  level int default 1,
  is_banned boolean default false,
  banned_until timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create servers table (if not exists)
create table if not exists servers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  ip text not null,
  port int default 25565,
  description text,
  tags text[],
  owner_user_id uuid references users(id),
  is_approved boolean default false,
  featured boolean default false,
  votes_count int default 0,
  current_players int default 0,
  max_players int default 0,
  status text default 'offline',
  banner_url text,
  website text,
  discord text,
  metadata jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create votes table (if not exists)
create table if not exists votes (
  id uuid primary key default uuid_generate_v4(),
  server_id uuid references servers(id) on delete cascade,
  user_id uuid references users(id) on delete set null,
  ip inet,
  created_at timestamptz default now()
);

-- Create reports table
create table if not exists reports (
  id uuid primary key default uuid_generate_v4(),
  reporter_id uuid references users(id) on delete set null,
  server_id uuid references servers(id) on delete cascade,
  reason text not null,
  description text,
  resolved boolean default false,
  resolved_by uuid references admins(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz default now()
);

-- Create settings table for admin configuration
create table if not exists settings (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  value jsonb not null,
  description text,
  updated_by uuid references admins(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create indexes
create index if not exists idx_users_username on users(username);
create index if not exists idx_users_email on users(email);
create index if not exists idx_users_banned on users(is_banned);

create index if not exists idx_servers_owner on servers(owner_user_id);
create index if not exists idx_servers_approved on servers(is_approved);
create index if not exists idx_servers_featured on servers(featured);
create index if not exists idx_servers_votes on servers(votes_count desc);
create index if not exists idx_servers_status on servers(status);

create index if not exists idx_votes_server on votes(server_id);
create index if not exists idx_votes_user on votes(user_id);
create index if not exists idx_votes_created on votes(created_at desc);

create index if not exists idx_reports_server on reports(server_id);
create index if not exists idx_reports_reporter on reports(reporter_id);
create index if not exists idx_reports_resolved on reports(resolved);

create index if not exists idx_settings_key on settings(key);

-- Add updated_at triggers
create trigger update_users_updated_at
  before update on users
  for each row
  execute function update_updated_at_column();

create trigger update_servers_updated_at
  before update on servers
  for each row
  execute function update_updated_at_column();

create trigger update_settings_updated_at
  before update on settings
  for each row
  execute function update_updated_at_column();

-- Create function to update server vote count
create or replace function update_server_vote_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update servers set votes_count = votes_count + 1 where id = NEW.server_id;
    return NEW;
  elsif TG_OP = 'DELETE' then
    update servers set votes_count = votes_count - 1 where id = OLD.server_id;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql;

-- Create trigger for vote count updates
create trigger update_server_vote_count_trigger
  after insert or delete on votes
  for each row
  execute function update_server_vote_count();
