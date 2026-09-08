# 🧵 SakhiSilai - Hyperlocal Women Tailoring Platform

[![Platform](https://img.shields.io/badge/Platform-SakhiSilai-E91E63?style=for-the-badge&logo=react)](https://github.com/arvi8080/SakhiSilai)
[![Backend API](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-1B4D3E?style=for-the-badge&logo=nodedotjs)](http://localhost:5000/api-docs)
[![Database](https://img.shields.io/badge/Database-SQLite%20(Persistent)-003B57?style=for-the-badge&logo=sqlite)](http://localhost:5000/health)
[![Build & Tests](https://img.shields.io/badge/APIs%20Tested-19%2F19%20Passed-emerald?style=for-the-badge)](http://localhost:5000/health)

> **Tagline:** *Ghar Se Hunar, Apni Kamai.*  
> A zero-commission hyperlocal platform empowering rural and suburban women tailors with direct customer bookings, interactive visit appointment scheduling, custom photo bidding, real-time stitching tracking, persistent SQLite storage, and integrated UPI QR payments.

---

## 🌟 Overview

**SakhiSilai** bridges the gap between household women tailors and local customers. Tailors stay at home, while customers in the same village or district can discover them, schedule visit appointments for fabric drops and measurements, choose custom designs, or upload dress photos for price bidding. Tailors receive 100% of their earnings with zero platform commissions.

---

## ✨ Key Features & Architecture

### 1️⃣ Single Unified User System & "Become a Tailor" Flow
- **One Signup for Everyone**: Name, Mobile OR Email, Password, Village, and District selection.
- **Unified Account Logic**: Every user registers as a normal customer first.
- **Become a Tailor**: Users can apply to become a tailor partner directly from their customer dashboard by filling in stitching skills, experience, village, starting prices, and portfolio images.
- **Admin Verification**: Applications are reviewed by SakhiSilai Admin. Once approved (`isVerified: true`), tailor features unlock for that account.

```
Unified Signup (Role = customer)
           ↓
Customer Dashboard ➔ Click "Become a Tailor"
           ↓
Fill Skills, Experience & Portfolio
           ↓
Application Submitted ➔ Admin Verification ✅
           ↓
Tailor Profile Activated ➔ Access Tailor Dashboard Console 👩‍🧵
```

---

### 2️⃣ 📅 Visit & Measurement Appointment Booking System
- **Schedule Appointment**: Customers select their preferred **Appointment Date** and **Time Slot** during order booking:
  - 🌅 **Morning Slot**: `10:00 AM – 01:00 PM`
  - ☀️ **Afternoon Slot**: `02:00 PM – 05:00 PM`
  - 🌆 **Evening Slot**: `05:00 PM – 08:00 PM`
- **Appointment Confirmation**: Requested appointments are sent to the tailor. Upon tailor acceptance, the appointment status changes to **`✅ Appointment Confirmed`**.
- **`📅 Book Appointment`** quick action button featured on all tailor profile pages.

---

### 3️⃣ 📍 Uttar Pradesh Hyperlocal Village Matching & Contact Privacy
- **All 75 UP Districts Supported**: Includes Lucknow, Kanpur Nagar, Varanasi, Prayagraj, Agra, Aligarh, Gorakhpur, Meerut, Ayodhya, Jhansi, Ghaziabad, Gautam Buddha Nagar, and all 75 districts of Uttar Pradesh.
- **Same-Village Priority**: Prioritizes home tailors in the same village for minimum travel and maximum trust.
- **🔒 Privacy Contact Unlocking**: Tailor phone numbers and exact home drop addresses are kept private until the tailor accepts the order request. Upon acceptance, full contact and handover details unlock.

---

### 4️⃣ 👗 Custom Photo Bidding & Quote System
- **Pinterest / Instagram Custom Bidding**: Customers upload dress photos, select budget, target date, and instructions.
- **Tailor Quote Offers**: Verified nearby tailors review custom requests and submit custom price & timeframe quotes.
- **Instant Order Conversion**: Customer accepts a quote to convert it into an active order.

---

### 5️⃣ ⏱️ Real-Time Stitching Order Tracker & Payment Gateway
- **8-Stage Live Stepper**: `Order Requested` ➔ `Tailor Accepted` ➔ `Fabric Received` ➔ `Cutting Started` ➔ `Stitching` ➔ `Quality Check` ➔ `Ready` ➔ `Completed`.
- **Integrated Payment Methods**:
  - 📱 **UPI / QR Instant Payments** (Dynamic QR payload generation for `sakhisilai@upi`, GPay, PhonePe, Paytm).
  - ⚡ **Partial Advance Booking** (Pay ₹200 advance online, balance upon completion).
  - 💵 **Cash on Completion (100% Direct COD)**.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Vanilla CSS / Tailwind, Lucide Icons, Canvas Confetti |
| **Backend API** | Node.js, Express.js, TypeScript, Swagger UI (`swagger-ui-express`) |
| **Database** | Persistent SQLite (`sakhisilai.db`) with `better-sqlite3` & Realtime Cloud Firestore sync |
| **DevOps & Containers** | Docker, Docker Compose, Render Deployment |

---

## 🚀 API Endpoints Reference (19/19 Verified & Tested)

| # | Method | Endpoint Path | Description | Test Status |
| :-: | :--- | :--- | :--- | :-: |
| 1 | `GET` | `/health` | API Health Check & Service Metadata | ✅ `200 OK` |
| 2 | `GET` | `/api/locations` | Fetch UP States, Districts & Villages | ✅ `200 OK` |
| 3 | `GET` | `/api/categories` | Service Categories Catalog | ✅ `200 OK` |
| 4 | `GET` | `/api/tailors/nearby` | Hyperlocal Tailor Search & Ranking | ✅ `200 OK` |
| 5 | `GET` | `/api/tailors/:id` | Fetch Tailor Profile Details | ✅ `200 OK` |
| 6 | `POST` | `/api/auth/register` | Customer / User Registration | ✅ `201 Created` |
| 7 | `POST` | `/api/auth/login` | Unified Email/Mobile Authentication | ✅ `200 OK` |
| 8 | `GET` | `/api/auth/me/:userId` | Current User Data Fetch | ✅ `200 OK` |
| 9 | `GET` | `/api/auth/customers` | Customer Directory Listing | ✅ `200 OK` |
| 10 | `GET` | `/api/orders` | Fetch Orders by Role & Filter | ✅ `200 OK` |
| 11 | `GET` | `/api/orders/:id` | Get Order & Appointment Details | ✅ `200 OK` |
| 12 | `POST` | `/api/orders` | Create Order with Appointment Date/Slot | ✅ `201 Created` |
| 13 | `PATCH` | `/api/orders/:id/status` | Update Order & Stitching Stage | ✅ `200 OK` |
| 14 | `GET` | `/api/custom-requests` | List Custom Design Photo Bids | ✅ `200 OK` |
| 15 | `POST` | `/api/custom-requests` | Post Custom Photo Bidding Request | ✅ `201 Created` |
| 16 | `GET` | `/api/notifications` | Fetch Role Notifications | ✅ `200 OK` |
| 17 | `POST` | `/api/notifications` | Send System / Admin Notification | ✅ `201 Created` |
| 18 | `GET` | `/api/admin/stats` | Admin Dashboard Analytics & Metrics | ✅ `200 OK` |
| 19 | `POST` | `/api/payments/verify` | Verify & Record Payment Transaction | ✅ `200 OK` |

> 📖 **Swagger UI Documentation**: Interactive API testing available at `http://localhost:5000/api-docs` when server is running.

---

## 💻 Local Setup & Development

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1️⃣ Clone Repository
```bash
git clone https://github.com/arvi8080/SakhiSilai.git
cd SakhiSilai
```

### 2️⃣ Start Backend API (Port 5000)
```bash
cd backend
npm install
npm run dev
```

### 3️⃣ Start Frontend Web App (Port 5173)
```bash
cd ../frontend
npm install
npm run dev
```

---

## 🧪 Testing

### Run Frontend Build Check
```bash
cd frontend
npm run build
```

### Run Automated API Test Suite
```bash
node scratch/test_apis.js
```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.
