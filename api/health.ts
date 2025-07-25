import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from './_lib/storage';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ status: 'ok' });
}
