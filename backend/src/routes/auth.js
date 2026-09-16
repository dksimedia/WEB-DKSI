const express = require('express');
const router = express.Router();
const { sign, verify } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimit');
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@dksi.co.id').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'dksi2026';

router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email & password wajib diisi' });
  const ok = email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;
  if (!ok) return res.status(401).json({ error: 'Email atau password salah' });
  const token = sign({ email: ADMIN_EMAIL, role: 'admin' });
  res.json({ token, user: { email: ADMIN_EMAIL, role: 'admin' } });
});
router.get('/me', verify, (req, res) => res.json({ user: req.user }));
router.post('/logout', verify, (req, res) => res.json({ ok: true }));
module.exports = router;
