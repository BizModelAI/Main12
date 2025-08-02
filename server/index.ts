import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use((express as any).json({ limit: '10mb' }));
app.use((express as any).urlencoded({ extended: true }));
app.use(cookieParser());

// Session middleware - using default memory store (acceptable for demo/startup)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production' && !process.env.RENDER, // HTTPS in production, but HTTP on Render during development
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// CORS configuration - dynamic for Render deployment
const corsOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : [
      process.env.FRONTEND_URL || process.env.RENDER_EXTERNAL_URL || 'http://localhost:5174',
      'http://localhost:5175', // Allow the current frontend port
      'http://localhost:5173',  // Allow common Vite dev server port
      // Render automatically provides RENDER_EXTERNAL_URL
    ];

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
  optionsSuccessStatus: 200 // for legacy browser support
}));

// Import and use route handlers
import authRoutes from './routes/auth';
import quizRoutes from './routes/quiz';
import aiRoutes from './routes/ai';
import adminRoutes from './routes/admin';
import stripeRoutes from './routes/stripe';
import healthRoutes from './routes/health';
import pricingRoutes from './routes/pricing';

// Import main routes (includes PDF generation)
import { registerRoutes } from './routes';

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz-attempts', quizRoutes);
app.use('/api', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api', healthRoutes);
app.use('/api', pricingRoutes);

// Register main routes (includes PDF generation) - after specific routes to avoid conflicts
registerRoutes(app);



// Serve static files from client build
app.use((express as any).static(path.join(__dirname, '../client/dist')));

// 404 handler for API routes (must come before catch-all)
app.all('/api/*', (req: any, res: any) => {
  (res as any).status(404).json({ error: 'API endpoint not found', path: (req as any).path });
});

// Catch-all handler for SPA routing (only for non-API routes)
app.get('*', (req: any, res: any) => {
  (res as any).sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// JSON parsing error handler
app.use((err: Error, req: any, res: any, next: any) => {
  if (err instanceof SyntaxError && (err as any).status === 400 && 'body' in err) {
    console.error('JSON parsing error:', err);
    return (res as any).status(400).json({ 
      error: 'Invalid JSON format',
      message: 'The request body contains invalid JSON'
    });
  }
  next(err);
});

// General error handling middleware
app.use((err: Error, req: any, res: any, next: any) => {
  console.error('Error:', err);
  
  // Don't crash the server on errors
  if ((res as any).headersSent) {
    return next(err);
  }
  
  (res as any).status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Add this at the end, before app.listen
app.use((err: Error, req: any, res: any, next: any) => {
  console.error('[EXPRESS ERROR]', {
    message: err?.message,
    stack: err?.stack,
    path: req?.path,
    body: req?.body,
    query: req?.query,
  });
  (res as any).status(500).json({ error: 'Internal server error', details: err?.message });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process, just log the error
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit the process, just log the error
});

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'SESSION_SECRET',
  'JWT_SECRET',
  'OPENAI_API_KEY'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPlease set these variables in your Render dashboard or .env file');
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || process.env.RENDER_EXTERNAL_URL || 'http://localhost:5174'}`);
  console.log(`🌐 CORS Origins: ${corsOrigins.join(', ')}`);
  
  // Log Render-specific info if available
  if (process.env.RENDER) {
    console.log(`🏗️  Running on Render`);
    console.log(`🔗 External URL: ${process.env.RENDER_EXTERNAL_URL || 'Auto-generated by Render'}`);
  }
}).on('error', (err: any) => {
  console.error('❌ Server failed to start:', err);
  process.exit(1);
});

export default app; 