import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const hasApiKey = !!process.env.OPENAI_API_KEY;
  res.status(200).json({
    configured: hasApiKey,
    status: hasApiKey ? 'ready' : 'not_configured',
  });
} 