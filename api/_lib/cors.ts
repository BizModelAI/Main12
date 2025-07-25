import type { VercelRequest, VercelResponse } from '@vercel/node';

export function setCORSHeaders(req: VercelRequest, res: VercelResponse) {
  const origin = process.env.FRONTEND_URL || req.headers.origin || "*";
  
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

export function handlePreflight(req: VercelRequest, res: VercelResponse): boolean {
  if (req.method === 'OPTIONS') {
    setCORSHeaders(req, res);
    res.status(200).end();
    return true;
  }
  return false;
}
