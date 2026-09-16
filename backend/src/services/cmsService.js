const fs = require('fs').promises;
const path = require('path');
const { readJSON, writeJSON, appendJSON } = require('../utils/store');
const DATA_DIR = path.join(__dirname, '../data');
const CMS_FILE = path.join(DATA_DIR, 'cms.json');
const PUBLISHED_FILE = path.join(DATA_DIR, 'cms.published.json');
const SEED_FILE = path.join(DATA_DIR, 'cms.seed.json');
const REVISIONS_FILE = path.join(DATA_DIR, 'revisions.json');
const ACTIVITY_FILE = path.join(DATA_DIR, 'activity.json');

async function ensureSeed() {
  try { await fs.access(CMS_FILE); } catch {
    try { const seed = await fs.readFile(SEED_FILE, 'utf8'); await fs.writeFile(CMS_FILE, seed, 'utf8'); } catch {}
  }
  try { await fs.access(PUBLISHED_FILE); } catch {
    try { const cur = await fs.readFile(CMS_FILE, 'utf8'); await fs.writeFile(PUBLISHED_FILE, cur, 'utf8'); } catch {}
  }
}
async function getDraft() { await ensureSeed(); return readJSON(CMS_FILE, {}); }
async function getPublished() { await ensureSeed(); return readJSON(PUBLISHED_FILE, {}); }
async function saveDraft(data) {
  await ensureSeed();
  if (!data || typeof data !== 'object') throw new Error('Invalid CMS data');
  data.meta = data.meta || {};
  data.meta.lastSaved = new Date().toISOString();
  await writeJSON(CMS_FILE, data);
  await appendJSON(REVISIONS_FILE, { id: Date.now(), data: JSON.parse(JSON.stringify(data)), date: new Date().toISOString(), user: 'Admin', action: 'saveDraft' }, 30);
  await appendJSON(ACTIVITY_FILE, { id: Date.now(), action: 'Saved draft', target: 'CMS', user: 'Admin', time: new Date().toISOString() }, 100);
  return data;
}
async function publish() {
  await ensureSeed();
  const draft = await getDraft();
  draft.meta = draft.meta || {};
  draft.meta.lastPublished = new Date().toISOString();
  await writeJSON(PUBLISHED_FILE, draft);
  await writeJSON(CMS_FILE, draft);
  await appendJSON(REVISIONS_FILE, { id: Date.now(), data: JSON.parse(JSON.stringify(draft)), date: new Date().toISOString(), user: 'Admin', action: 'publish' }, 30);
  await appendJSON(ACTIVITY_FILE, { id: Date.now(), action: 'Published content', target: 'CMS', user: 'Admin', time: new Date().toISOString() }, 100);
  return draft;
}
async function getRevisions() { return readJSON(REVISIONS_FILE, []); }
async function getActivity() { return readJSON(ACTIVITY_FILE, []); }
async function restoreRevision(id) {
  const revs = await getRevisions();
  const found = revs.find(r => String(r.id) === String(id));
  if (!found) throw new Error('Revision not found');
  await writeJSON(CMS_FILE, found.data);
  await appendJSON(ACTIVITY_FILE, { id: Date.now(), action: 'Restored revision', target: String(id), user: 'Admin', time: new Date().toISOString() }, 100);
  return found.data;
}
module.exports = { getDraft, getPublished, saveDraft, publish, getRevisions, getActivity, restoreRevision };
