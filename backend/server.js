/**
 * DKSI Backend Server
 * =====================================================
 * Express server — serves static frontend + admin CMS,
 * handles public inquiries (POST /api/contact) with
 * honeypot anti-spam and persists to contacts.json.
 *
 * Stack: Node.js + Express (no DB — file-based for MVP)
 * Next step production: add Nodemailer/SendGrid + JWT auth
 * =====================================================
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ------------------------------------------------------------------
// Config
// ------------------------------------------------------------------
const CONTACTS_FILE = path.join(__dirname, 'contacts.json');

// ------------------------------------------------------------------
// Middleware
// ------------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

/**
 * Load contacts from disk. Creates file if missing.
 * @returns {Array} contacts
 */
function getContacts() {
  try {
    if (!fs.existsSync(CONTACTS_FILE)) {
      fs.writeFileSync(CONTACTS_FILE, '[]', 'utf-8');
    }
    return JSON.parse(fs.readFileSync(CONTACTS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

/**
 * Persist contacts array to disk.
 * @param {Array} contacts
 */
function saveContacts(contacts) {
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2), 'utf-8');
}

// ------------------------------------------------------------------
// API Routes
// ------------------------------------------------------------------

/**
 * POST /api/contact — public inquiry (contact + consult modal)
 * Body: { name, company, email, phone, category, message, honeypot }
 * Honeypot must be empty; name+email required.
 */
app.post('/api/contact', (req, res) => {
  const { name, company, email, phone, category, message, honeypot } = req.body;

  if (honeypot) {
    return res.status(400).json({ status: 'error', message: 'Spam detected' });
  }
  if (!name || !email) {
    return res.status(400).json({ status: 'error', message: 'Name and Email are required' });
  }

  const contacts = getContacts();
  const inquiry = {
    id: Date.now(),
    name: name.trim(),
    company: (company || '').trim(),
    email: email.trim(),
    phone: (phone || '').trim(),
    category: category || 'General',
    message: message || '',
    date: new Date().toISOString(),
    status: 'New',
  };

  contacts.unshift(inquiry);
  saveContacts(contacts);

  console.log(`[DKSI Inquiry] ${inquiry.name} <${inquiry.email}> — ${inquiry.category}`);
  // TODO(prod): send email via Nodemailer/SendGrid + Telegram Bot webhook

  return res.json({ status: 'ok', message: 'Inquiry received successfully' });
});

/** GET /api/admin/contacts — list all inquiries (admin panel) */
app.get('/api/admin/contacts', (_req, res) => {
  res.json(getContacts());
});

/** GET /api/health — liveness probe */
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'dksi-backend-cms', timestamp: new Date().toISOString() });
});

// ------------------------------------------------------------------
// Static
// ------------------------------------------------------------------
app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Fallback: root -> admin dashboard (keep frontend at /index.html)
app.get('/', (_req, res) => res.redirect('/admin/admin.html'));

// ------------------------------------------------------------------
// Start
// ------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`[DKSI Backend] http://localhost:${PORT}`);
  console.log(`[DKSI Admin]   http://localhost:${PORT}/admin/admin.html`);
  console.log(`[DKSI Site]    http://localhost:${PORT}/index.html`);
});
