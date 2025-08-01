#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files to fix domain references in
const filesToFix = [
  'server/services/emailService.ts',
  'server/routes.ts',
  'server/auth.ts'
];

// Fix domain references
filesToFix.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace hardcoded domain references with environment variable fallbacks
    content = content.replace(
      /process\.env\.FRONTEND_URL \|\| "https:\/\/bizmodelai\.com"/g,
      'process.env.FRONTEND_URL || "http://localhost:5173"'
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed domain references in ${filePath}`);
  }
});

// Fix any remaining .js imports in TypeScript files
const serverFiles = [
  'server/routes.ts',
  'server/auth.ts',
  'server/routes/auth.ts',
  'server/routes/quiz.ts',
  'server/middleware/adminAuth.ts',
  'server/services/emailService.ts',
  'server/services/aiScoringService.ts',
  'scripts/cleanup-expired-data.ts'
];

serverFiles.forEach(filePath => {
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

console.log('🎉 All deployment issues fixed!'); 