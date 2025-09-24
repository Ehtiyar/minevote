-- Create admin audit logs table
create table admin_audit_logs (
  id bigserial primary key,
  admin_id uuid references admins(id) on delete set null,
  action text not null,
  resource_type text,
  resource_id text,
  details jsonb,
  ip inet,
  user_agent text,
  created_at timestamptz default now()
);

-- Create indexes for audit logs
create index idx_admin_audit_logs_admin_id on admin_audit_logs(admin_id);
create index idx_admin_audit_logs_action on admin_audit_logs(action);
create index idx_admin_audit_logs_resource on admin_audit_logs(resource_type, resource_id);
create index idx_admin_audit_logs_created_at on admin_audit_logs(created_at desc);

-- Create function to log admin actions
create or replace function log_admin_action(
  p_admin_id uuid,
  p_action text,
  p_resource_type text default null,
  p_resource_id text default null,
  p_details jsonb default null,
  p_ip inet default null,
  p_user_agent text default null
)
returns void as $$
begin
  insert into admin_audit_logs (
    admin_id, action, resource_type, resource_id, details, ip, user_agent
  ) values (
    p_admin_id, p_action, p_resource_type, p_resource_id, p_details, p_ip, p_user_agent
  );
end;
$$ language plpgsql;
