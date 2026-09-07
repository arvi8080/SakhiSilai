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

  const targetState = db.locations.find(s => s.id === stateId || s.name === stateId);
  if (!targetState) {
    return res.status(404).json({ success: false, message: 'State not found' });
  }

  const targetDistrict = targetState.districts.find(d => d.id === districtId || d.name === districtId);
  if (!targetDistrict) {
    return res.status(404).json({ success: false, message: 'District not found' });
  }

  if (!targetDistrict.villages.includes(villageName)) {
    targetDistrict.villages.push(villageName);
  }

  res.status(201).json({
    success: true,
    message: `Village ${villageName} added to ${targetDistrict.name}`,
    data: db.locations
  });
});
