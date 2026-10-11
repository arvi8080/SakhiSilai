import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { db } from '../data/db';
import { sqlite } from '../data/database';
import { computeHyperlocalMatches } from '../services/matchingService';
import { AuthenticatedRequest, requireAuth, requireRole } from '../middleware/auth';
import type { DesignCatalogItem } from '../types';

export const tailorRouter = Router();

// GET /api/tailors
tailorRouter.get('/', (_req: Request, res: Response) => {
  const tailors = db.tailors;
  res.json({ success: true, count: tailors.length, data: tailors });
});

// GET /api/tailors/me
tailorRouter.get('/me', requireAuth, requireRole('tailor'), (req: Request, res: Response) => {
  const auth = (req as AuthenticatedRequest).auth!;
  const tailor = db.tailors.find(item => item.userId === auth.userId);

  if (!tailor) {
    return res.status(404).json({ success: false, message: 'Tailor profile not found for this account' });
  }

  res.json({ success: true, data: tailor });
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

// GET /api/tailors/designs
tailorRouter.get('/designs', (_req: Request, res: Response) => {
  const verifiedTailorIds = new Set(db.tailors.filter(tailor => tailor.isVerified).map(tailor => tailor.id));
  const designs = db.designs.filter(design => design.isAvailable && verifiedTailorIds.has(design.tailorId));
  res.json({ success: true, count: designs.length, data: designs });
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

// PATCH /api/tailors/:id
// Tailor can edit their own public profile and service information

tailorRouter.patch('/:id', requireAuth, requireRole('tailor', 'admin'), (req: Request, res: Response) => {
  const { id } = req.params;
  const auth = (req as AuthenticatedRequest).auth!;
  const tailor = db.tailors.find(item => item.id === id);

  if (!tailor) {
    return res.status(404).json({ success: false, message: 'Tailor profile not found' });
  }

  if (auth.role !== 'admin' && tailor.userId !== auth.userId) {
    return res.status(403).json({ success: false, message: 'You cannot update another tailor profile' });
  }

  const updates = {
    name: typeof req.body.name === 'string' ? req.body.name.trim() : undefined,
    phone: typeof req.body.phone === 'string' ? req.body.phone.trim() : undefined,
    village: typeof req.body.village === 'string' ? req.body.village.trim() : undefined,
    district: typeof req.body.district === 'string' ? req.body.district.trim() : undefined,
    addressApprox: typeof req.body.addressApprox === 'string' ? req.body.addressApprox.trim() : undefined,
    bio: typeof req.body.bio === 'string' ? req.body.bio.trim() : undefined,
    experienceYears: req.body.experienceYears !== undefined ? Number(req.body.experienceYears) : undefined,
    startingPrice: req.body.startingPrice !== undefined ? Number(req.body.startingPrice) : undefined,
    skills: Array.isArray(req.body.skills) ? req.body.skills.map((s: unknown) => String(s).trim()).filter(Boolean) : undefined,
    avatar: typeof req.body.avatar === 'string' ? req.body.avatar.trim() : undefined,
    servicesOffered: Array.isArray(req.body.servicesOffered) ? req.body.servicesOffered.map((s: unknown) => String(s).trim()).filter(Boolean) : undefined,
    estCompletionDays: req.body.estCompletionDays !== undefined ? Number(req.body.estCompletionDays) : undefined
  };

  if (updates.name !== undefined && updates.name.length < 2) {
    return res.status(400).json({ success: false, message: 'Tailor name is required' });
  }

  if (updates.phone !== undefined && !/^\+?[0-9]{10,15}$/.test(updates.phone)) {
    return res.status(400).json({ success: false, message: 'Phone number is invalid' });
  }

  if (updates.startingPrice !== undefined && (Number(updates.startingPrice) < 100 || Number(updates.startingPrice) > 100000)) {
    return res.status(400).json({ success: false, message: 'Starting price is out of range' });
  }

  db.updateTailorProfile(id, updates as any);
  const updated = db.tailors.find(item => item.id === id);
  res.json({ success: true, message: 'Tailor profile updated', data: updated });
});

// POST /api/tailors/:id/gallery
tailorRouter.post('/:id/gallery', requireAuth, requireRole('tailor'), (req: Request, res: Response) => {
  const { id } = req.params;
  const auth = (req as AuthenticatedRequest).auth!;
  const tailor = db.tailors.find(item => item.id === id && item.userId === auth.userId);

  if (!tailor) {
    return res.status(404).json({ success: false, message: 'Tailor profile not found for this account' });
  }

  const image = req.body.image;
  if (
    typeof image !== 'string' ||
    image.length > 80_000 ||
    !/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(image)
  ) {
    return res.status(400).json({ success: false, message: 'Choose a valid JPEG photo under 55 KB' });
  }

  const galleryImages = tailor.galleryImages || [];
  if (galleryImages.length >= 24) {
    return res.status(400).json({ success: false, message: 'Gallery can contain up to 24 photos' });
  }

  db.updateTailorProfile(id, { galleryImages: [...galleryImages, image] });
  const updated = db.tailors.find(item => item.id === id);
  res.status(201).json({ success: true, message: 'Photo added to your gallery', data: updated });
});

// DELETE /api/tailors/:id/gallery/:imageIndex
tailorRouter.delete('/:id/gallery/:imageIndex', requireAuth, requireRole('tailor'), (req: Request, res: Response) => {
  const { id } = req.params;
  const imageIndex = Number(req.params.imageIndex);
  const auth = (req as AuthenticatedRequest).auth!;
  const tailor = db.tailors.find(item => item.id === id && item.userId === auth.userId);

  if (!tailor) {
    return res.status(404).json({ success: false, message: 'Tailor profile not found for this account' });
  }

  const galleryImages = tailor.galleryImages || [];
  if (!Number.isInteger(imageIndex) || imageIndex < 0 || imageIndex >= galleryImages.length) {
    return res.status(404).json({ success: false, message: 'Gallery photo not found' });
  }

  db.updateTailorProfile(id, { galleryImages: galleryImages.filter((_, index) => index !== imageIndex) });
  const updated = db.tailors.find(item => item.id === id);
  res.json({ success: true, message: 'Photo removed from your gallery', data: updated });
});

// POST /api/tailors/:id/capacity
tailorRouter.post('/:id/capacity', requireAuth, requireRole('tailor'), (req: Request, res: Response) => {
  const { id } = req.params;
  const auth = (req as AuthenticatedRequest).auth!;
  const tailor = db.tailors.find(item => item.id === id && item.userId === auth.userId);

  if (!tailor) {
    return res.status(404).json({ success: false, message: 'Tailor profile not found for this account' });
  }

  const maxActiveOrders = Number(req.body.maxActiveOrders);
  if (!Number.isInteger(maxActiveOrders) || maxActiveOrders < 1 || maxActiveOrders > 50) {
    return res.status(400).json({ success: false, message: 'Capacity must be between 1 and 50 active orders' });
  }

  db.updateTailorCapacity(id, maxActiveOrders);
  const updated = db.tailors.find(item => item.id === id);
  res.json({ success: true, message: 'Tailor capacity updated', data: updated });
});

// POST /api/tailors/:id/designs
tailorRouter.post('/:id/designs', requireAuth, requireRole('tailor'), (req: Request, res: Response) => {
  const { id } = req.params;
  const auth = (req as AuthenticatedRequest).auth!;
  const tailor = db.tailors.find(item => item.id === id && item.userId === auth.userId);

  if (!tailor) {
    return res.status(404).json({ success: false, message: 'Tailor profile not found for this account' });
  }

  const { title, categoryId, categoryName, image, price, estDays, description } = req.body;
  if (typeof title !== 'string' || title.trim().length < 2 || !Number.isFinite(Number(price)) || Number(price) <= 0) {
    return res.status(400).json({ success: false, message: 'Design title and price are required' });
  }
  if (
    typeof image !== 'string' ||
    image.length > 80_000 ||
    (!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(image) && !/^https:\/\//i.test(image))
  ) {
    return res.status(400).json({ success: false, message: 'Choose a valid image under 55 KB or provide an HTTPS image URL' });
  }

  const newDesign: DesignCatalogItem = {
    id: `d_${randomUUID()}`,
    tailorId: tailor.id,
    tailorName: tailor.name,
    categoryId: typeof categoryId === 'string' && categoryId.trim()
      ? categoryId.trim()
      : categoryName?.toString().toLowerCase().includes('blouse') ? 'blouse' : 'custom',
    categoryName: categoryName || 'Custom Design',
    title: title.trim(),
    image: image.trim(),
    price: Number(price),
    estDays: Number(estDays) || 3,
    description: typeof description === 'string' ? description.trim() : '',
    isAvailable: true
  };

  sqlite.transaction(() => db.addDesign(newDesign))();
  res.status(201).json({ success: true, message: 'Design added to catalog', data: newDesign });
});

// DELETE /api/tailors/:id/designs/:designId
tailorRouter.delete('/:id/designs/:designId', requireAuth, requireRole('tailor'), (req: Request, res: Response) => {
  const { id, designId } = req.params;
  const auth = (req as AuthenticatedRequest).auth!;
  const tailor = db.tailors.find(item => item.id === id && item.userId === auth.userId);
  const design = db.designs.find(item => item.id === designId && item.tailorId === id);

  if (!tailor || !design) {
    return res.status(404).json({ success: false, message: 'Design or tailor profile not found' });
  }

  db.deleteDesign(designId);
  res.json({ success: true, message: 'Design removed from catalog' });
});

// POST /api/tailors/availability
tailorRouter.post('/availability', requireAuth, requireRole('tailor'), (req: Request, res: Response) => {
  const { tailorId, availability } = req.body;
  const auth = (req as AuthenticatedRequest).auth!;
  const tailor = db.tailors.find(t => t.id === tailorId);
  if (!tailor || tailor.userId !== auth.userId || !['available', 'limited', 'unavailable'].includes(availability)) {
    return res.status(404).json({ success: false, message: 'Tailor profile not found' });
  }
  db.updateTailorAvailability(tailorId, availability);
  const updated = db.tailors.find(t => t.id === tailorId);
  res.json({ success: true, message: `Availability status updated to ${availability}`, data: updated });
});
