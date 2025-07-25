import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from "express";
// Note: registerRoutes import removed for Vercel compatibility

const app = express();

// Configure Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add logging middleware
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson: any, ...args: any[]) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

// Register routes - temporarily disabled for Vercel deployment
let isSetup = false;
async function setupApp() {
  if (!isSetup) {
    // await registerRoutes(app); // Commented out for Vercel compatibility

    app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      throw err;
    });

    isSetup = true;
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  await setupApp();

  // Handle the request with Express
  return new Promise((resolve, reject) => {
    app(req as any, res as any, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}
