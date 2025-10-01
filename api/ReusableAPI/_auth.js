// /api/_auth.js — small helper to verify admin JWT (Option B env-only)
const jwt = require('jsonwebtoken');

function requireAdmin(req, res) {
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ success: false, error: 'Server misconfiguration: JWT_SECRET not set' });
    return null;
  }
  if (!token) {
    res.status(401).json({ success: false, error: 'Missing Authorization Bearer token' });
    return null;
  }
  try {
    const decoded = jwt.verify(token, secret);
    // optional: verify role/isAdmin flag
    if (decoded.role && decoded.role !== 'admin' && !decoded.isAdmin) {
      res.status(403).json({ success: false, error: 'Forbidden' });
      return null;
    }
    return decoded;
  } catch (e) {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
    return null;
  }
}

module.exports = { requireAdmin };
