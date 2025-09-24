-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enable crypto extension for password hashing
create extension if not exists pgcrypto;

-- Create admins table
create table admins (
  id uuid primary key default uuid_generate_v4(),
  username text unique not null,
  email text unique,
  password_hash text not null,
  role text not null default 'admin',
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  last_login_at timestamptz,
  failed_logins int default 0,
  locked_until timestamptz
);

-- Create index for username lookups
create index idx_admins_username on admins(username);
create index idx_admins_email on admins(email);
create index idx_admins_active on admins(is_active);

-- Add updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_admins_updated_at
  before update on admins
  for each row
  execute function update_updated_at_column();
