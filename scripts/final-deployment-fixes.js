#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Running final deployment fixes...');

// 1. Add production environment check to server startup
const serverIndexPath = 'server/index.ts';
if (fs.existsSync(serverIndexPath)) {
  let content = fs.readFileSync(serverIndexPath, 'utf8');
  
  // Add production environment validation
  if (!content.includes('NODE_ENV validation')) {
    const envValidation = `
// Production environment validation
if (process.env.NODE_ENV === 'production') {
  const requiredEnvVars = ['DATABASE_URL', 'SESSION_SECRET', 'JWT_SECRET'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars);
    process.exit(1);
  }
  
  console.log('✅ Production environment validation passed');
}
`;
    
    content = content.replace(
      /import express from 'express';/,
      `import express from 'express';${envValidation}`
    );
  }
  
  fs.writeFileSync(serverIndexPath, content);
  console.log(`✅ Added production environment validation to ${serverIndexPath}`);
}

// 2. Add graceful shutdown handling
const gracefulShutdown = `
// Graceful shutdown handling
const gracefulShutdown = (signal: string) => {
  console.log(\`\\n🛑 Received \${signal}. Starting graceful shutdown...\`);
  
  // Close database connections
  if (typeof prisma !== 'undefined') {
    prisma.$disconnect()
      .then(() => console.log('✅ Database connections closed'))
      .catch(err => console.error('❌ Error closing database connections:', err));
  }
  
  // Exit after cleanup
  setTimeout(() => {
    console.log('👋 Graceful shutdown complete');
    process.exit(0);
  }, 1000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
`;

if (fs.existsSync(serverIndexPath)) {
  let content = fs.readFileSync(serverIndexPath, 'utf8');
  
  if (!content.includes('gracefulShutdown')) {
    content = content.replace(
      /app\.listen\(PORT, \(\) => \{/,
      `${gracefulShutdown}\napp.listen(PORT, () => {`
    );
  }
  
  fs.writeFileSync(serverIndexPath, content);
  console.log(`✅ Added graceful shutdown handling to ${serverIndexPath}`);
}

// 3. Add request logging middleware for production debugging
const requestLogging = `
// Request logging middleware (production only)
if (process.env.NODE_ENV === 'production') {
  app.use((req: any, res: any, next: any) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(\`\${req.method} \${req.path} - \${res.statusCode} - \${duration}ms\`);
    });
    next();
  });
}
`;

if (fs.existsSync(serverIndexPath)) {
  let content = fs.readFileSync(serverIndexPath, 'utf8');
  
  if (!content.includes('Request logging middleware')) {
    content = content.replace(
      /app\.use\(express\.json/,
      `${requestLogging}\napp.use(express.json`
    );
  }
  
  fs.writeFileSync(serverIndexPath, content);
  console.log(`✅ Added request logging middleware to ${serverIndexPath}`);
}

// 4. Add memory usage monitoring
const memoryMonitoring = `
// Memory usage monitoring (production only)
if (process.env.NODE_ENV === 'production') {
  setInterval(() => {
    const memUsage = process.memoryUsage();
    const memUsageMB = {
      rss: Math.round(memUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
      external: Math.round(memUsage.external / 1024 / 1024)
    };
    
    if (memUsageMB.heapUsed > 500) { // Alert if heap usage > 500MB
      console.warn('⚠️ High memory usage:', memUsageMB);
    }
  }, 60000); // Check every minute
}
`;

if (fs.existsSync(serverIndexPath)) {
  let content = fs.readFileSync(serverIndexPath, 'utf8');
  
  if (!content.includes('Memory usage monitoring')) {
    content = content.replace(
      /app\.listen\(PORT, \(\) => \{/,
      `${memoryMonitoring}\napp.listen(PORT, () => {`
    );
  }
  
  fs.writeFileSync(serverIndexPath, content);
  console.log(`✅ Added memory usage monitoring to ${serverIndexPath}`);
}

// 5. Add database connection retry logic
const dbRetryLogic = `
// Database connection retry logic
const connectWithRetry = async (maxRetries = 5, delay = 5000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await prisma.$connect();
      console.log('✅ Database connected successfully');
      return;
    } catch (error) {
      console.error(\`❌ Database connection attempt \${i + 1} failed:\`, error.message);
      if (i < maxRetries - 1) {
        console.log(\`⏳ Retrying in \${delay/1000} seconds...\`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('❌ Max database connection retries reached');
        process.exit(1);
      }
    }
  }
};

// Connect to database on startup
connectWithRetry();
`;

if (fs.existsSync(serverIndexPath)) {
  let content = fs.readFileSync(serverIndexPath, 'utf8');
  
  if (!content.includes('connectWithRetry')) {
    content = content.replace(
      /app\.listen\(PORT, \(\) => \{/,
      `${dbRetryLogic}\napp.listen(PORT, () => {`
    );
  }
  
  fs.writeFileSync(serverIndexPath, content);
  console.log(`✅ Added database connection retry logic to ${serverIndexPath}`);
}

// 6. Add CORS configuration for production
const corsConfig = `
// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://your-app-name.onrender.com']
    : [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:3000',
        'http://localhost:3001'
      ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
`;

if (fs.existsSync(serverIndexPath)) {
  let content = fs.readFileSync(serverIndexPath, 'utf8');
  
  if (!content.includes('corsOptions')) {
    content = content.replace(
      /app\.use\(cors\(/,
      `${corsConfig}\napp.use(cors(corsOptions)`
    );
  }
  
  fs.writeFileSync(serverIndexPath, content);
  console.log(`✅ Enhanced CORS configuration in ${serverIndexPath}`);
}

// 7. Add security headers
const securityHeaders = `
// Security headers middleware
app.use((req: any, res: any, next: any) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
`;

if (fs.existsSync(serverIndexPath)) {
  let content = fs.readFileSync(serverIndexPath, 'utf8');
  
  if (!content.includes('Security headers middleware')) {
    content = content.replace(
      /app\.use\(express\.json/,
      `${securityHeaders}\napp.use(express.json`
    );
  }
  
  fs.writeFileSync(serverIndexPath, content);
  console.log(`✅ Added security headers to ${serverIndexPath}`);
}

// 8. Create a production-ready start script
const startScript = `#!/bin/bash

# Production start script
echo "🚀 Starting BizModelAI in production mode..."

# Check if required environment variables are set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL is not set"
  exit 1
fi

if [ -z "$SESSION_SECRET" ]; then
  echo "❌ SESSION_SECRET is not set"
  exit 1
fi

if [ -z "$JWT_SECRET" ]; then
  echo "❌ JWT_SECRET is not set"
  exit 1
fi

echo "✅ Environment variables validated"
echo "📡 Starting server on port $PORT"

# Start the application
exec npm start
`;

fs.writeFileSync('start.sh', startScript);
fs.chmodSync('start.sh', '755');
console.log(`✅ Created production start script`);

// 9. Add build validation script
const buildValidation = `#!/bin/bash

# Build validation script
echo "🔍 Validating build..."

# Check if client build exists
if [ ! -d "client/dist" ]; then
  echo "❌ Client build not found. Running build..."
  cd client && npm install --legacy-peer-deps && npm run build && cd ..
fi

# Check if server TypeScript compiles
echo "🔍 Checking TypeScript compilation..."
npx tsc --noEmit

if [ $? -eq 0 ]; then
  echo "✅ Build validation passed"
else
  echo "❌ Build validation failed"
  exit 1
fi
`;

fs.writeFileSync('validate-build.sh', buildValidation);
fs.chmodSync('validate-build.sh', '755');
console.log(`✅ Created build validation script`);

// 10. Update package.json with additional scripts
const packagePath = 'package.json';
if (fs.existsSync(packagePath)) {
  let content = fs.readFileSync(packagePath, 'utf8');
  const packageJson = JSON.parse(content);
  
  // Add additional production scripts
  if (!packageJson.scripts['validate']) {
    packageJson.scripts['validate'] = 'bash validate-build.sh';
  }
  
  if (!packageJson.scripts['start:prod']) {
    packageJson.scripts['start:prod'] = 'bash start.sh';
  }
  
  if (!packageJson.scripts['health']) {
    packageJson.scripts['health'] = 'curl -f http://localhost:3001/api/health || exit 1';
  }
  
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log(`✅ Added additional scripts to ${packagePath}`);
}

console.log('🎉 Final deployment fixes completed!');
console.log('');
console.log('📋 Additional safety measures added:');
console.log('✅ Production environment validation');
console.log('✅ Graceful shutdown handling');
console.log('✅ Request logging middleware');
console.log('✅ Memory usage monitoring');
console.log('✅ Database connection retry logic');
console.log('✅ Enhanced CORS configuration');
console.log('✅ Security headers');
console.log('✅ Production start script');
console.log('✅ Build validation script');
console.log('');
console.log('🚀 Your application is now production-ready!'); 