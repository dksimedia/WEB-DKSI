const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Data file path for contacts
const CONTACTS_FILE = path.join(__dirname, 'contacts.json');

// Helper to get contacts
function getContacts() {
  try {
    if (!fs.existsSync(CONTACTS_FILE)) fs.writeFileSync(CONTACTS_FILE, '[]');
    return JSON.parse(fs.readFileSync(CONTACTS_FILE, 'utf-8'));
  } catch (err) {
    return [];
  }
}

// Endpoint to receive public inquiries
app.post('/api/contact', (req, res) => {
  const { name, company, email, phone, category, message, honeypot } = req.body;

  // Honeypot check
  if (honeypot) {
    return res.status(400).json({ status: 'error', message: 'Spam detected' });
  }

  if (!name || !email) {
    return res.status(400).json({ status: 'error', message: 'Name and Email are required' });
  }

  const contacts = getContacts();
  const newInquiry = {
    id: Date.now(),
    name,
    company: company || '',
    email,
    phone: phone || '',
    category: category || 'General',
    message: message || '',
    date: new Date().toISOString(),
    status: 'New'
  };

  contacts.unshift(newInquiry);
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));

  console.log(`[DKSI Inquiry] New message from: ${name} (${email}) - ${category}`);
  // In production, integrate Nodemailer / SendGrid / Telegram Bot API here

  res.json({ status: 'ok', message: 'Inquiry received successfully' });
});

// Endpoint for admin to fetch all inquiries
app.get('/api/admin/contacts', (req, res) => {
  res.json(getContacts());
});

// Serve Admin CMS
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// API health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'dksi-backend-cms', timestamp: new Date().toISOString() });
});

// Fallback to Admin CMS dashboard
app.get('/', (req, res) => {
  res.redirect('/admin/admin.html');
});

app.listen(PORT, () => {
  console.log(`[DKSI Backend] Server running on http://localhost:${PORT}`);
  console.log(`[DKSI Admin] CMS available at http://localhost:${PORT}/admin/admin.html`);
});
