const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const backupPath = process.env.BACKUP_FILE;
const databasePath = process.env.SQLITE_DB_PATH || path.resolve(__dirname, '../data/sakhisilai.db');
const checkOnly = process.argv.includes('--check');

if (!backupPath || !fs.existsSync(backupPath)) {
  process.stderr.write('Set BACKUP_FILE to an existing SQLite backup.\n');
  process.exit(1);
}

const backup = new Database(backupPath, { readonly: true, fileMustExist: true });
try {
  const result = backup.pragma('quick_check', { simple: true });
  if (result !== 'ok') throw new Error(`Backup integrity check failed: ${result}`);
} finally {
  backup.close();
}

if (checkOnly) {
  process.stdout.write('Backup integrity check passed.\n');
  process.exit(0);
}

fs.mkdirSync(path.dirname(databasePath), { recursive: true });
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const temporaryPath = `${databasePath}.restore-tmp`;
const previousPath = `${databasePath}.pre-restore-${timestamp}`;
fs.copyFileSync(backupPath, temporaryPath);

try {
  if (fs.existsSync(databasePath)) fs.renameSync(databasePath, previousPath);
  fs.renameSync(temporaryPath, databasePath);
  for (const suffix of ['-wal', '-shm']) {
    const sidecarPath = `${databasePath}${suffix}`;
    if (fs.existsSync(sidecarPath)) fs.renameSync(sidecarPath, `${sidecarPath}.pre-restore-${timestamp}`);
  }
} catch (error) {
  if (!fs.existsSync(databasePath) && fs.existsSync(previousPath)) fs.renameSync(previousPath, databasePath);
  if (fs.existsSync(temporaryPath)) fs.unlinkSync(temporaryPath);
  throw error;
}

process.stdout.write(`${JSON.stringify({ level: 'info', event: 'database_restore_complete', databasePath, previousPath })}\n`);