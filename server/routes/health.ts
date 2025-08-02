import express from 'express';

import { PrismaClient } from '@prisma/client';

const router = (express as any).Router();
const prisma = new PrismaClient();

// Health check endpoint
(router as any).get('/health', async (req: any, res: any) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    (res as any).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: 'connected'
    });
  } catch (error: any) {
    console.error('Health check failed:', error);
    (res as any).status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed'
    });
  }
});

// Health check endpoint (alternative path)
(router as any).get('/health-check', async (req: any, res: any) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    (res as any).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: 'connected'
    });
  } catch (error: any) {
    console.error('Health check failed:', error);
    (res as any).status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed'
    });
  }
});

export default router; 