import jwt from 'jsonwebtoken';

// Lazy validation - only check when actually used
function getJWTSecret(): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return process.env.JWT_SECRET;
}
const JWT_EXPIRES_IN = '7d';
const COOKIE_NAME = 'auth_token';

export interface AuthPayload {
  userId: number;
  email: string;
  isPaid?: boolean;
}

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, getJWTSecret(), {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: 'HS256',
  });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, getJWTSecret()) as AuthPayload;
  } catch (e) {
    return null;
  }
}

// Helper to set the cookie (for Vercel serverless, use Set-Cookie header)
export function setAuthCookie(res: any, token: string) {
  // For Vercel/Node: res.setHeader('Set-Cookie', ...)
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`); // 7d
}

export function getTokenFromRequest(req: any): string | null {
  // Try cookie first
  const cookie = req.headers?.cookie;
  if (cookie) {
    const match = cookie.match(/auth_token=([^;]+)/);
    if (match) return match[1];
  }
  // Try Authorization header (Bearer)
  const auth = req.headers?.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    return auth.slice(7);
  }
  return null;
}
