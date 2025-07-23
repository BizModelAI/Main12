import express from "express";
import { createServer } from "http";

console.log('🔄 Starting server initialization...');

const app = express();
const server = createServer(app);

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

console.log('🔄 Express middleware configured...');

// Basic health endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (_req, res) => {
  res.send('Server is running - debug mode!');
});

console.log('🔄 Basic routes configured...');

async function startServer() {
  try {
    console.log('🔄 Attempting to register routes...');
    
    // Try to import and register routes
    try {
      const { registerRoutes } = await import("./routes.js");
      await registerRoutes(app);
      console.log('✅ Routes registered successfully');
    } catch (error) {
      console.error('❌ Failed to register routes:', error);
      console.log('🔄 Continuing without full routes...');
    }

    console.log('🔄 Attempting to setup Vite...');
    
    // Try to setup Vite
    try {
      const { setupVite } = await import("./vite.js");
      await setupVite(app, server);
      console.log('✅ Vite setup successfully');
    } catch (error) {
      console.error('❌ Failed to setup Vite:', error);
      console.log('🔄 Continuing without Vite...');
    }

    const PORT = process.env.PORT || 3000;
    
    console.log(`🔄 Starting server on port ${PORT}...`);
    
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('✅ Server startup complete!');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
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

console.log('🔄 Starting server...');
startServer();
