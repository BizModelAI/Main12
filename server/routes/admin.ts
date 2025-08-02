import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = (express as any).Router();
const prisma = new PrismaClient();

// Admin middleware (basic check - you might want to add proper admin authentication)
const adminAuth = (req: any, res: any, next: any) => {
  const adminKey = (req.headers as any)['x-admin-key'];
  if (adminKey !== process.env.ADMIN_SECRET) {
    return (res as any).status(401).json({ error: 'Admin access required' });
  }
  next();
};

// Apply admin auth to all routes
router.use(adminAuth);

// Routes
router.get('/health', async (req: any, res: any) => {
  try {
    const userCount = await prisma.user.count();
    const attemptCount = await prisma.quizAttempt.count();
    const aiContentCount = await prisma.aiContent.count();
    
    (res as any).json({
      status: 'healthy',
      database: {
        users: userCount,
        quizAttempts: attemptCount,
        aiContent: aiContentCount
      },
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Admin health check error:', error);
    (res as any).status(500).json({ error: 'Database connection failed' });
  }
});

router.post('/convert-temp-user', async (req: any, res: any) => {
  try {
    const { tempUserId, email, password, firstName, lastName } = req.body;
    
    const tempUser = await prisma.user.findUnique({
      where: { id: parseInt(tempUserId) }
    });
    
    if (!tempUser || !tempUser.isTemporary) {
      return (res as any).status(404).json({ error: 'Temp user not found' });
    }
    
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(tempUserId) },
      data: {
        email,
        password,
        firstName,
        lastName,
        isTemporary: false
      }
    });
    
    (res as any).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Convert temp user error:', error);
    (res as any).status(500).json({ error: 'Internal server error' });
  }
});

router.get('/payments', async (req: any, res: any) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    (res as any).json({ payments });
  } catch (error) {
    console.error('Get payments error:', error);
    (res as any).status(500).json({ error: 'Internal server error' });
  }
});

router.post('/refunds', async (req: any, res: any) => {
  try {
    const { paymentId, reason } = req.body;
    
    const payment = await prisma.payment.findUnique({
      where: { id: parseInt(paymentId) }
    });
    
    if (!payment) {
      return (res as any).status(404).json({ error: 'Payment not found' });
    }
    
    // Create refund record
    const refund = await prisma.refund.create({
      data: {
        paymentId: parseInt(paymentId),
        amount: payment.amount,
        reason,
        status: 'pending'
      }
    });
    
    (res as any).json({ success: true, refund });
  } catch (error) {
    console.error('Create refund error:', error);
    (res as any).status(500).json({ error: 'Internal server error' });
  }
});

export default router; 