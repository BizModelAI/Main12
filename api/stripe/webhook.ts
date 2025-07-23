import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  // Optionally verify Stripe signature here if needed
  // const sig = req.headers['stripe-signature'];
  // const secret = process.env.STRIPE_SECRET_KEY;
  // ...
  // For now, just acknowledge receipt
  res.status(200).json({ received: true });
} 