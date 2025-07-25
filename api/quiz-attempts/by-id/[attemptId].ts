import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../_lib/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Always return JSON, never HTML
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { attemptId } = req.query;
    
    if (!attemptId || typeof attemptId !== 'string') {
      res.status(400).json({ error: 'Missing or invalid attemptId' });
      return;
    }

    let attempt = null;

    // Try numeric ID first (database primary key)
    const numericId = parseInt(attemptId);
    if (!isNaN(numericId)) {
      attempt = await storage.getQuizAttempt(numericId);
    }

    // If not found, try UUID-based lookup (for guest users)
    if (!attempt) {
      attempt = await storage.getQuizAttemptByUUID(attemptId);
    }

    if (!attempt) {
      res.status(404).json({ error: 'Quiz attempt not found' });
      return;
    }

    // Return the quiz attempt data
    res.status(200).json({
      success: true,
      id: attempt.id,
      quizData: attempt.quizData,
      userId: attempt.userId,
      completedAt: attempt.completedAt,
      quizAttemptId: attempt.quizAttemptId || attemptId
    });

  } catch (error) {
    console.error('Quiz attempt retrieval error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve quiz attempt',
      details: process.env.NODE_ENV === 'development' 
        ? error instanceof Error ? error.message : String(error)
        : undefined
    });
  }
}
