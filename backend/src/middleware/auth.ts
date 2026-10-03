import { createHmac, randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import type { UserRole } from '../types';

export interface AuthClaims {
  userId: string;
  role: UserRole;
  expiresAt: number;
}

export interface AuthenticatedRequest extends Request {
  auth?: AuthClaims;
}

export function asyncHandler(handler: RequestHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

const ACCESS_TOKEN_TTL_SECONDS = 60 * 60 * 8;

function tokenSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') throw new Error('JWT_SECRET must be configured in production');
  return 'local-development-secret-change-before-deploy';
}

function sign(value: string): string {
  return createHmac('sha256', tokenSecret()).update(value).digest('base64url');
}

export function issueAccessToken(userId: string, role: UserRole): string {
  const payload = Buffer.from(JSON.stringify({
    userId,
    role,
    expiresAt: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_TTL_SECONDS
  } satisfies AuthClaims)).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) return reject(error);
      resolve(`scrypt$${salt}$${derivedKey.toString('hex')}`);
    });
  });
}

export function verifyPassword(password: string, encoded: string): Promise<boolean> {
  const [algorithm, salt, hash] = encoded.split('$');
  if (algorithm !== 'scrypt' || !salt || !hash || !/^[a-f0-9]{128}$/i.test(hash)) {
    return Promise.resolve(false);
  }

  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) return reject(error);
      resolve(timingSafeEqual(Buffer.from(hash, 'hex'), derivedKey));
    });
  });
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authorization = req.get('authorization') || '';
  const match = authorization.match(/^Bearer ([A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/);
  if (!match) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const [payload, signature] = match[1].split('.');
  const expected = sign(payload);
  const actualBytes = Buffer.from(signature);
  const expectedBytes = Buffer.from(expected);
  if (actualBytes.length !== expectedBytes.length || !timingSafeEqual(actualBytes, expectedBytes)) {
    return res.status(401).json({ success: false, message: 'Invalid access token' });
  }

  try {
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as AuthClaims;
    if (!claims.userId || !['customer', 'tailor', 'admin'].includes(claims.role) || claims.expiresAt <= Date.now() / 1000) {
      return res.status(401).json({ success: false, message: 'Access token expired or invalid' });
    }
    (req as AuthenticatedRequest).auth = claims;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid access token' });
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = (req as AuthenticatedRequest).auth;
    if (!auth || !roles.includes(auth.role)) {
      return res.status(403).json({ success: false, message: 'You are not allowed to perform this action' });
    }
    next();
  };
}