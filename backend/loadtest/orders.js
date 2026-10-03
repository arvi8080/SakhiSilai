import http from 'k6/http';
import { check, sleep } from 'k6';

const baseUrl = __ENV.BASE_URL;
const token = __ENV.AUTH_TOKEN;
const tailorId = __ENV.TAILOR_ID;

export const options = {
  stages: [
    { duration: '30s', target: 1 },
    { duration: '60s', target: 3 },
    { duration: '60s', target: 5 },
    { duration: '30s', target: 0 }
  ],
  thresholds: {
    http_req_failed: ['rate<0.02'],
    http_req_duration: ['p(95)<750', 'p(99)<1500']
  }
};

export function setup() {
  if (!baseUrl || !token || !tailorId) {
    throw new Error('Set BASE_URL to staging, AUTH_TOKEN for a customer test account, and TAILOR_ID.');
  }
  const response = http.get(`${baseUrl}/health`);
  check(response, { 'staging API is healthy': res => res.status === 200 });
  return { baseUrl, token, tailorId };
}

export default function (data) {
  const idempotencyKey = `load-${__VU}-${__ITER}-${Date.now()}`;
  const payload = JSON.stringify({
    customerId: 'derived-from-token',
    customerName: 'Load Test',
    customerPhone: '0000000000',
    tailorId: data.tailorId,
    categoryId: 'load-test',
    categoryName: 'Load test service',
    designTitle: 'Staging load test order',
    price: 100,
    paymentMethod: 'cod',
    handoverMethod: 'customer_drop'
  });
  const response = http.post(`${data.baseUrl}/api/orders`, payload, {
    headers: {
      Authorization: `Bearer ${data.token}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey
    },
    tags: { endpoint: 'create-order' }
  });

  check(response, {
    'order accepted': res => res.status === 201 || res.status === 200,
    'order response has an id': res => Boolean(res.json('data.id'))
  });
  sleep(1);
}