import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { businessId } = req.body;
  if (!businessId) {
    res.status(400).json({ error: 'Missing businessId' });
    return;
  }
  // Example: return hardcoded projections for now
  res.status(200).json({
    businessId,
    projections: [
      { month: 1, income: 0 },
      { month: 2, income: 100 },
      { month: 3, income: 300 },
      { month: 4, income: 600 },
      { month: 5, income: 1000 },
    ],
  });
} 