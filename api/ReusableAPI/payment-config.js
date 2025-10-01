const { getStripeConfig } = require('./stripe-utils');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error:'Method not allowed' });

  const cfg = await getStripeConfig();
  return res.json({ publishableKey: cfg.publishableKey, testMode: cfg.testMode, source: cfg.source });
};
