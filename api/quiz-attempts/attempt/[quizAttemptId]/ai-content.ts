import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getTokenFromRequest, verifyToken } from '../../../_lib/jwtUtils';
import { storage } from '../../../_lib/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Always return JSON, never HTML
  res.setHeader('Content-Type', 'application/json');

  try {
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
  if (req.method === 'GET') {
    const { contentType } = req.query;
    const attempt = await storage.getQuizAttempt(quizAttemptId);
    if (!attempt) {
      res.status(404).json({ error: 'Quiz attempt not found' });
      return;
    }
    if (attempt.userId !== payload.userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    const aiContent = await storage.getAIContent(quizAttemptId, contentType as string || 'results-preview');
    res.status(200).json({ success: true, aiContent });
    return;
  }
  if (req.method === 'POST') {
    const { contentType, content, aiContent } = req.body;
    const attempt = await storage.getQuizAttempt(quizAttemptId);
    if (!attempt) {
      res.status(404).json({ error: 'Quiz attempt not found' });
      return;
    }
    if (attempt.userId !== payload.userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    const contentToSave = aiContent || content;
    if (!contentToSave) {
      res.status(400).json({ error: 'AI content is required' });
      return;
    }
    await storage.saveAIContent(quizAttemptId, contentType || 'results-preview', contentToSave);
    res.status(200).json({ success: true });
    return;
  }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('AI content API error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process AI content request'
    });
  }
}
