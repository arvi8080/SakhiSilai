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

  db.addCategory(newCat);
  res.status(201).json({ success: true, message: 'Category created in database', data: newCat });
});

// DELETE /api/categories/:id
categoryRouter.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const existing = db.categories.find(c => c.id === id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }
  db.deleteCategory(id);
  res.json({ success: true, message: 'Category deleted from database', data: existing });
});

