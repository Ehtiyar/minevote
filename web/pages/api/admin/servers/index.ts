import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { AdminAuth } from '../../../../lib/admin-auth';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify admin session
  const admin = await AdminAuth.getAdminFromRequest(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    if (req.method === 'GET') {
      // Get servers with pagination and filters
      const { page = 1, limit = 20, filter = 'all', search = '' } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let query = supabase
        .from('servers')
        .select(`
          *,
          users!servers_owner_user_id_fkey(username, email)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filter === 'pending') {
        query = query.eq('is_approved', false);
      } else if (filter === 'approved') {
        query = query.eq('is_approved', true);
      } else if (filter === 'featured') {
        query = query.eq('featured', true);
      }

      // Apply search
      if (search) {
        query = query.or(`name.ilike.%${search}%,ip.ilike.%${search}%`);
      }

      // Apply pagination
      query = query.range(offset, offset + Number(limit) - 1);

      const { data: servers, error, count } = await query;

      if (error) {
        throw error;
      }

      return res.status(200).json({
        servers: servers || [],
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count || 0,
          pages: Math.ceil((count || 0) / Number(limit))
        }
      });

    } else if (req.method === 'POST') {
      // Create new server (admin can create servers)
      const { name, ip, port, description, owner_user_id } = req.body;

      if (!name || !ip) {
        return res.status(400).json({ error: 'Name and IP are required' });
      }

      const { data: server, error } = await supabase
        .from('servers')
        .insert([{
          name,
          ip,
          port: port || 25565,
          description,
          owner_user_id,
          is_approved: true // Admin-created servers are auto-approved
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Log the action
      await AdminAuth.logAdminAction(
        admin.id,
        'server_created',
        'server',
        server.id,
        { name, ip, port },
        req.headers['x-forwarded-for'] as string,
        req.headers['user-agent']
      );

      return res.status(201).json(server);

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Servers API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
