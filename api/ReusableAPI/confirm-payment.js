const { createStripeInstance } = require('./stripe-utils');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error:'Method not allowed' });

  try {
    const { stripe } = await createStripeInstance();
    const body = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
    const { paymentIntentId } = body || {};
    if (!paymentIntentId) return res.status(400).json({ error:'paymentIntentId required' });

    const pi = await stripe.paymentIntents.confirm(paymentIntentId);
    return res.json({ status: pi.status, id: pi.id });
  } catch (e) {
    console.error('[confirm-payment]', e);
    return res.status(500).json({ error:'Failed to confirm payment' });
  }
};
