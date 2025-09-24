import type { NextApiRequest, NextApiResponse } from 'next';
import { AdminAuth } from '../../../lib/admin-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify admin session
    const admin = await AdminAuth.getAdminFromRequest(req);
    const ip = req.headers['x-forwarded-for'] as string || 
               req.headers['x-real-ip'] as string || 
               req.connection.remoteAddress || 
               'unknown';

    // Log logout action
    if (admin) {
      await AdminAuth.logAdminAction(
        admin.id,
        'logout',
        undefined,
        undefined,
        { ip },
        ip,
        req.headers['user-agent']
      );
    }

    // Clear the session cookie
    const cookieOptions = [
      'admin_session=',
      'HttpOnly',
      'Secure',
      'SameSite=Strict',
      'Path=/',
      'Max-Age=0'
    ].join('; ');

    res.setHeader('Set-Cookie', cookieOptions);

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
