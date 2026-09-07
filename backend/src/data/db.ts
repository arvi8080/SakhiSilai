import type {
  User,
  TailorProfile,
  ServiceCategory,
  DesignCatalogItem,
  Order,
  CustomDesignRequest,
  LocationState,
  Review,
  SystemNotification
} from '../types';

class MemoryDatabase {
  public users: User[] = [];
  public tailors: TailorProfile[] = [];
  public categories: ServiceCategory[] = [];
  public designs: DesignCatalogItem[] = [];
  public orders: Order[] = [];
  public customRequests: CustomDesignRequest[] = [];
  public locations: LocationState[] = [];
  public reviews: Review[] = [];
  public notifications: SystemNotification[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    this.users = [
      {
        id: 'u_pria',
        name: 'Priya Singh',
        phone: '9812345678',
        email: 'priya@example.com',
        role: 'customer',
        state: 'Uttar Pradesh',
        district: 'Lucknow',
        village: 'Mohanlalganj',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
        createdAt: '2025-01-10'
      },
      {
        id: 'u_sunita',
        name: 'Sunita Devi',
        phone: '9876543210',
        email: 'sunita@sakhisilai.com',
        role: 'tailor',
        state: 'Uttar Pradesh',
        district: 'Lucknow',
        village: 'Mohanlalganj',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
        createdAt: '2025-01-15',
        isVerified: true
      },
      {
        id: 'admin_1',
        name: 'Seema Sharma (Sakhi Admin)',
        phone: '9999900000',
        email: 'admin@sakhisilai.org',
        role: 'admin',
        state: 'Uttar Pradesh',
        district: 'Lucknow',
        village: 'Mohanlalganj',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
        createdAt: '2024-01-01'
      }
    ];

    this.locations = [
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
            villages: ['Sanganer', 'Chatsu', 'Chomu', 'Amer']
          }
        ]
      }
    ];

    this.categories = [
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
      }
    ];

    this.tailors = [
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
        servicesOffered: ['Blouse Stitching', 'Suit & Salwar Stitching', 'Dress & Kurti'],
        startingPrice: 300,
        estCompletionDays: 3,
        skills: ['Princess Cut', 'Padded Blouse', 'Heavy Embroidery'],
        galleryImages: [
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80'
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
        servicesOffered: ['Blouse Stitching', 'Suit & Salwar Stitching', 'Kids Clothing'],
        startingPrice: 280,
        estCompletionDays: 2,
        skills: ['Bridal Sharara', 'Dori Neckline'],
        galleryImages: [
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80'
        ],
        isVerified: true,
        joinedDate: '2025-02-01'
      }
    ];

    this.designs = [
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
      }
    ];

    this.orders = [
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
        measurements: 'Bust 36, Waist 30',
        specialInstructions: 'Please add red piping along sleeves.',
        requiredDate: '2026-09-10',
        createdAt: '2026-09-05T10:30:00Z',
        updatedAt: '2026-09-07T08:15:00Z',
        statusHistory: [
          { status: 'requested', labelEn: 'Order Requested', labelHi: 'ऑर्डर भेजा गया', timestamp: '2026-09-05T10:30:00Z' },
          { status: 'accepted', labelEn: 'Tailor Accepted', labelHi: 'दर्जी ने स्वीकार किया', timestamp: '2026-09-05T11:00:00Z' },
          { status: 'stitching', labelEn: 'Stitching in Progress', labelHi: 'सिलाई जारी है', timestamp: '2026-09-07T08:15:00Z' }
        ]
      }
    ];

    this.customRequests = [
      {
        id: 'req_201',
        customerId: 'u_pria',
        customerName: 'Priya Singh',
        customerVillage: 'Mohanlalganj',
        customerDistrict: 'Lucknow',
        customerState: 'Uttar Pradesh',
        requestTitle: 'Pinterest Style Boat Neck Kurti',
        clothingCategory: 'Dress & Kurti',
        referenceImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80',
        specialInstructions: 'Need organza sheer sleeves with fabric buttons.',
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
            note: 'I have done similar organza sleeve work before.',
            createdAt: '2026-09-06T14:30:00Z'
          }
        ]
      }
    ];

    this.notifications = [
      {
        id: 'n_1',
        targetRole: 'all',
        titleEn: 'Welcome to SakhiSilai API!',
        titleHi: 'सखीसिलाई एपीआई में आपका स्वागत है!',
        messageEn: 'Hyperlocal women tailoring backend server active.',
        messageHi: 'हाइपरलोकल महिला सिलाई बैकएंड सर्वर सक्रिय है।',
        timestamp: '2026-09-07T00:00:00Z',
        isRead: false,
        type: 'admin'
      }
    ];
  }
}

export const db = new MemoryDatabase();
