import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from './_lib/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { userId } = req.body;
  if (!userId) {
    res.status(400).json({ error: 'User ID is required' });
    return;
  }
  // Implement logic to clear AI content for user
  // Example: await storage.clearBusinessModelAIContent(userId);
  res.status(200).json({ success: true, deletedCount: 0 });
} 