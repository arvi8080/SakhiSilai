import { Router, Request, Response } from 'express';
import { db } from '../data/db';
import type { Order } from '../types';

export const orderRouter = Router();

// GET /api/orders
orderRouter.get('/', (req: Request, res: Response) => {
  const customerId = req.query.customerId as string;
  const tailorId = req.query.tailorId as string;

  let orders = db.orders;
  if (customerId) {
    orders = orders.filter(o => o.customerId === customerId);
  }
  if (tailorId) {
    orders = orders.filter(o => o.tailorId === tailorId);
  }

  res.json({ success: true, count: orders.length, data: orders });
});

// GET /api/orders/:id
orderRouter.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const order = db.orders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, data: order });
});

// POST /api/orders
orderRouter.post('/', (req: Request, res: Response) => {
  const now = new Date().toISOString();
  const tailor = db.tailors.find(t => t.id === (req.body.tailorId || 't_sunita'));

  const newOrder: Order = {
    id: 'ord_' + Date.now(),
    orderNumber: 'SK-2026-' + Math.floor(100 + Math.random() * 900),
    customerId: req.body.customerId || 'u_pria',
    customerName: req.body.customerName || 'Priya Singh',
    customerPhone: req.body.customerPhone || '9812345678',
    customerVillage: req.body.customerVillage || 'Mohanlalganj',
    customerDistrict: req.body.customerDistrict || 'Lucknow',
    customerState: req.body.customerState || 'Uttar Pradesh',
    tailorId: tailor?.id || 't_sunita',
    tailorName: tailor?.name || 'Sunita Devi',
    tailorVillage: tailor?.village || 'Mohanlalganj',
    tailorPhone: tailor?.phone || '9876543210',
    categoryId: req.body.categoryId || 'blouse',
    categoryName: req.body.categoryName || 'Blouse Stitching',
    designTitle: req.body.designTitle || 'Custom Blouse Design',
    designImage: req.body.designImage || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
    price: Number(req.body.price) || 600,
    advancePaid: Number(req.body.advancePaid) || 0,
    paymentMethod: req.body.paymentMethod || 'cod',
    paymentStatus: 'pending',
    status: 'requested',
    handoverMethod: req.body.handoverMethod || 'customer_drop',
    hasDeliveryAvailable: false,
    measurements: req.body.measurements || '',
    specialInstructions: req.body.specialInstructions || '',
    requiredDate: req.body.requiredDate || new Date(Date.now() + 3*86400000).toISOString().split('T')[0],
    createdAt: now,
    updatedAt: now,
    statusHistory: [
      { status: 'requested', labelEn: 'Order Requested', labelHi: 'ऑर्डर भेजा गया', timestamp: now }
    ]
  };

  db.addOrder(newOrder);

  // Send notification to tailor
  db.addNotification({
    id: 'n_' + Date.now(),
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

  res.status(201).json({ success: true, message: 'Order created successfully in database', data: newOrder });
});

// PATCH /api/orders/:id/status
orderRouter.patch('/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, labelEn, labelHi } = req.body;

  const order = db.orders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const historyEntry = {
    status,
    labelEn: labelEn || `Order Status: ${status}`,
    labelHi: labelHi || `आर्डर स्थिति: ${status}`,
    timestamp: new Date().toISOString()
  };

  db.updateOrderStatus(id, status, historyEntry);
  const updatedOrder = db.orders.find(o => o.id === id);

  res.json({ success: true, message: `Order status updated to ${status}`, data: updatedOrder });
});
