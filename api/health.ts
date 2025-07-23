import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from './_lib/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  let dbStatus = 'unknown';
  try {
    await storage.testConnection();
    dbStatus = 'healthy';
  } catch (e) {
    dbStatus = 'unhealthy';
  }
  res.status(200).json({ status: 'ok', database: dbStatus });
} 