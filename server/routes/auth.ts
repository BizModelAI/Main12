import express from 'express';

import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { getUserIdFromRequest as getUserIdFromRequestMain, getSessionKey, tempSessionCache } from '../auth';

const router = (express as any).Router();
const prisma = new PrismaClient();

// Validation schemas
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1).optional().default(""),
  lastName: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// Helper function to get user ID from request (uses main auth system)
function getUserIdFromRequest(req: any): number | undefined {
  console.log("Latest quiz data: Session debug", {
    sessionUserId: (req as any).session?.userId,
    sessionKey: (req as any).sessionID,
    userAgent: ((req.headers as any) as any)["user-agent"]?.substring(0, 50) + "...",
    ip: (req.ip as any) || req.connection.remoteAddress || "unknown"
  });

  // First try normal session
  if ((req as any).session?.userId) {
    console.log("Latest quiz data: Found userId in session:", (req as any).session.userId);
    return (req as any).session.userId;
  }

  // Fallback to temporary cache
  const sessionKey = getSessionKey(req);
  const cachedSession = tempSessionCache.get(sessionKey);

  if (cachedSession) {
    // Check if session is still valid (24 hours)
    const now = Date.now();
    if (now - cachedSession.timestamp < 24 * 60 * 60 * 1000) {
      // Found user in cache, restore to session for consistency
      (req as any).session.userId = cachedSession.userId;
      console.log("Latest quiz data: Session restored from cache: userId", cachedSession.userId);
      return cachedSession.userId;
    } else {
      // Cleanup expired session
      tempSessionCache.delete(sessionKey);
    }
  }

  console.log("Latest quiz data: No userId found via getUserIdFromRequest");
  return undefined;
}

// Routes
(router as any).post('/signup', async (req: any, res: any) => {
  try {
    // Validate request body exists
    if (!(req.body as any) || typeof (req.body as any) !== 'object') {
      return (res as any).status(400).json({ error: 'Request body is required' });
    }

    const { email, password, firstName, lastName } = signupSchema.parse((req.body as any));
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return (res as any).status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName
      }
    });
    
    // Set session using the main auth system
    (req as any).session.userId = user.id;
    
    // Also set in cache as fallback
    const sessionKey = getSessionKey(req);
    tempSessionCache.set(sessionKey, {
      userId: user.id,
      timestamp: Date.now(),
    });
    
    // Force session save synchronously
    await new Promise<void>((resolve, reject) => {
      (req as any).session.save((err: any) => {
        if (err) {
          console.error("Signup: Failed to save session:", err);
          reject(err);
        } else {
          console.log("Signup: Session saved for user:", user.id);
          resolve();
        }
      });
    });
    
    (res as any).status(201).json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    if (error instanceof z.ZodError) {
      return (res as any).status(400).json({ error: 'Invalid input data', details: error.errors });
    }
    (res as any).status(500).json({ error: 'Internal server error' });
  }
});

(router as any).post('/login', async (req: any, res: any) => {
  try {
    // Validate request body exists
    if (!(req.body as any) || typeof (req.body as any) !== 'object') {
      return (res as any).status(400).json({ error: 'Request body is required' });
    }

    const { email, password } = loginSchema.parse((req.body as any));
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return (res as any).status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return (res as any).status(401).json({ error: 'Invalid credentials' });
    }
    
    // Set session using the main auth system
    (req as any).session.userId = user.id;
    
    // Also set in cache as fallback
    const sessionKey = getSessionKey(req);
    tempSessionCache.set(sessionKey, {
      userId: user.id,
      timestamp: Date.now(),
    });
    
    // Force session save synchronously
    await new Promise<void>((resolve, reject) => {
      (req as any).session.save((err: any) => {
        if (err) {
          console.error("Login: Failed to save session:", err);
          reject(err);
        } else {
          console.log("Login: Session saved for user:", user.id);
          resolve();
        }
      });
    });
    
    (res as any).json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });
  } catch (error: any) {
    console.error('Login error:', error);
    if (error instanceof z.ZodError) {
      return (res as any).status(400).json({ error: 'Invalid input data', details: error.errors });
    }
    (res as any).status(500).json({ error: 'Internal server error' });
  }
});

(router as any).get('/me', async (req: any, res: any) => {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return (res as any).status(401).json({ error: 'Not authenticated' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true
      }
    });
    
    if (!user) {
      return (res as any).status(404).json({ error: 'User not found' });
    }
    
    (res as any).json(user);
  } catch (error: any) {
    console.error('Me endpoint error:', error);
    (res as any).status(500).json({ error: 'Internal server error' });
  }
});

(router as any).post('/logout', (req: any, res: any) => {
  (req as any).session.destroy((err: any) => {
    if (err) {
      console.error("Logout: Failed to destroy session:", err);
      return (res as any).status(500).json({ error: "Logout failed" });
    }
    
    (res as any).clearCookie('connect.sid');
    (res as any).json({ message: 'Logged out successfully' });
  });
});

// Debug endpoint to check session state
(router as any).get('/session-debug', async (req: any, res: any) => {
  (res as any).json({
    sessionId: (req as any).sessionID,
    userId: (req as any).session?.userId,
    testValue: (req as any).session?.testValue || "none",
    sessionExists: !!(req as any).session,
    cookieHeader: ((req.headers as any) as any).cookie?.substring(0, 100) + "..." || "none",
    userAgent: ((req.headers as any) as any)["user-agent"]?.substring(0, 50) + "..." || "none",
  });
});

(router as any).get('/latest-quiz-data', async (req: any, res: any) => {
  console.log("LATEST QUIZ DATA: Endpoint called!");
  console.log("API: GET /api/auth/latest-quiz-data", {
    sessionId: (req as any).sessionID,
    userId: (req as any).session?.userId,
    hasCookie: !!((req.headers as any) as any).cookie
  });
  
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      console.log("Latest quiz data: Not authenticated", {
        sessionUserId: (req as any).session?.userId,
        cacheUserId: userId,
        sessionKey: (req as any).sessionID
      });
      return (res as any).status(401).json({ error: 'Not authenticated' });
    }
    
    console.log("Latest quiz data: Authenticated, fetching data for userId:", userId);
    
    const latestAttempt = await prisma.quizAttempt.findFirst({
      where: { userId },
      orderBy: { completedAt: 'desc' },
      include: {
        aiContents: true
      }
    });
    
    console.log("Latest quiz data: Found attempt:", latestAttempt ? "yes" : "no");
    
    (res as any).json({ quizData: latestAttempt });
  } catch (error: any) {
    console.error('Latest quiz data error:', error);
    (res as any).status(500).json({ error: 'Internal server error' });
  }
});

(router as any).get('/latest-paid-quiz-data', async (req: any, res: any) => {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return (res as any).status(401).json({ error: 'Not authenticated' });
    }
    
    const latestAttempt = await prisma.quizAttempt.findFirst({
      where: { userId },
      orderBy: { completedAt: 'desc' },
      include: {
        aiContents: true
      }
    });
    
    if (!latestAttempt) {
      return (res as any).json(null);
    }
    
    // In pure pay-per-report model: all logged-in users have access to their latest quiz data
    // They just need to pay per report unlock if they want full reports
    (res as any).json({
      quizData: latestAttempt.quizData,
      quizAttemptId: latestAttempt.id,
      isUnlocked: true
    });
  } catch (error: any) {
    console.error('Latest paid quiz data error:', error);
    (res as any).status(500).json({ error: 'Internal server error' });
  }
});

// Contact form endpoint
(router as any).post('/contact', async (req: any, res: any) => {
  try {
    const { name, email, message } = (req.body as any);
    
    if (!name || !email || !message) {
      return (res as any).status(400).json({ error: 'Name, email, and message are required' });
    }
    
    // Here you would typically send an email using your email service
    // For now, we'll just log the contact form submission
    console.log('Contact form submission:', { name, email, message });
    
    (res as any).json({ message: 'Contact form submitted successfully' });
  } catch (error: any) {
    console.error('Contact form error:', error);
    (res as any).status(500).json({ error: 'Internal server error' });
  }
});

// Unsubscribe endpoint
(router as any).post('/unsubscribe', async (req: any, res: any) => {
  try {
    const { email } = (req.body as any);
    
    if (!email) {
      return (res as any).status(400).json({ error: 'Email is required' });
    }
    
    // Here you would typically update the user's email preferences
    // For now, we'll just log the unsubscribe request
    console.log('Unsubscribe request:', { email });
    
    (res as any).json({ message: 'Unsubscribed successfully' });
  } catch (error: any) {
    console.error('Unsubscribe error:', error);
    (res as any).status(500).json({ error: 'Internal server error' });
  }
});

export default router; 