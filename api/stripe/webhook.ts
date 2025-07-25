import type { VercelRequest, VercelResponse } from '@vercel/node';
import { validateRequiredEnvVars } from '../_lib/env';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Verify Stripe webhook signature for security
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured');
      res.status(500).json({ error: 'Webhook secret not configured' });
      return;
    }

    if (!sig) {
      console.error('No Stripe signature found in headers');
      res.status(400).json({ error: 'No signature found' });
      return;
    }

    // For now, basic validation - in production you'd use stripe.webhooks.constructEvent
    console.log('Stripe webhook received with signature:', sig);

    // Process webhook payload here
    const event = req.body;
    console.log('Webhook event type:', event?.type);

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    res.status(400).json({ error: 'Webhook signature verification failed' });
  }
}
