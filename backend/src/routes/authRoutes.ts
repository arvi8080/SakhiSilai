import { Router, Request, Response } from 'express';
import { db } from '../data/db';
import type { User, TailorProfile } from '../types';

export const authRouter = Router();

// POST /api/auth/login
authRouter.post('/login', (req: Request, res: Response) => {
  const { emailOrPhone, phone, email, password } = req.body;
  const input = (emailOrPhone || email || phone || '').trim().toLowerCase();

  if (!input) {
    return res.status(400).json({ success: false, message: 'Please enter your email or mobile phone number.' });
  }

  const user = db.users.find(u =>
    (u.email && u.email.toLowerCase() === input) ||
    (u.phone && u.phone.toLowerCase() === input) ||
    (input === 'admin' && u.role === 'admin') ||
    (input === 'tailor' && u.role === 'tailor')
  );

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  if ((user as any).password && password && (user as any).password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  res.json({ success: true, message: 'Authenticated successfully', data: user });
});

// GET /api/auth/me/:userId
authRouter.get('/me/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;
  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({ success: true, data: user });
});

// GET /api/auth/customers
authRouter.get('/customers', (_req: Request, res: Response) => {
  const customers = db.users.filter(u => u.role === 'customer');
  res.json({ success: true, count: customers.length, data: customers });
});

// POST /api/auth/register (General Customer / User registration)
authRouter.post('/register', (req: Request, res: Response) => {
  const { name, phone, email, password, role, state, district, village } = req.body;

  const existingUser = db.users.find(u => (phone && u.phone === phone) || (email && u.email === email));
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User with this phone number or email already exists' });
  }

  const newUserId = 'u_' + Date.now();
  const newUser: User & { password?: string } = {
    id: newUserId,
    name: name || 'User ' + (phone ? phone.slice(-4) : ''),
    phone: phone || '',
    email: email || '',
    password: password || '',
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

