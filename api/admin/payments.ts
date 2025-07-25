import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../_lib/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_API_KEY) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const limit = Math.min(parseInt(req.query.limit as string) || 100, 1000);
  const offset = parseInt(req.query.offset as string) || 0;
  const status = req.query.status as string;
  const paymentsWithUsers = await storage.getPaymentsWithUsers({ limit, offset, status });
  res.status(200).json({
    payments: paymentsWithUsers,
    pagination: {
      limit,
      offset,
      total: paymentsWithUsers.length === limit ? 'more_available' : paymentsWithUsers.length + offset,
    },
  });
}
