const express = require('express');
const router = express.Router();
const path = require('path');
const { verify } = require('../middleware/auth');
const { readJSON, writeJSON } = require('../utils/store');
const CONTACTS_FILE = path.join(__dirname, '../data/contacts.json');

router.get('/', verify, async (req, res) => {
  try { const list = await readJSON(CONTACTS_FILE, []); res.json(list); } catch (e) { res.status(500).json({ error: e.message }); }
});
router.patch('/:id', verify, async (req, res) => {
  try {
    const list = await readJSON(CONTACTS_FILE, []);
    const idx = list.findIndex(c => String(c.id) === String(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    if (req.body.status) list[idx].status = req.body.status;
    if (req.body.note) list[idx].note = req.body.note;
    list[idx].updatedAt = new Date().toISOString();
    await writeJSON(CONTACTS_FILE, list);
    res.json(list[idx]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
router.delete('/:id', verify, async (req, res) => {
  try {
    let list = await readJSON(CONTACTS_FILE, []);
    const before = list.length;
    list = list.filter(c => String(c.id) !== String(req.params.id));
    if (list.length === before) return res.status(404).json({ error: 'Not found' });
    await writeJSON(CONTACTS_FILE, list);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
module.exports = router;
