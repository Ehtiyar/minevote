import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Simple admin setup API called:', req.method, req.url);
  
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
    console.log('Simple setup request body:', req.body);
    const { username, password, email } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // For now, just return success without actually creating the user
    // This will help us test if the API routing is working
    return res.status(200).json({
      success: true,
      message: 'Simple setup API is working! (Database setup not implemented yet)',
      receivedData: {
        username,
        email: email || 'not provided',
        passwordLength: password.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Simple setup error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
