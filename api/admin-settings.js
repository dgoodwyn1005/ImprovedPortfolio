const { getAdminSettings, setAdminSettings } = require('./_db');
const { requireAdmin } = require('./_auth');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const admin = requireAdmin(req, res);
  if (!admin) return;

  if (req.method === 'GET') {
    try {
      const current = await getAdminSettings();
      const key = (req.query && req.query.key) || null;
      if (key) return res.json({ success:true, key, value: current?.[key] ?? null });
      return res.json({ success:true, settings: current });
    } catch (e) {
      console.error('[admin-settings][GET]', e);
      return res.status(500).json({ success:false, error:'Failed to load settings' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const body = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
      const { key, value, merge } = body || {};
      const current = await getAdminSettings();
      let next = current || {};
      if (key) {
        if (merge && typeof current?.[key] === 'object' && typeof value === 'object') {
          next = { ...current, [key]: { ...current[key], ...value } };
        } else {
          next = { ...current, [key]: value };
        }
      } else if (typeof body === 'object') {
        next = { ...current, ...body };
      }
      await setAdminSettings(next);
      return res.json({ success:true, settings: next });
    } catch (e) {
      console.error('[admin-settings][PUT]', e);
      return res.status(500).json({ success:false, error:'Failed to save settings' });
    }
  }

  return res.status(405).json({ success:false, error:'Method not allowed' });
};
