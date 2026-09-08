import React, { createContext, useContext, useState, useEffect } from 'react';
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
  INITIAL_CATEGORIES,
  INITIAL_TAILORS,
  INITIAL_DESIGNS,
  INITIAL_ORDERS,
  INITIAL_CUSTOM_REQUESTS,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CUSTOMERS,
  INITIAL_COMPLAINTS
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
  fetchOrdersApi,
  fetchCustomRequestsApi,
  createApiOrder,
  updateApiOrderStatus,
  createApiCustomRequest,
  submitApiQuoteOffer,
  acceptApiQuoteOffer,
  verifyTailorApi,
  updateTailorAvailabilityApi,
  registerUserApi,
  fetchLocationsApi,
  fetchCategoriesApi,
  fetchNotificationsApi,
  createCategoryApi,
  deleteCategoryApi,
  addVillageApi,
  broadcastNotificationApi
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
  createOrder: (orderData: Partial<Order>) => Order;
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
  acceptQuoteOffer: (requestId: string, offerId: string) => Order | undefined;

  verifyTailor: (tailorId: string, isVerified: boolean) => void;
  registerTailor: (tailorData: Omit<TailorProfile, 'id' | 'rating' | 'reviewCount' | 'completedOrdersCount' | 'currentActiveOrders' | 'joinedDate'>) => void;

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
  const [locations, setLocations] = useState<StateLocation[]>(() => {
    const s = localStorage.getItem('sakhisilai_locations');
    return s ? JSON.parse(s) : INITIAL_LOCATIONS;
  });

  const [categories, setCategories] = useState<ServiceCategory[]>(() => {
    const s = localStorage.getItem('sakhisilai_categories');
    return s ? JSON.parse(s) : INITIAL_CATEGORIES;
  });

  const [tailors, setTailors] = useState<TailorProfile[]>(() => {
    const s = localStorage.getItem('sakhisilai_tailors');
    return s ? JSON.parse(s) : INITIAL_TAILORS;
  });

  const [designs, setDesigns] = useState<DesignCatalogItem[]>(() => {
    const s = localStorage.getItem('sakhisilai_designs');
    return s ? JSON.parse(s) : INITIAL_DESIGNS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const s = localStorage.getItem('sakhisilai_orders');
    return s ? JSON.parse(s) : INITIAL_ORDERS;
  });

  const [customRequests, setCustomRequests] = useState<CustomDesignRequest[]>(() => {
    const s = localStorage.getItem('sakhisilai_custom_requests');
    return s ? JSON.parse(s) : INITIAL_CUSTOM_REQUESTS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const s = localStorage.getItem('sakhisilai_reviews');
    return s ? JSON.parse(s) : INITIAL_REVIEWS;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const s = localStorage.getItem('sakhisilai_notifications');
    return s ? JSON.parse(s) : INITIAL_NOTIFICATIONS;
  });

  const [measurements, setMeasurements] = useState<MeasurementProfile[]>(() => {
    const s = localStorage.getItem('sakhisilai_measurements');
    return s
      ? JSON.parse(s)
      : [
          {
            id: 'm_1',
            userId: 'u_pria',
            label: 'Priya - Standard Blouse',
            clothingType: 'Blouse',
            bustOrChest: '36 in',
            waist: '30 in',
            length: '14.5 in',
            shoulder: '14 in',
            sleeveLength: '10 in',
            neckDepth: '8 in Front / 10 in Back'
          }
        ];
  });

  const [customers, setCustomers] = useState<User[]>(() => {
    const s = localStorage.getItem('sakhisilai_customers');
    return s ? JSON.parse(s) : INITIAL_CUSTOMERS;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const s = localStorage.getItem('sakhisilai_complaints');
    return s ? JSON.parse(s) : INITIAL_COMPLAINTS;
  });

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
      if (data && Array.isArray(data) && data.length > 0) {
        setTailors(data);
      }
    });

    fetchOrdersApi().then(data => {
      if (data && Array.isArray(data) && data.length > 0) {
        setOrders(data);
      }
    });

    fetchCustomRequestsApi().then(data => {
      if (data && Array.isArray(data) && data.length > 0) {
        setCustomRequests(data);
      }
    });

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

    fetchNotificationsApi().then(data => {
      if (data && Array.isArray(data) && data.length > 0) {
        setNotifications(data);
      }
    });

    // 2. Realtime Cloud Firestore Listeners if Firebase is active
    if (isFirebaseConfigured) {
      console.log('🔥 Cloud Firestore Realtime Sync Active (Scalable to 1,000+ users/day)');

      const tailorsQuery = query(collection(firestore, 'tailors'), limit(100));
      const unsubTailors = onSnapshot(tailorsQuery, snapshot => {
        const fetched: TailorProfile[] = [];
        snapshot.forEach(docSnap => {
          fetched.push({ id: docSnap.id, ...docSnap.data() } as TailorProfile);
        });
        if (fetched.length > 0) {
          setTailors(fetched);
        }
      }, err => console.warn('Firestore tailors listener notice:', err));

      const ordersQuery = query(collection(firestore, 'orders'), limit(100));
      const unsubOrders = onSnapshot(ordersQuery, snapshot => {
        const fetched: Order[] = [];
        snapshot.forEach(docSnap => {
          fetched.push({ id: docSnap.id, ...docSnap.data() } as Order);
        });
        if (fetched.length > 0) {
          setOrders(fetched);
        }
      }, err => console.warn('Firestore orders listener notice:', err));

      const customReqQuery = query(collection(firestore, 'customRequests'), limit(100));
      const unsubCustomReq = onSnapshot(customReqQuery, snapshot => {
        const fetched: CustomDesignRequest[] = [];
        snapshot.forEach(docSnap => {
          fetched.push({ id: docSnap.id, ...docSnap.data() } as CustomDesignRequest);
        });
        if (fetched.length > 0) {
          setCustomRequests(fetched);
        }
      }, err => console.warn('Firestore custom requests listener notice:', err));

      return () => {
        unsubTailors();
        unsubOrders();
        unsubCustomReq();
      };
    }
  }, [selectedState, selectedDistrict, selectedVillage]);

  const setSelectedLocation = (state: string, district: string, village: string) => {
    setSelectedState(state);
    setSelectedDistrict(district);
    setSelectedVillage(village);
  };

  // Actions implementation
  const createOrder = (orderData: Partial<Order>): Order => {
    const newId = 'ord_' + Date.now();
    const orderNum = 'SK-2026-' + Math.floor(100 + Math.random() * 900);
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: newId,
      orderNumber: orderNum,
      customerId: orderData.customerId || 'u_pria',
      customerName: orderData.customerName || 'Priya Singh',
      customerPhone: orderData.customerPhone || '9812345678',
      customerVillage: orderData.customerVillage || selectedVillage,
      customerDistrict: orderData.customerDistrict || selectedDistrict,
      customerState: orderData.customerState || selectedState,
      tailorId: orderData.tailorId || 't_sunita',
      tailorName: orderData.tailorName || 'Sunita Devi',
      tailorVillage: orderData.tailorVillage || 'Mohanlalganj',
      tailorPhone: orderData.tailorPhone || '9876543210',
      categoryId: orderData.categoryId || 'blouse',
      categoryName: orderData.categoryName || 'Blouse Stitching',
      designTitle: orderData.designTitle || 'Custom Stitching Order',
      designImage: orderData.designImage || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
      price: orderData.price || 400,
      advancePaid: orderData.advancePaid || 0,
      paymentMethod: orderData.paymentMethod || 'cod',
      paymentStatus: orderData.paymentStatus || 'pending',
      status: 'requested',
      handoverMethod: orderData.handoverMethod || 'customer_drop',
      hasDeliveryAvailable: orderData.hasDeliveryAvailable || false,
      measurements: orderData.measurements || 'Handover during fabric drop',
      specialInstructions: orderData.specialInstructions || '',
      requiredDate: orderData.requiredDate || '2026-09-15',
      appointmentDate: orderData.appointmentDate || orderData.requiredDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      appointmentTimeSlot: orderData.appointmentTimeSlot || 'Morning (10:00 AM - 01:00 PM)',
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

    setOrders(prev => [newOrder, ...prev]);

    // Send order to backend API for SQLite DB persistence
    createApiOrder(newOrder);

    // Update tailor current active count
    setTailors(prev =>
      prev.map(t => (t.id === newOrder.tailorId ? { ...t, currentActiveOrders: t.currentActiveOrders + 1 } : t))
    );

    // Send Notification to Tailor
    sendNotification({
      targetRole: 'tailor',
      recipientId: newOrder.tailorId,
      titleEn: `New Order Request ${newOrder.orderNumber}`,
      titleHi: `नया सिलाई अनुरोध ${newOrder.orderNumber}`,
      messageEn: `${newOrder.customerName} from ${newOrder.customerVillage} requested ${newOrder.designTitle}.`,
      messageHi: `${newOrder.customerVillage} से ${newOrder.customerName} ने ${newOrder.designTitle} का ऑर्डर दिया है।`,
      type: 'order'
    });

    return newOrder;
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

  const updateTailorAvailability = (tailorId: string, availability: TailorAvailability) => {
    setTailors(prev => prev.map(t => (t.id === tailorId ? { ...t, availability } : t)));
    updateTailorAvailabilityApi(tailorId, availability);
  };

  const updateTailorCapacity = (tailorId: string, maxActiveOrders: number) => {
    setTailors(prev => prev.map(t => (t.id === tailorId ? { ...t, maxActiveOrders } : t)));
  };

  const updateTailorProfile = (tailorId: string, updates: Partial<TailorProfile>) => {
    setTailors(prev => prev.map(t => (t.id === tailorId ? { ...t, ...updates } : t)));
  };

  const addDesign = (design: Omit<DesignCatalogItem, 'id'>) => {
    const newItem: DesignCatalogItem = {
      ...design,
      id: 'd_' + Date.now()
    };
    setDesigns(prev => [newItem, ...prev]);
  };

  const updateDesign = (id: string, updates: Partial<DesignCatalogItem>) => {
    setDesigns(prev => prev.map(d => (d.id === id ? { ...d, ...updates } : d)));
  };

  const deleteDesign = (id: string) => {
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

  const acceptQuoteOffer = (requestId: string, offerId: string): Order | undefined => {
    const targetReq = customRequests.find(r => r.id === requestId);
    if (!targetReq) return undefined;

    const offer = targetReq.offers.find(o => o.id === offerId);
    if (!offer) return undefined;

    setCustomRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'quote_accepted', acceptedQuoteId: offerId } : r))
    );

    // Send to backend API
    acceptApiQuoteOffer(requestId, offerId);

    // Create active order from custom quote
    return createOrder({
      customerId: targetReq.customerId,
      customerName: targetReq.customerName,
      customerVillage: targetReq.customerVillage,
      customerDistrict: targetReq.customerDistrict,
      customerState: targetReq.customerState,
      tailorId: offer.tailorId,
      tailorName: offer.tailorName,
      tailorVillage: offer.tailorVillage,
      tailorPhone: offer.tailorPhone,
      categoryName: targetReq.clothingCategory,
      designTitle: targetReq.requestTitle,
      designImage: targetReq.referenceImage,
      price: offer.price,
      requiredDate: targetReq.requiredDate,
      specialInstructions: `${targetReq.specialInstructions} (Quote Note: ${offer.note})`
    });
  };

  const verifyTailor = (tailorId: string, isVerified: boolean) => {
    setTailors(prev => prev.map(t => (t.id === tailorId ? { ...t, isVerified } : t)));
    verifyTailorApi(tailorId, isVerified);
  };

  const registerTailor = (
    tailorData: Omit<TailorProfile, 'id' | 'rating' | 'reviewCount' | 'completedOrdersCount' | 'currentActiveOrders' | 'joinedDate'>
  ) => {
    const newTailor: TailorProfile = {
      ...tailorData,
      id: 't_' + Date.now(),
      rating: 5.0,
      reviewCount: 0,
      completedOrdersCount: 0,
      currentActiveOrders: 0,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    setTailors(prev => [newTailor, ...prev]);

    // Send to backend API
    registerUserApi({
      name: newTailor.name,
      phone: newTailor.phone,
      role: 'tailor',
      village: newTailor.village,
      district: newTailor.district,
      state: newTailor.state
    });

    // Admin notification
    sendNotification({
      targetRole: 'all',
      titleEn: 'New Tailor Registration Pending Approval',
      titleHi: 'नया दर्जी पंजीकरण सत्यापन के लिए लंबित',
      messageEn: `${newTailor.name} from ${newTailor.village} registered as a tailor.`,
      messageHi: `${newTailor.village} से ${newTailor.name} ने पंजीकरण कराया है।`,
      type: 'admin'
    });
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

  const toggleBlockUser = (userId: string) => {
    setCustomers(prev =>
      prev.map(c => (c.id === userId ? { ...c, isBlocked: !c.isBlocked } : c))
    );
  };

  const resolveComplaint = (complaintId: string, status: 'investigating' | 'resolved', note?: string) => {
    setComplaints(prev =>
      prev.map(cmp => (cmp.id === complaintId ? { ...cmp, status, resolutionNote: note } : cmp))
    );
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
