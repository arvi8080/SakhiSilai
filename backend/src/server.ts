import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

import { authRouter } from './routes/authRoutes';
import { tailorRouter } from './routes/tailorRoutes';
import { orderRouter } from './routes/orderRoutes';
import { customRequestRouter } from './routes/customRequestRoutes';
import { locationRouter } from './routes/locationRoutes';
import { categoryRouter } from './routes/categoryRoutes';
import { notificationRouter } from './routes/notificationRoutes';
import { adminRouter } from './routes/adminRoutes';
import { paymentRouter } from './routes/paymentRoutes';
import { setupSwagger } from './config/swagger';
import { requireAuth, requireRole } from './middleware/auth';
import { rateLimit } from './middleware/rateLimit';
import { sqlite } from './data/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)) {
  throw new Error('JWT_SECRET must be configured with at least 32 characters in production');
}
app.set('trust proxy', process.env.NODE_ENV === 'production' ? 1 : false);

app.use((req: Request, res: Response, next) => {
  const requestId = randomUUID();
  const startedAt = Date.now();
  res.setHeader('X-Request-Id', requestId);
  res.on('finish', () => {
    process.stdout.write(`${JSON.stringify({
      level: 'info',
      event: 'http_request',
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt
    })}\n`);
  });
  next();
});

// CORS Configuration for Production Vercel & Local Development
const allowedOrigins = (process.env.ALLOWED_ORIGINS || [
  'https://sakhisilai.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
].join(',')).split(',').map(origin => origin.trim()).filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Idempotency-Key']
  })
);

app.use(express.json({
  limit: '100kb',
  verify: (req, _res, buffer) => {
    (req as Request & { rawBody?: Buffer }).rawBody = Buffer.from(buffer);
  }
}));

app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

app.use('/api', rateLimit(300, 60_000));
app.use('/api/auth/login', rateLimit(10, 15 * 60_000));
app.use('/api/auth/register', rateLimit(10, 60 * 60_000));

// Setup Swagger UI Documentation
setupSwagger(app);

// Root Endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'SakhiSilai Hyperlocal Women Tailoring Backend API',
    tagline: 'Ghar Se Hunar, Apni Kamai.',
    database: 'SQLite Persistent (sakhisilai.db)',
    healthCheck: '/health',
    swaggerDocs: '/api-docs',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  try {
    sqlite.prepare('SELECT 1').get();
    res.json({
      status: 'ok',
      database: 'ready',
      service: 'SakhiSilai Hyperlocal Women Tailoring Backend API',
      timestamp: new Date().toISOString()
    });
  } catch {
    res.status(503).json({
      status: 'error',
      database: 'unavailable',
      service: 'SakhiSilai Hyperlocal Women Tailoring Backend API',
      timestamp: new Date().toISOString()
    });
  }
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/tailors', tailorRouter);
app.use('/api/orders', requireAuth, orderRouter);
app.use('/api/custom-requests', requireAuth, customRequestRouter);
app.use('/api/locations', locationRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/notifications', requireAuth, notificationRouter);
app.use('/api/admin', requireAuth, requireRole('admin'), adminRouter);
app.use('/api/payments', paymentRouter);


// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'API Endpoint not found' });
});

app.use((error: Error, req: Request, res: Response, _next: express.NextFunction) => {
  const requestId = res.getHeader('X-Request-Id');
  process.stderr.write(`${JSON.stringify({
    level: 'error',
    event: 'request_error',
    requestId,
    method: req.method,
    path: req.path,
    message: error.message
  })}\n`);
  if (res.headersSent) return;
  res.status(error.message.includes('CORS') ? 403 : 500).json({
    success: false,
    message: error.message.includes('CORS') ? 'Origin not allowed' : 'Internal server error',
    requestId
  });
});

// Start API Server
app.listen(PORT, () => {
  console.log(`🧵 SakhiSilai API Server listening on port ${PORT}`);
  console.log(`  Database:     SQLite Persistent (sakhisilai.db)`);
  console.log(`  Swagger UI:   http://localhost:${PORT}/api-docs`);
  console.log(`  Swagger JSON: http://localhost:${PORT}/api-docs.json`);
  console.log(`  Health Check: http://localhost:${PORT}/health`);
  console.log(`  Tailors API:  http://localhost:${PORT}/api/tailors/nearby`);
  console.log(`  Orders API:   http://localhost:${PORT}/api/orders`);
  console.log(`  Admin API:    http://localhost:${PORT}/api/admin/stats`);
});
