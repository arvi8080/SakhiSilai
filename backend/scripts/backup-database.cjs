const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const databasePath = process.env.SQLITE_DB_PATH || path.resolve(__dirname, '../data/sakhisilai.db');
const backupDirectory = process.env.DB_BACKUP_DIR || path.resolve(__dirname, '../../backups');
const retentionDays = Number(process.env.DB_BACKUP_RETENTION_DAYS || 30);

if (!fs.existsSync(databasePath)) {
  process.stderr.write(`Database file not found: ${databasePath}\n`);
  process.exit(1);
}
if (!Number.isInteger(retentionDays) || retentionDays < 1 || retentionDays > 3650) {
  process.stderr.write('DB_BACKUP_RETENTION_DAYS must be between 1 and 3650.\n');
  process.exit(1);
}

async function runBackup() {
  fs.mkdirSync(backupDirectory, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const destination = path.join(backupDirectory, `sakhisilai-${timestamp}.db`);
  const database = new Database(databasePath, { readonly: true, fileMustExist: true });
  try {
    await database.backup(destination);
  } finally {
    database.close();
  }

  const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
  for (const name of fs.readdirSync(backupDirectory)) {
    if (!/^sakhisilai-.*\.db$/.test(name)) continue;
    const backupPath = path.join(backupDirectory, name);
    if (fs.statSync(backupPath).mtimeMs < cutoff) fs.unlinkSync(backupPath);
  }
  process.stdout.write(`${JSON.stringify({ level: 'info', event: 'database_backup_complete', destination, timestamp: new Date().toISOString() })}\n`);
}

runBackup().catch(error => {
  process.stderr.write(`${JSON.stringify({ level: 'error', event: 'database_backup_failed', message: error.message })}\n`);
  process.exitCode = 1;
});