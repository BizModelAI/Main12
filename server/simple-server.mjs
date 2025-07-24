import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

console.log('🔄 Starting React development server...');

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API endpoints
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    server: 'react-dev'
  });
});

async function setupViteMiddleware() {
  try {
    // Import Vite dynamically
    const { createServer: createViteServer } = await import('vite');

    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
      root: path.resolve(__dirname, '..', 'client'),
    });

    // Use vite's connect instance as middleware
    app.use(vite.middlewares);

    console.log('✅ Vite middleware loaded successfully');
    return vite;
  } catch (error) {
    console.log('⚠️ Vite not available, serving static files:', error.message);

    // Fallback to static serving
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

    return null;
  }
}

// Setup Vite middleware
const vite = await setupViteMiddleware();

// Add API endpoints before static serving
app.get('/api/auth/me', (_req, res) => {
  res.json({
    user: null,
    authenticated: false
  });
});

app.get('/api/openai-status', (_req, res) => {
  res.json({
    configured: true,
    status: 'ready'
  });
});

const PORT = process.env.PORT || 5173;

server.listen(PORT, () => {
  console.log(`🚀 Combined server running on port ${PORT}`);
  console.log(`📁 Serving static files from client directory`);
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
