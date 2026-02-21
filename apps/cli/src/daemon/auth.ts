import crypto from 'node:crypto';
import type http from 'node:http';

let token: string | null = null;

export function generateToken(): string {
  token = crypto.randomBytes(32).toString('hex');
  return token;
}

export function getToken(): string | null {
  return token;
}

export function validateToken(candidate: string | null): boolean {
  if (!token || !candidate) return false;
  // Use timing-safe comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(candidate, 'utf-8'),
      Buffer.from(token, 'utf-8'),
    );
  } catch {
    return false;
  }
}

export function extractToken(req: http.IncomingMessage): string | null {
  // Try Authorization: Bearer <token> header first
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  // Try ?token= query parameter
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
  return url.searchParams.get('token');
}
