import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getTokenFromRequest, verifyToken } from '../../server/utils/jwtUtils';
import { storage } from '../../server/storage';

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
  const id = parseInt(req.query.id as string);
  if (!id) {
    res.status(400).json({ error: 'Missing or invalid id' });
    return;
  }
  const attempt = await storage.getQuizAttempt(id);
  if (!attempt) {
    res.status(404).json({ error: 'Quiz attempt not found' });
    return;
  }
  if (attempt.userId !== payload.userId) {
    res.status(403).json({ error: 'Access denied' });
    return;
  }
  res.status(200).json(attempt);
} 