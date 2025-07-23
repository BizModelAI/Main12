import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const testValue = `test-${Date.now()}`;
  res.setHeader('Set-Cookie', `test_cookie=${testValue}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`);
  res.status(200).json({
    testValue,
    cookieHeader: req.headers.cookie || 'none',
    userAgent: req.headers['user-agent'] || 'none',
  });
} 