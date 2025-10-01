const { createStripeInstance } = require('./stripe-utils');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error:'Method not allowed' });

  try {
    const body = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
    const { amount, currency='usd', metadata={} } = body || {};
    if (!amount || Number(amount) <= 0) return res.status(400).json({ error:'amount required' });

    const { stripe } = await createStripeInstance();
    const pi = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount)),
      currency,
      automatic_payment_methods: { enabled: true },
      metadata
    });
    return res.json({ clientSecret: pi.client_secret, id: pi.id });
  } catch (e) {
    console.error('[create-payment-intent]', e);
    return res.status(500).json({ error:'Failed to create PaymentIntent' });
  }
};
