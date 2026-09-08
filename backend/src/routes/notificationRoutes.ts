import { Router, Request, Response } from 'express';
import { db } from '../data/db';
import type { SystemNotification } from '../types';

export const notificationRouter = Router();

// GET /api/notifications
notificationRouter.get('/', (req: Request, res: Response) => {
  const role = req.query.role as string;
  const recipientId = req.query.recipientId as string;

  let results = db.notifications;
  if (role || recipientId) {
    results = results.filter(
      n => n.targetRole === 'all' || n.targetRole === role || n.recipientId === recipientId
    );
  }

  res.json({ success: true, count: results.length, data: results });
});

// POST /api/notifications/broadcast
notificationRouter.post('/broadcast', (req: Request, res: Response) => {
  const { titleEn, titleHi, messageEn, messageHi, targetRole } = req.body;

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

