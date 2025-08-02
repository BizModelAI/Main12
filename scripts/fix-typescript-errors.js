#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files to fix with their specific fixes
const filesToFix = [
  {
    file: 'server/index.ts',
    fixes: [
      {
        search: 'app.use(express.json({ limit: \'10mb\' }));',
        replace: 'app.use(express.json({ limit: \'10mb\' }));'
      },
      {
        search: 'app.use(express.urlencoded({ extended: true }));',
        replace: 'app.use(express.urlencoded({ extended: true }));'
      },
      {
        search: 'store: new session.MemoryStore(),',
        replace: 'store: new session.MemoryStore(),'
      },
      {
        search: 'app.use(express.static(path.join(__dirname, \'../client/dist\')));',
        replace: 'app.use(express.static(path.join(__dirname, \'../client/dist\')));'
      },
      {
        search: 'app.all(\'/api/*\', (req: express.Request, res: express.Response) => {',
        replace: 'app.all(\'/api/*\', (req: express.Request, res: express.Response) => {'
      },
      {
        search: 'app.get(\'*\', (req: express.Request, res: express.Response) => {',
        replace: 'app.get(\'*\', (req: express.Request, res: express.Response) => {'
      },
      {
        search: 'app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {',
        replace: 'app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {'
      }
    ]
  },
  {
    file: 'server/auth.ts',
    fixes: [
      {
        search: 'type Express = express.Express;',
        replace: 'type Express = express.Express;'
      },
      {
        search: 'type Request = express.Request;',
        replace: 'type Request = express.Request;'
      },
      {
        search: 'type Response = express.Response;',
        replace: 'type Response = express.Response;'
      },
      {
        search: 'next: express.NextFunction',
        replace: 'next: express.NextFunction'
      }
    ]
  },
  {
    file: 'server/middleware/adminAuth.ts',
    fixes: [
      {
        search: 'import type { Response, NextFunction } from "express";',
        replace: 'import type { Response, NextFunction } from "express";'
      }
    ]
  },
  {
    file: 'server/routes/admin.ts',
    fixes: [
      {
        search: 'const router = express.Router();',
        replace: 'const router = express.Router();'
      },
      {
        search: 'const adminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {',
        replace: 'const adminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {'
      }
    ]
  },
  {
    file: 'server/routes/ai.ts',
    fixes: [
      {
        search: 'const router = express.Router();',
        replace: 'const router = express.Router();'
      }
    ]
  },
  {
    file: 'server/routes/auth.ts',
    fixes: [
      {
        search: 'const router = express.Router();',
        replace: 'const router = express.Router();'
      },
      {
        search: 'function getUserIdFromRequest(req: express.Request): number | undefined {',
        replace: 'function getUserIdFromRequest(req: express.Request): number | undefined {'
      }
    ]
  },
  {
    file: 'server/routes/health.ts',
    fixes: [
      {
        search: 'const router = express.Router();',
        replace: 'const router = express.Router();'
      }
    ]
  },
  {
    file: 'server/routes/pricing.ts',
    fixes: [
      {
        search: 'const router = express.Router();',
        replace: 'const router = express.Router();'
      },
      {
        search: 'router.get("/user-pricing/:userId", async (req: express.Request, res: express.Response) => {',
        replace: 'router.get("/user-pricing/:userId", async (req: express.Request, res: express.Response) => {'
      },
      {
        search: 'router.get("/stripe-config", (req: express.Request, res: express.Response) => {',
        replace: 'router.get("/stripe-config", (req: express.Request, res: express.Response) => {'
      },
      {
        search: 'router.get("/payment/:paymentId", async (req: express.Request, res: express.Response) => {',
        replace: 'router.get("/payment/:paymentId", async (req: express.Request, res: express.Response) => {'
      }
    ]
  },
  {
    file: 'server/routes/quiz.ts',
    fixes: [
      {
        search: 'const router = express.Router();',
        replace: 'const router = express.Router();'
      }
    ]
  },
  {
    file: 'server/routes/stripe.ts',
    fixes: [
      {
        search: 'const router = express.Router();',
        replace: 'const router = express.Router();'
      },
      {
        search: 'router.post(\'/webhook\', express.raw({ type: \'application/json\' }), async (req: any, res: any) => {',
        replace: 'router.post(\'/webhook\', express.raw({ type: \'application/json\' }), async (req: any, res: any) => {'
      }
    ]
  },
  {
    file: 'server/vite.ts',
    fixes: [
      {
        search: 'type Express = express.Express;',
        replace: 'type Express = express.Express;'
      },
      {
        search: 'type Request = express.Request;',
        replace: 'type Request = express.Request;'
      },
      {
        search: 'type Response = express.Response;',
        replace: 'type Response = express.Response;'
      },
      {
        search: 'type NextFunction = express.NextFunction;',
        replace: 'type NextFunction = express.NextFunction;'
      },
      {
        search: 'app.use(express.static(distPath));',
        replace: 'app.use(express.static(distPath));'
      },
      {
        search: 'app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {',
        replace: 'app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {'
      }
    ]
  },
  {
    file: 'server/working-index.ts',
    fixes: [
      {
        search: 'app.use(express.json({ limit: \'10mb\' }));',
        replace: 'app.use(express.json({ limit: \'10mb\' }));'
      },
      {
        search: 'app.use(express.urlencoded({ extended: true, limit: \'10mb\' }));',
        replace: 'app.use(express.urlencoded({ extended: true, limit: \'10mb\' }));'
      },
      {
        search: 'app.get(\'/api/health\', (_req: express.Request, res: express.Response) => {',
        replace: 'app.get(\'/api/health\', (_req: express.Request, res: express.Response) => {'
      }
    ]
  },
  {
    file: 'server/minimal-test.ts',
    fixes: [
      {
        search: 'type Request = express.Request;',
        replace: 'type Request = express.Request;'
      },
      {
        search: 'type Response = express.Response;',
        replace: 'type Response = express.Response;'
      }
    ]
  }
];

// Function to fix a file
function fixFile(filePath, fixes) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  fixes.forEach(fix => {
    if (content.includes(fix.search)) {
      content = content.replace(new RegExp(fix.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), fix.replace);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
  } else {
    console.log(`ℹ️  No changes needed: ${filePath}`);
  }
}

// Main execution
console.log('🔧 Fixing TypeScript errors...\n');

filesToFix.forEach(({ file, fixes }) => {
  fixFile(file, fixes);
});

console.log('\n🎉 TypeScript error fixes completed!');
console.log('Run "npx tsc --project server/tsconfig.server.json --noEmit" to check for remaining errors.'); 