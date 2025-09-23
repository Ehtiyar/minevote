-- Align database schema with application code (homepage, add server, vote, ping)
-- Safe, idempotent-ish migration (uses IF NOT EXISTS and conditional checks)

-- 0) Helpers
create extension if not exists pgcrypto;

create or replace function public.update_timestamp()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- 1) profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  mc_nick text not null default '',
  bio text,
  discord_id text,
  avatar_url text,
  total_votes integer not null default 0,
  xp integer not null default 0,
  level integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.update_timestamp();

alter table public.profiles enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='profiles read all'
  ) then
    create policy "profiles read all" on public.profiles for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='profiles owner update'
  ) then
    create policy "profiles owner update" on public.profiles for update using (auth.uid() = id);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='profiles owner insert'
  ) then
    create policy "profiles owner insert" on public.profiles for insert with check (auth.uid() = id);
  end if;
end $$;

-- 2) servers: ensure owner_id and stats columns exist
do $$ begin
  if not exists (
    select 1 from information_schema.columns where table_schema='public' and table_name='servers' and column_name='owner_id'
  ) then
    alter table public.servers add column owner_id uuid references auth.users(id) on delete cascade;
    create index if not exists servers_owner_idx on public.servers(owner_id);
  end if;
end $$;

-- Ensure updated_at trigger
drop trigger if exists servers_set_updated_at on public.servers;
create trigger servers_set_updated_at before update on public.servers
for each row execute function public.update_timestamp();

alter table public.servers enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='servers' and policyname='servers read all'
  ) then
    create policy "servers read all" on public.servers for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='servers' and policyname='servers owner insert'
  ) then
    create policy "servers owner insert" on public.servers for insert with check (auth.uid() = owner_id);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='servers' and policyname='servers owner update'
  ) then
    create policy "servers owner update" on public.servers for update using (auth.uid() = owner_id);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='servers' and policyname='servers owner delete'
  ) then
    create policy "servers owner delete" on public.servers for delete using (auth.uid() = owner_id);
  end if;
end $$;

-- 3) votes: open insert, open read
alter table public.votes enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='votes' and policyname='votes insert anyone'
  ) then
    create policy "votes insert anyone" on public.votes for insert with check (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='votes' and policyname='votes read all'
  ) then
    create policy "votes read all" on public.votes for select using (true);
  end if;
end $$;

-- 4) server_ping_history: align column names with API
do $$ begin
  if not exists (
    select 1 from information_schema.columns where table_schema='public' and table_name='server_ping_history' and column_name='created_at'
  ) then
    alter table public.server_ping_history add column created_at timestamptz default now();
    -- migrate from ping_timestamp if exists
    if exists (
      select 1 from information_schema.columns where table_schema='public' and table_name='server_ping_history' and column_name='ping_timestamp'
    ) then
      update public.server_ping_history set created_at = coalesce(ping_timestamp, now());
      alter table public.server_ping_history drop constraint if exists ping_history_retention;
      alter table public.server_ping_history drop column ping_timestamp;
    end if;
  end if;
end $$;

create index if not exists ping_history_server_idx on public.server_ping_history(server_id, created_at desc);

alter table public.server_ping_history enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='server_ping_history' and policyname='ping history read all'
  ) then
    create policy "ping history read all" on public.server_ping_history for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='server_ping_history' and policyname='ping history insert by owner'
  ) then
    create policy "ping history insert by owner" on public.server_ping_history
    for insert with check (
      exists (
        select 1 from public.servers s where s.id = server_id and s.owner_id = auth.uid()
      )
    );
  end if;
end $$;

-- 5) Views for homepage (optional but helpful)
create or replace view public.vw_top_servers as
select id, name, total_votes, banner_url, created_at from public.servers
order by total_votes desc, created_at desc limit 5;

create or replace view public.vw_latest_servers as
select id, name, total_votes, banner_url, created_at from public.servers
order by created_at desc limit 5;


