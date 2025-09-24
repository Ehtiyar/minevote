-- Enable Row Level Security
alter table admins enable row level security;
alter table admin_audit_logs enable row level security;
alter table users enable row level security;
alter table servers enable row level security;
alter table votes enable row level security;
alter table reports enable row level security;
alter table settings enable row level security;

-- RLS Policies for admins table
-- Only service role can access admins table
create policy "Service role can manage admins" on admins
  for all using (auth.role() = 'service_role');

-- RLS Policies for admin_audit_logs table
-- Only service role can access audit logs
create policy "Service role can manage audit logs" on admin_audit_logs
  for all using (auth.role() = 'service_role');

-- RLS Policies for users table
-- Public can read users (for display purposes)
create policy "Public can read users" on users
  for select using (true);

-- Service role can manage users
create policy "Service role can manage users" on users
  for all using (auth.role() = 'service_role');

-- RLS Policies for servers table
-- Public can read approved servers
create policy "Public can read approved servers" on servers
  for select using (is_approved = true);

-- Service role can manage all servers
create policy "Service role can manage servers" on servers
  for all using (auth.role() = 'service_role');

-- RLS Policies for votes table
-- Public can read votes
create policy "Public can read votes" on votes
  for select using (true);

-- Service role can manage votes
create policy "Service role can manage votes" on votes
  for all using (auth.role() = 'service_role');

-- RLS Policies for reports table
-- Public can read reports
create policy "Public can read reports" on reports
  for select using (true);

-- Service role can manage reports
create policy "Service role can manage reports" on reports
  for all using (auth.role() = 'service_role');

-- RLS Policies for settings table
-- Public can read settings
create policy "Public can read settings" on settings
  for select using (true);

-- Service role can manage settings
create policy "Service role can manage settings" on settings
  for all using (auth.role() = 'service_role');

-- Create function to check if user is admin (for use in policies if needed)
create or replace function is_admin(user_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from admins 
    where id = user_id and is_active = true
  );
end;
$$ language plpgsql security definer;
