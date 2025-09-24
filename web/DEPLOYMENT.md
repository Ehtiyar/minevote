# MineVote Admin Panel Deployment Guide

## Prerequisites

1. **Supabase Project**: Set up a Supabase project with PostgreSQL database
2. **Netlify Account**: For hosting the application
3. **Domain**: Optional, for custom domain setup

## Environment Variables

Set the following environment variables in your Netlify dashboard:

### Required Variables

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# JWT Secret (generate a secure random string)
JWT_SECRET=your_very_secure_jwt_secret_here_at_least_32_characters

# Environment
NODE_ENV=production
```

### Optional Variables (for admin seeding)

```bash
# Admin Seeding (only needed for initial setup)
ADMIN_INITIAL_USERNAME=admin
ADMIN_INITIAL_PASSWORD=your_secure_admin_password_here
ADMIN_INITIAL_EMAIL=admin@yourdomain.com
```

## Database Setup

### 1. Run Migrations

Execute the SQL migration files in order:

1. `migrations/1_create_admins.sql`
2. `migrations/2_create_audit_logs.sql`
3. `migrations/3_create_servers_votes_users.sql`
4. `migrations/4_create_rls_policies.sql`

You can run these in the Supabase SQL Editor or via the Supabase CLI.

### 2. Create Initial Admin

After setting up the database, create your first admin user:

```bash
# Set environment variables
export ADMIN_INITIAL_USERNAME=admin
export ADMIN_INITIAL_PASSWORD=your_secure_password_here
export ADMIN_INITIAL_EMAIL=admin@yourdomain.com

# Run the seed script
npm run seed:admin
```

**Important**: Delete the environment variables after creating the admin user for security.

## Netlify Deployment

### 1. Build Settings

In your Netlify dashboard, configure:

- **Build Command**: `npm install --legacy-peer-deps && npm run build`
- **Publish Directory**: `.next`
- **Base Directory**: `web` (if your project is in a subdirectory)

### 2. Environment Variables

Add all required environment variables in the Netlify dashboard under:
Site Settings → Environment Variables

### 3. Deploy

1. Connect your repository to Netlify
2. Configure build settings
3. Add environment variables
4. Deploy

## Security Considerations

### 1. JWT Secret

Generate a secure JWT secret:
```bash
openssl rand -base64 32
```

### 2. Admin Password

Use a strong password for the initial admin account:
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, and symbols
- Avoid common words or patterns

### 3. Environment Variables

- Never commit secrets to version control
- Use Netlify's environment variable system
- Rotate secrets regularly
- Use different secrets for different environments

### 4. Database Security

- Enable Row Level Security (RLS) policies
- Use service role key only server-side
- Regularly audit admin actions
- Monitor failed login attempts

## Testing the Deployment

### 1. Access Admin Panel

1. Navigate to `https://your-site.netlify.app/admin`
2. You should be redirected to the login page
3. Log in with your admin credentials

### 2. Test Real-time Updates

1. Open two browser windows with the admin panel
2. Make changes in one window
3. Verify changes appear in the other window within 1-3 seconds

### 3. Test Security

1. Try accessing `/admin/dashboard` without logging in
2. Verify you're redirected to login
3. Test rate limiting with multiple failed login attempts

## Monitoring and Maintenance

### 1. Audit Logs

Monitor admin actions in the `admin_audit_logs` table:
```sql
SELECT * FROM admin_audit_logs 
ORDER BY created_at DESC 
LIMIT 100;
```

### 2. Failed Login Attempts

Check for suspicious activity:
```sql
SELECT * FROM admin_audit_logs 
WHERE action = 'login_failed' 
ORDER BY created_at DESC;
```

### 3. Regular Backups

Set up automated database backups in Supabase:
- Go to Settings → Database
- Configure backup schedule
- Test restore procedures

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (should be 20.11.0)
   - Verify all environment variables are set
   - Check for TypeScript errors

2. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check RLS policies
   - Ensure migrations are applied

3. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check admin user exists and is active
   - Review audit logs for failed attempts

### Support

For issues:
1. Check the audit logs
2. Review Netlify build logs
3. Check Supabase logs
4. Verify environment variables

## Rollback Procedure

If deployment fails:

1. **Revert Code**: Rollback to previous commit
2. **Database**: Restore from backup if schema changed
3. **Environment**: Verify environment variables
4. **Test**: Verify functionality before re-deploying

## Security Checklist

- [ ] JWT secret is secure and unique
- [ ] Admin password is strong
- [ ] Environment variables are not in code
- [ ] RLS policies are enabled
- [ ] Audit logging is working
- [ ] Rate limiting is active
- [ ] HTTPS is enforced
- [ ] Admin panel is not indexed by search engines
