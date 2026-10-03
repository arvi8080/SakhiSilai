import { Router, Request, Response } from 'express';
import { db } from '../data/db';
import { AuthenticatedRequest, requireRole } from '../middleware/auth';
import type { SystemNotification } from '../types';

export const notificationRouter = Router();

// GET /api/notifications
notificationRouter.get('/', (req: Request, res: Response) => {
  const auth = (req as AuthenticatedRequest).auth!;
  const tailor = auth.role === 'tailor' ? db.tailors.find(item => item.userId === auth.userId) : undefined;

  const results = db.notifications.filter(notification => auth.role === 'admin' ||
    notification.targetRole === 'all' ||
    notification.recipientId === auth.userId ||
    (tailor && notification.recipientId === tailor.id)
  );

  res.json({ success: true, count: results.length, data: results });
});

// POST /api/notifications
notificationRouter.post('/', requireRole('admin'), (req: Request, res: Response) => {
  const { titleEn, titleHi, messageEn, messageHi, targetRole, recipientId, type } = req.body;
  if (!['all', 'customer', 'tailor', 'admin'].includes(targetRole) ||
    typeof titleEn !== 'string' || titleEn.trim().length < 1 || titleEn.length > 160 ||
    typeof messageEn !== 'string' || messageEn.length > 2000) {
    return res.status(400).json({ success: false, message: 'Notification details are invalid' });
  }

  const newNotif: SystemNotification = {
    id: 'n_' + Date.now(),
    targetRole: targetRole || 'all',
    recipientId,
    titleEn: titleEn || 'System Notification',
    titleHi: titleHi || titleEn || 'अधिसूचना',
    messageEn: messageEn || '',
    messageHi: messageHi || messageEn || '',
    timestamp: new Date().toISOString(),
    isRead: false,
    type: type || 'admin'
  };

  db.addNotification(newNotif);
  res.status(201).json({ success: true, message: 'Notification sent successfully', data: newNotif });
});

// POST /api/notifications/broadcast
notificationRouter.post('/broadcast', requireRole('admin'), (req: Request, res: Response) => {
  const { titleEn, titleHi, messageEn, messageHi, targetRole } = req.body;
  if (!['all', 'customer', 'tailor'].includes(targetRole) ||
    typeof titleEn !== 'string' || titleEn.trim().length < 1 || titleEn.length > 160 ||
    typeof messageEn !== 'string' || messageEn.length > 2000) {
    return res.status(400).json({ success: false, message: 'Broadcast details are invalid' });
  }

  const newNotif: SystemNotification = {
    id: 'n_' + Date.now(),
    targetRole: targetRole || 'all',
    titleEn,
    titleHi: titleHi || titleEn,
    messageEn,
    messageHi: messageHi || messageEn,
    timestamp: new Date().toISOString(),
    isRead: false,
    type: 'admin'
  };

  db.addNotification(newNotif);
  res.status(201).json({ success: true, message: 'Broadcast notification sent to database', data: newNotif });
});

