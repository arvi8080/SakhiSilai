import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { db } from '../data/db';
import { sqlite } from '../data/database';
import { AuthenticatedRequest, requireRole } from '../middleware/auth';
import type { Order } from '../types';

export const orderRouter = Router();

// GET /api/orders
orderRouter.get('/', (req: Request, res: Response) => {
  const { userId, role } = (req as AuthenticatedRequest).auth!;
  let customerId: string | undefined;
  let tailorId: string | undefined;
  if (role === 'customer') customerId = userId;
  if (role === 'tailor') {
    tailorId = db.tailors.find(tailor => tailor.userId === userId)?.id;
    if (!tailorId) return res.status(403).json({ success: false, message: 'Tailor profile not found' });
  }
  if (role === 'admin') {
    customerId = typeof req.query.customerId === 'string' ? req.query.customerId : undefined;
    tailorId = typeof req.query.tailorId === 'string' ? req.query.tailorId : undefined;
  }
  const orders = db.listOrders(customerId, tailorId);

  res.json({ success: true, count: orders.length, data: orders });
});

// GET /api/orders/:id
orderRouter.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const order = db.getOrderById(id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  const auth = (req as AuthenticatedRequest).auth!;
  const tailor = auth.role === 'tailor' ? db.tailors.find(item => item.userId === auth.userId) : undefined;
  if (auth.role !== 'admin' && order.customerId !== auth.userId && order.tailorId !== tailor?.id) {
    return res.status(403).json({ success: false, message: 'You cannot access this order' });
  }
  res.json({ success: true, data: order });
});

// POST /api/orders
orderRouter.post('/', requireRole('customer'), (req: Request, res: Response) => {
  const {
    customerId,
    customerName,
    customerPhone,
    tailorId,
    categoryId,
    categoryName,
    designTitle,
    price,
    paymentMethod = 'cod',
    handoverMethod = 'customer_drop'
  } = req.body;
  const auth = (req as AuthenticatedRequest).auth!;
  const customer = db.users.find(user => user.id === auth.userId);
  const idempotencyKey = req.get('Idempotency-Key') || '';
  const measurementsSize = req.body.measurements === undefined ? 0 : JSON.stringify(req.body.measurements).length;

  if (
    !customer || typeof customerId !== 'string' || customerId.length > 100 ||
    typeof customerName !== 'string' || customerName.length > 100 ||
    typeof customerPhone !== 'string' || customerPhone.length > 20 ||
    typeof tailorId !== 'string' || tailorId.length > 100 ||
    typeof categoryId !== 'string' || categoryId.length > 100 ||
    typeof categoryName !== 'string' || categoryName.trim().length < 2 || categoryName.length > 100 ||
    typeof designTitle !== 'string' || designTitle.trim().length < 2 || designTitle.length > 160 ||
    (req.body.specialInstructions !== undefined && (typeof req.body.specialInstructions !== 'string' || req.body.specialInstructions.length > 2000)) ||
    (req.body.requiredDate !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(req.body.requiredDate)) ||
    (req.body.appointmentDate !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(req.body.appointmentDate)) ||
    (typeof req.body.measurements !== 'string' && typeof req.body.measurements !== 'object' && req.body.measurements !== undefined) ||
    measurementsSize > 10_000 ||
    !/^[A-Za-z0-9_-]{16,128}$/.test(idempotencyKey) ||
    !Number.isFinite(Number(price)) || Number(price) <= 0 || Number(price) > 100000 ||
    !['cod', 'upi', 'partial_advance'].includes(paymentMethod) ||
    !['customer_drop', 'delivery_pickup'].includes(handoverMethod)
  ) {
    return res.status(400).json({ success: false, message: 'Order details or idempotency key are incomplete or invalid' });
  }

  const prior = db.getIdempotencyRecord('create-order', idempotencyKey);
  if (prior) {
    if (prior.ownerId !== auth.userId) return res.status(409).json({ success: false, message: 'Idempotency key conflict' });
    return res.json({ success: true, replayed: true, data: JSON.parse(prior.responseJson) });
  }

  const tailor = db.tailors.find(t => t.id === tailorId);
  if (!tailor) {
    return res.status(400).json({ success: false, message: 'Selected tailor is unavailable' });
  }

  const now = new Date().toISOString();
  const id = `ord_${randomUUID()}`;

  const newOrder: Order = {
    id,
    orderNumber: `SK-${new Date().getFullYear()}-${randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase()}`,
    customerId: customer.id,
    customerName: customer.name,
    customerPhone: customer.phone,
    customerVillage: customer.village,
    customerDistrict: customer.district,
    customerState: customer.state,
    tailorId: tailor.id,
    tailorName: tailor.name,
    tailorVillage: tailor.village,
    tailorPhone: tailor.phone,
    categoryId,
    categoryName,
    designTitle,
    designImage: req.body.designImage || '',
    price: Number(price),
    advancePaid: 0,
    paymentMethod,
    paymentStatus: 'pending',
    status: 'requested',
    handoverMethod,
    hasDeliveryAvailable: Boolean(req.body.hasDeliveryAvailable),
    measurements: req.body.measurements || '',
    specialInstructions: req.body.specialInstructions || '',
    requiredDate: req.body.requiredDate || new Date(Date.now() + 3*86400000).toISOString().split('T')[0],
    createdAt: now,
    updatedAt: now,
    appointmentDate: req.body.appointmentDate,
    appointmentTimeSlot: req.body.appointmentTimeSlot,
    statusHistory: [
      { status: 'requested', labelEn: 'Order Requested', labelHi: 'ऑर्डर भेजा गया', timestamp: now }
    ]
  };

  sqlite.transaction(() => {
    db.addOrder(newOrder);
    db.addNotification({
      id: `n_${randomUUID()}`,
      targetRole: 'tailor',
      recipientId: newOrder.tailorId,
      titleEn: 'New Order Request Received',
      titleHi: 'नया सिलाई आर्डर प्राप्त हुआ',
      messageEn: `${newOrder.customerName} placed a new order #${newOrder.orderNumber} for ₹${newOrder.price}.`,
      messageHi: `${newOrder.customerName} ने ₹${newOrder.price} का नया आर्डर #${newOrder.orderNumber} भेजा है।`,
      timestamp: now,
      isRead: false,
      type: 'order'
    });
    db.addIdempotencyRecord('create-order', idempotencyKey, auth.userId, newOrder);
  })();

  res.status(201).json({ success: true, message: 'Order created successfully in database', data: newOrder });
});

// PATCH /api/orders/:id/status
orderRouter.patch('/:id/status', requireRole('tailor', 'admin'), (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, labelEn, labelHi } = req.body;

  const order = db.getOrderById(id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  const auth = (req as AuthenticatedRequest).auth!;
  const tailor = auth.role === 'tailor' ? db.tailors.find(item => item.userId === auth.userId) : undefined;
  const allowedStatuses = ['requested', 'accepted', 'fabric_received', 'cutting_started', 'stitching', 'quality_check', 'ready', 'completed', 'cancelled'];
  if (!allowedStatuses.includes(status) || (auth.role !== 'admin' && order.tailorId !== tailor?.id)) {
    return res.status(403).json({ success: false, message: 'Invalid status or you cannot update this order' });
  }

  const historyEntry = {
    status,
    labelEn: labelEn || `Order Status: ${status}`,
    labelHi: labelHi || `आर्डर स्थिति: ${status}`,
    timestamp: new Date().toISOString()
  };

  db.updateOrderStatus(id, status, historyEntry);
  const updatedOrder = db.getOrderById(id);

  res.json({ success: true, message: `Order status updated to ${status}`, data: updatedOrder });
});
