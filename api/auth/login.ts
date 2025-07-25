import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcrypt';
import { signToken, setAuthCookie, AuthPayload } from '../_lib/jwtUtils';
import { storage } from '../_lib/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { email, password } = req.body || {};
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }
  const user = await storage.getUserByEmail(email);
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  const payload: AuthPayload = { userId: user.id, email: user.email, isPaid: user.isPaid };
  const token = signToken(payload);
  setAuthCookie(res, token);
  const { password: userPassword, ...userInfo } = user;
  res.status(200).json({ user: userInfo });
}
