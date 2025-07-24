import express from "express";
import { createServer } from "http";
import path from "path";
import fs from "fs";

const app = express();
const server = createServer(app);

console.log('🔄 Starting minimal server...');

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve the client HTML directly with proper imports
app.get('*', async (req, res) => {
  try {
    // Check if it's an API route
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }

    const clientHtml = path.resolve('client/index.html');
    let template = await fs.promises.readFile(clientHtml, 'utf-8');
    
    // Add Vite dev client script
    template = template.replace(
      '<head>',
      `<head>
        <script type="module" src="/@vite/client"></script>`
    );
    
    // Make sure the main.tsx script has proper path
    template = template.replace(
      'src="/src/main.tsx"',
      'src="/src/main.tsx"'
    );

    res.set('Content-Type', 'text/html').send(template);
  } catch (error) {
    console.error('Error serving HTML:', error);
    res.status(500).send('Server Error');
  }
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Minimal server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Start a simple Vite dev server separately
  console.log('🔄 You can run "yarn --cwd client dev" in another terminal for full Vite features');
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
