const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://sakhisilai.onrender.com/api';
  }
  return 'http://localhost:5000/api';
};

const getHealthUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') + '/health';
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://sakhisilai.onrender.com/health';
  }
  return 'http://localhost:5000/health';
};

const API_BASE_URL = getBaseUrl();

// Health check
export async function checkBackendHealth() {
  try {
    const res = await fetch(getHealthUrl());
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === 'ok';
  } catch (err) {
    return false;
  }
}

// Tailors API
export async function fetchNearbyTailors(state: string = 'Uttar Pradesh', district: string = 'Lucknow', village: string = 'Mohanlalganj') {
  try {
    const res = await fetch(
      `${API_BASE_URL}/tailors/nearby?state=${encodeURIComponent(state)}&district=${encodeURIComponent(
        district
      )}&village=${encodeURIComponent(village)}`
    );
    if (!res.ok) throw new Error('API server unavailable');
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.warn('Backend API connection fallback to local state:', err);
    return null;
  }
}

export async function updateTailorAvailabilityApi(tailorId: string, availability: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/tailors/availability`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tailorId, availability })
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

// Orders API
export async function fetchOrdersApi(customerId?: string, tailorId?: string) {
  try {
    let url = `${API_BASE_URL}/orders`;
    const params = new URLSearchParams();
    if (customerId) params.append('customerId', customerId);
    if (tailorId) params.append('tailorId', tailorId);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch orders');
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.warn('Backend API orders fetch fallback:', err);
    return null;
  }
}

export async function createApiOrder(orderData: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) throw new Error('Failed to create API order');
    return await res.json();
  } catch (err) {
    console.warn('Backend API order fallback to local state:', err);
    return null;
  }
}

export async function updateApiOrderStatus(orderId: string, status: string, labelEn?: string, labelHi?: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, labelEn, labelHi })
    });
    if (!res.ok) throw new Error('Failed to update API order status');
    return await res.json();
  } catch (err) {
    console.warn('Backend API order status fallback to local state:', err);
    return null;
  }
}

// Custom Requests API
export async function fetchCustomRequestsApi(village?: string) {
  try {
    const url = village
      ? `${API_BASE_URL}/custom-requests?village=${encodeURIComponent(village)}`
      : `${API_BASE_URL}/custom-requests`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch custom requests');
    const data = await res.json();
    return data.data;
  } catch (err) {
    return null;
  }
}

export async function createApiCustomRequest(reqData: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/custom-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqData)
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function submitApiQuoteOffer(requestId: string, offerData: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/custom-requests/${requestId}/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offerData)
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function acceptApiQuoteOffer(requestId: string, offerId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/custom-requests/${requestId}/accept-quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offerId })
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

// Admin API
export async function verifyTailorApi(tailorId: string, isVerified: boolean) {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/tailors/${tailorId}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isVerified })
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchAdminStats() {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/stats`);
    if (!res.ok) throw new Error('Failed to fetch admin stats');
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.warn('Backend API admin stats fallback to local state:', err);
    return null;
  }
}

// Auth API
export async function loginUserApi(emailOrPhone: string, password?: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrPhone, password })
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function registerUserApi(userData: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function forgotPasswordApi(email: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function resetPasswordApi(email: string, newPassword: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword })
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

// Payment API
export async function processPaymentApi(paymentData: { orderId: string; paymentMethod: string; amount: number; transactionId?: string }) {
  try {
    const res = await fetch(`${API_BASE_URL}/payments/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    return await res.json();
  } catch (err) {
    console.warn('Backend payment process fallback:', err);
    return null;
  }
}

export async function fetchPaymentsByOrderApi(orderId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/payments/order/${orderId}`);
    if (!res.ok) throw new Error('Failed to fetch payments');
    const data = await res.json();
    return data.data;
  } catch (err) {
    return null;
  }
}

export async function generateUpiQrApi(orderId: string, amount: number, note?: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/payments/qr-generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, amount, note })
    });
    const data = await res.json();
    return data.data;
  } catch (err) {
    return null;
  }
}

// Locations API
export async function fetchLocationsApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/locations`);
    if (!res.ok) throw new Error('Failed to fetch locations');
    const data = await res.json();
    return data.data;
  } catch (err) {
    return null;
  }
}

export async function addVillageApi(stateId: string, districtId: string, villageName: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/locations/villages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stateId, districtId, villageName })
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

// Categories API
export async function fetchCategoriesApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    return data.data;
  } catch (err) {
    return null;
  }
}

export async function createCategoryApi(categoryData: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData)
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function deleteCategoryApi(categoryId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
      method: 'DELETE'
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

// Notifications API
export async function fetchNotificationsApi(role?: string, recipientId?: string) {
  try {
    let url = `${API_BASE_URL}/notifications`;
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (recipientId) params.append('recipientId', recipientId);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    const data = await res.json();
    return data.data;
  } catch (err) {
    return null;
  }
}

export async function broadcastNotificationApi(notifData: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/notifications/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notifData)
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}


