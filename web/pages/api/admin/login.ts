import type { NextApiRequest, NextApiResponse } from 'next';
import { AdminAuth } from '../../../lib/admin-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const ip = req.headers['x-forwarded-for'] as string || 
               req.headers['x-real-ip'] as string || 
               req.connection.remoteAddress || 
               'unknown';

    const session = await AdminAuth.authenticate(username, password, ip);

    if (!session) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Set secure HTTP-only cookie
    const cookieOptions = [
      `admin_session=${session.token}`,
      'HttpOnly',
      'Secure',
      'SameSite=Strict',
      'Path=/',
      'Max-Age=3600'
    ].join('; ');

    res.setHeader('Set-Cookie', cookieOptions);

    return res.status(200).json({
      success: true,
      admin: {
        id: session.admin.id,
        username: session.admin.username,
        email: session.admin.email,
        role: session.admin.role
      }
    });

  } catch (error: any) {
    console.error('Login error:', error);
    
    if (error.message.includes('Too many') || error.message.includes('locked')) {
      return res.status(429).json({ error: error.message });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
}
