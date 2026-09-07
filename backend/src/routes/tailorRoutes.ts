import { Router, Request, Response } from 'express';
import { computeHyperlocalMatches } from '../services/matchingService';

export const tailorRouter = Router();

// Sample in-memory DB seed for backend API
const mockTailors = [
  {
    id: 't_sunita',
    name: 'Sunita Devi',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    village: 'Mohanlalganj',
    availability: 'available' as const,
    maxActiveOrders: 5,
    currentActiveOrders: 2,
    rating: 4.9,
    isVerified: true,
    servicesOffered: ['Blouse Stitching', 'Suit & Salwar Stitching', 'Dress & Kurti']
  },
  {
    id: 't_radha',
    name: 'Radha Sharma',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    village: 'Mohanlalganj',
    availability: 'available' as const,
    maxActiveOrders: 4,
    currentActiveOrders: 1,
    rating: 4.8,
    isVerified: true,
    servicesOffered: ['Blouse Stitching', 'Suit & Salwar Stitching', 'Kids Clothing']
  }
];

// GET /api/tailors/nearby
tailorRouter.get('/nearby', (req: Request, res: Response) => {
  const state = (req.query.state as string) || 'Uttar Pradesh';
  const district = (req.query.district as string) || 'Lucknow';
  const village = (req.query.village as string) || 'Mohanlalganj';

  const matches = computeHyperlocalMatches(mockTailors, state, district, village);
  res.json({ success: true, count: matches.length, data: matches });
});

// POST /api/tailors/availability
tailorRouter.post('/availability', (req: Request, res: Response) => {
  const { tailorId, availability } = req.body;
  const tailor = mockTailors.find(t => t.id === tailorId);
  if (!tailor) {
    return res.status(404).json({ success: false, message: 'Tailor not found' });
  }
  tailor.availability = availability;
  res.json({ success: true, message: `Status updated to ${availability}`, data: tailor });
});
