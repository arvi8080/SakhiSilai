# 🧵 SakhiSilai - Hyperlocal Women Tailoring Platform

> **Tagline:** *Ghar Se Hunar, Apni Kamai.*  
> A zero-commission hyperlocal platform empowering rural and suburban women tailors with direct customer bookings, custom photo bidding, real-time stitching tracking, persistent SQLite storage, and an integrated UPI payment gateway.

---

## 🌟 Overview

**SakhiSilai** bridges the gap between household women tailors and local customers. Customers can discover top-rated tailors in their village or district, choose custom design styles, request fabric pickups, or upload dress photos for price bidding. Tailors receive 100% of their earnings with zero platform commissions.

---

## ✨ Key Features

- 📍 **Hyperlocal Village Matching**: Automatically computes proximity scores, matching tiers (`same_village`, `nearby_area`), and distance estimates for customers and tailors.
- 👗 **Custom Photo Bidding**: Customers upload dress photos from Pinterest/Instagram; local tailors submit competitive price & ETA quotes.
- 💳 **Integrated Payment Gateway**:
  - 💵 **Cash on Completion (100% COD)**
  - 📱 **UPI / QR Instant Payments** (Dynamic QR payload generation for `sakhisilai@upi`, GPay, PhonePe, Paytm)
  - ⚡ **Partial Advance Booking** (Pay ₹200 advance online, balance upon completion)
  - 📄 **Digital Receipts**: Real-time transaction ref generation (`TXN...`) and persistent payment history.
- ⏱️ **Real-Time Stitching Order Tracker**: Step-by-step progress timeline (`Requested` ➔ `Accepted` ➔ `Fabric Received` ➔ `Cutting Started` ➔ `Stitching` ➔ `Quality Check` ➔ `Ready` ➔ `Completed`).
- 👩‍🎨 **Tailor Work Center**:
  - Live availability status controls (🟢 *Available*, 🟡 *Limited Slots*, 🔴 *Busy*).
  - Active workload capacity limiter.
  - Multi-category stitching design catalog editor.
  - Earnings dashboard with 100% direct payout breakdown.
- 🛡️ **Admin Verification Panel**: Tailor registration approval workflow, system broadcast notifications, and platform analytics.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti |
| **Backend API** | Node.js, Express.js, TypeScript, Swagger UI (`swagger-ui-express`) |
| **Database** | SQLite (`better-sqlite3`) with WAL journal mode & schema migrations |
| **DevOps & Containers** | Docker, Docker Compose, Kubernetes (`k8s`), Render Deployment |

---

## 🗄️ Database Architecture & Schema

The persistent SQLite database (`backend/data/sakhisilai.db`) includes the following relational schema:

```
┌──────────────┐     ┌──────────────┐     ┌────────────────┐
│    users     │ ──► │   tailors    │ ──► │    designs     │
└──────────────┘     └──────────────┘     └────────────────┘
       │                    │
       ▼                    ▼
┌──────────────┐     ┌──────────────┐     ┌────────────────┐
│   orders     │ ──► │   payments   │     │custom_requests │
└──────────────┘     └──────────────┘     └────────────────┘
       │                    │
       ▼                    ▼
┌──────────────┐     ┌──────────────┐
│  categories  │     │  locations   │
└──────────────┘     └──────────────┘
```

- **`users`**: Customer, tailor, and admin profile data.
- **`tailors`**: Tailor bio, address, experience, rating, availability, capacity, and skills.
- **`categories`**: Service categories (Blouse, Suit & Salwar, Dress & Kurti, Kids).
- **`designs`**: Catalog items offered by tailors with prices & turnaround days.
- **`orders`**: Active stitching orders, handover options, measurements, and status history.
- **`custom_requests`**: Photo bidding requests and quote offers (`offers` JSON).
- **`locations`**: State, district, and village geographic data.
- **`notifications`**: System notifications with recipient targeting.
- **`payments`**: Persistent transaction records (`id`, `orderId`, `amount`, `paymentMethod`, `paymentStatus`, `transactionId`, `timestamp`).

---

## 🚀 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` - Customer / User registration
- `POST /api/auth/register-tailor` - Tailor registration
- `POST /api/auth/login` - User authentication

### ✂️ Tailors (`/api/tailors`)
- `GET /api/tailors` - List all tailors
- `GET /api/tailors/nearby` - Hyperlocal tailor matching (state, district, village query)
- `GET /api/tailors/:id` - Fetch single tailor profile
- `POST /api/tailors/availability` - Update availability status

### 📦 Orders (`/api/orders`)
- `GET /api/orders` - Filter orders by customer or tailor
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create new stitching order
- `PATCH /api/orders/:id/status` - Update stitching progress status

### 💳 Payments (`/api/payments`)
- `POST /api/payments/process` - Process payment (COD, UPI, Partial Advance)
- `POST /api/payments/qr-generate` - Dynamic UPI QR payload generator (`sakhisilai@upi`)
- `GET /api/payments/order/:orderId` - Retrieve payment transaction records

### 🎨 Custom Photo Requests (`/api/custom-requests`)
- `GET /api/custom-requests` - List custom photo requests
- `POST /api/custom-requests` - Post design photo for bidding
- `POST /api/custom-requests/:id/quotes` - Submit tailor price quote
- `POST /api/custom-requests/:id/accept-quote` - Accept quote and generate order

### 📍 Locations & Categories (`/api/locations`, `/api/categories`)
- `GET /api/locations` | `POST /api/locations/villages`
- `GET /api/categories` | `POST /api/categories` | `DELETE /api/categories/:id`

### 🔔 Notifications & Admin (`/api/notifications`, `/api/admin`)
- `GET /api/notifications` | `POST /api/notifications/broadcast`
- `GET /api/admin/stats` | `POST /api/admin/tailors/:id/verify`

> 📖 **Swagger UI Documentation**: Available at `http://localhost:5000/api-docs` when server is running.

---

## 💻 Local Development Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Clone Repository
```bash
git clone https://github.com/arvi8080/SakhiSilai.git
cd SakhiSilai
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend API will listen on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Frontend Web App will run on `http://localhost:5173`.

---

## 🧪 Testing

### Backend API & SQLite Database Build Test
```bash
cd backend
npm run build
```

---

## 🐳 Docker Deployment

To run both backend and frontend via Docker Compose:
```bash
docker-compose up --build
```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.
