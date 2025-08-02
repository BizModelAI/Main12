import fs from 'fs';
import path from 'path';

// Files to fix with their specific fixes
const filesToFix = [
  {
    file: 'server/routes/ai.ts',
    fixes: [
      {
        search: 'import express from \'express\';',
        replace: 'import express, { Request, Response, NextFunction } from \'express\';'
      }
    ]
  },
  {
    file: 'server/routes/auth.ts',
    fixes: [
      {
        search: 'import express from \'express\';',
        replace: 'import express, { Request, Response, NextFunction } from \'express\';'
      },
      {
        search: 'function getUserIdFromRequest(req: express.Request): number | undefined {',
        replace: 'function getUserIdFromRequest(req: Request): number | undefined {'
      }
    ]
  },
  {
    file: 'server/routes/health.ts',
    fixes: [
      {
        search: 'import express from \'express\';',
        replace: 'import express, { Request, Response, NextFunction } from \'express\';'
      }
    ]
  },
  {
    file: 'server/routes/pricing.ts',
    fixes: [
      {
        search: 'import express from \'express\';',
        replace: 'import express, { Request, Response, NextFunction } from \'express\';'
      },
      {
        search: 'router.get("/user-pricing/:userId", async (req: express.Request, res: express.Response) => {',
        replace: 'router.get("/user-pricing/:userId", async (req: Request, res: Response) => {'
      },
      {
        search: 'router.get("/stripe-config", (req: express.Request, res: express.Response) => {',
        replace: 'router.get("/stripe-config", (req: Request, res: Response) => {'
      },
      {
        search: 'router.get("/payment/:paymentId", async (req: express.Request, res: express.Response) => {',
        replace: 'router.get("/payment/:paymentId", async (req: Request, res: Response) => {'
      }
    ]
  },
  {
    file: 'server/routes/quiz.ts',
    fixes: [
      {
        search: 'import express from \'express\';',
        replace: 'import express, { Request, Response, NextFunction } from \'express\';'
      }
    ]
  },
  {
    file: 'server/routes/stripe.ts',
    fixes: [
      {
        search: 'import express from \'express\';',
        replace: 'import express, { Request, Response, NextFunction } from \'express\';'
      }
    ]
  },
  {
    file: 'server/minimal-test.ts',
    fixes: [
      {
        search: 'import express from \'express\';',
        replace: 'import express, { Request, Response, NextFunction } from \'express\';'
      },
      {
        search: 'type Request = express.Request;',
        replace: '// Request type imported from express'
      },
      {
        search: 'type Response = express.Response;',
        replace: '// Response type imported from express'
      }
    ]
  },
  {
    file: 'server/vite.ts',
    fixes: [
      {
        search: 'import express from \'express\';',
        replace: 'import express, { Express, Request, Response, NextFunction } from \'express\';'
      },
      {
        search: 'type Express = express.Express;',
        replace: '// Express type imported from express'
      },
      {
        search: 'type Request = express.Request;',
        replace: '// Request type imported from express'
      },
      {
        search: 'type Response = express.Response;',
        replace: '// Response type imported from express'
      },
      {
        search: 'type NextFunction = express.NextFunction;',
        replace: '// NextFunction type imported from express'
      }
    ]
  },
  {
    file: 'server/working-index.ts',
    fixes: [
      {
        search: 'import express from \'express\';',
        replace: 'import express, { Request, Response, NextFunction } from \'express\';'
      },
      {
        search: 'app.get(\'/api/health\', (_req: express.Request, res: express.Response) => {',
        replace: 'app.get(\'/api/health\', (_req: Request, res: Response) => {'
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
console.log('🔧 Fixing Express imports...\n');

filesToFix.forEach(({ file, fixes }) => {
  fixFile(file, fixes);
});

console.log('\n🎉 Express import fixes completed!');
console.log('Run "npx tsc --project server/tsconfig.server.json --noEmit" to check for remaining errors.'); 