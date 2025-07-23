import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../_lib/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_API_KEY) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const { userId } = req.body;
  if (!userId) {
    res.status(400).json({ error: 'Missing userId' });
    return;
  }
  // Implement conversion logic here, e.g. update user type
  await storage.updateUser(userId, { isTemporary: false });
  res.status(200).json({ success: true });
} 