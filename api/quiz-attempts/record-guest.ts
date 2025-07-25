import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../_lib/storage';
import { validators, ValidationError } from '../_lib/validation';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Always return JSON, never HTML
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { quizData, quizAttemptId, tempUserId } = req.body;
    
    // Validate required fields
    if (!quizData) {
      res.status(400).json({ error: 'Missing quizData' });
      return;
    }
    
    if (!quizAttemptId) {
      res.status(400).json({ error: 'Missing quizAttemptId' });
      return;
    }

    // Validate quiz data structure
    if (!validators.quizData(quizData)) {
      res.status(400).json({ error: 'Invalid quiz data format' });
      return;
    }

    // Create or get temporary user
    let userId: number;
    
    if (tempUserId) {
      // Try to find existing temp user
      const existingUser = await storage.getUser(parseInt(tempUserId));
      if (existingUser && existingUser.isTemporary) {
        userId = existingUser.id;
      } else {
        // Create new temp user if not found or not temporary
        const tempUser = await storage.createTemporaryUser({
          email: `temp_${Date.now()}@temporary.local`,
          sessionId: quizAttemptId,
          quizAttemptId: quizAttemptId
        });
        userId = tempUser.id;
      }
    } else {
      // Create new temporary user
      const tempUser = await storage.createTemporaryUser({
        email: `temp_${Date.now()}@temporary.local`,
        sessionId: quizAttemptId,
        quizAttemptId: quizAttemptId
      });
      userId = tempUser.id;
    }

    // Record the quiz attempt
    const attempt = await storage.recordQuizAttempt({ 
      userId: userId, 
      quizData: quizData,
      quizAttemptId: quizAttemptId,
      completedAt: new Date()
    });

    console.log(`Guest quiz attempt recorded: attemptId=${attempt.id}, userId=${userId}`);

    res.status(200).json({ 
      success: true, 
      attemptId: attempt.id,
      userId: userId,
      quizAttemptId: quizAttemptId
    });

  } catch (error) {
    console.error('Guest quiz attempt record error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to record quiz attempt',
      details: process.env.NODE_ENV === 'development' 
        ? error instanceof Error ? error.message : String(error)
        : undefined
    });
  }
}
