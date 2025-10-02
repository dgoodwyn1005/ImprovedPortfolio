// /api/debug-echo.js — protected debugging endpoint
// Usage: set DEBUG_TOKEN in environment (random string). The admin UI can POST here to inspect what the server receives.

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const debugToken = process.env.DEBUG_TOKEN || null;
  if (!debugToken) return res.status(404).end();

  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (token !== debugToken) return res.status(403).json({ success:false, error:'Forbidden' });

  const payload = typeof req.body === 'object' ? req.body : (req.body ? JSON.parse(req.body) : {});
  console.log('[debug-echo] headers:', Object.keys(req.headers).reduce((acc,k)=>{acc[k]= (k==='authorization'? 'REDACTED': req.headers[k]); return acc;},{}));
  console.log('[debug-echo] body keys:', Object.keys(payload || {}).slice(0,50));

  return res.json({ success:true, headers: { ...req.headers, authorization: 'REDACTED' }, body: payload });
};
