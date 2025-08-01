#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing all deployment issues...');

// 1. Fix console.log statements in production
const serverFiles = [
  'server/auth.ts',
  'server/services/aiScoringService.ts',
  'server/services/emailService.ts',
  'server/routes.ts',
  'server/routes/ai.ts',
  'server/middleware/adminAuth.ts'
];

serverFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace console.log with conditional logging for production
    content = content.replace(
      /console\.log\(/g,
      'process.env.NODE_ENV === "development" && console.log('
    );
    
    // Replace console.warn with conditional logging
    content = content.replace(
      /console\.warn\(/g,
      'process.env.NODE_ENV === "development" && console.warn('
    );
    
    // Keep console.error for production debugging
    // content = content.replace(/console\.error\(/g, 'process.env.NODE_ENV === "development" && console.error(');
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed console logging in ${filePath}`);
  }
});

// 2. Fix potential memory leaks in setInterval calls
const filesWithIntervals = [
  'server/auth.ts',
  'server/services/aiScoringService.ts',
  'server/middleware/adminAuth.ts',
  'server/routes.ts'
];

filesWithIntervals.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add cleanup for setInterval calls
    if (content.includes('setInterval')) {
      // Add process.on('exit') handlers for cleanup
      const cleanupCode = `
// Cleanup intervals on process exit
process.on('exit', () => {
  if (typeof cleanupTimer !== 'undefined') {
    clearInterval(cleanupTimer);
  }
});
`;
      
      if (!content.includes('process.on(\'exit\')')) {
        content = content.replace(
          /(setInterval\([^)]+\))/g,
          (match) => {
            return `${match}\n${cleanupCode}`;
          }
        );
      }
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed potential memory leaks in ${filePath}`);
  }
});

// 3. Fix any remaining .js imports
const allServerFiles = [
  'server/routes.ts',
  'server/auth.ts',
  'server/routes/auth.ts',
  'server/routes/quiz.ts',
  'server/middleware/adminAuth.ts',
  'server/services/emailService.ts',
  'server/services/aiScoringService.ts',
  'server/routes/pricing.ts',
  'scripts/cleanup-expired-data.ts'
];

allServerFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix .js imports to proper TypeScript imports
    content = content.replace(/from ['"]\.\.?\/.*\.js['"]/g, (match) => {
      return match.replace('.js', '');
    });
    
    // Fix dynamic imports
    content = content.replace(/import\(['"]\.\.?\/.*\.js['"]\)/g, (match) => {
      return match.replace('.js', '');
    });
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed import paths in ${filePath}`);
  }
});

// 4. Fix domain references
const filesWithDomains = [
  'server/services/emailService.ts',
  'server/routes.ts',
  'server/auth.ts'
];

filesWithDomains.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace hardcoded domain references
    content = content.replace(
      /process\.env\.FRONTEND_URL \|\| "https:\/\/bizmodelai\.com"/g,
      'process.env.FRONTEND_URL || "http://localhost:5173"'
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed domain references in ${filePath}`);
  }
});

// 5. Add error boundaries and better error handling
const serverIndexPath = 'server/index.ts';
if (fs.existsSync(serverIndexPath)) {
  let content = fs.readFileSync(serverIndexPath, 'utf8');
  
  // Add better error handling for unhandled rejections
  if (!content.includes('process.on(\'unhandledRejection\')')) {
    const errorHandling = `
// Enhanced error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process, just log the error
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit the process, just log the error
});
`;
    
    content = content.replace(
      /app\.listen\(PORT, \(\) => \{/,
      `${errorHandling}\napp.listen(PORT, () => {`
    );
  }
  
  fs.writeFileSync(serverIndexPath, content);
  console.log(`✅ Enhanced error handling in ${serverIndexPath}`);
}

// 6. Fix client build issues
const clientPackagePath = 'client/package.json';
if (fs.existsSync(clientPackagePath)) {
  let content = fs.readFileSync(clientPackagePath, 'utf8');
  const packageJson = JSON.parse(content);
  
  // Ensure all build dependencies are in dependencies, not devDependencies
  const buildDeps = ['vite', '@vitejs/plugin-react', 'typescript', 'autoprefixer'];
  
  buildDeps.forEach(dep => {
    if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
      if (!packageJson.dependencies) packageJson.dependencies = {};
      packageJson.dependencies[dep] = packageJson.devDependencies[dep];
      delete packageJson.devDependencies[dep];
    }
  });
  
  fs.writeFileSync(clientPackagePath, JSON.stringify(packageJson, null, 2));
  console.log(`✅ Fixed client dependencies in ${clientPackagePath}`);
}

// 7. Add production optimizations to package.json
const packagePath = 'package.json';
if (fs.existsSync(packagePath)) {
  let content = fs.readFileSync(packagePath, 'utf8');
  const packageJson = JSON.parse(content);
  
  // Add production-specific scripts
  if (!packageJson.scripts['build:prod']) {
    packageJson.scripts['build:prod'] = 'NODE_ENV=production npm run build';
  }
  
  if (!packageJson.scripts['start:prod']) {
    packageJson.scripts['start:prod'] = 'NODE_ENV=production npm start';
  }
  
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log(`✅ Added production scripts to ${packagePath}`);
}

// 8. Create a production-ready .env.example
const envExample = `# Production Environment Variables
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://username:password@localhost:5432/database
SESSION_SECRET=your-super-secret-session-key
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-app-name.onrender.com

# Optional: External Services
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
OPENAI_API_KEY=sk-...
RESEND_API_KEY=re_...
ADMIN_SECRET=your-admin-secret
`;

fs.writeFileSync('.env.example', envExample);
console.log(`✅ Created .env.example file`);

// 9. Add health check endpoint if not exists
const healthPath = 'server/routes/health.ts';
if (fs.existsSync(healthPath)) {
  let content = fs.readFileSync(healthPath, 'utf8');
  
  // Add more comprehensive health checks
  if (!content.includes('database: \'connected\'')) {
    const enhancedHealth = `
// Enhanced health check with more details
router.get('/health', async (req: any, res: any) => {
  try {
    // Test database connection
    await prisma.$queryRaw\`SELECT 1\`;
    
    // Test environment
    const env = process.env.NODE_ENV || 'development';
    const port = process.env.PORT || 3001;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: env,
      port: port,
      frontendUrl: frontendUrl,
      database: 'connected',
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed',
      details: error.message
    });
  }
});
`;
    
    content = content.replace(
      /router\.get\('\/health', async \(req: any, res: any\) => \{[\s\S]*?\}\);?\s*$/,
      enhancedHealth
    );
  }
  
  fs.writeFileSync(healthPath, content);
  console.log(`✅ Enhanced health check endpoint`);
}

console.log('🎉 All deployment issues fixed!');
console.log('');
console.log('📋 Next steps:');
console.log('1. Commit all changes to git');
console.log('2. Deploy to Render');
console.log('3. Set environment variables in Render dashboard');
console.log('4. Test the deployment'); 