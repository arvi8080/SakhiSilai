import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import type {
  User,
  TailorProfile,
  ServiceCategory,
  DesignCatalogItem,
  Order,
  CustomDesignRequest,
  Review,
  SystemNotification
} from '../types';

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'sakhisilai.db');
console.log(`📁 Persistent Database File: ${dbPath}`);

export const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');

// Initialize database schema tables
export function initDatabase() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      password TEXT,
      role TEXT NOT NULL,
      state TEXT NOT NULL,
      district TEXT NOT NULL,
      village TEXT NOT NULL,
      avatar TEXT,
      createdAt TEXT NOT NULL,
      isVerified INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS tailors (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      avatar TEXT,
      state TEXT NOT NULL,
      district TEXT NOT NULL,
      village TEXT NOT NULL,
      addressApprox TEXT NOT NULL,
      bio TEXT,
      experienceYears INTEGER DEFAULT 0,
      rating REAL DEFAULT 5.0,
      reviewCount INTEGER DEFAULT 0,
      completedOrdersCount INTEGER DEFAULT 0,
      availability TEXT DEFAULT 'available',
      maxActiveOrders INTEGER DEFAULT 5,
      currentActiveOrders INTEGER DEFAULT 0,
      servicesOffered TEXT,
      startingPrice INTEGER DEFAULT 300,
      estCompletionDays INTEGER DEFAULT 3,
      skills TEXT,
      galleryImages TEXT,
      isVerified INTEGER DEFAULT 0,
      joinedDate TEXT
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      nameEn TEXT NOT NULL,
      nameHi TEXT NOT NULL,
      iconName TEXT NOT NULL,
      descriptionEn TEXT,
      descriptionHi TEXT,
      startingPrice INTEGER DEFAULT 0,
      estDays INTEGER DEFAULT 3,
      popular INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS designs (
      id TEXT PRIMARY KEY,
      tailorId TEXT NOT NULL,
      tailorName TEXT NOT NULL,
      categoryId TEXT NOT NULL,
      categoryName TEXT NOT NULL,
      title TEXT NOT NULL,
      titleHi TEXT,
      image TEXT NOT NULL,
      price INTEGER NOT NULL,
      estDays INTEGER DEFAULT 3,
      description TEXT,
      isAvailable INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      orderNumber TEXT NOT NULL,
      customerId TEXT NOT NULL,
      customerName TEXT NOT NULL,
      customerPhone TEXT NOT NULL,
      customerVillage TEXT NOT NULL,
      customerDistrict TEXT NOT NULL,
      customerState TEXT NOT NULL,
      tailorId TEXT NOT NULL,
      tailorName TEXT NOT NULL,
      tailorVillage TEXT NOT NULL,
      tailorPhone TEXT NOT NULL,
      categoryId TEXT NOT NULL,
      categoryName TEXT NOT NULL,
      designTitle TEXT,
      designImage TEXT,
      price INTEGER NOT NULL,
      advancePaid INTEGER DEFAULT 0,
      paymentMethod TEXT DEFAULT 'cod',
      paymentStatus TEXT DEFAULT 'pending',
      status TEXT DEFAULT 'requested',
      handoverMethod TEXT DEFAULT 'customer_drop',
      hasDeliveryAvailable INTEGER DEFAULT 0,
      measurements TEXT,
      specialInstructions TEXT,
      requiredDate TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      statusHistory TEXT
    );

    CREATE TABLE IF NOT EXISTS custom_requests (
      id TEXT PRIMARY KEY,
      customerId TEXT NOT NULL,
      customerName TEXT NOT NULL,
      customerVillage TEXT NOT NULL,
      customerDistrict TEXT NOT NULL,
      customerState TEXT NOT NULL,
      requestTitle TEXT NOT NULL,
      clothingCategory TEXT NOT NULL,
      referenceImage TEXT,
      specialInstructions TEXT,
      requiredDate TEXT,
      createdAt TEXT NOT NULL,
      status TEXT DEFAULT 'open',
      offers TEXT
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      tailorId TEXT NOT NULL,
      customerId TEXT NOT NULL,
      customerName TEXT NOT NULL,
      customerVillage TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT,
      date TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      targetRole TEXT NOT NULL,
      recipientId TEXT,
      titleEn TEXT NOT NULL,
      titleHi TEXT NOT NULL,
      messageEn TEXT NOT NULL,
      messageHi TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      isRead INTEGER DEFAULT 0,
      type TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS locations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      districts TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      orderId TEXT NOT NULL,
      customerId TEXT NOT NULL,
      tailorId TEXT NOT NULL,
      amount INTEGER NOT NULL,
      paymentMethod TEXT NOT NULL,
      paymentStatus TEXT NOT NULL,
      transactionId TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      receiptUrl TEXT
    );
  `);

  try {
    sqlite.exec("ALTER TABLE users ADD COLUMN password TEXT;");
  } catch (e) {
    // Column already exists
  }

  // Migration for existing databases: ensure recipientId column exists in notifications
  try {
    sqlite.exec('ALTER TABLE notifications ADD COLUMN recipientId TEXT;');
  } catch (e) {
    // recipientId column already exists
  }

  // Seed initial data if tables are empty
  seedIfEmpty();
}

function seedIfEmpty() {
  const userCount = (sqlite.prepare('SELECT COUNT(*) as cnt FROM users').get() as any).cnt;

  if (userCount === 0) {
    console.log('🌱 Seeding initial SakhiSilai database records...');

    // 1. Users
    const insertUser = sqlite.prepare(`
      INSERT INTO users (id, name, phone, email, role, state, district, village, avatar, createdAt, isVerified)
      VALUES (@id, @name, @phone, @email, @role, @state, @district, @village, @avatar, @createdAt, @isVerified)
    `);

    insertUser.run({
      id: 'u_pria',
      name: 'Priya Singh',
      phone: '9812345678',
      email: 'priya@example.com',
      role: 'customer',
      state: 'Uttar Pradesh',
      district: 'Lucknow',
      village: 'Mohanlalganj',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
      createdAt: '2025-01-10',
      isVerified: 1
    });

    insertUser.run({
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
      isVerified: 1
    });

    insertUser.run({
      id: 'admin_1',
      name: 'Seema Sharma (Sakhi Admin)',
      phone: '9999900000',
      email: 'admin@sakhisilai.org',
      role: 'admin',
      state: 'Uttar Pradesh',
      district: 'Lucknow',
      village: 'Mohanlalganj',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      createdAt: '2024-01-01',
      isVerified: 1
    });

    // 2. Categories
    const insertCat = sqlite.prepare(`
      INSERT INTO categories (id, nameEn, nameHi, iconName, descriptionEn, descriptionHi, startingPrice, estDays, popular)
      VALUES (@id, @nameEn, @nameHi, @iconName, @descriptionEn, @descriptionHi, @startingPrice, @estDays, @popular)
    `);

    const categories: ServiceCategory[] = [
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

    for (const cat of categories) {
      insertCat.run({
        ...cat,
        popular: cat.popular ? 1 : 0
      });
    }

    // 3. Tailors
    const insertTailor = sqlite.prepare(`
      INSERT INTO tailors (
        id, userId, name, phone, avatar, state, district, village, addressApprox, bio,
        experienceYears, rating, reviewCount, completedOrdersCount, availability, maxActiveOrders,
        currentActiveOrders, servicesOffered, startingPrice, estCompletionDays, skills, galleryImages, isVerified, joinedDate
      ) VALUES (
        @id, @userId, @name, @phone, @avatar, @state, @district, @village, @addressApprox, @bio,
        @experienceYears, @rating, @reviewCount, @completedOrdersCount, @availability, @maxActiveOrders,
        @currentActiveOrders, @servicesOffered, @startingPrice, @estCompletionDays, @skills, @galleryImages, @isVerified, @joinedDate
      )
    `);

    insertTailor.run({
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
      servicesOffered: JSON.stringify(['Blouse Stitching', 'Suit & Salwar Stitching', 'Dress & Kurti']),
      startingPrice: 300,
      estCompletionDays: 3,
      skills: JSON.stringify(['Princess Cut', 'Padded Blouse', 'Heavy Embroidery']),
      galleryImages: JSON.stringify([
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80'
      ]),
      isVerified: 1,
      joinedDate: '2025-01-15'
    });

    insertTailor.run({
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
      servicesOffered: JSON.stringify(['Blouse Stitching', 'Suit & Salwar Stitching', 'Kids Clothing']),
      startingPrice: 280,
      estCompletionDays: 2,
      skills: JSON.stringify(['Bridal Sharara', 'Dori Neckline']),
      galleryImages: JSON.stringify([
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80'
      ]),
      isVerified: 1,
      joinedDate: '2025-02-01'
    });

    // 4. Designs
    const insertDesign = sqlite.prepare(`
      INSERT INTO designs (id, tailorId, tailorName, categoryId, categoryName, title, titleHi, image, price, estDays, description, isAvailable)
      VALUES (@id, @tailorId, @tailorName, @categoryId, @categoryName, @title, @titleHi, @image, @price, @estDays, @description, @isAvailable)
    `);

    insertDesign.run({
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
      isAvailable: 1
    });

    // 5. Orders
    const insertOrder = sqlite.prepare(`
      INSERT INTO orders (
        id, orderNumber, customerId, customerName, customerPhone, customerVillage, customerDistrict, customerState,
        tailorId, tailorName, tailorVillage, tailorPhone, categoryId, categoryName, designTitle, designImage, price,
        advancePaid, paymentMethod, paymentStatus, status, handoverMethod, hasDeliveryAvailable, measurements,
        specialInstructions, requiredDate, createdAt, updatedAt, statusHistory
      ) VALUES (
        @id, @orderNumber, @customerId, @customerName, @customerPhone, @customerVillage, @customerDistrict, @customerState,
        @tailorId, @tailorName, @tailorVillage, @tailorPhone, @categoryId, @categoryName, @designTitle, @designImage, @price,
        @advancePaid, @paymentMethod, @paymentStatus, @status, @handoverMethod, @hasDeliveryAvailable, @measurements,
        @specialInstructions, @requiredDate, @createdAt, @updatedAt, @statusHistory
      )
    `);

    insertOrder.run({
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
      hasDeliveryAvailable: 0,
      measurements: 'Bust 36, Waist 30',
      specialInstructions: 'Please add red piping along sleeves.',
      requiredDate: '2026-09-10',
      createdAt: '2026-09-05T10:30:00Z',
      updatedAt: '2026-09-07T08:15:00Z',
      statusHistory: JSON.stringify([
        { status: 'requested', labelEn: 'Order Requested', labelHi: 'ऑर्डर भेजा गया', timestamp: '2026-09-05T10:30:00Z' },
        { status: 'accepted', labelEn: 'Tailor Accepted', labelHi: 'दर्जी ने स्वीकार किया', timestamp: '2026-09-05T11:00:00Z' },
        { status: 'stitching', labelEn: 'Stitching in Progress', labelHi: 'सिलाई जारी है', timestamp: '2026-09-07T08:15:00Z' }
      ])
    });

    // 6. Custom Requests
    const insertReq = sqlite.prepare(`
      INSERT INTO custom_requests (
        id, customerId, customerName, customerVillage, customerDistrict, customerState, requestTitle,
        clothingCategory, referenceImage, specialInstructions, requiredDate, createdAt, status, offers
      ) VALUES (
        @id, @customerId, @customerName, @customerVillage, @customerDistrict, @customerState, @requestTitle,
        @clothingCategory, @referenceImage, @specialInstructions, @requiredDate, @createdAt, @status, @offers
      )
    `);

    insertReq.run({
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
      offers: JSON.stringify([
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
      ])
    });

    // 7. Notifications
    const insertNotif = sqlite.prepare(`
      INSERT INTO notifications (id, targetRole, recipientId, titleEn, titleHi, messageEn, messageHi, timestamp, isRead, type)
      VALUES (@id, @targetRole, @recipientId, @titleEn, @titleHi, @messageEn, @messageHi, @timestamp, @isRead, @type)
    `);

    insertNotif.run({
      id: 'n_1',
      targetRole: 'all',
      recipientId: '',
      titleEn: 'Welcome to SakhiSilai API!',
      titleHi: 'सखीसिलाई एपीआई में आपका स्वागत है!',
      messageEn: 'Hyperlocal women tailoring backend server active with SQLite persistent database.',
      messageHi: 'हाइपरलोकल महिला सिलाई बैकएंड सर्वर SQLite डेटाबेस के साथ सक्रिय है।',
      timestamp: new Date().toISOString(),
      isRead: 0,
      type: 'admin'
    });

    console.log('✅ SQLite database successfully seeded with initial SakhiSilai dataset!');
  }

  // Ensure locations are always seeded if table is empty
  const locCount = (sqlite.prepare('SELECT COUNT(*) as cnt FROM locations').get() as any).cnt;
  if (locCount === 0) {
    seedLocations();
  }
}

function seedLocations() {
  console.log('🌱 Seeding initial SakhiSilai location records...');
  const insertLoc = sqlite.prepare(`
    INSERT INTO locations (id, name, districts)
    VALUES (@id, @name, @districts)
  `);

  const locationsData = [
    {
      id: 'up',
      name: 'Uttar Pradesh',
      districts: JSON.stringify([
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
      ])
    },
    {
      id: 'rajasthan',
      name: 'Rajasthan',
      districts: JSON.stringify([
        {
          id: 'jaipur',
          name: 'Jaipur',
          villages: ['Sanganer', 'Chatsu', 'Chomu', 'Amer']
        }
      ])
    }
  ];

  for (const loc of locationsData) {
    insertLoc.run(loc);
  }
}
