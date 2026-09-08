import { Router, Request, Response } from 'express';
import { db } from '../data/db';
import type { User, TailorProfile } from '../types';

export const authRouter = Router();

// POST /api/auth/login
authRouter.post('/login', (req: Request, res: Response) => {
  const { phone, role } = req.body;
  const user = db.users.find(u => u.phone === phone || (role && u.role === role));

  if (!user) {
    return res.status(404).json({ success: false, message: 'User profile not found. Please register.' });
  }

  res.json({ success: true, message: 'Authenticated successfully', data: user });
});

// POST /api/auth/register (General Customer / User registration)
authRouter.post('/register', (req: Request, res: Response) => {
  const { name, phone, email, role, state, district, village } = req.body;

  const existingUser = db.users.find(u => u.phone === phone);
  if (existingUser) {
    return res.json({ success: true, message: 'User already exists', data: existingUser });
  }

  const newUserId = 'u_' + Date.now();
  const newUser: User = {
    id: newUserId,
    name: name || 'User ' + phone.slice(-4),
    phone,
    email: email || '',
    role: role || 'customer',
    state: state || 'Uttar Pradesh',
    district: district || 'Lucknow',
    village: village || 'Mohanlalganj',
    createdAt: new Date().toISOString(),
    isVerified: true
  };

  db.addUser(newUser);

  res.status(201).json({
    success: true,
    message: 'User registered successfully in database',
    data: newUser
  });
});

// POST /api/auth/register-tailor
authRouter.post('/register-tailor', (req: Request, res: Response) => {
  const { name, phone, state, district, village, addressApprox, bio, experienceYears, servicesOffered, startingPrice } = req.body;

  const newUserId = 'u_' + Date.now();
  const newTailorId = 't_' + Date.now();

  const newUser: User = {
    id: newUserId,
    name,
    phone,
    role: 'tailor',
    state,
    district,
    village,
    createdAt: new Date().toISOString(),
    isVerified: false
  };

  const newTailor: TailorProfile = {
    id: newTailorId,
    userId: newUserId,
    name,
    phone,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    state,
    district,
    village,
    addressApprox: addressApprox || `${village}, ${district}`,
    bio: bio || 'Skilled home tailor',
    experienceYears: Number(experienceYears) || 3,
    rating: 5.0,
    reviewCount: 0,
    completedOrdersCount: 0,
    availability: 'available',
    maxActiveOrders: 4,
    currentActiveOrders: 0,
    servicesOffered: servicesOffered || ['Blouse Stitching', 'Suit & Salwar Stitching'],
    startingPrice: Number(startingPrice) || 300,
    estCompletionDays: 3,
    skills: ['Custom Stitching'],
    galleryImages: [],
    isVerified: false, // Pending admin approval
    joinedDate: new Date().toISOString().split('T')[0]
  };

  db.addUser(newUser);
  db.addTailor(newTailor);

  // Notify admin
  db.addNotification({
    id: 'n_' + Date.now(),
    targetRole: 'all',
    titleEn: 'New Tailor Registration Pending Approval',
    titleHi: 'नया दर्जी पंजीकरण सत्यापन के लिए लंबित',
    messageEn: `${newTailor.name} from ${newTailor.village} registered.`,
    messageHi: `${newTailor.village} से ${newTailor.name} ने पंजीकरण किया।`,
    timestamp: new Date().toISOString(),
    isRead: false,
    type: 'admin'
  });

  res.status(201).json({
    success: true,
    message: 'Tailor registered successfully. Pending admin approval.',
    data: newTailor
  });
});

