import { Router, Request, Response } from 'express';
import { db } from '../data/db';
import { computeHyperlocalMatches } from '../services/matchingService';

export const tailorRouter = Router();

// GET /api/tailors
tailorRouter.get('/', (_req: Request, res: Response) => {
  const tailors = db.tailors;
  res.json({ success: true, count: tailors.length, data: tailors });
});

// GET /api/tailors/nearby
tailorRouter.get('/nearby', (req: Request, res: Response) => {
  const state = (req.query.state as string) || 'Uttar Pradesh';
  const district = (req.query.district as string) || 'Lucknow';
  const village = (req.query.village as string) || 'Mohanlalganj';

  const allTailors = db.tailors;
  const matches = computeHyperlocalMatches(allTailors, state, district, village);
  res.json({ success: true, count: matches.length, data: matches });
});

// GET /api/tailors/:id
tailorRouter.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const tailor = db.tailors.find(t => t.id === id || t.userId === id);
  if (!tailor) {
    return res.status(404).json({ success: false, message: 'Tailor profile not found' });
  }
  res.json({ success: true, data: tailor });
});

// POST /api/tailors/availability
tailorRouter.post('/availability', (req: Request, res: Response) => {
  const { tailorId, availability } = req.body;
  const tailor = db.tailors.find(t => t.id === tailorId);
  if (!tailor) {
    return res.status(404).json({ success: false, message: 'Tailor profile not found' });
  }
  db.updateTailorAvailability(tailorId, availability);
  const updated = db.tailors.find(t => t.id === tailorId);
  res.json({ success: true, message: `Availability status updated to ${availability}`, data: updated });
});

