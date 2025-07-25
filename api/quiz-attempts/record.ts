import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getTokenFromRequest, verifyToken } from '../_lib/jwtUtils';
import { storage } from '../_lib/storage';

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
  const { quizData } = req.body;
  if (!quizData) {
    res.status(400).json({ error: 'Missing quizData' });
    return;
  }

  try {
    const attempt = await storage.recordQuizAttempt({ userId: payload.userId, quizData });
    res.status(200).json({ success: true, attemptId: attempt.id });
  } catch (error) {
    console.error('Quiz attempt record error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to record quiz attempt'
    });
  }
}
