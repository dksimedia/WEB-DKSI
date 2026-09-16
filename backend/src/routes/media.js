const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const upload = require('../middleware/upload');
const { verify } = require('../middleware/auth');
const { readJSON, writeJSON } = require('../utils/store');
const MEDIA_FILE = path.join(__dirname, '../data/media.json');

router.get('/', async (req, res) => {
  try { const list = await readJSON(MEDIA_FILE, []); res.json(list); } catch (e) { res.status(500).json({ error: e.message }); }
});
router.post('/upload', verify, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file' });
    const url = `/uploads/media/${req.file.filename}`;
    const entry = { id: Date.now(), url, name: req.file.originalname, size: req.file.size, mimetype: req.file.mimetype, date: new Date().toISOString() };
    let list = await readJSON(MEDIA_FILE, []);
    list.unshift(entry);
    if (list.length > 200) list = list.slice(0, 200);
    await writeJSON(MEDIA_FILE, list);
    res.json(entry);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
router.delete('/:id', verify, async (req, res) => {
  try {
    let list = await readJSON(MEDIA_FILE, []);
    const idx = list.findIndex(m => String(m.id) === String(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    const [removed] = list.splice(idx, 1);
    await writeJSON(MEDIA_FILE, list);
    // try delete file
    try { await fs.unlink(path.join(__dirname, '../../uploads/media', path.basename(removed.url))); } catch {}
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
module.exports = router;
