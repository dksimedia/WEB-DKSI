const express = require('express');
const router = express.Router();
const path = require('path');
const { readJSON, writeJSON, appendJSON } = require('../utils/store');
const { contactLimiter } = require('../middleware/rateLimit');
const CONTACTS_FILE = path.join(__dirname, '../data/contacts.json');
const ACTIVITY_FILE = path.join(__dirname, '../data/activity.json');

function isEmail(s){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s||'')); }

router.post('/', contactLimiter, async (req, res) => {
  try {
    const { name, company, email, phone, category, message, honeypot } = req.body || {};
    if (honeypot) return res.status(400).json({ error: 'Spam detected' });
    if (!name || !String(name).trim()) return res.status(400).json({ error: 'Nama wajib diisi' });
    if (!email || !isEmail(email)) return res.status(400).json({ error: 'Email tidak valid' });
    const entry = {
      id: Date.now(),
      name: String(name).trim(),
      company: String(company||'').trim(),
      email: String(email).trim(),
      phone: String(phone||'').trim(),
      category: category || 'General',
      message: String(message||'').trim(),
      date: new Date().toISOString(),
      status: 'New',
    };
    let list = await readJSON(CONTACTS_FILE, []);
    list.unshift(entry);
    await writeJSON(CONTACTS_FILE, list);
    // also append activity
    try { await appendJSON(ACTIVITY_FILE, { id: Date.now(), action: 'New inquiry', target: entry.name + ' — ' + (entry.company||entry.email), user: 'Public', time: entry.date }, 100); } catch{}
    console.log(`[Inquiry] ${entry.name} <${entry.email}> — ${entry.category}`);
    res.json({ status: 'ok', message: 'Inquiry received', id: entry.id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
module.exports = router;
