import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { AdminAuth } from '../../../../lib/admin-auth';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify admin session
    const admin = await AdminAuth.getAdminFromRequest(req);
    if (!admin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Fetch all stats in parallel
    const [
      totalServersResult,
      totalUsersResult,
      totalVotesResult,
      pendingServersResult,
      bannedUsersResult,
      votesTodayResult,
      recentActivityResult
    ] = await Promise.all([
      // Total servers
      supabase
        .from('servers')
        .select('*', { count: 'exact', head: true }),

      // Total users
      supabase
        .from('users')
        .select('*', { count: 'exact', head: true }),

      // Total votes
      supabase
        .from('votes')
        .select('*', { count: 'exact', head: true }),

      // Pending servers
      supabase
        .from('servers')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', false),

      // Banned users
      supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('is_banned', true),

      // Votes today
      supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date().toISOString().split('T')[0]),

      // Recent activity (last 10 audit logs)
      supabase
        .from('admin_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
    ]);

    // Check for errors
    const errors = [
      totalServersResult.error,
      totalUsersResult.error,
      totalVotesResult.error,
      pendingServersResult.error,
      bannedUsersResult.error,
      votesTodayResult.error,
      recentActivityResult.error
    ].filter(Boolean);

    if (errors.length > 0) {
      console.error('Dashboard stats errors:', errors);
      return res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }

    // Format recent activity
    const recentActivity = recentActivityResult.data?.map(activity => ({
      description: `${activity.action} ${activity.resource_type || 'item'}`,
      time: new Date(activity.created_at).toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    })) || [];

    const stats = {
      totalServers: totalServersResult.count || 0,
      totalUsers: totalUsersResult.count || 0,
      totalVotes: totalVotesResult.count || 0,
      pendingServers: pendingServersResult.count || 0,
      bannedUsers: bannedUsersResult.count || 0,
      votesToday: votesTodayResult.count || 0,
      recentActivity
    };

    return res.status(200).json(stats);

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
