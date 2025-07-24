import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

console.log('🔄 Starting combined server...');

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API endpoints
app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    server: 'integrated'
  });
});

// Serve static files from client directory
const clientPath = path.resolve(__dirname, '..', 'client');
app.use(express.static(clientPath));

// Handle client-side routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  const indexPath = path.join(clientPath, 'index.html');
  res.sendFile(indexPath);
});

const PORT = process.env.PORT || 5173;

server.listen(PORT, () => {
  console.log(`🚀 Combined server running on port ${PORT}`);
  console.log(`📁 Serving static files from: ${clientPath}`);
  console.log(`🔗 API endpoints available at /api/*`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});
