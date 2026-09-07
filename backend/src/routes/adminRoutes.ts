import { Router, Request, Response } from 'express';
import { db } from '../data/db';

export const adminRouter = Router();

// GET /api/admin/stats
adminRouter.get('/stats', (_req: Request, res: Response) => {
  const verifiedTailors = db.tailors.filter(t => t.isVerified);
  const pendingTailors = db.tailors.filter(t => !t.isVerified);
  const activeOrders = db.orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');
  const completedOrders = db.orders.filter(o => o.status === 'completed');
  const totalRevenue = db.orders.reduce((sum, o) => sum + (o.status === 'completed' ? o.price : 0), 0);

  res.json({
    success: true,
    data: {
      totalCustomers: db.users.filter(u => u.role === 'customer').length,
      totalTailors: db.tailors.length,
      verifiedTailors: verifiedTailors.length,
      pendingTailors: pendingTailors.length,
      totalOrders: db.orders.length,
      activeOrders: activeOrders.length,
      completedOrders: completedOrders.length,
      totalRevenue
    }
  });
});

// PATCH /api/admin/tailors/:id/verify
adminRouter.patch('/tailors/:id/verify', (req: Request, res: Response) => {
  const { id } = req.params;
  const { isVerified } = req.body;

  const tailor = db.tailors.find(t => t.id === id);
  if (!tailor) {
    return res.status(404).json({ success: false, message: 'Tailor profile not found' });
  }

  db.verifyTailor(id, Boolean(isVerified));
  const updatedTailor = db.tailors.find(t => t.id === id);

  res.json({
    success: true,
    message: `Tailor ${tailor.name} ${isVerified ? 'verified & approved' : 'suspended'}`,
    data: updatedTailor
  });
});
