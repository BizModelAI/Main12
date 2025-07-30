import express from 'express';

import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { getUserIdFromRequest as getUserIdFromRequestMain, getSessionKey } from '../auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// Helper function to get user ID from request (uses main auth system)
function getUserIdFromRequest(req: express.Request): number | undefined {
  console.log("Latest quiz data: Session debug", {
    sessionUserId: req.session?.userId,
    sessionKey: req.sessionID,
    userAgent: req.headers["user-agent"]?.substring(0, 50) + "...",
    ip: req.ip || req.connection.remoteAddress || "unknown"
  });

  // Use only the main session handling function
  const sessionUserId = getUserIdFromRequestMain(req);
  console.log("Latest quiz data: getUserIdFromRequest returned", sessionUserId);
  
  if (!sessionUserId) {
    console.log("Latest quiz data: No userId found via getUserIdFromRequest");
  }
  
  return sessionUserId;
}

// Routes
router.post('/signup', async (req: any, res: any) => {
  try {
    const { email, password, firstName, lastName } = signupSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
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
    req.session.userId = user.id;
    
    // Force session save
    req.session.save((err: any) => {
      if (err) {
        console.error("Signup: Failed to save session:", err);
        return res.status(500).json({ error: "Session save failed" });
      }
      
      console.log("Signup: Session saved for user:", user.id);
      
      res.status(201).json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      });
    });
  } catch (error) {
    console.error('Signup error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input data', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req: any, res: any) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Set session using the main auth system
    req.session.userId = user.id;
    
    // Force session save
    req.session.save((err: any) => {
      if (err) {
        console.error("Login: Failed to save session:", err);
        return res.status(500).json({ error: "Session save failed" });
      }
      
      console.log("Login: Session saved for user:", user.id);
      
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input data', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/me', async (req: any, res: any) => {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
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
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Me endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', (req: any, res: any) => {
  req.session.destroy((err: any) => {
    if (err) {
      console.error("Logout: Failed to destroy session:", err);
      return res.status(500).json({ error: "Logout failed" });
    }
    
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

// Debug endpoint to check session state
router.get('/session-debug', async (req: any, res: any) => {
  res.json({
    sessionId: req.sessionID,
    userId: req.session?.userId,
    testValue: req.session?.testValue || "none",
    sessionExists: !!req.session,
    cookieHeader: req.headers.cookie?.substring(0, 100) + "..." || "none",
    userAgent: req.headers["user-agent"]?.substring(0, 50) + "..." || "none",
  });
});

router.get('/latest-quiz-data', async (req: any, res: any) => {
  console.log("LATEST QUIZ DATA: Endpoint called!");
  console.log("API: GET /api/auth/latest-quiz-data", {
    sessionId: req.sessionID,
    userId: req.session?.userId,
    hasCookie: !!req.headers.cookie
  });
  
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      console.log("Latest quiz data: Not authenticated", {
        sessionUserId: req.session?.userId,
        cacheUserId: userId,
        sessionKey: req.sessionID
      });
      return res.status(401).json({ error: 'Not authenticated' });
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
    
    res.json({ quizData: latestAttempt });
  } catch (error) {
    console.error('Latest quiz data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/latest-paid-quiz-data', async (req: any, res: any) => {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const latestAttempt = await prisma.quizAttempt.findFirst({
      where: { userId },
      orderBy: { completedAt: 'desc' },
      include: {
        aiContents: true
      }
    });
    
    if (!latestAttempt) {
      return res.json(null);
    }
    
    // In pure pay-per-report model: all logged-in users have access to their latest quiz data
    // They just need to pay per report unlock if they want full reports
    res.json({
      quizData: latestAttempt.quizData,
      quizAttemptId: latestAttempt.id,
      isUnlocked: true
    });
  } catch (error) {
    console.error('Latest paid quiz data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 