const Database = require('better-sqlite3');
const { randomUUID, scryptSync, randomBytes } = require('crypto');
const path = require('path');

const databasePath = process.env.SQLITE_DB_PATH || path.resolve(__dirname, '../data/sakhisilai.db');
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const phone = process.env.ADMIN_PHONE?.trim();
const password = process.env.ADMIN_PASSWORD;

if (!email || !/^\S+@\S+\.\S+$/.test(email) || !phone || !/^\+?[0-9]{10,15}$/.test(phone) || !password || password.length < 12) {
  process.stderr.write('Set ADMIN_EMAIL, ADMIN_PHONE, and ADMIN_PASSWORD (minimum 12 characters).\n');
  process.exit(1);
}

const database = new Database(databasePath);
const existing = database.prepare('SELECT id, role FROM users WHERE LOWER(email) = ? OR phone = ? LIMIT 1').get(email, phone);
if (existing && existing.role !== 'admin') {
  database.close();
  process.stderr.write('Refusing to promote a non-admin account. Choose a new email and phone.\n');
  process.exit(1);
}
const salt = randomBytes(16).toString('hex');
const passwordHash = `scrypt$${salt}$${scryptSync(password, salt, 64).toString('hex')}`;
const userId = existing?.id || `admin_${randomUUID()}`;

database.prepare(`
  INSERT INTO users (id, name, phone, email, password, role, state, district, village, avatar, createdAt, isVerified)
  VALUES (?, ?, ?, ?, ?, 'admin', 'Uttar Pradesh', 'Lucknow', 'Mohanlalganj', '', ?, 1)
  ON CONFLICT(id) DO UPDATE SET name = excluded.name, phone = excluded.phone, email = excluded.email,
    password = excluded.password, role = 'admin', isVerified = 1
`).run(userId, 'SakhiSilai Administrator', phone, email, passwordHash, new Date().toISOString());

process.stdout.write('Admin account provisioned. Store credentials in your secret manager and remove them from the shell environment.\n');
database.close();