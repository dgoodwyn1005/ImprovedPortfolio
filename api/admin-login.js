const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ success:false, error:'Method not allowed' });

  const { ADMIN_USERNAME='', ADMIN_PASSWORD_HASH='', JWT_SECRET } = process.env;
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH || !JWT_SECRET) {
    return res.status(500).json({ success:false, error:'Server misconfiguration' });
  }

  const body = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
  const { username, email, login, password } = body || {};
  const ident = (login || username || email || '').trim().toLowerCase();
  if (!ident || !password) return res.status(400).json({ success:false, error:'username/email and password required' });

  if (ident !== ADMIN_USERNAME.trim().toLowerCase()) {
    return res.status(401).json({ success:false, error:'Invalid credentials' });
  }
  const ok = await bcrypt.compare(password, ADMIN_PASSWORD_HASH).catch(() => false);
  if (!ok) return res.status(401).json({ success:false, error:'Invalid credentials' });

  const token = jwt.sign({ sub:'env-admin', username: ADMIN_USERNAME, role:'admin', isAdmin:true }, JWT_SECRET, { expiresIn:'12h' });
  return res.json({ success:true, token, admin:{ id:'env-admin', username: ADMIN_USERNAME, role:'admin' } });
};
