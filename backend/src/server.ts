import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration for Production Vercel & Local Development
const allowedOrigins = [
  'https://sakhisilai.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
  })
);

// Preflight OPTIONS handler
app.options('*', cors());

app.use(express.json());

// Setup Swagger UI Documentation
setupSwagger(app);

// Request logger middleware
app.use((req: Request, _res: Response, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

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
  res.json({
    status: 'ok',
    service: 'SakhiSilai Hyperlocal Women Tailoring Backend API',
    tagline: 'Ghar Se Hunar, Apni Kamai.',
    database: 'SQLite Persistent (sakhisilai.db)',
    swaggerDocs: 'http://localhost:5000/api-docs',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/tailors', tailorRouter);
app.use('/api/orders', orderRouter);
app.use('/api/custom-requests', customRequestRouter);
app.use('/api/locations', locationRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/admin', adminRouter);
app.use('/api/payments', paymentRouter);


// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'API Endpoint not found' });
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
