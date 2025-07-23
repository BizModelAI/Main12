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
  const id = parseInt(req.query.id as string);
  if (!id) {
    res.status(400).json({ error: 'Missing or invalid id' });
    return;
  }
  // Example: fetch pricing info for user
  const user = await storage.getUser(id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  // Example: return static pricing info
  res.status(200).json({ userId: id, pricing: { plan: user.isPaid ? 'paid' : 'free', price: user.isPaid ? 99 : 0 } });
} 