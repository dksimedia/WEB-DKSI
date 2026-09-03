const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
