const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Health check
export async function checkBackendHealth() {
  try {
    const res = await fetch('http://localhost:5000/health');
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
export async function loginUserApi(phone: string, role: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, role })
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
