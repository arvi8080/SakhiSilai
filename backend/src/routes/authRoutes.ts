import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { db } from '../data/db';
import { sqlite } from '../data/database';
import type { User, TailorProfile } from '../types';
import { asyncHandler, hashPassword, issueAccessToken, requireAuth, requireRole, verifyPassword, AuthenticatedRequest } from '../middleware/auth';

export const authRouter = Router();

// POST /api/auth/login
authRouter.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const { emailOrPhone, phone, email, password } = req.body;
  const input = (emailOrPhone || email || phone || '').trim().toLowerCase();

  if (!input || typeof password !== 'string' || password.length < 1 || input.length > 254) {
    return res.status(400).json({ success: false, message: 'Enter a valid email or phone and password.' });
  }

  const user = db.users.find(u =>
    (u.email && u.email.toLowerCase() === input) ||
    (u.phone && u.phone.toLowerCase() === input)
  );

  const storedPassword = (user as (User & { password?: string }) | undefined)?.password;
  if (!user || !storedPassword) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const passwordValid = await verifyPassword(password, storedPassword);
  if (!passwordValid && !storedPassword.startsWith('scrypt$') && storedPassword === password) {
    db.updateUserPasswordById(user.id, await hashPassword(password));
  } else if (!passwordValid) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const { password: _password, ...safeUser } = user as User & { password?: string };
  res.json({
    success: true,
    message: 'Authenticated successfully',
    token: issueAccessToken(user.id, user.role),
    data: safeUser
  });
}));

// GET /api/auth/me
authRouter.get('/me', requireAuth, (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).auth!.userId;
  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  const { password: _password, ...safeUser } = user as User & { password?: string };
  res.json({ success: true, data: safeUser });
});

authRouter.get('/customers', requireAuth, requireRole('admin'), (_req: Request, res: Response) => {
  const customers = db.users.filter(u => u.role === 'customer');
  res.json({
    success: true,
    count: customers.length,
    data: customers.map(customer => {
      const { password: _password, ...safeUser } = customer as User & { password?: string };
      return safeUser;
    })
  });
});

// POST /api/auth/forgot-password
authRouter.post('/forgot-password', (_req: Request, res: Response) => {
  res.status(503).json({ success: false, message: 'Secure password recovery is not configured yet' });
});

// POST /api/auth/reset-password
authRouter.post('/reset-password', (_req: Request, res: Response) => {
  res.status(503).json({ success: false, message: 'Secure password recovery is not configured yet' });
});

// POST /api/auth/register (General Customer / User registration)
authRouter.post('/register', asyncHandler(async (req: Request, res: Response) => {
  const { name, phone, email, password, role, state, district, village } = req.body;
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const cleanPhone = typeof phone === 'string' ? phone.trim() : '';

  if (
    typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100 ||
    !/^\S+@\S+\.\S+$/.test(cleanEmail) ||
    !/^\+?[0-9]{10,15}$/.test(cleanPhone) ||
    typeof password !== 'string' || password.length < 12 || password.length > 128 ||
    typeof village !== 'string' || village.trim().length < 2 || village.length > 100 ||
    typeof district !== 'string' || district.trim().length < 2 || district.length > 100
  ) {
    return res.status(400).json({ success: false, message: 'Please provide valid account details and a password of at least 12 characters.' });
  }

  const existingUser = db.users.find(u =>
    (u.phone && u.phone === cleanPhone) || (u.email && u.email.toLowerCase() === cleanEmail)
  );
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User with this phone number or email already exists' });
  }

  const newUserId = `u_${randomUUID()}`;
  const newUser: User & { password?: string } = {
    id: newUserId,
    name: name.trim(),
    phone: cleanPhone,
    email: cleanEmail,
    password: await hashPassword(password),
    role: 'customer',
    state: typeof state === 'string' && state.length <= 100 ? state : 'Uttar Pradesh',
    district: district.trim(),
    village: village.trim(),
    createdAt: new Date().toISOString(),
    isVerified: true
  };

  db.addUser(newUser);

  const { password: _password, ...safeUser } = newUser;
  res.status(201).json({
    success: true,
    message: 'User registered successfully in database',
    token: issueAccessToken(newUser.id, newUser.role),
    data: safeUser
  });
}));

// POST /api/auth/register-tailor
authRouter.post('/register-tailor', requireAuth, requireRole('customer'), (req: Request, res: Response) => {
  const auth = (req as AuthenticatedRequest).auth!;
  const user = db.users.find(candidate => candidate.id === auth.userId);
  const { addressApprox, bio, experienceYears, servicesOffered, startingPrice } = req.body;
  if (!user) return res.status(404).json({ success: false, message: 'Account not found' });
  if (db.tailors.some(tailor => tailor.userId === user.id)) {
    return res.status(409).json({ success: false, message: 'A tailor application already exists for this account' });
  }
  if ((typeof addressApprox === 'string' && addressApprox.length > 300) ||
    (typeof bio === 'string' && bio.length > 1000) ||
    (experienceYears !== undefined && (!Number.isInteger(Number(experienceYears)) || Number(experienceYears) < 0 || Number(experienceYears) > 60)) ||
    (startingPrice !== undefined && (!Number.isFinite(Number(startingPrice)) || Number(startingPrice) < 100 || Number(startingPrice) > 100000)) ||
    (servicesOffered !== undefined && (!Array.isArray(servicesOffered) || servicesOffered.length > 20 || servicesOffered.some((service: unknown) => typeof service !== 'string' || service.length > 100)))) {
    return res.status(400).json({ success: false, message: 'Tailor application details are invalid' });
  }

  const newTailor: TailorProfile = {
    id: `t_${randomUUID()}`,
    userId: user.id,
    name: user.name,
    phone: user.phone,
    avatar: user.avatar || '',
    state: user.state,
    district: user.district,
    village: user.village,
    addressApprox: typeof addressApprox === 'string' && addressApprox.trim() ? addressApprox.trim() : `${user.village}, ${user.district}`,
    bio: typeof bio === 'string' && bio.trim() ? bio.trim() : 'Skilled home tailor',
    experienceYears: Number(experienceYears) || 0,
    rating: 5,
    reviewCount: 0,
    completedOrdersCount: 0,
    availability: 'available',
    maxActiveOrders: 4,
    currentActiveOrders: 0,
    servicesOffered: servicesOffered || ['Blouse Stitching', 'Suit & Salwar Stitching'],
    startingPrice: Number(startingPrice) || 300,
    estCompletionDays: 3,
    skills: [],
    galleryImages: [],
    isVerified: false,
    joinedDate: new Date().toISOString().split('T')[0]
  };

  sqlite.transaction(() => {
    db.addTailor(newTailor);
    db.addNotification({
      id: `n_${randomUUID()}`,
      targetRole: 'admin',
      titleEn: 'New Tailor Application Pending Approval',
      titleHi: 'नया दर्जी आवेदन सत्यापन के लिए लंबित',
      messageEn: `${newTailor.name} from ${newTailor.village} applied to join.`,
      messageHi: `${newTailor.village} से ${newTailor.name} ने आवेदन किया।`,
      timestamp: new Date().toISOString(),
      isRead: false,
      type: 'admin'
    });
  })();

  res.status(201).json({ success: true, message: 'Application submitted for admin approval', data: newTailor });
});

