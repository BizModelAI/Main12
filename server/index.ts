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
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session middleware with explicit memory store
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: true,
  saveUninitialized: false,
  store: new session.MemoryStore(),
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Secure cookies in production
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5174',
    'http://localhost:5175', // Allow the current frontend port
    'http://localhost:5173',  // Allow common Vite dev server port
    'https://business-model-finder.onrender.com' // Production URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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

// Register main routes (includes PDF generation)
registerRoutes(app);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz-attempts', quizRoutes);
app.use('/api', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api', healthRoutes);
app.use('/api', pricingRoutes);

// Serve static files from client build
app.use(express.static(path.join(__dirname, '../client/dist')));

// Catch-all handler for SPA routing
app.get('*', (req: any, res: any) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5174'}`);
});

export default app; 