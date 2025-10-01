const { supabase } = require('./_db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error:'Method not allowed' });

  try {
    const body = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
    const { name, email, subject, message } = body || {};
    if (!name || !email || !subject || !message) return res.status(400).json({ success:false, error:'All fields required' });

    const { error } = await supabase.from('contact_messages').insert({ name, email, subject, message });
    if (error) return res.status(400).json({ success:false, error: error.message });
    return res.json({ success:true });
  } catch (e) {
    console.error('[contact]', e);
    return res.status(500).json({ success:false, error:'Failed to send message' });
  }
};
