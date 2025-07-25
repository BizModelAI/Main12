import express from "express";
import { createServer } from "http";

console.log('🔄 Starting API server...');

const app = express();
const server = createServer(app);

// Enable CORS for development
app.use((req, res, next) => {
  const origin = process.env.FRONTEND_URL || req.headers.origin || '*';
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API endpoints
app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    server: 'api-backend'
  });
});

// Mock auth endpoints for development
app.get('/api/auth/me', (_req, res) => {
  res.json({ 
    user: null,
    authenticated: false 
  });
});

app.post('/api/auth/login', (_req, res) => {
  res.json({ 
    success: false,
    message: 'Mock auth endpoint - not implemented' 
  });
});

// Mock openai status
app.get('/api/openai-status', (_req, res) => {
  res.json({ 
    configured: true,
    status: 'ready' 
  });
});

// Serve static files from client directory
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientPath = path.resolve(__dirname, '..', 'client');
app.use(express.static(clientPath));

// Catch-all for API routes
app.use('/api/*', (req, res) => {
  console.log(`🔍 API request to: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Handle client-side routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }

  const indexPath = path.join(clientPath, 'index.html');
  res.sendFile(indexPath);
});

const PORT = 5173;

server.listen(PORT, () => {
  console.log(`🚀 API server running on port ${PORT}`);
  console.log(`🔗 CORS enabled for ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down API server gracefully...');
  server.close(() => {
    console.log('API server terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down API server gracefully...');
  server.close(() => {
    console.log('API server terminated');
  });
});
