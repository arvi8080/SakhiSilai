import { Router, Request, Response } from 'express';
import { createHmac, randomUUID, timingSafeEqual } from 'crypto';
import { db } from '../data/db';
import { sqlite } from '../data/database';
import { asyncHandler, AuthenticatedRequest, requireAuth, requireRole } from '../middleware/auth';
import type { PaymentRecord } from '../types';

export const paymentRouter = Router();

function razorpayConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_WEBHOOK_SECRET);
}

function secureEquals(left: string, right: string) {
  const leftBytes = Buffer.from(left);
  const rightBytes = Buffer.from(right);
  return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes);
}

function razorpayAuthHeader() {
  return `Basic ${Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64')}`;
}

function ownerForOrder(req: Request, orderId: string) {
  const auth = (req as AuthenticatedRequest).auth!;
  const tailor = auth.role === 'tailor' ? db.tailors.find(item => item.userId === auth.userId) : undefined;
  const order = db.getOrderById(orderId);
  if (!order || (auth.role !== 'admin' && order.customerId !== auth.userId && order.tailorId !== tailor?.id)) return undefined;
  return order;
}

paymentRouter.get('/order/:orderId', requireAuth, (req: Request, res: Response) => {
  const { orderId } = req.params;
  if (!ownerForOrder(req, orderId)) return res.status(404).json({ success: false, message: 'Order not found' });
  const payments = db.getPaymentsByOrder(orderId);
  res.json({ success: true, count: payments.length, data: payments });
});

paymentRouter.post('/razorpay/orders', requireAuth, requireRole('customer'), asyncHandler(async (req: Request, res: Response) => {
  if (!razorpayConfigured()) return res.status(503).json({ success: false, message: 'Online payments are not configured yet' });

  const auth = (req as AuthenticatedRequest).auth!;
  const { orderId, paymentMethod } = req.body;
  const key = req.get('Idempotency-Key') || '';
  const order = typeof orderId === 'string' ? db.getOrderById(orderId) : undefined;
  if (!order || order.customerId !== auth.userId) return res.status(404).json({ success: false, message: 'Order not found' });
  if (!['upi', 'partial_advance'].includes(paymentMethod) ||
    !/^[A-Za-z0-9_-]{16,128}$/.test(key)) {
    return res.status(400).json({ success: false, message: 'Payment details or idempotency key are invalid' });
  }

  const amountPaise = Math.round((paymentMethod === 'partial_advance' ? Math.min(200, order.price) : order.price) * 100);
  let intent = sqlite.prepare('SELECT * FROM payment_intents WHERE idempotencyKey = ?').get(key) as any;
  if (intent && (intent.ownerId !== auth.userId || intent.orderId !== order.id || intent.paymentMethod !== paymentMethod)) {
    return res.status(409).json({ success: false, message: 'Idempotency key conflict' });
  }
  if (intent?.razorpayOrderId) {
    return res.json({ success: true, data: { orderId: intent.razorpayOrderId, amount: intent.amountPaise, currency: 'INR', keyId: process.env.RAZORPAY_KEY_ID } });
  }
  if (intent?.status === 'creating') {
    return res.status(409).json({ success: false, message: 'Payment order is still being initialized; retry shortly' });
  }

  sqlite.transaction(() => {
    if (intent) {
      sqlite.prepare('UPDATE payment_intents SET status = ?, amountPaise = ?, createdAt = ? WHERE idempotencyKey = ?')
        .run('creating', amountPaise, new Date().toISOString(), key);
    } else {
      sqlite.prepare(`INSERT INTO payment_intents
        (idempotencyKey, ownerId, orderId, amountPaise, paymentMethod, status, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)`)
        .run(key, auth.userId, order.id, amountPaise, paymentMethod, 'creating', new Date().toISOString());
    }
  })();

  try {
    const providerResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { Authorization: razorpayAuthHeader(), 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(10_000),
      body: JSON.stringify({
        amount: amountPaise,
        currency: 'INR',
        receipt: key.slice(0, 40),
        notes: { orderId: order.id, customerId: auth.userId }
      })
    });
    const providerOrder = await providerResponse.json() as { id?: string };
    if (!providerResponse.ok || !providerOrder.id) throw new Error('Razorpay could not create a payment order');

    sqlite.prepare('UPDATE payment_intents SET razorpayOrderId = ?, status = ? WHERE idempotencyKey = ?')
      .run(providerOrder.id, 'created', key);
    res.status(201).json({
      success: true,
      data: { orderId: providerOrder.id, amount: amountPaise, currency: 'INR', keyId: process.env.RAZORPAY_KEY_ID }
    });
  } catch (error) {
    sqlite.prepare('UPDATE payment_intents SET status = ? WHERE idempotencyKey = ?').run('failed', key);
    process.stderr.write(`${JSON.stringify({ level: 'error', event: 'payment_order_creation_failed', message: error instanceof Error ? error.message : 'unknown' })}\n`);
    return res.status(502).json({ success: false, message: 'Payment provider could not create checkout. Please retry.' });
  }
}));

paymentRouter.post('/razorpay/verify', requireAuth, requireRole('customer'), asyncHandler(async (req: Request, res: Response) => {
  if (!razorpayConfigured()) return res.status(503).json({ success: false, message: 'Online payments are not configured yet' });

  const auth = (req as AuthenticatedRequest).auth!;
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  if (typeof razorpayOrderId !== 'string' || typeof razorpayPaymentId !== 'string' || typeof razorpaySignature !== 'string') {
    return res.status(400).json({ success: false, message: 'Payment verification fields are required' });
  }

  const intent = sqlite.prepare('SELECT * FROM payment_intents WHERE razorpayOrderId = ?').get(razorpayOrderId) as any;
  if (!intent || intent.ownerId !== auth.userId) return res.status(404).json({ success: false, message: 'Payment order not found' });
  if (intent.status === 'paid') {
    const payment = db.getPaymentsByOrder(intent.orderId).find(record => record.transactionId === intent.razorpayPaymentId);
    return res.json({ success: true, replayed: true, data: { payment, order: db.getOrderById(intent.orderId) } });
  }

  const expectedSignature = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`).digest('hex');
  if (!secureEquals(expectedSignature, razorpaySignature)) {
    return res.status(400).json({ success: false, message: 'Payment signature is invalid' });
  }

  let providerPayment: { id?: string; order_id?: string; amount?: number; currency?: string; status?: string };
  try {
    const providerResponse = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(razorpayPaymentId)}`, {
      headers: { Authorization: razorpayAuthHeader() },
      signal: AbortSignal.timeout(10_000)
    });
    providerPayment = await providerResponse.json() as typeof providerPayment;
    if (!providerResponse.ok) return res.status(502).json({ success: false, message: 'Payment provider could not confirm the payment' });
  } catch {
    return res.status(502).json({ success: false, message: 'Payment provider is temporarily unavailable' });
  }
  if (providerPayment.id !== razorpayPaymentId || providerPayment.order_id !== razorpayOrderId ||
    providerPayment.amount !== intent.amountPaise || providerPayment.currency !== 'INR' || providerPayment.status !== 'captured') {
    return res.status(409).json({ success: false, message: 'Payment is not confirmed as captured by the provider' });
  }

  const order = db.getOrderById(intent.orderId);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  const paymentStatus = intent.paymentMethod === 'partial_advance' ? 'advance_paid' : 'fully_paid';
  const payment: PaymentRecord = {
    id: `pay_${randomUUID()}`,
    orderId: order.id,
    customerId: auth.userId,
    tailorId: order.tailorId,
    amount: intent.amountPaise / 100,
    paymentMethod: intent.paymentMethod,
    paymentStatus,
    transactionId: razorpayPaymentId,
    timestamp: new Date().toISOString()
  };

  sqlite.transaction(() => {
    const currentIntent = sqlite.prepare('SELECT status FROM payment_intents WHERE idempotencyKey = ?').get(intent.idempotencyKey) as { status: string };
    if (currentIntent.status === 'paid') return;
    db.addPayment(payment);
    db.updateOrderPayment(order.id, paymentStatus, payment.amount);
    sqlite.prepare('UPDATE payment_intents SET razorpayPaymentId = ?, status = ? WHERE idempotencyKey = ?')
      .run(razorpayPaymentId, 'paid', intent.idempotencyKey);
  })();

  const savedPayment = db.getPaymentsByOrder(order.id).find(record => record.transactionId === razorpayPaymentId) || payment;
  res.json({ success: true, data: { payment: savedPayment, order: db.getOrderById(order.id) } });
}));

paymentRouter.post('/razorpay/webhook', (req: Request, res: Response) => {
  if (!razorpayConfigured()) return res.status(503).json({ success: false, message: 'Online payments are not configured yet' });
  const signature = req.get('x-razorpay-signature') || '';
  const rawBody = (req as Request & { rawBody?: Buffer }).rawBody;
  if (!rawBody || !signature) return res.status(400).json({ success: false, message: 'Webhook signature is required' });

  const expected = createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!).update(rawBody).digest('hex');
  if (!secureEquals(expected, signature)) return res.status(401).json({ success: false, message: 'Invalid webhook signature' });

  const event = req.body as any;
  if (event.event === 'payment.captured') {
    const payment = event.payload?.payment?.entity;
    const intent = payment?.order_id
      ? sqlite.prepare('SELECT * FROM payment_intents WHERE razorpayOrderId = ?').get(payment.order_id) as any
      : undefined;
    if (intent && payment?.id && payment.status === 'captured' && payment.amount === intent.amountPaise && payment.currency === 'INR') {
      const order = db.getOrderById(intent.orderId);
      if (order && intent.status !== 'paid') {
        const paymentStatus = intent.paymentMethod === 'partial_advance' ? 'advance_paid' : 'fully_paid';
        const paymentRecord: PaymentRecord = {
          id: `pay_${randomUUID()}`,
          orderId: order.id,
          customerId: intent.ownerId,
          tailorId: order.tailorId,
          amount: payment.amount / 100,
          paymentMethod: intent.paymentMethod,
          paymentStatus,
          transactionId: payment.id,
          timestamp: new Date().toISOString()
        };
        sqlite.transaction(() => {
          const latest = sqlite.prepare('SELECT status FROM payment_intents WHERE idempotencyKey = ?')
            .get(intent.idempotencyKey) as { status: string } | undefined;
          if (!latest || latest.status === 'paid') return;
          db.addPayment(paymentRecord);
          db.updateOrderPayment(order.id, paymentStatus, paymentRecord.amount);
          sqlite.prepare('UPDATE payment_intents SET razorpayPaymentId = ?, status = ? WHERE idempotencyKey = ?')
            .run(payment.id, 'paid', intent.idempotencyKey);
        })();
      }
    }
  }

  res.json({ success: true, received: true });
});
