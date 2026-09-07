import { Router, Request, Response } from 'express';
import { db } from '../data/db';
import type { ServiceCategory } from '../types';

export const categoryRouter = Router();

// GET /api/categories
categoryRouter.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, count: db.categories.length, data: db.categories });
});

// POST /api/categories
categoryRouter.post('/', (req: Request, res: Response) => {
  const { nameEn, nameHi, iconName, descriptionEn, descriptionHi, startingPrice, estDays } = req.body;

  const newCat: ServiceCategory = {
    id: 'cat_' + Date.now(),
    nameEn,
    nameHi: nameHi || nameEn,
    iconName: iconName || 'Scissors',
    descriptionEn: descriptionEn || '',
    descriptionHi: descriptionHi || '',
    startingPrice: Number(startingPrice) || 300,
    estDays: Number(estDays) || 3
  };

  db.categories.push(newCat);
  res.status(201).json({ success: true, message: 'Category created', data: newCat });
});

// DELETE /api/categories/:id
categoryRouter.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = db.categories.findIndex(c => c.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }
  const deleted = db.categories.splice(idx, 1);
  res.json({ success: true, message: 'Category deleted', data: deleted[0] });
});
