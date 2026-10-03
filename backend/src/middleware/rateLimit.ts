import { Request, Response, NextFunction } from 'express';

interface RateWindow {
  count: number;
  resetsAt: number;
}

export function rateLimit(maxRequests: number, windowMs: number) {
  const windows = new Map<string, RateWindow>();
  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, window] of windows) {
      if (window.resetsAt <= now) windows.delete(key);
    }
  }, Math.min(windowMs, 60_000));
  cleanup.unref();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    let window = windows.get(key);
    if (!window || window.resetsAt <= now) {
      window = { count: 0, resetsAt: now + windowMs };
      windows.set(key, window);
    }

    window.count += 1;
    res.setHeader('RateLimit-Limit', String(maxRequests));
    res.setHeader('RateLimit-Remaining', String(Math.max(0, maxRequests - window.count)));
    res.setHeader('RateLimit-Reset', String(Math.ceil(window.resetsAt / 1000)));
    if (window.count > maxRequests) {
      return res.status(429).json({ success: false, message: 'Too many requests. Please try again later.' });
    }
    next();
  };
}