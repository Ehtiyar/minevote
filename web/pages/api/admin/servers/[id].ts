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

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Server ID is required' });
  }

  try {
    if (req.method === 'GET') {
      // Get server details
      const { data: server, error } = await supabase
        .from('servers')
        .select(`
          *,
          users!servers_owner_user_id_fkey(username, email, mc_nick),
          votes(count)
        `)
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Server not found' });
        }
        throw error;
      }

      return res.status(200).json(server);

    } else if (req.method === 'PUT') {
      // Update server
      const { name, ip, port, description, is_approved, featured, tags, metadata } = req.body;

      // Get current server data for optimistic concurrency
      const { data: currentServer, error: fetchError } = await supabase
        .from('servers')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          return res.status(404).json({ error: 'Server not found' });
        }
        throw fetchError;
      }

      // Check for optimistic concurrency conflict
      if (req.body.updated_at && currentServer.updated_at !== req.body.updated_at) {
        return res.status(409).json({ 
          error: 'Conflict: Server was modified by another admin',
          current: currentServer
        });
      }

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (ip !== undefined) updateData.ip = ip;
      if (port !== undefined) updateData.port = port;
      if (description !== undefined) updateData.description = description;
      if (is_approved !== undefined) updateData.is_approved = is_approved;
      if (featured !== undefined) updateData.featured = featured;
      if (tags !== undefined) updateData.tags = tags;
      if (metadata !== undefined) updateData.metadata = metadata;

      const { data: server, error } = await supabase
        .from('servers')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Log the action
      await AdminAuth.logAdminAction(
        admin.id,
        'server_updated',
        'server',
        id,
        { changes: updateData, previous: currentServer },
        req.headers['x-forwarded-for'] as string,
        req.headers['user-agent']
      );

      return res.status(200).json(server);

    } else if (req.method === 'DELETE') {
      // Delete server
      const { data: server, error: fetchError } = await supabase
        .from('servers')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          return res.status(404).json({ error: 'Server not found' });
        }
        throw fetchError;
      }

      const { error } = await supabase
        .from('servers')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Log the action
      await AdminAuth.logAdminAction(
        admin.id,
        'server_deleted',
        'server',
        id,
        { server: server },
        req.headers['x-forwarded-for'] as string,
        req.headers['user-agent']
      );

      return res.status(200).json({ success: true });

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Server API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
