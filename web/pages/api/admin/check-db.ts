import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Check DB API called:', req.method, req.url);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Checking database tables...');
    
    // Check if admins table exists
    const { data: adminsData, error: adminsError } = await supabase
      .from('admins')
      .select('count')
      .limit(1);

    // Check if users table exists
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    // Check if servers table exists
    const { data: serversData, error: serversError } = await supabase
      .from('servers')
      .select('count')
      .limit(1);

    const tableStatus = {
      admins: {
        exists: !adminsError,
        error: adminsError?.message || null
      },
      users: {
        exists: !usersError,
        error: usersError?.message || null
      },
      servers: {
        exists: !serversError,
        error: serversError?.message || null
      }
    };

    return res.status(200).json({
      success: true,
      message: 'Database table check completed',
      environment: {
        hasSupabaseUrl: !!process.env.SUPABASE_URL,
        hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
        hasJwtSecret: !!process.env.JWT_SECRET
      },
      tables: tableStatus,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Check DB error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
