import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = (express as any).Router();
let prisma: PrismaClient | null = null;

// Initialize Prisma with error handling
try {
  prisma = new PrismaClient();
} catch (error) {
  console.error('Failed to initialize Prisma:', error);
}

// Health check endpoint
(router as any).get('/health', async (req: any, res: any) => {
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'unknown'
  };

  // Test database connection if Prisma is available
  if (prisma) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      healthStatus.database = 'connected';
    } catch (error: any) {
      console.error('Database health check failed:', error);
      healthStatus.database = 'disconnected';
      healthStatus.status = 'degraded';
    }
  } else {
    healthStatus.database = 'not_initialized';
    healthStatus.status = 'degraded';
  }

  // Always return 200 for basic health check (Render needs this)
  (res as any).json(healthStatus);
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