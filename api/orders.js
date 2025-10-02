const { supabase } = require('./_db');
const { requireAdmin } = require('./_auth');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    const admin = requireAdmin(req, res);
    if (!admin) return;
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ success:false, error:'Failed to fetch orders' });
    return res.json({ success:true, orders: data || [] });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
      const { sessionId=null, stripePaymentIntentId=null, stripeSessionId=null, total, status='pending', customerEmail=null, shippingAddress=null, billingAddress=null, items=[] } = body || {};
      if (typeof total === 'undefined' || isNaN(Number(total))) {
        return res.status(400).json({ success:false, error:'total is required and must be numeric' });
      }
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success:false, error:'items must be a non-empty array' });
      }
      const payload = {
        session_id: sessionId,
        stripe_payment_intent_id: stripePaymentIntentId,
        stripe_session_id: stripeSessionId,
        total: Number(total),
        status,
        customer_email: customerEmail,
        shipping_address: shippingAddress,
        billing_address: billingAddress,
        items
      };
      const { data, error } = await supabase.from('orders').insert(payload).select('*').single();
      if (error) return res.status(400).json({ success:false, error: error.message });
      return res.json({ success:true, order: data });
    } catch (e) {
      console.error('[orders][POST]', e);
      return res.status(500).json({ success:false, error:'Failed to create order' });
    }
  }

  return res.status(405).json({ success:false, error:'Method not allowed' });
};
