const { createStripeInstance } = require('./stripe-utils');
const { requireAdmin } = require('./_auth');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const admin = requireAdmin(req, res);
  if (!admin) return;

  try {
    const { stripe, config } = await createStripeInstance();
    // log masked key info for debugging
    try {
      console.log('[test-stripe] using keys source:', config.source, 'testMode:', !!config.testMode);
    } catch (e) {}
    // create $1.00 test intent just to validate keys
    const pi = await stripe.paymentIntents.create({
      amount: 100,
      currency: 'usd',
      automatic_payment_methods: { enabled: true }
    });
    return res.json({ success:true, testMode: config.testMode, paymentIntentId: pi.id, mode: config.testMode ? 'test' : 'live' });
  } catch (e) {
    console.error('[test-stripe] error:', e && e.message, e && e.stack);
    const msg = (e && e.message) || 'Stripe test failed';
    return res.status(500).json({ success:false, error: msg });
  }
};
