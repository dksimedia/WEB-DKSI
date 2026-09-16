require('dotenv').config();
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(compression());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contact', require('./routes/contacts'));
app.use('/api/cms', require('./routes/cms'));
app.use('/api/media', require('./routes/media'));
app.use('/api/admin/contacts', require('./routes/adminContacts'));
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'dksi-backend-v3', timestamp: new Date().toISOString() }));
app.get('/api/version', (req, res) => res.json({ version: '3.0.0', cms: 'api/cms', media: 'api/media' }));

// Static — uploads with cache + immutable
const STATIC_OPTS = {
  maxAge: '7d',
  etag: true,
  lastModified: true,
  setHeaders(res, filePath) {
    if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    else if (/\.(css|js|png|jpg|jpeg|svg|webp|woff2?)$/.test(filePath)) res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
  },
};
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), STATIC_OPTS));
app.use('/admin', express.static(path.join(__dirname, '../admin'), STATIC_OPTS));
app.use(express.static(path.join(__dirname, '../../frontend'), STATIC_OPTS));

// Multer / validation error handler — return JSON not HTML
app.use((err, req, res, next) => {
  if (!err) return next();
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'File too large (max 5MB)' });
  if (err.message === 'File type not allowed') return res.status(400).json({ error: err.message });
  if (err instanceof Error && err.message) return res.status(400).json({ error: err.message });
  next(err);
});

// SPA fallback for admin deep links — but keep /api 404
app.get('/', (req, res) => res.redirect('/admin/admin.html'));
app.use((req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
  res.status(404).send('Not found');
});

module.exports = app;
