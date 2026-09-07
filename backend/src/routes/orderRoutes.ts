import { Router, Request, Response } from 'express';

export const orderRouter = Router();

interface OrderRecord {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  tailorId: string;
  tailorName: string;
  status: string;
  price: number;
  createdAt: string;
}

const mockOrders: OrderRecord[] = [
  {
    id: 'ord_101',
    orderNumber: 'SK-2026-001',
    customerId: 'u_pria',
    customerName: 'Priya Singh',
    tailorId: 't_sunita',
    tailorName: 'Sunita Devi',
    status: 'stitching',
    price: 600,
    createdAt: new Date().toISOString()
  }
];

// GET /api/orders
orderRouter.get('/', (req: Request, res: Response) => {
  res.json({ success: true, count: mockOrders.length, data: mockOrders });
});

// POST /api/orders
orderRouter.post('/', (req: Request, res: Response) => {
  const newOrder: OrderRecord = {
    id: 'ord_' + Date.now(),
    orderNumber: 'SK-2026-' + Math.floor(100 + Math.random() * 900),
    customerId: req.body.customerId || 'u_pria',
    customerName: req.body.customerName || 'Priya Singh',
    tailorId: req.body.tailorId || 't_sunita',
    tailorName: req.body.tailorName || 'Sunita Devi',
    status: 'requested',
    price: req.body.price || 400,
    createdAt: new Date().toISOString()
  };
  mockOrders.unshift(newOrder);
  res.status(201).json({ success: true, message: 'Order created successfully', data: newOrder });
});

// PATCH /api/orders/:id/status
orderRouter.patch('/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = mockOrders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  order.status = status;
  res.json({ success: true, message: `Order status updated to ${status}`, data: order });
});
