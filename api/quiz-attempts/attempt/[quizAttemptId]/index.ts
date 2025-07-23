import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getTokenFromRequest, verifyToken } from '../../../_lib/jwtUtils';
import { storage } from '../../../_lib/storage';

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
  const quizAttemptId = parseInt(req.query.quizAttemptId as string);
  if (!quizAttemptId) {
    res.status(400).json({ error: 'Missing or invalid quizAttemptId' });
    return;
  }
  const attempt = await storage.getQuizAttempt(quizAttemptId);
  if (!attempt) {
    res.status(404).json({ error: 'Quiz attempt not found' });
    return;
  }
  if (attempt.userId !== payload.userId) {
    res.status(403).json({ error: 'Access denied' });
    return;
  }
  res.status(200).json(attempt);
} 