const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

async function getAdminCredentials() {
  try {
    const raw = fs.readFileSync(ADMIN_FILE, 'utf-8');
    const creds = JSON.parse(raw);
    return creds;
  } catch (e) {
    return null;
  }
}

async function saveAdminCredentials(creds) {
  ensureDataDir();
  fs.writeFileSync(ADMIN_FILE, JSON.stringify(creds, null, 2), 'utf-8');
}

module.exports = { getAdminCredentials, saveAdminCredentials };


