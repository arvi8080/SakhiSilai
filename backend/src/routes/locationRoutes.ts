import { Router, Request, Response } from 'express';
import { db } from '../data/db';

export const locationRouter = Router();

// GET /api/locations
locationRouter.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, count: db.locations.length, data: db.locations });
});

// POST /api/locations/villages (Add Village to District)
locationRouter.post('/villages', (req: Request, res: Response) => {
  const { stateId, districtId, villageName } = req.body;

  if (!stateId || !districtId || !villageName) {
    return res.status(400).json({ success: false, message: 'stateId, districtId and villageName are required' });
  }

  const success = db.addVillage(stateId, districtId, villageName);
  if (!success) {
    return res.status(404).json({ success: false, message: 'State or district not found' });
  }

  res.status(201).json({
    success: true,
    message: `Village ${villageName} added successfully to database`,
    data: db.locations
  });
});

