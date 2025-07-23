import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
  const hasSecretKey = !!process.env.STRIPE_SECRET_KEY;
  res.status(200).json({
    publishableKey: publishableKey || null,
    configured: hasSecretKey,
    status: hasSecretKey ? 'ready' : 'not_configured',
  });
} 