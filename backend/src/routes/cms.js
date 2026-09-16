const express = require('express');
const router = express.Router();
const { verify } = require('../middleware/auth');
const svc = require('../services/cmsService');

// Public — published snapshot (frontend reads this)
router.get('/', async (req, res) => {
  try { res.json(await svc.getPublished()); } catch (e) { res.status(500).json({ error: e.message }); }
});
// Public — published alias (explicit)
router.get('/published', async (req, res) => {
  try { res.json(await svc.getPublished()); } catch (e) { res.status(500).json({ error: e.message }); }
});
// Admin — draft
router.get('/draft', verify, async (req, res) => {
  try { res.json(await svc.getDraft()); } catch (e) { res.status(500).json({ error: e.message }); }
});
router.put('/draft', verify, async (req, res) => {
  try { const saved = await svc.saveDraft(req.body); res.json(saved); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/publish', verify, async (req, res) => {
  try { const pub = await svc.publish(); res.json(pub); } catch (e) { res.status(500).json({ error: e.message }); }
});
router.get('/revisions', verify, async (req, res) => {
  try { res.json(await svc.getRevisions()); } catch (e) { res.status(500).json({ error: e.message }); }
});
router.post('/restore/:id', verify, async (req, res) => {
  try { const data = await svc.restoreRevision(req.params.id); res.json(data); } catch (e) { res.status(404).json({ error: e.message }); }
});
router.get('/activity', verify, async (req, res) => {
  try { res.json(await svc.getActivity()); } catch (e) { res.status(500).json({ error: e.message }); }
});
module.exports = router;
