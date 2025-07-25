import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getTokenFromRequest, verifyToken } from '../_lib/jwtUtils';
import { storage } from '../_lib/storage';

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
  const attempts = await storage.getQuizAttempts(payload.userId);
  if (!attempts || attempts.length === 0) {
    res.status(404).json({ error: 'No quiz attempts found' });
    return;
  }
  const latest = attempts[0];
  res.status(200).json({ latest });
}
