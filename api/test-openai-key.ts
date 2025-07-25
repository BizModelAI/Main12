import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Always return JSON, never HTML
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    const status = {
      hasApiKey: !!apiKey,
      keyLength: apiKey ? apiKey.length : 0,
      keyPrefix: apiKey ? apiKey.substring(0, 7) + '...' : 'none',
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    };

    console.log('OpenAI API Key Status Check:', status);

    res.status(200).json({
      success: true,
      status
    });

  } catch (error) {
    console.error('Error checking OpenAI API key:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to check OpenAI API key status'
    });
  }
}
