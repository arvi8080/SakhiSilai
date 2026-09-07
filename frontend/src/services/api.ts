const API_BASE_URL = 'http://localhost:5000/api';

export async function fetchNearbyTailors(state: string, district: string, village: string) {
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

export async function updateApiOrderStatus(orderId: string, status: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update API order status');
    return await res.json();
  } catch (err) {
    console.warn('Backend API order status fallback to local state:', err);
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
