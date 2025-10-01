const { getAdminSettings } = require('./_db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const settings = await getAdminSettings();
    // Expose a small, safe public subset
    const publicSettings = {
      currency: settings?.currency || 'usd'
    };
    return res.json({ success: true, settings: publicSettings });
  } catch (e) {
    console.error('[public-settings]', e);
    return res.status(500).json({ success: false, error: 'Failed to load public settings' });
  }
};
