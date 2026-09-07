import type {
  TailorProfile,
  ServiceCategory,
  DesignCatalogItem,
  Order,
  CustomDesignRequest,
  StateLocation,
  Review,
  SystemNotification
} from '../types';

export const INITIAL_LOCATIONS: StateLocation[] = [
  {
    id: 'up',
    name: 'Uttar Pradesh',
    districts: [
      {
        id: 'lucknow',
        name: 'Lucknow',
        villages: ['Mohanlalganj', 'Bakshi Ka Talab', 'Goshainganj', 'Kakori', 'Chinhat']
      },
      {
        id: 'barabanki',
        name: 'Barabanki',
        villages: ['Zaidpur', 'Haidergarh', 'Fatehpur', 'Daryabad']
      },
      {
        id: 'varanasi',
        name: 'Varanasi',
        villages: ['Rameshwar', 'Sewapuri', 'Pindra', 'Kashi']
      }
    ]
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    districts: [
      {
        id: 'jaipur',
        name: 'Jaipur',
        villages: ['Sanganer', 'Chatsu', 'Chomu', 'Amer', 'Bassi']
      },
      {
        id: 'jodhpur',
        name: 'Jodhpur',
        villages: ['Mandore', 'Luni', 'Piparcity', 'Osian']
      }
    ]
  },
  {
    id: 'bihar',
    name: 'Bihar',
    districts: [
      {
        id: 'patna',
        name: 'Patna',
        villages: ['Bihta', 'Danapur', 'Fatuha', 'Phulwari Sharif']
      },
      {
        id: 'muzaffarpur',
        name: 'Muzaffarpur',
        villages: ['Kanti', 'Motipur', 'Bochahan', 'Marwan']
      }
    ]
  }
];

export const INITIAL_CATEGORIES: ServiceCategory[] = [
  {
    id: 'blouse',
    nameEn: 'Blouse Stitching',
    nameHi: 'ब्लाउज सिलाई',
    iconName: 'Scissors',
    descriptionEn: 'Princess cut, padded, heavy bridal, padded & boat neck blouses with custom lining.',
    descriptionHi: 'प्रिंसेस कट, पैडेड, हैवी ब्राइडल, बोट नेक और डिज़ाइनर बैक ब्लाउज।',
    startingPrice: 300,
    estDays: 3,
    popular: true
  },
  {
    id: 'suit',
    nameEn: 'Suit & Salwar Stitching',
    nameHi: 'सूट एवं सलवार सिलाई',
    iconName: 'Shirt',
    descriptionEn: 'Anarkali, Punjabi suit, Sharara, Palazzo suit with piping and design necklines.',
    descriptionHi: 'अनारकली, पंजाबी सूट, शरारा, प्लाजो सूट एवं डिज़ाइनर नेक सिलाई।',
    startingPrice: 450,
    estDays: 4,
    popular: true
  },
  {
    id: 'dress',
    nameEn: 'Dress & Kurti',
    nameHi: 'ड्रेस एवं कुर्ती',
    iconName: 'Sparkles',
    descriptionEn: 'Long ethnic gowns, Indo-western dresses, casual daily wear kurtis.',
    descriptionHi: 'लॉन्ग एथनिक गाउन, इंडो-वेस्टर्न ड्रेसेस और कैज़ुअल कुर्तियां।',
    startingPrice: 500,
    estDays: 4
  },
  {
    id: 'kids',
    nameEn: 'Kids Clothing',
    nameHi: 'बच्चों के कपड़े',
    iconName: 'Smile',
    descriptionEn: 'Lehenga choli for girls, kurta pyjama for boys, cute frock stitching.',
    descriptionHi: 'बच्चों की फ्रॉक, लहंगा चोली और कुर्ता पायजामा।',
    startingPrice: 250,
    estDays: 2
  },
  {
    id: 'alterations',
    nameEn: 'Alterations & Fitting',
    nameHi: 'अल्टरेशन एवं फिटिंग',
    iconName: 'Ruler',
    descriptionEn: 'Size adjustment, length shortening, zipper replacement, tight/loose fitting.',
    descriptionHi: 'कपड़ों की फिटिंग, लंबाई छोटी करना, जिप बदलना व अल्टरेशन।',
    startingPrice: 80,
    estDays: 1
  },
  {
    id: 'custom',
    nameEn: 'Custom Design',
    nameHi: 'कस्टम डिज़ाइन (मनपसंद)',
    iconName: 'Palette',
    descriptionEn: 'Upload photo from Pinterest/Instagram and get exact custom stitching.',
    descriptionHi: 'अपनी पसंद का फोटो अपलोड करें और दर्जियों से मनपसंद दर पाएं।',
    startingPrice: 600,
    estDays: 5,
    popular: true
  }
];

export const INITIAL_TAILORS: TailorProfile[] = [
  {
    id: 't_sunita',
    userId: 'u_sunita',
    name: 'Sunita Devi',
    phone: '9876543210',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    village: 'Mohanlalganj',
    addressApprox: 'Near Primary School, Main Chaupal, Mohanlalganj',
    bio: 'Specialist in Designer Blouses and Anarkali Suits with 8+ years of experience from home.',
    experienceYears: 8,
    rating: 4.9,
    reviewCount: 42,
    completedOrdersCount: 128,
    availability: 'available',
    maxActiveOrders: 5,
    currentActiveOrders: 2,
    servicesOffered: ['Blouse Stitching', 'Suit & Salwar Stitching', 'Dress & Kurti', 'Custom Design'],
    startingPrice: 300,
    estCompletionDays: 3,
    skills: ['Princess Cut', 'Padded Blouse', 'Heavy Embroidery', 'Aari Work', 'Lining Work'],
    galleryImages: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80'
    ],
    isVerified: true,
    joinedDate: '2025-01-15'
  },
  {
    id: 't_radha',
    userId: 'u_radha',
    name: 'Radha Sharma',
    phone: '9876543211',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    village: 'Mohanlalganj',
    addressApprox: 'Near Temple Road, Mohanlalganj',
    bio: 'Master of bridal suits, sharara sets and fast alterations. Working dedicatedly for 6 years.',
    experienceYears: 6,
    rating: 4.8,
    reviewCount: 29,
    completedOrdersCount: 89,
    availability: 'available',
    maxActiveOrders: 4,
    currentActiveOrders: 1,
    servicesOffered: ['Blouse Stitching', 'Suit & Salwar Stitching', 'Kids Clothing', 'Alterations'],
    startingPrice: 280,
    estCompletionDays: 2,
    skills: ['Bridal Sharara', 'Dori Neckline', 'Pipe Fitting', 'Quick Alteration'],
    galleryImages: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=80'
    ],
    isVerified: true,
    joinedDate: '2025-02-01'
  },
  {
    id: 't_meena',
    userId: 'u_meena',
    name: 'Meena Kumari',
    phone: '9876543212',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    village: 'Bakshi Ka Talab',
    addressApprox: 'Station Road, Near Bank of Baroda, Bakshi Ka Talab',
    bio: 'Expert in Kids wear and designer kurtis. Known for perfect fitting and neat piping.',
    experienceYears: 5,
    rating: 4.7,
    reviewCount: 18,
    completedOrdersCount: 64,
    availability: 'limited',
    maxActiveOrders: 3,
    currentActiveOrders: 3,
    servicesOffered: ['Suit & Salwar Stitching', 'Kids Clothing', 'Dress & Kurti'],
    startingPrice: 250,
    estCompletionDays: 4,
    skills: ['Frock Stitching', 'Girl Lehenga', 'Straight Kurti', 'Button Crafting'],
    galleryImages: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80'
    ],
    isVerified: true,
    joinedDate: '2025-03-10'
  },
  {
    id: 't_anita',
    userId: 'u_anita',
    name: 'Anita Verma',
    phone: '9876543213',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    state: 'Rajasthan',
    district: 'Jaipur',
    village: 'Sanganer',
    addressApprox: 'Handicraft Lane, Near Post Office, Sanganer',
    bio: 'Specialist in Rajasthani Ethnic Lehengas, Chaniya Choli & Designer Blouses.',
    experienceYears: 10,
    rating: 5.0,
    reviewCount: 56,
    completedOrdersCount: 175,
    availability: 'available',
    maxActiveOrders: 6,
    currentActiveOrders: 2,
    servicesOffered: ['Blouse Stitching', 'Suit & Salwar Stitching', 'Custom Design', 'Dress & Kurti'],
    startingPrice: 350,
    estCompletionDays: 3,
    skills: ['Gota Patti Stitching', 'Padded Blouse', 'Traditional Lehenga', 'Designer Piping'],
    galleryImages: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80'
    ],
    isVerified: true,
    joinedDate: '2024-11-20'
  }
];

export const INITIAL_DESIGNS: DesignCatalogItem[] = [
  {
    id: 'd_1',
    tailorId: 't_sunita',
    tailorName: 'Sunita Devi',
    categoryId: 'blouse',
    categoryName: 'Blouse Stitching',
    title: 'Princess Cut Designer Blouse',
    titleHi: 'प्रिंसेस कट डिज़ाइनर ब्लाउज',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
    price: 600,
    estDays: 3,
    description: 'Beautiful princess cut blouse with padded cups, heavy piping and designer back dori.',
    isAvailable: true
  },
  {
    id: 'd_2',
    tailorId: 't_sunita',
    tailorName: 'Sunita Devi',
    categoryId: 'blouse',
    categoryName: 'Blouse Stitching',
    title: 'Classic Simple Daily Wear Blouse',
    titleHi: 'सादा दैनिक उपयोग ब्लाउज',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80',
    price: 300,
    estDays: 2,
    description: 'Neat classic front hook blouse with sturdy lining for daily comfort.',
    isAvailable: true
  },
  {
    id: 'd_3',
    tailorId: 't_radha',
    tailorName: 'Radha Sharma',
    categoryId: 'suit',
    categoryName: 'Suit & Salwar Stitching',
    title: 'Designer Sharara & Kurti Set',
    titleHi: 'डिज़ाइनर शरारा एवं कुर्ती सेट',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
    price: 750,
    estDays: 4,
    description: 'Modern sharara flare stitching with neck embroidery border placement.',
    isAvailable: true
  },
  {
    id: 'd_4',
    tailorId: 't_anita',
    tailorName: 'Anita Verma',
    categoryId: 'blouse',
    categoryName: 'Blouse Stitching',
    title: 'Heavy Bridal Velvet Blouse',
    titleHi: 'हैवी ब्राइडल वेलवेट ब्लाउज',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=80',
    price: 1200,
    estDays: 5,
    description: 'Heavy padded velvet blouse with handcrafted latkan and deep neck styling.',
    isAvailable: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_101',
    orderNumber: 'SK-2026-001',
    customerId: 'u_pria',
    customerName: 'Priya Singh',
    customerPhone: '9812345678',
    customerVillage: 'Mohanlalganj',
    customerDistrict: 'Lucknow',
    customerState: 'Uttar Pradesh',
    tailorId: 't_sunita',
    tailorName: 'Sunita Devi',
    tailorVillage: 'Mohanlalganj',
    tailorPhone: '9876543210',
    categoryId: 'blouse',
    categoryName: 'Blouse Stitching',
    designTitle: 'Princess Cut Designer Blouse',
    designImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
    price: 600,
    advancePaid: 0,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    status: 'stitching',
    handoverMethod: 'customer_drop',
    hasDeliveryAvailable: false,
    measurements: {
      id: 'm_1',
      userId: 'u_pria',
      label: 'My Blouse Measurement',
      clothingType: 'Blouse',
      bustOrChest: '36 in',
      waist: '30 in',
      length: '14.5 in',
      shoulder: '14 in',
      sleeveLength: '10 in',
      neckDepth: '8 in Front / 10 in Back'
    },
    specialInstructions: 'Please add red piping along sleeves and back dori latkan.',
    requiredDate: '2026-09-10',
    createdAt: '2026-09-05T10:30:00Z',
    updatedAt: '2026-09-07T08:15:00Z',
    statusHistory: [
      { status: 'requested', labelEn: 'Order Requested', labelHi: 'ऑर्डर भेजा गया', timestamp: '2026-09-05T10:30:00Z' },
      { status: 'accepted', labelEn: 'Tailor Accepted', labelHi: 'दर्जी ने स्वीकार किया', timestamp: '2026-09-05T11:00:00Z' },
      { status: 'fabric_received', labelEn: 'Fabric Received', labelHi: 'कपड़ा प्राप्त हुआ', timestamp: '2026-09-06T09:00:00Z' },
      { status: 'cutting_started', labelEn: 'Cutting Started', labelHi: 'कटाई शुरू हुई', timestamp: '2026-09-06T14:20:00Z' },
      { status: 'stitching', labelEn: 'Stitching in Progress', labelHi: 'सिलाई जारी है', timestamp: '2026-09-07T08:15:00Z' }
    ]
  },
  {
    id: 'ord_102',
    orderNumber: 'SK-2026-002',
    customerId: 'u_pria',
    customerName: 'Priya Singh',
    customerPhone: '9812345678',
    customerVillage: 'Mohanlalganj',
    customerDistrict: 'Lucknow',
    customerState: 'Uttar Pradesh',
    tailorId: 't_radha',
    tailorName: 'Radha Sharma',
    tailorVillage: 'Mohanlalganj',
    tailorPhone: '9876543211',
    categoryId: 'suit',
    categoryName: 'Suit & Salwar Stitching',
    designTitle: 'Designer Sharara Set',
    designImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
    price: 750,
    advancePaid: 200,
    paymentMethod: 'partial_advance',
    paymentStatus: 'advance_paid',
    status: 'completed',
    handoverMethod: 'delivery_pickup',
    hasDeliveryAvailable: true,
    measurements: 'Handover during drop',
    specialInstructions: 'Double stitching on side seams.',
    requiredDate: '2026-09-04',
    createdAt: '2026-08-28T14:00:00Z',
    updatedAt: '2026-09-03T16:00:00Z',
    statusHistory: [
      { status: 'requested', labelEn: 'Order Requested', labelHi: 'ऑर्डर भेजा गया', timestamp: '2026-08-28T14:00:00Z' },
      { status: 'accepted', labelEn: 'Tailor Accepted', labelHi: 'दर्जी ने स्वीकार किया', timestamp: '2026-08-28T15:00:00Z' },
      { status: 'fabric_received', labelEn: 'Fabric Received', labelHi: 'कपड़ा प्राप्त हुआ', timestamp: '2026-08-29T10:00:00Z' },
      { status: 'cutting_started', labelEn: 'Cutting Started', labelHi: 'कटाई शुरू हुई', timestamp: '2026-08-30T11:00:00Z' },
      { status: 'stitching', labelEn: 'Stitching in Progress', labelHi: 'सिलाई जारी है', timestamp: '2026-08-31T12:00:00Z' },
      { status: 'quality_check', labelEn: 'Quality Check Passed', labelHi: 'गुणवत्ता जाँच पास', timestamp: '2026-09-02T10:00:00Z' },
      { status: 'ready', labelEn: 'Ready for Pickup', labelHi: 'तैयार', timestamp: '2026-09-03T09:00:00Z' },
      { status: 'completed', labelEn: 'Order Completed', labelHi: 'ऑर्डर पूरा हुआ', timestamp: '2026-09-03T16:00:00Z' }
    ],
    rating: 5,
    reviewText: 'Wonderful fitting! Radha did perfect sharara flare stitching on time.'
  }
];

export const INITIAL_CUSTOM_REQUESTS: CustomDesignRequest[] = [
  {
    id: 'req_201',
    customerId: 'u_pria',
    customerName: 'Priya Singh',
    customerVillage: 'Mohanlalganj',
    customerDistrict: 'Lucknow',
    customerState: 'Uttar Pradesh',
    requestTitle: 'Pinterest Style Boat Neck Kurti with Organza Sleeves',
    clothingCategory: 'Dress & Kurti',
    referenceImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80',
    specialInstructions: 'Need organza sheer sleeves with fabric buttons down the neck line.',
    requiredDate: '2026-09-12',
    createdAt: '2026-09-06T12:00:00Z',
    status: 'open',
    offers: [
      {
        id: 'off_1',
        tailorId: 't_sunita',
        tailorName: 'Sunita Devi',
        tailorVillage: 'Mohanlalganj',
        tailorRating: 4.9,
        tailorPhone: '9876543210',
        price: 550,
        estDays: 3,
        note: 'I have done similar organza sleeve work before. Guaranteed neat finish!',
        createdAt: '2026-09-06T14:30:00Z'
      },
      {
        id: 'off_2',
        tailorId: 't_radha',
        tailorName: 'Radha Sharma',
        tailorVillage: 'Mohanlalganj',
        tailorRating: 4.8,
        tailorPhone: '9876543211',
        price: 500,
        estDays: 2,
        note: 'Can complete in 2 days if fabric is dropped today.',
        createdAt: '2026-09-06T15:10:00Z'
      }
    ]
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    orderId: 'ord_102',
    customerId: 'u_pria',
    customerName: 'Priya Singh',
    customerVillage: 'Mohanlalganj',
    tailorId: 't_radha',
    rating: 5,
    comment: 'Wonderful fitting! Radha did perfect sharara flare stitching on time.',
    date: '2026-09-03'
  },
  {
    id: 'rev_2',
    orderId: 'ord_099',
    customerId: 'u_kavita',
    customerName: 'Kavita Mishra',
    customerVillage: 'Mohanlalganj',
    tailorId: 't_sunita',
    rating: 5,
    comment: 'Sunita ji stitched my heavy bridal blouse perfectly! Very reliable home tailor in our village.',
    date: '2026-08-25'
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'n_1',
    targetRole: 'all',
    titleEn: 'Welcome to SakhiSilai Platform! 🧵',
    titleHi: 'सखीसिलाई मंच पर आपका स्वागत है! 🧵',
    messageEn: 'Connecting skilled rural women tailors with nearby customers directly.',
    messageHi: 'पास के ग्राहकों को सीधे हुनरमंद ग्रामीण महिला दर्जियों से जोड़ना।',
    timestamp: '2026-09-07T00:00:00Z',
    isRead: false,
    type: 'admin'
  },
  {
    id: 'n_2',
    targetRole: 'customer',
    recipientId: 'u_pria',
    titleEn: 'Order Update: SK-2026-001',
    titleHi: 'ऑर्डर अपडेट: SK-2026-001',
    messageEn: 'Sunita Devi updated your order status to "Stitching in Progress".',
    messageHi: 'सुनीता देवी ने आपके ऑर्डर की स्थिति बदलकर "सिलाई जारी है" कर दी है।',
    timestamp: '2026-09-07T08:15:00Z',
    isRead: false,
    type: 'order'
  }
];
