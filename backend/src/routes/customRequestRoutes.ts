import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { db } from '../data/db';
import { sqlite } from '../data/database';
import { AuthenticatedRequest, requireRole } from '../middleware/auth';
import type { CustomDesignRequest, QuoteOffer, Order } from '../types';

export const customRequestRouter = Router();

// GET /api/custom-requests
customRequestRouter.get('/', (req: Request, res: Response) => {
  const village = req.query.village as string;
  const auth = (req as AuthenticatedRequest).auth!;
  const caller = db.users.find(user => user.id === auth.userId);
  let results = db.customRequests.filter(request => {
    if (auth.role === 'admin') return true;
    if (auth.role === 'customer') return request.customerId === auth.userId;
    return Boolean(caller && request.customerDistrict === caller.district);
  });

  if (village) {
    results = results.filter(r => r.customerVillage.toLowerCase() === village.toLowerCase());
  }

  res.json({ success: true, count: results.length, data: results });
});

// POST /api/custom-requests (Customer posts photo)
customRequestRouter.post('/', requireRole('customer'), (req: Request, res: Response) => {
  const auth = (req as AuthenticatedRequest).auth!;
  const customer = db.users.find(user => user.id === auth.userId);
  const { requestTitle, clothingCategory, referenceImage, specialInstructions, requiredDate } = req.body;
  if (!customer || typeof requestTitle !== 'string' || requestTitle.trim().length < 3 || requestTitle.length > 120 ||
    typeof clothingCategory !== 'string' || clothingCategory.length > 100 || typeof requiredDate !== 'string') {
    return res.status(400).json({ success: false, message: 'Custom request details are invalid' });
  }

  const newReq: CustomDesignRequest = {
    id: `req_${randomUUID()}`,
    customerId: customer.id,
    customerName: customer.name,
    customerVillage: customer.village,
    customerDistrict: customer.district,
    customerState: customer.state,
    requestTitle: requestTitle.trim(),
    clothingCategory: clothingCategory.trim(),
    referenceImage: typeof referenceImage === 'string' ? referenceImage.slice(0, 2000) : '',
    specialInstructions: specialInstructions || '',
    requiredDate,
    createdAt: new Date().toISOString(),
    status: 'open',
    offers: []
  };

  sqlite.transaction(() => {
    db.addCustomRequest(newReq);
    db.addNotification({
      id: `n_${randomUUID()}`,
      targetRole: 'tailor',
      titleEn: 'New Custom Photo Request Posted',
      titleHi: 'नया विशेष डिज़ाइन फोटो अनुरोध',
      messageEn: `${newReq.customerName} uploaded a dress photo in ${newReq.customerVillage}.`,
      messageHi: `${newReq.customerVillage} में ${newReq.customerName} ने डिज़ाइन अपलोड किया।`,
      timestamp: new Date().toISOString(),
      isRead: false,
      type: 'quote'
    });
  })();

  res.status(201).json({ success: true, message: 'Custom request posted to database', data: newReq });
});

// POST /api/custom-requests/:id/quotes (Tailor submits quote)
customRequestRouter.post('/:id/quotes', requireRole('tailor'), (req: Request, res: Response) => {
  const { id } = req.params;
  const { price, estDays, note } = req.body;
  const auth = (req as AuthenticatedRequest).auth!;
  const tailorProfile = db.tailors.find(tailor => tailor.userId === auth.userId);
  if (!tailorProfile || !Number.isFinite(Number(price)) || Number(price) <= 0 || Number(price) > 100000 ||
    !Number.isInteger(Number(estDays)) || Number(estDays) < 1 || Number(estDays) > 365 ||
    (typeof note === 'string' && note.length > 1000)) {
    return res.status(400).json({ success: false, message: 'Quote details are invalid' });
  }

  const requestObj = db.customRequests.find(r => r.id === id);
  if (!requestObj) {
    return res.status(404).json({ success: false, message: 'Custom request not found' });
  }

  const newOffer: QuoteOffer = {
    id: `off_${randomUUID()}`,
    tailorId: tailorProfile.id,
    tailorName: tailorProfile.name,
    tailorVillage: tailorProfile.village,
    tailorRating: tailorProfile.rating,
    tailorPhone: tailorProfile.phone,
    price: Number(price),
    estDays: Number(estDays),
    note: typeof note === 'string' ? note.trim() : '',
    createdAt: new Date().toISOString()
  };

  sqlite.transaction(() => {
    db.addOfferToCustomRequest(id, newOffer);
    db.addNotification({
      id: `n_${randomUUID()}`,
      targetRole: 'customer',
      recipientId: requestObj.customerId,
      titleEn: `New Price Quote from ${tailorProfile.name}`,
      titleHi: `${tailorProfile.name} से नया सिलाई प्रस्ताव`,
      messageEn: `Tailor quoted ₹${price} for your custom design.`,
      messageHi: `दर्जी ने ₹${price} की दर का प्रस्ताव दिया है।`,
      timestamp: new Date().toISOString(),
      isRead: false,
      type: 'quote'
    });
  })();

  res.json({ success: true, message: 'Quote offer submitted', data: newOffer });
});

// POST /api/custom-requests/:id/accept-quote (Customer accepts quote)
customRequestRouter.post('/:id/accept-quote', requireRole('customer'), (req: Request, res: Response) => {
  const { id } = req.params;
  const { offerId } = req.body;

  const requestObj = db.customRequests.find(r => r.id === id);
  if (!requestObj) {
    return res.status(404).json({ success: false, message: 'Request not found' });
  }
  const auth = (req as AuthenticatedRequest).auth!;
  if (requestObj.customerId !== auth.userId) {
    return res.status(403).json({ success: false, message: 'You cannot accept a quote for this request' });
  }
  const idempotencyKey = `${id}_${String(offerId || '')}`;
  const prior = db.getIdempotencyRecord('accept-quote', idempotencyKey);
  if (prior) {
    if (prior.ownerId !== auth.userId) return res.status(409).json({ success: false, message: 'Idempotency key conflict' });
    return res.json({ success: true, replayed: true, data: JSON.parse(prior.responseJson) });
  }
  if (requestObj.status !== 'open') {
    return res.status(409).json({ success: false, message: 'This request already has an accepted quote' });
  }

  const offer = requestObj.offers.find(o => o.id === offerId);
  if (!offer) {
    return res.status(404).json({ success: false, message: 'Offer not found' });
  }

  // Convert to order
  const now = new Date().toISOString();
  const createdOrder: Order = {
    id: `ord_${randomUUID()}`,
    orderNumber: `SK-${new Date().getFullYear()}-${randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase()}`,
    customerId: requestObj.customerId,
    customerName: requestObj.customerName,
    customerPhone: db.users.find(user => user.id === requestObj.customerId)?.phone || '',
    customerVillage: requestObj.customerVillage,
    customerDistrict: requestObj.customerDistrict,
    customerState: requestObj.customerState,
    tailorId: offer.tailorId,
    tailorName: offer.tailorName,
    tailorVillage: offer.tailorVillage,
    tailorPhone: offer.tailorPhone,
    categoryId: 'custom',
    categoryName: requestObj.clothingCategory,
    designTitle: requestObj.requestTitle,
    designImage: requestObj.referenceImage,
    price: offer.price,
    advancePaid: 0,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    status: 'requested',
    handoverMethod: 'customer_drop',
    hasDeliveryAvailable: false,
    measurements: 'Handover during drop',
    specialInstructions: `${requestObj.specialInstructions} (Quote Note: ${offer.note})`,
    requiredDate: requestObj.requiredDate,
    createdAt: now,
    updatedAt: now,
    statusHistory: [
      { status: 'requested', labelEn: 'Order Requested', labelHi: 'ऑर्डर भेजा गया', timestamp: now }
    ]
  };

  sqlite.transaction(() => {
    if (!db.acceptCustomRequestQuote(id, offerId)) throw new Error('Quote has already been accepted');
    db.addOrder(createdOrder);
    db.addIdempotencyRecord('accept-quote', idempotencyKey, auth.userId, createdOrder);
  })();

  res.json({
    success: true,
    message: 'Quote accepted and order created in database successfully',
    data: createdOrder
  });
});
