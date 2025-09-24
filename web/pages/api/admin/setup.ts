import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password, email } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if admin already exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admins')
      .select('id')
      .eq('username', username)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing admin:', checkError);
      return res.status(500).json({ error: 'Database error' });
    }

    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin user already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create admin user
    const { data: admin, error: createError } = await supabase
      .from('admins')
      .insert([{
        username,
        email: email || `${username}@minevote.com`,
        password_hash: passwordHash,
        role: 'admin',
        is_active: true
      }])
      .select()
      .single();

    if (createError) {
      console.error('Error creating admin:', createError);
      return res.status(500).json({ error: 'Failed to create admin user' });
    }

    return res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error: any) {
    console.error('Setup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
