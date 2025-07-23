import express from "express";
import { createServer } from "http";
import session from "express-session";

console.log('🔄 Starting enhanced server...');

const app = express();
const server = createServer(app);

// Import memorystore for sessions
let MemoryStore;
try {
  MemoryStore = (await import('memorystore')).default(session);
  console.log('✅ MemoryStore imported successfully');
} catch (error) {
  console.log('⚠️ MemoryStore not available, using default session store');
  MemoryStore = null;
}

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
};

if (MemoryStore) {
  sessionConfig.store = new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  });
}

app.use(session(sessionConfig));
console.log('✅ Session middleware configured');

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

console.log('✅ Express middleware configured');

// Basic health endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (_req, res) => {
  res.send('Enhanced server is running!');
});

console.log('✅ Basic routes configured');

async function startServer() {
  try {
    console.log('🔄 Attempting to register routes...');
    
    // Try to import and register routes
    try {
      const { registerRoutes } = await import("./routes.ts");
      await registerRoutes(app);
      console.log('✅ Routes registered successfully');
    } catch (error) {
      console.error('❌ Failed to register routes:', error.message);
      console.log('🔄 Continuing without full routes...');
    }

    console.log('🔄 Attempting to setup Vite...');
    
    // Try to setup Vite
    try {
      const { setupVite } = await import("./vite.ts");
      await setupVite(app, server);
      console.log('✅ Vite setup successfully');
    } catch (error) {
      console.error('❌ Failed to setup Vite:', error.message);
      console.log('🔄 Continuing without Vite...');
      
      // Fallback: serve static files for development
      app.use('*', (_req, res) => {
        res.send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>App Development Mode</title>
          </head>
          <body>
            <h1>App is running in development mode</h1>
            <p>Vite is not available, but the API server is working.</p>
            <p><a href="/api/health">Check API Health</a></p>
          </body>
          </html>
        `);
      });
    }

    const PORT = process.env.PORT || 3001;
    
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
