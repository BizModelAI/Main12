import express from "express";
import { createServer } from "http";

console.log('🔄 Starting JavaScript server...');

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
  res.send('JavaScript server is running!');
});

console.log('🔄 Basic routes configured...');

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 JavaScript server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

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

console.log('✅ JavaScript server setup complete!');
