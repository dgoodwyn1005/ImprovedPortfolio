const { createStripeInstance } = require('./stripe-utils');

module.exports = async function handler(req, res) {
  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ error: 'Missing session_id' });

  try {
    const { stripe } = await createStripeInstance();
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['customer_details', 'shipping'],
    });

    res.json(session);
  } catch (err) {
    console.error('[get-checkout-session] error:', err);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
};
