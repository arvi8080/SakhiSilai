const assert = require('assert/strict');
const { spawn } = require('child_process');
const { execFileSync } = require('child_process');
const { once } = require('events');
const { randomUUID } = require('crypto');
const Database = require('better-sqlite3');
const fs = require('fs');
const os = require('os');
const path = require('path');

const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'sakhisilai-smoke-'));
const databasePath = path.join(tempDirectory, 'test.db');
const port = 5100 + Math.floor(Math.random() * 1000);
const baseUrl = `http://127.0.0.1:${port}`;
const child = spawn(process.execPath, [path.resolve(__dirname, '../dist/server.js')], {
  cwd: path.resolve(__dirname, '..'),
  env: { ...process.env, NODE_ENV: 'test', PORT: String(port), SQLITE_DB_PATH: databasePath },
  stdio: ['ignore', 'pipe', 'pipe']
});
let serverError = '';
child.stdout?.on('data', chunk => { serverError += chunk.toString(); });
child.stderr.on('data', chunk => { serverError += chunk.toString(); });
child.on('error', error => { serverError += `${error.message}\n`; });

async function request(route, options = {}) {
  const response = await fetch(`${baseUrl}${route}`, options);
  let body = {};
  try { body = await response.json(); } catch { /* no response body */ }
  return { response, body };
}

async function waitForServer() {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`API exited early: ${serverError}`);
    try {
      const { response } = await request('/health');
      if (response.ok) return;
    } catch { /* server is still starting */ }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`API did not become healthy: ${serverError}`);
}

async function registerAccount() {
  const suffix = randomUUID().replace(/-/g, '').slice(0, 10);
  const phone = `9${String(Math.floor(Math.random() * 1_000_000_000)).padStart(9, '0')}`;
  const { response, body } = await request('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Smoke Test Customer',
      email: `smoke-${suffix}@example.test`,
      phone,
      password: 'Smoke-Test-Passphrase-2026',
      village: 'Mohanlalganj',
      district: 'Lucknow',
      state: 'Uttar Pradesh'
    })
  });
  assert.equal(response.status, 201, JSON.stringify(body));
  assert.equal(typeof body.token, 'string');
  assert.equal(Object.hasOwn(body.data, 'password'), false);
  return { token: body.token, user: body.data };
}

async function registerTailor(token) {
  const { response, body } = await request('/api/auth/register-tailor', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ addressApprox: 'Smoke Test Address', experienceYears: 3, startingPrice: 300 })
  });
  assert.equal(response.status, 201, JSON.stringify(body));
  return body.data;
}

async function run() {
  await waitForServer();
  const { response: swaggerResponse, body: swagger } = await request('/api-docs.json');
  assert.equal(swaggerResponse.status, 200);
  const loginSchema = swagger.paths['/api/auth/login'].post.requestBody.content['application/json'].schema;
  const registerSchema = swagger.paths['/api/auth/register'].post.requestBody.content['application/json'].schema;
  assert(loginSchema.properties.emailOrPhone);
  assert(loginSchema.properties.password);
  assert(registerSchema.required.includes('email'));
  assert(registerSchema.required.includes('password'));
  assert.equal(Object.hasOwn(registerSchema.properties, 'role'), false);
  assert.equal(swagger.paths['/api/auth/forgot-password'].post.responses['503'] !== undefined, true);

  const first = await registerAccount();
  const customerAvatar = await request('/api/auth/profile/avatar', {
    method: 'PATCH',
    headers: { Authorization: ['Bearer', first.token].join(' '), 'Content-Type': 'application/json' },
    body: JSON.stringify({ avatar: 'data:image/jpeg;base64,/9j/2Q==' })
  });
  assert.equal(customerAvatar.response.status, 200, JSON.stringify(customerAvatar.body));
  assert.equal(customerAvatar.body.data.avatar, 'data:image/jpeg;base64,/9j/2Q==');
  const removedCustomerAvatar = await request('/api/auth/profile/avatar', {
    method: 'PATCH',
    headers: { Authorization: ['Bearer', first.token].join(' '), 'Content-Type': 'application/json' },
    body: JSON.stringify({ avatar: '' })
  });
  assert.equal(removedCustomerAvatar.response.status, 200, JSON.stringify(removedCustomerAvatar.body));
  assert.equal(removedCustomerAvatar.body.data.avatar, '');
  const invalidAvatar = await request('/api/auth/profile/avatar', {
    method: 'PATCH',
    headers: { Authorization: ['Bearer', first.token].join(' '), 'Content-Type': 'application/json' },
    body: JSON.stringify({ avatar: 'javascript:alert(1)' })
  });
  assert.equal(invalidAvatar.response.status, 400);

  const tailorAccount = await registerAccount();
  const tailor = await registerTailor(tailorAccount.token);
  const adminAccount = await registerAccount();
  const testDb = new Database(databasePath);
  testDb.prepare("UPDATE users SET role = 'admin', isVerified = 1 WHERE id = ?").run(adminAccount.user.id);
  testDb.close();

  const adminLogin = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailOrPhone: adminAccount.user.email, password: 'Smoke-Test-Passphrase-2026' })
  });
  assert.equal(adminLogin.response.status, 200, JSON.stringify(adminLogin.body));
  const adminAuthorization = ['Bearer', adminLogin.body.token].join(' ');
  const adminAvatar = await request('/api/auth/profile/avatar', {
    method: 'PATCH',
    headers: { Authorization: adminAuthorization, 'Content-Type': 'application/json' },
    body: JSON.stringify({ avatar: 'data:image/jpeg;base64,/9j/2Q==' })
  });
  assert.equal(adminAvatar.response.status, 200, JSON.stringify(adminAvatar.body));
  assert.equal(adminAvatar.body.data.avatar, 'data:image/jpeg;base64,/9j/2Q==');
  const removedAdminAvatar = await request('/api/auth/profile/avatar', {
    method: 'PATCH',
    headers: { Authorization: adminAuthorization, 'Content-Type': 'application/json' },
    body: JSON.stringify({ avatar: '' })
  });
  assert.equal(removedAdminAvatar.response.status, 200, JSON.stringify(removedAdminAvatar.body));
  assert.equal(removedAdminAvatar.body.data.avatar, '');
  const adminTailors = await request('/api/admin/tailors', {
    headers: { Authorization: adminAuthorization }
  });
  assert.equal(adminTailors.response.status, 200, JSON.stringify(adminTailors.body));
  assert.equal(adminTailors.body.data.some(profile => profile.id === tailor.id && profile.isVerified === false), true);
  const approval = await request(`/api/admin/tailors/${tailor.id}/verify`, {
    method: 'POST',
    headers: { Authorization: adminAuthorization, 'Content-Type': 'application/json' },
    body: JSON.stringify({ isVerified: true })
  });
  assert.equal(approval.response.status, 200, JSON.stringify(approval.body));
  assert.equal(approval.body.data.isVerified, true);

  const refreshedSession = await request('/api/auth/me', {
    headers: { Authorization: `Bearer ${tailorAccount.token}` }
  });
  assert.equal(refreshedSession.response.status, 200, JSON.stringify(refreshedSession.body));
  assert.equal(refreshedSession.body.data.role, 'tailor');
  assert.equal(typeof refreshedSession.body.token, 'string');
  const tailorDashboardAccess = await request('/api/tailors/me', {
    headers: { Authorization: `Bearer ${refreshedSession.body.token}` }
  });
  assert.equal(tailorDashboardAccess.response.status, 200, JSON.stringify(tailorDashboardAccess.body));
  assert.equal(tailorDashboardAccess.body.data.id, tailor.id);

  const tailorAuthorization = ['Bearer', refreshedSession.body.token].join(' ');
  const tailorAvatar = await request('/api/auth/profile/avatar', {
    method: 'PATCH',
    headers: { Authorization: tailorAuthorization, 'Content-Type': 'application/json' },
    body: JSON.stringify({ avatar: 'data:image/jpeg;base64,/9j/2Q==' })
  });
  assert.equal(tailorAvatar.response.status, 200, JSON.stringify(tailorAvatar.body));
  const refreshedTailorProfile = await request('/api/tailors/me', {
    headers: { Authorization: tailorAuthorization }
  });
  assert.equal(refreshedTailorProfile.response.status, 200, JSON.stringify(refreshedTailorProfile.body));
  assert.equal(refreshedTailorProfile.body.data.avatar, 'data:image/jpeg;base64,/9j/2Q==');
  const removedTailorAvatar = await request('/api/auth/profile/avatar', {
    method: 'PATCH',
    headers: { Authorization: tailorAuthorization, 'Content-Type': 'application/json' },
    body: JSON.stringify({ avatar: '' })
  });
  assert.equal(removedTailorAvatar.response.status, 200, JSON.stringify(removedTailorAvatar.body));

  const galleryStartCount = tailorDashboardAccess.body.data.galleryImages.length;
  const galleryPhoto = await request('/api/tailors/' + tailor.id + '/gallery', {
    method: 'POST',
    headers: { Authorization: tailorAuthorization, 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: 'data:image/jpeg;base64,/9j/2Q==' })
  });
  assert.equal(galleryPhoto.response.status, 201, JSON.stringify(galleryPhoto.body));
  assert.equal(galleryPhoto.body.data.galleryImages.length, galleryStartCount + 1);
  const invalidGalleryPhoto = await request('/api/tailors/' + tailor.id + '/gallery', {
    method: 'POST',
    headers: { Authorization: tailorAuthorization, 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: 'javascript:alert(1)' })
  });
  assert.equal(invalidGalleryPhoto.response.status, 400);
  const removedGalleryPhoto = await request('/api/tailors/' + tailor.id + '/gallery/' + galleryStartCount, {
    method: 'DELETE',
    headers: { Authorization: tailorAuthorization }
  });
  assert.equal(removedGalleryPhoto.response.status, 200, JSON.stringify(removedGalleryPhoto.body));
  assert.equal(removedGalleryPhoto.body.data.galleryImages.length, galleryStartCount);

  const unauthenticated = await request('/api/orders');
  assert.equal(unauthenticated.response.status, 401);

  const key = `smoke-${randomUUID()}`;
  const orderPayload = {
    customerId: 'forged-customer-id',
    customerName: 'Forged Name',
    customerPhone: '0000000000',
    tailorId: tailor.id,
    categoryId: 'blouse',
    categoryName: 'Blouse Stitching',
    designTitle: 'Smoke Test Order',
    price: 450,
    paymentMethod: 'cod',
    handoverMethod: 'customer_drop',
    measurements: { bustOrChest: '36 in', waist: '30 in' }
  };
  const orderRequest = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${first.token}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': key
    },
    body: JSON.stringify(orderPayload)
  };
  const created = await request('/api/orders', orderRequest);
  assert.equal(created.response.status, 201, JSON.stringify(created.body));
  assert.equal(created.body.data.customerId, first.user.id);
  assert.notEqual(created.body.data.orderNumber, undefined);
  const savedOrder = await request(`/api/orders/${created.body.data.id}`, { headers: { Authorization: `Bearer ${first.token}` } });
  assert.deepEqual(savedOrder.body.data.measurements, orderPayload.measurements);

  const replay = await request('/api/orders', orderRequest);
  assert.equal(replay.response.status, 200);
  assert.equal(replay.body.data.id, created.body.data.id);

  const ownOrders = await request('/api/orders', { headers: { Authorization: `Bearer ${first.token}` } });
  assert.equal(ownOrders.body.count, 1);
  const second = await registerAccount();
  const otherOrders = await request('/api/orders', { headers: { Authorization: `Bearer ${second.token}` } });
  assert.equal(otherOrders.body.count, 0);
  const forbiddenOrder = await request(`/api/orders/${created.body.data.id}`, { headers: { Authorization: `Bearer ${second.token}` } });
  assert.equal(forbiddenOrder.response.status, 403);

  const paymentUnavailable = await request('/api/payments/razorpay/orders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${first.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId: created.body.data.id, paymentMethod: 'upi' })
  });
  assert.equal(paymentUnavailable.response.status, 503);

  const forbiddenOrigin = await request('/health', { headers: { Origin: 'https://unapproved.invalid' } });
  assert.equal(forbiddenOrigin.response.status, 403);

  const invalidLogins = await Promise.all(Array.from({ length: 11 }, () => request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailOrPhone: 'invalid@example.test', password: 'wrong' })
  })));
  assert(invalidLogins.some(result => result.response.status === 429));

  child.kill();
  if (child.exitCode === null) await once(child, 'exit');
  const backupDirectory = path.join(tempDirectory, 'backups');
  const scriptDirectory = path.resolve(__dirname, '..');
  const opsEnv = { ...process.env, SQLITE_DB_PATH: databasePath, DB_BACKUP_DIR: backupDirectory };
  execFileSync(process.execPath, [path.join(__dirname, 'backup-database.cjs')], { cwd: scriptDirectory, env: opsEnv });
  const backupFile = path.join(backupDirectory, fs.readdirSync(backupDirectory)[0]);
  assert(fs.existsSync(backupFile));
  execFileSync(process.execPath, [path.join(__dirname, 'restore-database.cjs'), '--check'], {
    cwd: scriptDirectory,
    env: { ...opsEnv, BACKUP_FILE: backupFile }
  });
  execFileSync(process.execPath, [path.join(__dirname, 'restore-database.cjs')], {
    cwd: scriptDirectory,
    env: { ...opsEnv, BACKUP_FILE: backupFile }
  });
  process.stdout.write('API and recovery smoke checks passed: auth, admin approval, approval role refresh, avatar update/removal, tailor authorization, gallery upload/delete, validation, idempotency, payment fail-closed, CORS, rate limit, backup, restore.\n');
}

run().catch(error => {
  process.stderr.write(`${error.stack || error}\n${serverError}`);
  process.exitCode = 1;
}).finally(async () => {
  child.kill();
  if (child.exitCode === null) await new Promise(resolve => child.once('exit', resolve));
  fs.rmSync(tempDirectory, { recursive: true, force: true });
});