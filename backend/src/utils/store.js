const fs = require('fs').promises;
const path = require('path');
async function readJSON(file, fallback) {
  try { const raw = await fs.readFile(file, 'utf8'); return JSON.parse(raw); } catch { return fallback; }
}
async function writeJSON(file, data) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8');
}
async function appendJSON(file, entry, max = 100) {
  const list = await readJSON(file, []);
  list.unshift(entry);
  if (list.length > max) list.length = max;
  await writeJSON(file, list);
  return list;
}
module.exports = { readJSON, writeJSON, appendJSON };
