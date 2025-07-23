import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getTokenFromRequest, verifyToken } from '../../../_lib/jwtUtils';
import { storage } from '../../../_lib/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
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
  const quizAttemptId = parseInt(req.query.quizAttemptId as string);
  if (!quizAttemptId) {
    res.status(400).json({ error: 'Missing or invalid quizAttemptId' });
    return;
  }
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Missing email' });
    return;
  }
  // Example: update quiz attempt with email
  await storage.updateQuizAttempt(quizAttemptId, { email });
  res.status(200).json({ success: true });
} 