import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from './_lib/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const checks = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    status: 'healthy',
    services: {
      database: 'unknown',
      jwt: 'unknown',
      openai: 'unknown'
    }
  };

  // Check database connection
  try {
    await storage.getUser(1); // Test database connection
    checks.services.database = 'healthy';
  } catch (error) {
    checks.services.database = 'unhealthy';
    checks.status = 'degraded';
  }

  // Check JWT secret
  try {
    if (process.env.JWT_SECRET) {
      checks.services.jwt = 'healthy';
    } else {
      checks.services.jwt = 'unhealthy';
      checks.status = 'degraded';
    }
  } catch (error) {
    checks.services.jwt = 'unhealthy';
    checks.status = 'degraded';
  }

  // Check OpenAI API key
  try {
    if (process.env.OPENAI_API_KEY) {
      checks.services.openai = 'healthy';
    } else {
      checks.services.openai = 'unhealthy';
      checks.status = 'degraded';
    }
  } catch (error) {
    checks.services.openai = 'unhealthy';
    checks.status = 'degraded';
  }

  const statusCode = checks.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(checks);
}
