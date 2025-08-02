import express from 'express';

import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { getUserIdFromRequest } from '../auth';

const router = (express as any).Router();
const prisma = new PrismaClient();

// Helper functions - removed JWT functions, using main auth system

// Validation schemas
const quizDataSchema = z.object({
  mainMotivation: z.string().optional(),
  workStyle: z.string().optional(),
  riskTolerance: z.string().optional(),
  timeCommitment: z.string().optional(),
  financialGoals: z.string().optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  experience: z.string().optional(),
  location: z.string().optional(),
  budget: z.string().optional()
});

const recordGuestSchema = z.object({
  quizData: quizDataSchema,
  tempUserId: z.number().optional()
});

// Routes
(router as any).post('/record-guest', async (req: any, res: any) => {
  try {
    console.log('📝 Record guest attempt started');
    
    // Validate request body exists
    if (!(req.body as any) || typeof (req.body as any) !== 'object') {
      console.error('❌ Invalid request body');
      return (res as any).status(400).json({ error: 'Request body is required' });
    }
    
    // Test database connection first
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log('✅ Database connection verified');
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError);
      return (res as any).status(503).json({ 
        error: 'Database unavailable', 
        details: 'Please try again in a moment' 
      });
    }

    const { quizData, tempUserId } = recordGuestSchema.parse((req.body as any));
    console.log('✅ Request data validated');
    
    // Generate quizAttemptId for guest users
    const finalQuizAttemptId = `guest-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    
    // Create or find temp user
    let userId: number;
    if (tempUserId) {
      console.log(`🔄 Using existing temp user: ${tempUserId}`);
      userId = tempUserId;
    } else {
      console.log('👤 Creating new temp user');
      try {
        const tempUser = await prisma.user.create({
          data: {
            email: `temp-${Date.now()}@temp.com`,
            password: 'temp-password',
            firstName: 'Guest',
            lastName: 'User',
            isTemporary: true
          }
        });
        userId = tempUser.id;
        console.log(`✅ Created temp user with ID: ${userId}`);
      } catch (userError) {
        console.error('❌ Failed to create temp user:', userError);
        return (res as any).status(500).json({ 
          error: 'Failed to create user account', 
          details: 'Database error during user creation' 
        });
      }
    }
    
    // Record quiz attempt
    console.log('💾 Saving quiz attempt to database');
    try {
      const quizAttempt = await prisma.quizAttempt.create({
        data: {
          quizAttemptId: finalQuizAttemptId,
          userId,
          quizData,
          completedAt: new Date()
        }
      });
      
      console.log(`✅ Quiz attempt saved with ID: ${quizAttempt.id}`);
      
      (res as any).status(201).json({
        success: true,
        attemptId: quizAttempt.id,
        userId,
        quizAttemptId: finalQuizAttemptId
      });
    } catch (attemptError) {
      console.error('❌ Failed to save quiz attempt:', attemptError);
      return (res as any).status(500).json({ 
        error: 'Failed to save quiz attempt', 
        details: 'Database error during quiz save' 
      });
    }
    
  } catch (error: any) {
    console.error('❌ Record guest error:', error);
    if (error instanceof z.ZodError) {
      console.error('❌ Validation error:', error.errors);
      return (res as any).status(400).json({ 
        error: 'Invalid input data', 
        details: error.errors 
      });
    }
    console.error('❌ Unexpected error:', error.message);
    (res as any).status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Please try again'
    });
  }
});

(router as any).post('/record', async (req: any, res: any) => {
  try {
    const token = getUserIdFromRequest(req);
    if (!token) {
      return (res as any).status(401).json({ error: 'Not authenticated' });
    }
    
    const { quizData } = (req.body as any);
    
    // Generate quizAttemptId for authenticated users
    const quizAttemptId = `auth-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    
    const quizAttempt = await prisma.quizAttempt.create({
      data: {
        quizAttemptId,
        userId: token,
        quizData,
        completedAt: new Date()
      }
    });
    
    (res as any).status(201).json({
      success: true,
      attemptId: quizAttempt.id
    });
  } catch (error: any) {
    console.error('Record quiz error:', error);
    (res as any).status(500).json({ error: 'Internal server error' });
  }
});

(router as any).get('/', async (req: any, res: any) => {
  try {
    const token = getUserIdFromRequest(req);
    if (!token) {
      return (res as any).status(401).json({ error: 'Not authenticated' });
    }
    
    const attempts = await prisma.quizAttempt.findMany({
      where: { userId: token },
      orderBy: { completedAt: 'desc' },
      include: {
        aiContents: true
      }
    });
    
    (res as any).json({ attempts });
  } catch (error: any) {
    console.error('Get attempts error:', error);
    (res as any).status(500).json({ error: 'Internal server error' });
  }
});

(router as any).get('/:id', async (req: any, res: any) => {
  try {
    const { id } = (req as any).params;
    const token = getUserIdFromRequest(req);
    
    let userId: number | undefined;
    if (token) {
      userId = token;
    }
    
    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: parseInt(id) },
      include: {
        aiContents: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });
    
    if (!attempt) {
      return (res as any).status(404).json({ error: 'Quiz attempt not found' });
    }
    
    // Check if user can access this attempt
    if (userId && attempt.userId !== userId) {
      return (res as any).status(403).json({ error: 'Access denied' });
    }
    
    (res as any).json({ attempt });
  } catch (error: any) {
    console.error('Get attempt error:', error);
    (res as any).status(500).json({ error: 'Internal server error' });
  }
});

(router as any).get('/user/:userId', async (req: any, res: any) => {
  try {
    const { userId } = (req as any).params;
    const token = getUserIdFromRequest(req);
    
    if (!token) {
      return (res as any).status(401).json({ error: 'Not authenticated' });
    }
    
    if (token !== parseInt(userId)) {
      return (res as any).status(403).json({ error: 'Access denied' });
    }
    
    const attempts = await prisma.quizAttempt.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { completedAt: 'desc' },
      include: {
        aiContents: true
      }
    });
    
    (res as any).json({ attempts });
  } catch (error: any) {
    console.error('Get user attempts error:', error);
    (res as any).status(500).json({ error: 'Internal server error' });
  }
});

(router as any).get('/by-id/:attemptId', async (req: any, res: any) => {
  try {
    const { attemptId } = (req as any).params;
    
    const attempt = await prisma.quizAttempt.findFirst({
      where: { quizAttemptId: attemptId },
      include: {
        aiContents: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });
    
    if (!attempt) {
      return (res as any).status(404).json({ error: 'Quiz attempt not found' });
    }
    
    (res as any).json({ attempt });
  } catch (error: any) {
    console.error('Get attempt by ID error:', error);
    (res as any).status(500).json({ error: 'Internal server error' });
  }
});

// AI content routes
(router as any).get('/attempt/:quizAttemptId', async (req: any, res: any) => {
  try {
    const { quizAttemptId } = (req as any).params;
    
    const attempt = await prisma.quizAttempt.findFirst({
      where: { quizAttemptId },
      include: {
        aiContents: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });
    
    if (!attempt) {
      return (res as any).status(404).json({ error: 'Quiz attempt not found' });
    }
    
    (res as any).json({ attempt });
  } catch (error: any) {
    console.error('Get attempt by quizAttemptId error:', error);
    (res as any).status(500).json({ error: 'Internal server error' });
  }
});

(router as any).post('/attempt/:quizAttemptId/ai-content', async (req: any, res: any) => {
  try {
    const { quizAttemptId } = (req as any).params;
    const { content, contentType = 'business_analysis' } = (req.body as any);
    
    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: parseInt(quizAttemptId) }
    });
    
    if (!attempt) {
      return (res as any).status(404).json({ error: 'Quiz attempt not found' });
    }
    
    // For authenticated users, verify access
    const token = getUserIdFromRequest(req);
    if (token) {
      if (attempt.userId !== token) {
        return (res as any).status(403).json({ error: 'Access denied' });
      }
    } else {
      // For unauthenticated users, check if this is a temporary user
      if (attempt.userId) {
        const user = await prisma.user.findUnique({
          where: { id: attempt.userId }
        });
        
        if (!user || !user.isTemporary) {
          return (res as any).status(401).json({ error: 'Authentication required for non-temporary users' });
        }
      } else {
        return (res as any).status(401).json({ error: 'Authentication required' });
      }
    }
    
    const aiContent = await prisma.aiContent.create({
      data: {
        quizAttemptId: attempt.id,
        content,
        contentType
      }
    });
    
    (res as any).status(201).json({ aiContent });
  } catch (error: any) {
    console.error('Save AI content error:', error);
    (res as any).status(500).json({ error: 'Internal server error' });
  }
});

// Get AI content for a specific quiz attempt
(router as any).get('/attempt/:quizAttemptId/ai-content', async (req: any, res: any) => {
  try {
    const { quizAttemptId } = (req as any).params;
    const { contentType } = (req.query as any);
    
    // Find the quiz attempt by numeric ID
    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: parseInt(quizAttemptId) }
    });
    
    if (!attempt) {
      return (res as any).status(404).json({ error: 'Quiz attempt not found' });
    }
    
    // For authenticated users, verify access
    const token = getUserIdFromRequest(req);
    if (token) {
      if (attempt.userId !== token) {
        return (res as any).status(403).json({ error: 'Access denied' });
      }
    } else {
      // For unauthenticated users, check if this is a temporary user
      if (attempt.userId) {
        const user = await prisma.user.findUnique({
          where: { id: attempt.userId }
        });
        
        if (!user || !user.isTemporary) {
          return (res as any).status(401).json({ error: 'Authentication required for non-temporary users' });
        }
      } else {
        return (res as any).status(401).json({ error: 'Authentication required' });
      }
    }
    
    // Get AI content
    const aiContent = await prisma.aiContent.findFirst({
      where: { 
        quizAttemptId: attempt.id, 
        contentType: contentType as string || 'results-preview' 
      },
      orderBy: { generatedAt: 'desc' }
    });
    
    (res as any).json({ success: true, aiContent });
  } catch (error: any) {
    console.error('Get AI content error:', error);
    (res as any).status(500).json({ error: 'Internal server error' });
  }
});

import { EmailService } from '../services/emailService';

(router as any).post('/attempt/:quizAttemptId/email', async (req: any, res: any) => {
  try {
    const { quizAttemptId } = (req as any).params;
    const { email, firstName, lastName } = (req.body as any);
    
    const attempt = await prisma.quizAttempt.findFirst({
      where: { quizAttemptId }
    });
    
    if (!attempt) {
      return (res as any).status(404).json({ error: 'Quiz attempt not found' });
    }
    
    // Update user email if it's a temp user and the email is different
    if (attempt.userId) {
      const user = await prisma.user.findUnique({
        where: { id: attempt.userId }
      });
      
      if (user && user.email !== email) {
        try {
          await prisma.user.update({
            where: { id: attempt.userId },
            data: { email }
          });
        } catch (error: any) {
          console.log('Could not update user email (might already exist):', error.message);
          // Continue with the email sending even if we can't update the user email
        }
      }
    }
    
    // Check if user has paid for this specific report
    let hasPaidForReport = false;
    if (attempt.userId) {
      // Check if there's a successful payment for this specific quiz attempt
      const payment = await prisma.payment.findFirst({
        where: {
          userId: attempt.userId,
          quizAttemptId: attempt.id,
          status: 'completed'
        }
      });
      hasPaidForReport = !!payment;
    }
    
    // Send the actual email
    const emailService = EmailService.getInstance();
    const result = await emailService.sendQuizResults(email, attempt.quizData as any, attempt.id, hasPaidForReport);
    
    if (result.success) {
      (res as any).json({ success: true, message: 'Email sent successfully' });
    } else {
      (res as any).status(429).json({ 
        success: false, 
        error: 'Rate limit exceeded',
        rateLimitInfo: result.rateLimitInfo 
      });
    }
  } catch (error: any) {
    console.error('Email sending error:', error);
    (res as any).status(500).json({ error: 'Internal server error' });
  }
});



export default router; 