const { getStripeConfig } = require('./stripe-utils');
const { requireAdmin } = require('./_auth');

function mask(k){
  if (!k) return null;
  const head = k.startsWith('sk_') ? 'sk_' : (k.startsWith('pk_') ? 'pk_' : '');
  return head + '…' + k.slice(-6);
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ success:false, error:'Method not allowed' });

  const admin = requireAdmin(req, res);
  if (!admin) return;

  const cfg = await getStripeConfig();
  return res.json({ success:true, stripeConfig: { publishableKey: mask(cfg.publishableKey), secretKey: mask(cfg.secretKey), mode: cfg.testMode ? 'test' : 'live', source: cfg.source } });
};
