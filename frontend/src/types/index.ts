export type UserRole = 'customer' | 'tailor' | 'admin';

export type Language = 'en' | 'hi';

export type TailorAvailability = 'available' | 'limited' | 'unavailable';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  village: string;
  district: string;
  state: string;
  avatar?: string;
  createdAt: string;
  isVerified?: boolean;
}

export interface TailorProfile {
  id: string;
  userId: string;
  name: string;
  phone: string;
  avatar: string;
  state: string;
  district: string;
  village: string;
  addressApprox: string;
  addressFull?: string;
  bio: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  completedOrdersCount: number;
  availability: TailorAvailability;
  maxActiveOrders: number;
  currentActiveOrders: number;
  servicesOffered: string[];
  startingPrice: number;
  estCompletionDays: number;
  skills: string[];
  galleryImages: string[];
  isVerified: boolean;
  joinedDate: string;
}

export interface ServiceCategory {
  id: string;
  nameEn: string;
  nameHi: string;
  iconName: string;
  descriptionEn: string;
  descriptionHi: string;
  startingPrice: number;
  estDays: number;
  popular?: boolean;
}

export interface DesignCatalogItem {
  id: string;
  tailorId: string;
  tailorName?: string;
  categoryId: string;
  categoryName: string;
  title: string;
  titleHi?: string;
  image: string;
  price: number;
  estDays: number;
  description: string;
  isAvailable: boolean;
}

export type FabricHandoverMethod = 'customer_drop' | 'delivery_pickup';

export interface MeasurementProfile {
  id: string;
  userId: string;
  label: string;
  clothingType: string;
  bustOrChest?: string;
  waist?: string;
  hips?: string;
  length?: string;
  shoulder?: string;
  sleeveLength?: string;
  neckDepth?: string;
  additionalNotes?: string;
}

export type OrderStatus =
  | 'requested'
  | 'accepted'
  | 'fabric_received'
  | 'cutting_started'
  | 'stitching'
  | 'quality_check'
  | 'ready'
  | 'completed'
  | 'cancelled';

export interface StatusHistoryEntry {
  status: OrderStatus;
  labelEn: string;
  labelHi: string;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerVillage: string;
  customerDistrict: string;
  customerState: string;
  tailorId: string;
  tailorName: string;
  tailorVillage: string;
  tailorPhone: string;
  categoryId: string;
  categoryName: string;
  designTitle: string;
  designImage?: string;
  price: number;
  advancePaid: number;
  paymentMethod: 'cod' | 'upi' | 'partial_advance';
  paymentStatus: 'pending' | 'advance_paid' | 'fully_paid';
  status: OrderStatus;
  handoverMethod: FabricHandoverMethod;
  hasDeliveryAvailable: boolean;
  measurements: MeasurementProfile | string; // Profile or note
  specialInstructions: string;
  requiredDate: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusHistoryEntry[];
  rating?: number;
  reviewText?: string;
}

export interface QuoteOffer {
  id: string;
  tailorId: string;
  tailorName: string;
  tailorVillage: string;
  tailorRating: number;
  tailorPhone: string;
  price: number;
  estDays: number;
  note: string;
  createdAt: string;
}

export interface CustomDesignRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerVillage: string;
  customerDistrict: string;
  customerState: string;
  requestTitle: string;
  clothingCategory: string;
  referenceImage: string;
  specialInstructions: string;
  requiredDate: string;
  createdAt: string;
  status: 'open' | 'quote_accepted' | 'closed';
  acceptedQuoteId?: string;
  offers: QuoteOffer[];
}

export interface VillageLocation {
  name: string;
  pincode?: string;
}

export interface DistrictLocation {
  id: string;
  name: string;
  villages: string[];
}

export interface StateLocation {
  id: string;
  name: string;
  districts: DistrictLocation[];
}

export interface Review {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  customerVillage: string;
  tailorId: string;
  rating: number;
  comment: string;
  date: string;
  isModerated?: boolean;
}

export interface SystemNotification {
  id: string;
  targetRole: 'all' | 'customer' | 'tailor';
  recipientId?: string;
  titleEn: string;
  titleHi: string;
  messageEn: string;
  messageHi: string;
  timestamp: string;
  isRead: boolean;
  type: 'order' | 'quote' | 'admin' | 'info';
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  customerId: string;
  tailorId: string;
  amount: number;
  paymentMethod: 'cod' | 'upi' | 'partial_advance';
  paymentStatus: 'pending' | 'advance_paid' | 'fully_paid';
  transactionId: string;
  timestamp: string;
  receiptUrl?: string;
}

