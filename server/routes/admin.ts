import express from 'express';
import { requireAdminAuth } from '../middleware/adminAuth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = (express as any).Router();
const prisma = new PrismaClient();

// Use proper admin authentication middleware


// Apply admin auth to all routes
(router as any).use(requireAdminAuth);

// Routes
(router as any).get('/health', async (req: any, res: any) => {
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
  } catch (error: any) {
    console.error('Admin health check error:', error);
    (res as any).status(500).json({ error: 'Database connection failed' });
  }
});

(router as any).post('/convert-temp-user', async (req: any, res: any) => {
  try {
    const { tempUserId, email, password, firstName, lastName } = (req.body as any);
    
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
  } catch (error: any) {
    console.error('Convert temp user error:', error);
    (res as any).status(500).json({ error: 'Internal server error' });
  }
});

(router as any).get('/payments', async (req: any, res: any) => {
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
  } catch (error: any) {
    console.error('Get payments error:', error);
    (res as any).status(500).json({ error: 'Internal server error' });
  }
});

(router as any).post('/refunds', async (req: any, res: any) => {
  try {
    const { paymentId, reason } = (req.body as any);
    
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
  } catch (error: any) {
    console.error('Create refund error:', error);
    (res as any).status(500).json({ error: 'Internal server error' });
  }
});

export default router; 