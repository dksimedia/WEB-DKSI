const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'dksi_jwt_secret_2026_change_in_prod_32chars!!';
function sign(payload) { return jwt.sign(payload, SECRET, { expiresIn: '8h' }); }
function verify(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try { req.user = jwt.verify(token, SECRET); next(); } catch { return res.status(401).json({ error: 'Token expired' }); }
}
module.exports = { sign, verify, SECRET };
