import { Router, Request, Response } from 'express';
import { db } from '../data/db';
import type { CustomDesignRequest, QuoteOffer, Order } from '../types';

export const customRequestRouter = Router();

// GET /api/custom-requests
customRequestRouter.get('/', (req: Request, res: Response) => {
  const village = req.query.village as string;
  let results = db.customRequests;

  if (village) {
    results = results.filter(r => r.customerVillage.toLowerCase() === village.toLowerCase());
  }

  res.json({ success: true, count: results.length, data: results });
});

// POST /api/custom-requests (Customer posts photo)
customRequestRouter.post('/', (req: Request, res: Response) => {
  const { customerId, customerName, customerVillage, customerDistrict, customerState, requestTitle, clothingCategory, referenceImage, specialInstructions, requiredDate } = req.body;

  const newReq: CustomDesignRequest = {
    id: 'req_' + Date.now(),
    customerId: customerId || 'u_pria',
    customerName: customerName || 'Priya Singh',
    customerVillage: customerVillage || 'Mohanlalganj',
    customerDistrict: customerDistrict || 'Lucknow',
    customerState: customerState || 'Uttar Pradesh',
    requestTitle,
    clothingCategory,
    referenceImage,
    specialInstructions: specialInstructions || '',
    requiredDate,
    createdAt: new Date().toISOString(),
    status: 'open',
    offers: []
  };

  db.addCustomRequest(newReq);

  // Notify tailors in area
  db.addNotification({
    id: 'n_' + Date.now(),
    targetRole: 'tailor',
    titleEn: 'New Custom Photo Request Posted',
    titleHi: 'नया विशेष डिज़ाइन फोटो अनुरोध',
    messageEn: `${newReq.customerName} uploaded a dress photo in ${newReq.customerVillage}.`,
    messageHi: `${newReq.customerVillage} में ${newReq.customerName} ने डिज़ाइन अपलोड किया।`,
    timestamp: new Date().toISOString(),
    isRead: false,
    type: 'quote'
  });

  res.status(201).json({ success: true, message: 'Custom request posted to database', data: newReq });
});

// POST /api/custom-requests/:id/quotes (Tailor submits quote)
customRequestRouter.post('/:id/quotes', (req: Request, res: Response) => {
  const { id } = req.params;
  const { tailorId, tailorName, tailorVillage, tailorRating, tailorPhone, price, estDays, note } = req.body;

  const requestObj = db.customRequests.find(r => r.id === id);
  if (!requestObj) {
    return res.status(404).json({ success: false, message: 'Custom request not found' });
  }

  const newOffer: QuoteOffer = {
    id: 'off_' + Date.now(),
    tailorId,
    tailorName,
    tailorVillage,
    tailorRating: Number(tailorRating) || 5.0,
    tailorPhone: tailorPhone || '9876543210',
    price: Number(price),
    estDays: Number(estDays),
    note: note || '',
    createdAt: new Date().toISOString()
  };

  db.addOfferToCustomRequest(id, newOffer);

  // Notify customer
  db.addNotification({
    id: 'n_' + Date.now(),
    targetRole: 'customer',
    recipientId: requestObj.customerId,
    titleEn: `New Price Quote from ${tailorName}`,
    titleHi: `${tailorName} से नया सिलाई प्रस्ताव`,
    messageEn: `Tailor quoted ₹${price} for your custom design.`,
    messageHi: `दर्जी ने ₹${price} की दर का प्रस्ताव दिया है।`,
    timestamp: new Date().toISOString(),
    isRead: false,
    type: 'quote'
  });

  res.json({ success: true, message: 'Quote offer submitted', data: newOffer });
});

// POST /api/custom-requests/:id/accept-quote (Customer accepts quote)
customRequestRouter.post('/:id/accept-quote', (req: Request, res: Response) => {
  const { id } = req.params;
  const { offerId } = req.body;

  const requestObj = db.customRequests.find(r => r.id === id);
  if (!requestObj) {
    return res.status(404).json({ success: false, message: 'Request not found' });
  }

  const offer = requestObj.offers.find(o => o.id === offerId);
  if (!offer) {
    return res.status(404).json({ success: false, message: 'Offer not found' });
  }

  // Convert to order
  const now = new Date().toISOString();
  const createdOrder: Order = {
    id: 'ord_' + Date.now(),
    orderNumber: 'SK-2026-' + Math.floor(100 + Math.random() * 900),
    customerId: requestObj.customerId,
    customerName: requestObj.customerName,
    customerPhone: '9812345678',
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

  db.addOrder(createdOrder);

  res.json({
    success: true,
    message: 'Quote accepted and order created in database successfully',
    data: createdOrder
  });
});
