import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import type {
  User,
  TailorProfile,
  ServiceCategory,
  DesignCatalogItem,
  Order,
  OrderStatus,
  CustomDesignRequest,
  StateLocation,
  Review,
  SystemNotification,
  MeasurementProfile,
  TailorAvailability,
  QuoteOffer,
  Complaint
} from '../types';
import {
  INITIAL_LOCATIONS,
  INITIAL_CATEGORIES
} from '../data/mockSeedData';
import { firestore, isFirebaseConfigured } from '../config/firebase';
import {
  collection,
  onSnapshot,
  query,
  limit
} from 'firebase/firestore';
import {
  fetchNearbyTailors,
  fetchTailorDesignsApi,
  fetchOrdersApi,
  fetchCustomRequestsApi,
  createApiOrder,
  updateApiOrderStatus,
  createApiCustomRequest,
  submitApiQuoteOffer,
  acceptApiQuoteOffer,
  verifyTailorApi,
  updateTailorAvailabilityApi,
  updateTailorProfileApi,
  updateTailorCapacityApi,
  createTailorDesignApi,
  deleteTailorDesignApi,
  registerTailorApi,
  fetchLocationsApi,
  fetchCategoriesApi,
  fetchNotificationsApi,
  createCategoryApi,
  deleteCategoryApi,
  addVillageApi,
  broadcastNotificationApi,
  fetchComplaintsApi,
  blockUserApi,
  resolveComplaintApi
} from '../services/api';

interface DataContextType {
  locations: StateLocation[];
  categories: ServiceCategory[];
  tailors: TailorProfile[];
  designs: DesignCatalogItem[];
  orders: Order[];
  customRequests: CustomDesignRequest[];
  reviews: Review[];
  notifications: SystemNotification[];
  measurements: MeasurementProfile[];
  customers: User[];
  complaints: Complaint[];

  // User location filter selection
  selectedState: string;
  selectedDistrict: string;
  selectedVillage: string;
  setSelectedLocation: (state: string, district: string, village: string) => void;

  // Actions
  createOrder: (orderData: Partial<Order>, idempotencyKey?: string) => Promise<Order>;
  updateOrderPayment: (orderId: string, paymentStatus: Order['paymentStatus'], advancePaid: number) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  updateTailorAvailability: (tailorId: string, status: TailorAvailability) => void;
  updateTailorCapacity: (tailorId: string, maxOrders: number) => void;
  updateTailorProfile: (tailorId: string, updates: Partial<TailorProfile>) => void;
  
  addDesign: (design: Omit<DesignCatalogItem, 'id'>) => void;
  updateDesign: (id: string, updates: Partial<DesignCatalogItem>) => void;
  deleteDesign: (id: string) => void;

  addCategory: (category: Omit<ServiceCategory, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<ServiceCategory>) => void;
  deleteCategory: (id: string) => void;

  addVillageToDistrict: (stateId: string, districtId: string, villageName: string) => void;
  addDistrictToState: (stateId: string, districtName: string) => void;
  addState: (stateName: string) => void;

  submitCustomRequest: (req: Omit<CustomDesignRequest, 'id' | 'createdAt' | 'status' | 'offers'>) => CustomDesignRequest;
  submitQuoteOffer: (requestId: string, offer: Omit<QuoteOffer, 'id' | 'createdAt'>) => void;
  acceptQuoteOffer: (requestId: string, offerId: string) => Promise<Order | undefined>;

  verifyTailor: (tailorId: string, isVerified: boolean) => void;
  registerTailor: (tailorData: Omit<TailorProfile, 'id' | 'rating' | 'reviewCount' | 'completedOrdersCount' | 'currentActiveOrders' | 'joinedDate'>) => Promise<void>;

  saveMeasurement: (m: Omit<MeasurementProfile, 'id'>) => void;
  addReview: (orderId: string, rating: number, comment: string) => void;
  deleteReview: (reviewId: string) => void;
  sendNotification: (n: Omit<SystemNotification, 'id' | 'timestamp' | 'isRead'>) => void;
  markNotificationRead: (id: string) => void;

  // Admin Actions
  toggleBlockUser: (userId: string) => void;
  resolveComplaint: (complaintId: string, status: 'investigating' | 'resolved', note?: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isLoggedIn } = useAuth();
  const [locations, setLocations] = useState<StateLocation[]>(() => {
    const s = localStorage.getItem('sakhisilai_locations');
    return s ? JSON.parse(s) : INITIAL_LOCATIONS;
  });

  const [categories, setCategories] = useState<ServiceCategory[]>(() => {
    const s = localStorage.getItem('sakhisilai_categories');
    return s ? JSON.parse(s) : INITIAL_CATEGORIES;
  });

  const [tailors, setTailors] = useState<TailorProfile[]>([]);

  const [designs, setDesigns] = useState<DesignCatalogItem[]>([]);

  const [orders, setOrders] = useState<Order[]>([]);

  const [customRequests, setCustomRequests] = useState<CustomDesignRequest[]>([]);

  const [reviews, setReviews] = useState<Review[]>([]);

  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  const [measurements, setMeasurements] = useState<MeasurementProfile[]>(() => {
    const s = localStorage.getItem('sakhisilai_measurements');
    return s
      ? JSON.parse(s)
      : [];
  });

  const [customers, setCustomers] = useState<User[]>([]);

  const [complaints, setComplaints] = useState<Complaint[]>([]);

  // User location state
  const [selectedState, setSelectedState] = useState<string>('Uttar Pradesh');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Lucknow');
  const [selectedVillage, setSelectedVillage] = useState<string>('Mohanlalganj');

  // Persistence helpers
  useEffect(() => localStorage.setItem('sakhisilai_locations', JSON.stringify(locations)), [locations]);
  useEffect(() => localStorage.setItem('sakhisilai_categories', JSON.stringify(categories)), [categories]);
  useEffect(() => localStorage.setItem('sakhisilai_tailors', JSON.stringify(tailors)), [tailors]);
  useEffect(() => localStorage.setItem('sakhisilai_customers', JSON.stringify(customers)), [customers]);
  useEffect(() => localStorage.setItem('sakhisilai_complaints', JSON.stringify(complaints)), [complaints]);
  useEffect(() => localStorage.setItem('sakhisilai_designs', JSON.stringify(designs)), [designs]);
  useEffect(() => localStorage.setItem('sakhisilai_orders', JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem('sakhisilai_custom_requests', JSON.stringify(customRequests)), [customRequests]);
  useEffect(() => localStorage.setItem('sakhisilai_reviews', JSON.stringify(reviews)), [reviews]);
  useEffect(() => localStorage.setItem('sakhisilai_notifications', JSON.stringify(notifications)), [notifications]);
  useEffect(() => localStorage.setItem('sakhisilai_measurements', JSON.stringify(measurements)), [measurements]);

  // Fetch from persistent SQLite backend API and Cloud Firestore
  useEffect(() => {
    // 1. Initial sync with Express SQLite Backend API
    fetchNearbyTailors(selectedState, selectedDistrict, selectedVillage).then(data => {
      if (Array.isArray(data)) {
        setTailors(data);
      }
    });

    fetchTailorDesignsApi().then(data => {
      if (Array.isArray(data)) setDesigns(data);
    });

    if (isLoggedIn) {
      fetchOrdersApi().then(data => {
        setOrders(Array.isArray(data) ? data : []);
      });

      fetchCustomRequestsApi().then(data => {
        setCustomRequests(Array.isArray(data) ? data : []);
      });

      fetchNotificationsApi().then(data => {
        setNotifications(Array.isArray(data) ? data : []);
      });

      if (currentUser.role === 'admin') {
        fetchComplaintsApi().then(data => {
          setComplaints(Array.isArray(data) ? data : []);
        });
      }
    } else {
      setOrders([]);
      setCustomRequests([]);
      setNotifications([]);
    }

    fetchLocationsApi().then(data => {
      if (data && Array.isArray(data) && data.length > 0) {
        setLocations(data);
      }
    });

    fetchCategoriesApi().then(data => {
      if (data && Array.isArray(data) && data.length > 0) {
        setCategories(data);
      }
    });

    // 2. Realtime Cloud Firestore Listeners if Firebase is active
    if (isFirebaseConfigured && firestore) {
      console.log('🔥 Cloud Firestore Realtime Sync Active (Scalable to 1,000+ users/day)');

      const tailorsQuery = query(collection(firestore, 'tailors'), limit(100));
      const unsubTailors = onSnapshot(tailorsQuery, snapshot => {
        const fetched: TailorProfile[] = [];
        snapshot.forEach(docSnap => {
          fetched.push({ id: docSnap.id, ...docSnap.data() } as TailorProfile);
        });
        setTailors(fetched);
      }, err => console.warn('Firestore tailors listener notice:', err));

      return () => {
        unsubTailors();
      };
    }
  }, [selectedState, selectedDistrict, selectedVillage, isLoggedIn, currentUser.id, currentUser.role]);

  const setSelectedLocation = (state: string, district: string, village: string) => {
    setSelectedState(state);
    setSelectedDistrict(district);
    setSelectedVillage(village);
  };

  // Actions implementation
  const createOrder = async (orderData: Partial<Order>, idempotencyKey: string = crypto.randomUUID()): Promise<Order> => {
    const newId = 'ord_' + Date.now();
    const orderNum = 'SK-2026-' + Math.floor(100 + Math.random() * 900);
    const now = new Date().toISOString();
    const selectedTailor = tailors.find(tailor => tailor.id === orderData.tailorId);
    const selectedCategory = categories.find(category => category.id === orderData.categoryId);

    const newOrder: Order = {
      id: newId,
      orderNumber: orderNum,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      customerVillage: orderData.customerVillage || currentUser.village || selectedVillage,
      customerDistrict: orderData.customerDistrict || currentUser.district || selectedDistrict,
      customerState: orderData.customerState || currentUser.state || selectedState,
      tailorId: orderData.tailorId || '',
      tailorName: orderData.tailorName || selectedTailor?.name || '',
      tailorVillage: orderData.tailorVillage || selectedTailor?.village || '',
      tailorPhone: orderData.tailorPhone || selectedTailor?.phone || '',
      categoryId: orderData.categoryId || '',
      categoryName: orderData.categoryName || selectedCategory?.nameEn || '',
      designTitle: orderData.designTitle || '',
      designImage: orderData.designImage || '',
      price: orderData.price ?? 0,
      advancePaid: orderData.advancePaid || 0,
      paymentMethod: orderData.paymentMethod || 'cod',
      paymentStatus: orderData.paymentStatus || 'pending',
      status: 'requested',
      handoverMethod: orderData.handoverMethod || 'customer_drop',
      hasDeliveryAvailable: orderData.hasDeliveryAvailable ?? false,
      measurements: orderData.measurements || '',
      specialInstructions: orderData.specialInstructions || '',
      requiredDate: orderData.requiredDate || '2026-09-15',
      appointmentDate: orderData.appointmentDate || orderData.requiredDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      appointmentTimeSlot: orderData.appointmentTimeSlot || '',
      appointmentNotes: orderData.appointmentNotes || '',
      createdAt: now,
      updatedAt: now,
      statusHistory: [
        {
          status: 'requested',
          labelEn: 'Order Requested',
          labelHi: 'ऑर्डर भेजा गया',
          timestamp: now
        }
      ]
    };

    const savedOrder = await createApiOrder(newOrder, idempotencyKey);
    setOrders(prev => [savedOrder, ...prev.filter(order => order.id !== savedOrder.id)]);

    // Update tailor current active count
    setTailors(prev =>
      prev.map(t => (t.id === savedOrder.tailorId ? { ...t, currentActiveOrders: t.currentActiveOrders + 1 } : t))
    );

    // Send Notification to Tailor
    sendNotification({
      targetRole: 'tailor',
      recipientId: savedOrder.tailorId,
      titleEn: `New Order Request ${savedOrder.orderNumber}`,
      titleHi: `नया सिलाई अनुरोध ${savedOrder.orderNumber}`,
      messageEn: `${savedOrder.customerName} from ${savedOrder.customerVillage} requested ${savedOrder.designTitle}.`,
      messageHi: `${savedOrder.customerVillage} से ${savedOrder.customerName} ने ${savedOrder.designTitle} का ऑर्डर दिया है।`,
      type: 'order'
    });

    return savedOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    const now = new Date().toISOString();

    const statusLabels: Record<OrderStatus, { en: string; hi: string }> = {
      requested: { en: 'Order Requested', hi: 'ऑर्डर भेजा गया' },
      accepted: { en: 'Tailor Accepted', hi: 'दर्जी ने स्वीकार किया' },
      fabric_received: { en: 'Fabric Received', hi: 'कपड़ा प्राप्त हुआ' },
      cutting_started: { en: 'Cutting Started', hi: 'कटाई शुरू हुई' },
      stitching: { en: 'Stitching in Progress', hi: 'सिलाई जारी है' },
      quality_check: { en: 'Quality Check Passed', hi: 'गुणवत्ता जाँच पास' },
      ready: { en: 'Ready for Pickup / Delivery', hi: 'तैयार' },
      completed: { en: 'Order Completed', hi: 'ऑर्डर पूरा हुआ' },
      cancelled: { en: 'Order Cancelled', hi: 'ऑर्डर रद्द किया गया' }
    };

    setOrders(prev =>
      prev.map(ord => {
        if (ord.id !== orderId) return ord;

        const newEntry = {
          status: newStatus,
          labelEn: statusLabels[newStatus].en,
          labelHi: statusLabels[newStatus].hi,
          timestamp: now,
          note
        };

        const updatedOrder: Order = {
          ...ord,
          status: newStatus,
          updatedAt: now,
          statusHistory: [...ord.statusHistory, newEntry]
        };

        if (newStatus === 'completed') {
          updatedOrder.paymentStatus = 'fully_paid';
        }

        // Notify customer
        sendNotification({
          targetRole: 'customer',
          recipientId: ord.customerId,
          titleEn: `Order Status Updated: ${ord.orderNumber}`,
          titleHi: `ऑर्डर स्थिति अपडेट: ${ord.orderNumber}`,
          messageEn: `Your order is now: ${statusLabels[newStatus].en}.`,
          messageHi: `आपके ऑर्डर की नई स्थिति: ${statusLabels[newStatus].hi}`,
          type: 'order'
        });

        return updatedOrder;
      })
    );

    // Sync status update with SQLite Backend API
    updateApiOrderStatus(orderId, newStatus, statusLabels[newStatus].en, statusLabels[newStatus].hi);

    if (newStatus === 'completed' || newStatus === 'cancelled') {
      const targetOrd = orders.find(o => o.id === orderId);
      if (targetOrd) {
        setTailors(prev =>
          prev.map(t =>
            t.id === targetOrd.tailorId
              ? {
                  ...t,
                  currentActiveOrders: Math.max(0, t.currentActiveOrders - 1),
                  completedOrdersCount: newStatus === 'completed' ? t.completedOrdersCount + 1 : t.completedOrdersCount
                }
              : t
          )
        );
      }
    }
  };

  const updateOrderPayment = (orderId: string, paymentStatus: Order['paymentStatus'], advancePaid: number) => {
    setOrders(prev => prev.map(order => order.id === orderId ? { ...order, paymentStatus, advancePaid } : order));
  };

  const updateTailorAvailability = (tailorId: string, availability: TailorAvailability) => {
    setTailors(prev => prev.map(t => (t.id === tailorId ? { ...t, availability } : t)));
    updateTailorAvailabilityApi(tailorId, availability).catch(() => undefined);
  };

  const updateTailorCapacity = async (tailorId: string, maxActiveOrders: number) => {
    try {
      const updated = await updateTailorCapacityApi(tailorId, maxActiveOrders);
      setTailors(prev => prev.map(t => (t.id === tailorId ? { ...t, ...updated } : t)));
    } catch {
      setTailors(prev => prev.map(t => (t.id === tailorId ? { ...t, maxActiveOrders } : t)));
    }
  };

  const updateTailorProfile = async (tailorId: string, updates: Partial<TailorProfile>) => {
    try {
      const updated = await updateTailorProfileApi(tailorId, updates);
      setTailors(prev => prev.map(t => (t.id === tailorId ? { ...t, ...updated } : t)));
    } catch {
      setTailors(prev => prev.map(t => (t.id === tailorId ? { ...t, ...updates } : t)));
    }
  };

  const addDesign = async (design: Omit<DesignCatalogItem, 'id'>) => {
    try {
      const saved = await createTailorDesignApi(design.tailorId, {
        title: design.title,
        categoryId: design.categoryId,
        categoryName: design.categoryName,
        image: design.image,
        price: design.price,
        estDays: design.estDays,
        description: design.description
      });
      setDesigns(prev => [saved, ...prev.filter(item => item.id !== saved.id)]);
    } catch {
      const fallback: DesignCatalogItem = { ...design, id: 'd_' + Date.now() };
      setDesigns(prev => [fallback, ...prev]);
    }
  };

  const updateDesign = (id: string, updates: Partial<DesignCatalogItem>) => {
    setDesigns(prev => prev.map(d => (d.id === id ? { ...d, ...updates } : d)));
  };

  const deleteDesign = async (id: string) => {
    const target = designs.find(d => d.id === id);
    if (target) {
      try {
        await deleteTailorDesignApi(target.tailorId, id);
      } catch {
        // fallback to local state even if API fails
      }
    }
    setDesigns(prev => prev.filter(d => d.id !== id));
  };

  const addCategory = (cat: Omit<ServiceCategory, 'id'>) => {
    const newCat: ServiceCategory = {
      ...cat,
      id: 'cat_' + Date.now()
    };
    setCategories(prev => [...prev, newCat]);
    createCategoryApi(newCat);
  };

  const updateCategory = (id: string, updates: Partial<ServiceCategory>) => {
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    deleteCategoryApi(id);
  };

  const addVillageToDistrict = (stateId: string, districtId: string, villageName: string) => {
    setLocations(prev =>
      prev.map(st => {
        if (st.id !== stateId && st.name !== stateId) return st;
        return {
          ...st,
          districts: st.districts.map(dist => {
            if (dist.id !== districtId && dist.name !== districtId) return dist;
            if (dist.villages.includes(villageName)) return dist;
            return { ...dist, villages: [...dist.villages, villageName] };
          })
        };
      })
    );
    addVillageApi(stateId, districtId, villageName);
  };

  const addDistrictToState = (stateId: string, districtName: string) => {
    setLocations(prev =>
      prev.map(st => {
        if (st.id !== stateId && st.name !== stateId) return st;
        const distId = districtName.toLowerCase().replace(/\s+/g, '_');
        return {
          ...st,
          districts: [...st.districts, { id: distId, name: districtName, villages: ['Main Market'] }]
        };
      })
    );
  };

  const addState = (stateName: string) => {
    const stId = stateName.toLowerCase().replace(/\s+/g, '_');
    setLocations(prev => [
      ...prev,
      {
        id: stId,
        name: stateName,
        districts: [{ id: 'central', name: 'Central District', villages: ['Main Village'] }]
      }
    ]);
  };

  const submitCustomRequest = (req: Omit<CustomDesignRequest, 'id' | 'createdAt' | 'status' | 'offers'>) => {
    const newReq: CustomDesignRequest = {
      ...req,
      id: 'req_' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'open',
      offers: []
    };
    setCustomRequests(prev => [newReq, ...prev]);

    // Send to backend API
    createApiCustomRequest(newReq);

    // Notify nearby tailors
    sendNotification({
      targetRole: 'tailor',
      titleEn: 'New Custom Design Request!',
      titleHi: 'नया विशेष डिज़ाइन अनुरोध!',
      messageEn: `${newReq.customerName} uploaded a design photo for bidding in ${newReq.customerVillage}.`,
      messageHi: `${newReq.customerVillage} में ${newReq.customerName} ने डिज़ाइन फोटो अपलोड किया है।`,
      type: 'quote'
    });

    return newReq;
  };

  const submitQuoteOffer = (requestId: string, offer: Omit<QuoteOffer, 'id' | 'createdAt'>) => {
    const newOffer: QuoteOffer = {
      ...offer,
      id: 'off_' + Date.now(),
      createdAt: new Date().toISOString()
    };

    setCustomRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, offers: [...r.offers, newOffer] } : r))
    );

    // Send to backend API
    submitApiQuoteOffer(requestId, newOffer);

    const targetReq = customRequests.find(r => r.id === requestId);
    if (targetReq) {
      sendNotification({
        targetRole: 'customer',
        recipientId: targetReq.customerId,
        titleEn: `New Price Quote from ${offer.tailorName}`,
        titleHi: `${offer.tailorName} की ओर से नया सिलाई प्रस्ताव`,
        messageEn: `Tailor quoted ₹${offer.price} for your custom design.`,
        messageHi: `दर्जी ने आपके डिज़ाइन के लिए ₹${offer.price} की दर बताई है।`,
        type: 'quote'
      });
    }
  };

  const acceptQuoteOffer = async (requestId: string, offerId: string): Promise<Order | undefined> => {
    const targetReq = customRequests.find(r => r.id === requestId);
    if (!targetReq) return undefined;

    const offer = targetReq.offers.find(o => o.id === offerId);
    if (!offer) return undefined;

    const result = await acceptApiQuoteOffer(requestId, offerId);
    const createdOrder = result.data as Order;

    setCustomRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'quote_accepted', acceptedQuoteId: offerId } : r))
    );
    setOrders(prev => [createdOrder, ...prev.filter(order => order.id !== createdOrder.id)]);

    return createdOrder;
  };

  const verifyTailor = (tailorId: string, isVerified: boolean) => {
    setTailors(prev => prev.map(t => (t.id === tailorId ? { ...t, isVerified } : t)));
    verifyTailorApi(tailorId, isVerified);
  };

  const registerTailor = async (
    tailorData: Omit<TailorProfile, 'id' | 'rating' | 'reviewCount' | 'completedOrdersCount' | 'currentActiveOrders' | 'joinedDate'>
  ): Promise<void> => {
    const newTailor: TailorProfile = {
      ...tailorData,
      id: 't_' + Date.now(),
      rating: 5.0,
      reviewCount: 0,
      completedOrdersCount: 0,
      currentActiveOrders: 0,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    const savedTailor = await registerTailorApi({
      addressApprox: newTailor.addressApprox,
      bio: newTailor.bio,
      experienceYears: newTailor.experienceYears,
      servicesOffered: newTailor.servicesOffered,
      startingPrice: newTailor.startingPrice
    });
    setTailors(prev => [savedTailor, ...prev.filter(tailor => tailor.id !== savedTailor.id)]);
  };

  const saveMeasurement = (m: Omit<MeasurementProfile, 'id'>) => {
    const newM: MeasurementProfile = {
      ...m,
      id: 'm_' + Date.now()
    };
    setMeasurements(prev => [newM, ...prev]);
  };

  const addReview = (orderId: string, rating: number, comment: string) => {
    const targetOrd = orders.find(o => o.id === orderId);
    if (!targetOrd) return;

    const newRev: Review = {
      id: 'rev_' + Date.now(),
      orderId,
      customerId: targetOrd.customerId,
      customerName: targetOrd.customerName,
      customerVillage: targetOrd.customerVillage,
      tailorId: targetOrd.tailorId,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    };

    setReviews(prev => [newRev, ...prev]);

    // Update order with rating
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, rating, reviewText: comment } : o)));

    // Recalculate tailor rating average
    const tailorReviews = [...reviews.filter(r => r.tailorId === targetOrd.tailorId), newRev];
    const avg = tailorReviews.reduce((sum, r) => sum + r.rating, 0) / tailorReviews.length;

    setTailors(prev =>
      prev.map(t => (t.id === targetOrd.tailorId ? { ...t, rating: Number(avg.toFixed(1)), reviewCount: tailorReviews.length } : t))
    );
  };

  const sendNotification = (n: Omit<SystemNotification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotif: SystemNotification = {
      ...n,
      id: 'n_' + Date.now(),
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    broadcastNotificationApi(newNotif);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const deleteReview = (reviewId: string) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  const toggleBlockUser = async (userId: string) => {
    const targetUser = customers.find(c => c.id === userId);
    if (!targetUser) return;

    const nextState = !targetUser.isBlocked;
    try {
      const updated = await blockUserApi(userId, nextState);
      setCustomers(prev => prev.map(c => (c.id === userId ? { ...c, isBlocked: Boolean(updated?.isBlocked ?? nextState) } : c)));
    } catch {
      setCustomers(prev => prev.map(c => (c.id === userId ? { ...c, isBlocked: nextState } : c)));
    }
  };

  const resolveComplaint = async (complaintId: string, status: 'investigating' | 'resolved', note?: string) => {
    try {
      const updated = await resolveComplaintApi(complaintId, status, note);
      setComplaints(prev => prev.map(cmp => (cmp.id === complaintId ? { ...cmp, status: updated?.status || status, resolutionNote: updated?.resolutionNote || note } : cmp)));
    } catch {
      setComplaints(prev => prev.map(cmp => (cmp.id === complaintId ? { ...cmp, status, resolutionNote: note } : cmp)));
    }
  };

  return (
    <DataContext.Provider
      value={{
        locations,
        categories,
        tailors,
        designs,
        orders,
        customRequests,
        reviews,
        notifications,
        measurements,
        customers,
        complaints,

        selectedState,
        selectedDistrict,
        selectedVillage,
        setSelectedLocation,

        createOrder,
        updateOrderPayment,
        updateOrderStatus,
        updateTailorAvailability,
        updateTailorCapacity,
        updateTailorProfile,

        addDesign,
        updateDesign,
        deleteDesign,

        addCategory,
        updateCategory,
        deleteCategory,

        addVillageToDistrict,
        addDistrictToState,
        addState,

        submitCustomRequest,
        submitQuoteOffer,
        acceptQuoteOffer,

        verifyTailor,
        registerTailor,

        saveMeasurement,
        addReview,
        deleteReview,
        sendNotification,
        markNotificationRead,

        toggleBlockUser,
        resolveComplaint
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
