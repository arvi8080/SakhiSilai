import { sqlite, initDatabase } from './database';
import type {
  User,
  TailorProfile,
  ServiceCategory,
  DesignCatalogItem,
  Order,
  CustomDesignRequest,
  QuoteOffer,
  LocationState,
  Review,
  SystemNotification,
  PaymentRecord
} from '../types';

// Ensure SQLite schemas and initial seeds are present
initDatabase();

function parseStoredJson(value: string | null | undefined, fallback: unknown = '') {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

class SQLiteDatabaseProxy {
  // ------------------------------------------------------------------
  // READ GETTERS (Querying persistent SQLite database)
  // ------------------------------------------------------------------
  get users(): User[] {
    const rows = sqlite.prepare('SELECT * FROM users').all() as any[];
    return rows.map(r => ({
      ...r,
      isVerified: Boolean(r.isVerified),
      isBlocked: Boolean(r.isBlocked)
    }));
  }

  get complaints(): any[] {
    return sqlite.prepare('SELECT * FROM complaints ORDER BY createdAt DESC').all() as any[];
  }

  get tailors(): TailorProfile[] {
    const rows = sqlite.prepare('SELECT * FROM tailors').all() as any[];
    return rows.map(r => ({
      ...r,
      isVerified: Boolean(r.isVerified),
      servicesOffered: r.servicesOffered ? JSON.parse(r.servicesOffered) : [],
      skills: r.skills ? JSON.parse(r.skills) : [],
      galleryImages: r.galleryImages ? JSON.parse(r.galleryImages) : []
    }));
  }

  get categories(): ServiceCategory[] {
    const rows = sqlite.prepare('SELECT * FROM categories').all() as any[];
    return rows.map(r => ({
      ...r,
      popular: Boolean(r.popular)
    }));
  }

  get designs(): DesignCatalogItem[] {
    const rows = sqlite.prepare('SELECT * FROM designs').all() as any[];
    return rows.map(r => ({
      ...r,
      isAvailable: Boolean(r.isAvailable)
    }));
  }

  get orders(): Order[] {
    return this.listOrders();
  }

  listOrders(customerId?: string, tailorId?: string): Order[] {
    const filters: string[] = [];
    const values: string[] = [];
    if (customerId) {
      filters.push('customerId = ?');
      values.push(customerId);
    }
    if (tailorId) {
      filters.push('tailorId = ?');
      values.push(tailorId);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const rows = sqlite.prepare(`SELECT * FROM orders ${whereClause} ORDER BY createdAt DESC`).all(...values) as any[];
    return rows.map(r => ({
      ...r,
      hasDeliveryAvailable: Boolean(r.hasDeliveryAvailable),
      measurements: parseStoredJson(r.measurements),
      statusHistory: r.statusHistory ? JSON.parse(r.statusHistory) : []
    }));
  }

  getOrderById(orderId: string): Order | undefined {
    const row = sqlite.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any;
    if (!row) return undefined;
    return {
      ...row,
      hasDeliveryAvailable: Boolean(row.hasDeliveryAvailable),
      measurements: parseStoredJson(row.measurements),
      statusHistory: row.statusHistory ? JSON.parse(row.statusHistory) : []
    } as Order;
  }

  get customRequests(): CustomDesignRequest[] {
    const rows = sqlite.prepare('SELECT * FROM custom_requests ORDER BY createdAt DESC').all() as any[];
    return rows.map(r => ({
      ...r,
      offers: r.offers ? JSON.parse(r.offers) : []
    }));
  }

  get reviews(): Review[] {
    return sqlite.prepare('SELECT * FROM reviews').all() as Review[];
  }

  get notifications(): SystemNotification[] {
    const rows = sqlite.prepare('SELECT * FROM notifications ORDER BY timestamp DESC').all() as any[];
    return rows.map(r => ({
      ...r,
      isRead: Boolean(r.isRead)
    }));
  }

  get locations(): LocationState[] {
    const rows = sqlite.prepare('SELECT * FROM locations').all() as any[];
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      districts: r.districts ? JSON.parse(r.districts) : []
    }));
  }

  // ------------------------------------------------------------------
  // WRITE MUTATORS (Persisting changes to SQLite database)
  // ------------------------------------------------------------------
  addUser(user: User & { password?: string }) {
    const stmt = sqlite.prepare(`
      INSERT OR REPLACE INTO users (id, name, phone, email, password, role, state, district, village, avatar, createdAt, isVerified, isBlocked)
      VALUES (@id, @name, @phone, @email, @password, @role, @state, @district, @village, @avatar, @createdAt, @isVerified, @isBlocked)
    `);
    stmt.run({
      ...user,
      email: user.email || '',
      password: (user as any).password || '',
      avatar: user.avatar || '',
      isVerified: user.isVerified ? 1 : 0,
      isBlocked: (user as any).isBlocked ? 1 : 0
    });
  }

  updateUserPassword(email: string, newPassword: string) {
    const cleanEmail = email.trim().toLowerCase();
    sqlite.prepare('UPDATE users SET password = ? WHERE LOWER(email) = ? OR LOWER(phone) = ?').run(newPassword, cleanEmail, cleanEmail);
  }

  updateUserPasswordById(userId: string, passwordHash: string) {
    sqlite.prepare('UPDATE users SET password = ? WHERE id = ?').run(passwordHash, userId);
  }

  getIdempotencyRecord(scope: string, key: string) {
    return sqlite.prepare(
      'SELECT ownerId, responseJson FROM idempotency_records WHERE scope = ? AND idempotencyKey = ?'
    ).get(scope, key) as { ownerId: string; responseJson: string } | undefined;
  }

  addIdempotencyRecord(scope: string, key: string, ownerId: string, response: unknown) {
    sqlite.prepare(`
      INSERT INTO idempotency_records (scope, idempotencyKey, ownerId, responseJson, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `).run(scope, key, ownerId, JSON.stringify(response), new Date().toISOString());
  }

  addTailor(tailor: TailorProfile) {
    const stmt = sqlite.prepare(`
      INSERT OR REPLACE INTO tailors (
        id, userId, name, phone, avatar, state, district, village, addressApprox, bio,
        experienceYears, rating, reviewCount, completedOrdersCount, availability, maxActiveOrders,
        currentActiveOrders, servicesOffered, startingPrice, estCompletionDays, skills, galleryImages, isVerified, joinedDate
      ) VALUES (
        @id, @userId, @name, @phone, @avatar, @state, @district, @village, @addressApprox, @bio,
        @experienceYears, @rating, @reviewCount, @completedOrdersCount, @availability, @maxActiveOrders,
        @currentActiveOrders, @servicesOffered, @startingPrice, @estCompletionDays, @skills, @galleryImages, @isVerified, @joinedDate
      )
    `);
    stmt.run({
      ...tailor,
      servicesOffered: JSON.stringify(tailor.servicesOffered || []),
      skills: JSON.stringify(tailor.skills || []),
      galleryImages: JSON.stringify(tailor.galleryImages || []),
      isVerified: tailor.isVerified ? 1 : 0
    });
  }

  verifyTailor(tailorId: string, isVerified: boolean) {
    const flag = isVerified ? 1 : 0;
    const tailor = sqlite.prepare('SELECT userId FROM tailors WHERE id = ?').get(tailorId) as any;
    
    sqlite.prepare('UPDATE tailors SET isVerified = ? WHERE id = ?').run(flag, tailorId);
    if (tailor?.userId) {
      sqlite.prepare('UPDATE users SET isVerified = ?, role = ? WHERE id = ?').run(flag, isVerified ? 'tailor' : 'customer', tailor.userId);
    }
  }

  addOrder(order: Order) {
    const stmt = sqlite.prepare(`
      INSERT INTO orders (
        id, orderNumber, customerId, customerName, customerPhone, customerVillage, customerDistrict, customerState,
        tailorId, tailorName, tailorVillage, tailorPhone, categoryId, categoryName, designTitle, designImage, price,
        advancePaid, paymentMethod, paymentStatus, status, handoverMethod, hasDeliveryAvailable, measurements,
        specialInstructions, requiredDate, appointmentDate, appointmentTimeSlot, createdAt, updatedAt, statusHistory
      ) VALUES (
        @id, @orderNumber, @customerId, @customerName, @customerPhone, @customerVillage, @customerDistrict, @customerState,
        @tailorId, @tailorName, @tailorVillage, @tailorPhone, @categoryId, @categoryName, @designTitle, @designImage, @price,
        @advancePaid, @paymentMethod, @paymentStatus, @status, @handoverMethod, @hasDeliveryAvailable, @measurements,
        @specialInstructions, @requiredDate, @appointmentDate, @appointmentTimeSlot, @createdAt, @updatedAt, @statusHistory
      )
    `);
    stmt.run({
      ...order,
      designTitle: order.designTitle || '',
      designImage: order.designImage || '',
      hasDeliveryAvailable: order.hasDeliveryAvailable ? 1 : 0,
      measurements: JSON.stringify(order.measurements ?? ''),
      specialInstructions: order.specialInstructions || '',
      appointmentDate: order.appointmentDate || '',
      appointmentTimeSlot: order.appointmentTimeSlot || '',
      statusHistory: JSON.stringify(order.statusHistory || [])
    });
  }

  updateOrderStatus(orderId: string, status: string, historyEntry?: any) {
    const order = sqlite.prepare('SELECT statusHistory FROM orders WHERE id = ?').get(orderId) as any;
    if (!order) return;

    let history = order.statusHistory ? JSON.parse(order.statusHistory) : [];
    if (historyEntry) {
      history.push(historyEntry);
    }

    sqlite.prepare(`
      UPDATE orders 
      SET status = ?, updatedAt = ?, statusHistory = ?
      WHERE id = ?
    `).run(status, new Date().toISOString(), JSON.stringify(history), orderId);
  }

  addCustomRequest(req: CustomDesignRequest) {
    const stmt = sqlite.prepare(`
      INSERT INTO custom_requests (
        id, customerId, customerName, customerVillage, customerDistrict, customerState, requestTitle,
        clothingCategory, referenceImage, specialInstructions, requiredDate, createdAt, status, offers
      ) VALUES (
        @id, @customerId, @customerName, @customerVillage, @customerDistrict, @customerState, @requestTitle,
        @clothingCategory, @referenceImage, @specialInstructions, @requiredDate, @createdAt, @status, @offers
      )
    `);
    stmt.run({
      ...req,
      referenceImage: req.referenceImage || '',
      specialInstructions: req.specialInstructions || '',
      offers: JSON.stringify(req.offers || [])
    });
  }

  acceptCustomRequestQuote(requestId: string, offerId: string) {
    return sqlite.prepare(`
      UPDATE custom_requests
      SET status = 'quote_accepted', acceptedQuoteId = ?
      WHERE id = ? AND status = 'open'
    `).run(offerId, requestId).changes === 1;
  }

  addOfferToCustomRequest(requestId: string, offer: QuoteOffer) {
    const row = sqlite.prepare('SELECT offers FROM custom_requests WHERE id = ?').get(requestId) as any;
    if (!row) return;

    const offers: QuoteOffer[] = row.offers ? JSON.parse(row.offers) : [];
    offers.push(offer);

    sqlite.prepare('UPDATE custom_requests SET offers = ? WHERE id = ?').run(JSON.stringify(offers), requestId);
  }

  updateTailorAvailability(tailorId: string, availability: string) {
    sqlite.prepare('UPDATE tailors SET availability = ? WHERE id = ?').run(availability, tailorId);
  }

  updateTailorProfile(tailorId: string, updates: Partial<TailorProfile>) {
    const patch: Record<string, unknown> = {
      ...updates,
      isVerified: updates.isVerified !== undefined ? (updates.isVerified ? 1 : 0) : undefined,
      servicesOffered: updates.servicesOffered ? JSON.stringify(updates.servicesOffered) : undefined,
      skills: updates.skills ? JSON.stringify(updates.skills) : undefined,
      galleryImages: updates.galleryImages ? JSON.stringify(updates.galleryImages) : undefined
    };

    const entries = Object.entries(patch).filter(([, value]) => value !== undefined);
    if (!entries.length) return;

    const columns = entries.map(([key]) => `${key} = @${key}`).join(', ');
    const params = Object.fromEntries(entries.map(([key, value]) => [key, value]));

    sqlite.prepare(`UPDATE tailors SET ${columns} WHERE id = @tailorId`).run({
      ...params,
      tailorId
    });
  }

  updateTailorCapacity(tailorId: string, maxActiveOrders: number) {
    sqlite.prepare('UPDATE tailors SET maxActiveOrders = ? WHERE id = ?').run(maxActiveOrders, tailorId);
  }

  toggleUserBlock(userId: string, isBlocked: boolean) {
    sqlite.prepare('UPDATE users SET isBlocked = ? WHERE id = ?').run(isBlocked ? 1 : 0, userId);
  }

  addComplaint(complaint: any) {
    sqlite.prepare(`
      INSERT OR REPLACE INTO complaints (
        id, orderId, orderNumber, complainantName, complainantRole, complainantPhone, againstName, category, subject,
        description, status, createdAt, resolutionNote
      ) VALUES (
        @id, @orderId, @orderNumber, @complainantName, @complainantRole, @complainantPhone, @againstName, @category, @subject,
        @description, @status, @createdAt, @resolutionNote
      )
    `).run({
      ...complaint,
      status: complaint.status || 'open',
      resolutionNote: complaint.resolutionNote || ''
    });
  }

  resolveComplaint(complaintId: string, status: 'investigating' | 'resolved', note?: string) {
    sqlite.prepare('UPDATE complaints SET status = ?, resolutionNote = ? WHERE id = ?').run(status, note || '', complaintId);
  }

  addDesign(design: DesignCatalogItem) {
    const stmt = sqlite.prepare(`
      INSERT OR REPLACE INTO designs (
        id, tailorId, tailorName, categoryId, categoryName, title, titleHi, image, price, estDays, description, isAvailable
      ) VALUES (
        @id, @tailorId, @tailorName, @categoryId, @categoryName, @title, @titleHi, @image, @price, @estDays, @description, @isAvailable
      )
    `);
    stmt.run({
      ...design,
      tailorName: design.tailorName || '',
      titleHi: design.titleHi || '',
      isAvailable: design.isAvailable ? 1 : 0
    });
  }

  deleteDesign(id: string) {
    sqlite.prepare('DELETE FROM designs WHERE id = ?').run(id);
  }

  addCategory(cat: ServiceCategory) {
    const stmt = sqlite.prepare(`
      INSERT OR REPLACE INTO categories (id, nameEn, nameHi, iconName, descriptionEn, descriptionHi, startingPrice, estDays, popular)
      VALUES (@id, @nameEn, @nameHi, @iconName, @descriptionEn, @descriptionHi, @startingPrice, @estDays, @popular)
    `);
    stmt.run({
      ...cat,
      popular: cat.popular ? 1 : 0
    });
  }

  deleteCategory(id: string) {
    sqlite.prepare('DELETE FROM categories WHERE id = ?').run(id);
  }

  addVillage(stateId: string, districtId: string, villageName: string): boolean {
    const row = sqlite.prepare('SELECT districts FROM locations WHERE id = ? OR name = ?').get(stateId, stateId) as any;
    if (!row) return false;

    const districts = row.districts ? JSON.parse(row.districts) : [];
    const targetDist = districts.find((d: any) => d.id === districtId || d.name === districtId);
    if (!targetDist) return false;

    if (!targetDist.villages.includes(villageName)) {
      targetDist.villages.push(villageName);
      sqlite.prepare('UPDATE locations SET districts = ? WHERE id = ? OR name = ?').run(JSON.stringify(districts), stateId, stateId);
    }
    return true;
  }

  addNotification(notif: SystemNotification) {
    const stmt = sqlite.prepare(`
      INSERT INTO notifications (id, targetRole, recipientId, titleEn, titleHi, messageEn, messageHi, timestamp, isRead, type)
      VALUES (@id, @targetRole, @recipientId, @titleEn, @titleHi, @messageEn, @messageHi, @timestamp, @isRead, @type)
    `);
    stmt.run({
      ...notif,
      recipientId: notif.recipientId || '',
      isRead: notif.isRead ? 1 : 0
    });
  }

  get payments(): PaymentRecord[] {
    return sqlite.prepare('SELECT * FROM payments ORDER BY timestamp DESC').all() as PaymentRecord[];
  }

  getPaymentsByOrder(orderId: string): PaymentRecord[] {
    return sqlite.prepare('SELECT * FROM payments WHERE orderId = ? ORDER BY timestamp DESC').all(orderId) as PaymentRecord[];
  }

  addPayment(payment: PaymentRecord) {
    const stmt = sqlite.prepare(`
      INSERT INTO payments (id, orderId, customerId, tailorId, amount, paymentMethod, paymentStatus, transactionId, timestamp, receiptUrl)
      VALUES (@id, @orderId, @customerId, @tailorId, @amount, @paymentMethod, @paymentStatus, @transactionId, @timestamp, @receiptUrl)
    `);
    stmt.run({
      ...payment,
      receiptUrl: payment.receiptUrl || ''
    });
  }

  updateOrderPayment(orderId: string, paymentStatus: string, advancePaid: number) {
    sqlite.prepare(`
      UPDATE orders
      SET paymentStatus = ?, advancePaid = ?, updatedAt = ?
      WHERE id = ?
    `).run(paymentStatus, advancePaid, new Date().toISOString(), orderId);
  }
}

export const db = new SQLiteDatabaseProxy();
