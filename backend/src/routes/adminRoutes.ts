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

adminRouter.get('/complaints', (_req: Request, res: Response) => {
  res.json({ success: true, count: db.complaints.length, data: db.complaints });
});

adminRouter.post('/users/:id/block', (req: Request, res: Response) => {
  const { id } = req.params;
  const { isBlocked } = req.body;
  const user = db.users.find(item => item.id === id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  db.toggleUserBlock(id, Boolean(isBlocked));
  res.json({
    success: true,
    message: `User ${user.name} ${Boolean(isBlocked) ? 'blocked' : 'unblocked'}`,
    data: { ...user, isBlocked: Boolean(isBlocked) }
  });
});

adminRouter.post('/complaints/:id/resolve', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, resolutionNote } = req.body;
  const complaint = db.complaints.find(item => item.id === id);
  if (!complaint) {
    return res.status(404).json({ success: false, message: 'Complaint not found' });
  }

  const safeStatus = status === 'investigating' || status === 'resolved' ? status : 'resolved';
  db.resolveComplaint(id, safeStatus, resolutionNote || 'Resolved by SakhiSilai platform admin');

  res.json({
    success: true,
    message: `Complaint ${id} updated to ${safeStatus}`,
    data: { ...complaint, status: safeStatus, resolutionNote: resolutionNote || 'Resolved by SakhiSilai platform admin' }
  });
});

const handleVerifyTailor = (req: Request, res: Response) => {
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
};

// PATCH /api/admin/tailors/:id/verify
adminRouter.patch('/tailors/:id/verify', handleVerifyTailor);

// POST /api/admin/tailors/:id/verify (For frontend compatibility)
adminRouter.post('/tailors/:id/verify', handleVerifyTailor);

