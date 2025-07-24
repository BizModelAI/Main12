import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getTokenFromRequest, verifyToken } from 'api/_lib/jwtUtils';
import { storage } from 'api/_lib/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const token = getTokenFromRequest(req);
  if (!token) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }
  const userId = parseInt(req.query.userId as string);
  if (!userId) {
    res.status(400).json({ error: 'Missing or invalid userId' });
    return;
  }
  if (payload.userId !== userId) {
    res.status(403).json({ error: 'Access denied' });
    return;
  }
  const attempts = await storage.getQuizAttempts(userId);
  res.status(200).json({ attempts });
} 