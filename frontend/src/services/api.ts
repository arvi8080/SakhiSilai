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

function authenticatedFetch(url: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const token = localStorage.getItem('sakhisilai_access_token');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(url, { ...init, headers }).then(response => {
    if (response.status === 401) window.dispatchEvent(new Event('sakhisilai-auth-expired'));
    return response;
  });
}

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

export async function fetchTailorDesignsApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/tailors/designs`);
    if (!res.ok) throw new Error('Failed to fetch tailor services');
    const result = await res.json();
    return result.data;
  } catch (err) {
    console.warn('Backend API tailor services fallback to local state:', err);
    return null;
  }
}

export async function updateTailorAvailabilityApi(tailorId: string, availability: string) {
  try {
    const res = await authenticatedFetch(`${API_BASE_URL}/tailors/availability`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tailorId, availability })
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function updateTailorProfileApi(tailorId: string, updates: Record<string, unknown>) {
  try {
    const res = await authenticatedFetch(`${API_BASE_URL}/tailors/${tailorId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const result = await res.json();
    if (!res.ok || !result.success) throw new Error(result.message || 'Profile update failed');
    return result.data;
  } catch (err) {
    throw err instanceof Error ? err : new Error('Profile update failed');
  }
}

export async function updateTailorCapacityApi(tailorId: string, maxActiveOrders: number) {
  try {
    const res = await authenticatedFetch(`${API_BASE_URL}/tailors/${tailorId}/capacity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ maxActiveOrders })
    });
    const result = await res.json();
    if (!res.ok || !result.success) throw new Error(result.message || 'Capacity update failed');
    return result.data;
  } catch (err) {
    throw err instanceof Error ? err : new Error('Capacity update failed');
  }
}

export async function createTailorDesignApi(tailorId: string, designData: Record<string, unknown>) {
  try {
    const res = await authenticatedFetch(`${API_BASE_URL}/tailors/${tailorId}/designs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(designData)
    });
    const result = await res.json();
    if (!res.ok || !result.success) throw new Error(result.message || 'Design creation failed');
    return result.data;
  } catch (err) {
    throw err instanceof Error ? err : new Error('Design creation failed');
  }
}

export async function deleteTailorDesignApi(tailorId: string, designId: string) {
  try {
    const res = await authenticatedFetch(`${API_BASE_URL}/tailors/${tailorId}/designs/${designId}`, {
      method: 'DELETE'
    });
    const result = await res.json();
    if (!res.ok || !result.success) throw new Error(result.message || 'Design deletion failed');
    return result;
  } catch (err) {
    throw err instanceof Error ? err : new Error('Design deletion failed');
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

    const res = await authenticatedFetch(url);
    if (!res.ok) throw new Error('Failed to fetch orders');
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.warn('Backend API orders fetch fallback:', err);
    return null;
  }
}

export async function createApiOrder(orderData: any, idempotencyKey: string) {
  const res = await authenticatedFetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
    body: JSON.stringify(orderData)
  });
  const result = await res.json();
  if (!res.ok || !result.success) {
    throw new Error(result.message || 'Order could not be saved. Please try again.');
  }
  return result.data;
}

export async function updateApiOrderStatus(orderId: string, status: string, labelEn?: string, labelHi?: string) {
  try {
    const res = await authenticatedFetch(`${API_BASE_URL}/orders/${orderId}/status`, {
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
    const res = await authenticatedFetch(url);
    if (!res.ok) throw new Error('Failed to fetch custom requests');
    const data = await res.json();
    return data.data;
  } catch (err) {
    return null;
  }
}

export async function createApiCustomRequest(reqData: any) {
  try {
    const res = await authenticatedFetch(`${API_BASE_URL}/custom-requests`, {
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
    const res = await authenticatedFetch(`${API_BASE_URL}/custom-requests/${requestId}/quotes`, {
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
  const res = await authenticatedFetch(`${API_BASE_URL}/custom-requests/${requestId}/accept-quote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ offerId })
  });
  const result = await res.json();
  if (!res.ok || !result.success) {
    throw new Error(result.message || 'Quote could not be accepted. Please try again.');
  }
  return result;
}

// Admin API
export async function verifyTailorApi(tailorId: string, isVerified: boolean) {
  try {
    const res = await authenticatedFetch(`${API_BASE_URL}/admin/tailors/${tailorId}/verify`, {
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
    const res = await authenticatedFetch(`${API_BASE_URL}/admin/stats`);
    if (!res.ok) throw new Error('Failed to fetch admin stats');
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.warn('Backend API admin stats fallback to local state:', err);
    return null;
  }
}

export async function fetchComplaintsApi() {
  try {
    const res = await authenticatedFetch(`${API_BASE_URL}/admin/complaints`);
    if (!res.ok) throw new Error('Failed to fetch complaints');
    const data = await res.json();
    return data.data;
  } catch (err) {
    return null;
  }
}

export async function blockUserApi(userId: string, isBlocked: boolean) {
  try {
    const res = await authenticatedFetch(`${API_BASE_URL}/admin/users/${userId}/block`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isBlocked })
    });
    const result = await res.json();
    if (!res.ok || !result.success) throw new Error(result.message || 'User block state update failed');
    return result.data;
  } catch (err) {
    throw err instanceof Error ? err : new Error('User block state update failed');
  }
}

export async function resolveComplaintApi(complaintId: string, status: 'investigating' | 'resolved', note?: string) {
  try {
    const res = await authenticatedFetch(`${API_BASE_URL}/admin/complaints/${complaintId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, resolutionNote: note })
    });
    const result = await res.json();
    if (!res.ok || !result.success) throw new Error(result.message || 'Complaint update failed');
    return result.data;
  } catch (err) {
    throw err instanceof Error ? err : new Error('Complaint update failed');
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

export async function registerTailorApi(application: {
  addressApprox: string;
  bio: string;
  experienceYears: number;
  servicesOffered: string[];
  startingPrice: number;
}) {
  const res = await authenticatedFetch(`${API_BASE_URL}/auth/register-tailor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(application)
  });
  const result = await res.json();
  if (!res.ok || !result.success) throw new Error(result.message || 'Tailor application could not be submitted.');
  return result.data;
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
export async function createRazorpayOrderApi(orderId: string, paymentMethod: 'upi' | 'partial_advance', idempotencyKey: string) {
  const res = await authenticatedFetch(`${API_BASE_URL}/payments/razorpay/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
    body: JSON.stringify({ orderId, paymentMethod })
  });
  const result = await res.json();
  if (!res.ok || !result.success) {
    throw new Error(result.message || 'Secure payment checkout could not be started.');
  }
  return result;
}

export async function verifyRazorpayPaymentApi(payment: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const res = await authenticatedFetch(`${API_BASE_URL}/payments/razorpay/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payment)
  });
  const result = await res.json();
  if (!res.ok || !result.success) {
    throw new Error(result.message || 'Payment could not be confirmed.');
  }
  return result;
}

export async function fetchPaymentsByOrderApi(orderId: string) {
  try {
    const res = await authenticatedFetch(`${API_BASE_URL}/payments/order/${orderId}`);
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
    const res = await authenticatedFetch(`${API_BASE_URL}/locations/villages`, {
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
    const res = await authenticatedFetch(`${API_BASE_URL}/categories`, {
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
    const res = await authenticatedFetch(`${API_BASE_URL}/categories/${categoryId}`, {
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

    const res = await authenticatedFetch(url);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    const data = await res.json();
    return data.data;
  } catch (err) {
    return null;
  }
}

export async function broadcastNotificationApi(notifData: any) {
  try {
    const res = await authenticatedFetch(`${API_BASE_URL}/notifications/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notifData)
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}


