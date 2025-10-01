const { createStripeInstance } = require('./stripe-utils');
const { supabase } = require('./_db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error:'Method not allowed' });

  try {
    const body = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
    let { lineItems=[], items=[], mode='payment', successUrl='/api/checkout-success', cancelUrl='/api/checkout-cancel', customerEmail } = body || {};

    // Support legacy `items` payload by mapping to Stripe `lineItems` format
    if ((!Array.isArray(lineItems) || lineItems.length === 0) && Array.isArray(items) && items.length > 0) {
      console.log('[create-checkout-session] received legacy items payload, mapping to lineItems');
      // Expect items to have { productId, name, price, image, size, quantity }
      lineItems = items.map(it => {
        const price = Number(it.price || 0);
        return {
          price_data: {
            currency: (it.currency || 'usd'),
            product_data: {
              name: `${it.name}${it.size ? ' (' + it.size + ')' : ''}`,
              images: it.image ? [it.image] : []
            },
            unit_amount: Math.round(price * 100)
          },
          quantity: Number(it.quantity || 1)
        };
      });
    }

    if (!Array.isArray(lineItems) || lineItems.length === 0) return res.status(400).json({ error:'lineItems required' });

    // Build absolute URLs for Stripe (Stripe requires absolute URLs)
    const siteOrigin = (process.env.SITE_ORIGIN || process.env.REPL_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) || process.env.CORS_ORIGIN || 'http://localhost:3000').replace(/\/$/, '');
    const makeAbsolute = (u) => {
      if (!u) return u;
      if (u.startsWith('http://') || u.startsWith('https://')) return u;
      // ensure leading slash
      return siteOrigin + (u.startsWith('/') ? u : '/' + u);
    };

    successUrl = makeAbsolute(successUrl);
    cancelUrl = makeAbsolute(cancelUrl);

    const { stripe, config } = await createStripeInstance();
    console.log('[create-checkout-session] stripe config source:', config.source, 'testMode:', config.testMode);
    console.log('[create-checkout-session] creating session with', lineItems.length, 'lineItems. sample:', lineItems[0]);
    // Sanitize images: Stripe requires valid http(s) URLs and length < 2048
    const sanitizeImageUrl = (u) => {
      if (!u || typeof u !== 'string') return null;
      if (u.length > 2000) return null;
      if (!u.startsWith('http://') && !u.startsWith('https://')) return null;
      return u;
    };

    lineItems = lineItems.map(li => {
      try {
        if (li && li.price_data && li.price_data.product_data && Array.isArray(li.price_data.product_data.images)) {
          const imgs = li.price_data.product_data.images.map(sanitizeImageUrl).filter(Boolean);
          li.price_data.product_data.images = imgs;
        }
      } catch (e) {
        // ignore sanitization errors
      }
      return li;
    });
    console.log('[create-checkout-session] success_url:', successUrl, 'cancel_url:', cancelUrl);

    // Create an order record (pending) so we track items and can update inventory later
    try {
      const orderPayload = {
        session_id: null,
        stripe_payment_intent_id: null,
        stripe_session_id: null,
        total: Number((body && body.total) || 0),
        status: 'pending',
        customer_email: customerEmail || null,
        shipping_address: null,
        billing_address: null,
        items: items || []
      };
      const { data: orderData, error: orderErr } = await supabase.from('orders').insert(orderPayload).select('*').single();
      if (orderErr) {
        console.error('[create-checkout-session] failed to create order record:', orderErr.message || orderErr);
      }

      // If Stripe is in testMode (no real keys available), return a mock session and attach order id
      if (config && config.testMode) {
        console.log('[create-checkout-session] running in test mode; returning mock session');
        const mockSession = {
          id: 'cs_test_' + Math.random().toString(36).slice(2, 10),
          url: '#mock-checkout',
        };
        // update order with mock session id if we created one
        if (orderData && orderData.id) {
          await supabase.from('orders').update({ stripe_session_id: mockSession.id }).eq('id', orderData.id);
        }
        return res.json({ id: mockSession.id, url: mockSession.url, testMode: true });
      }

      try {
        const session = await stripe.checkout.sessions.create({
          mode,
          line_items: lineItems,
          success_url: successUrl,
          cancel_url: cancelUrl,
          customer_email: customerEmail,
          shipping_address_collection: {
            allowed_countries: ['US', 'CA'], // adjust as needed
          },
          phone_number_collection: {
            enabled: true,
          },
        });

        // Update order with Stripe session id if order exists
        if (orderData && orderData.id) {
          await supabase.from('orders').update({ stripe_session_id: session.id }).eq('id', orderData.id);
        }

        return res.json({ id: session.id, url: session.url });
      } catch (stripeErr) {
        console.error('[create-checkout-session][stripe error]', stripeErr && stripeErr.message ? stripeErr.message : stripeErr);
        // Return Stripe error message to client for debugging (non-sensitive)
        return res.status(500).json({ error: stripeErr && stripeErr.message ? stripeErr.message : 'Stripe session creation failed' });
      }
    } catch (orderEx) {
      console.error('[create-checkout-session][order create]', orderEx);
      // continue to try creating Stripe session even if order insert failed
    }
  } catch (e) {
    console.error('[create-checkout-session]', e);
    return res.status(500).json({ error:'Failed to create session' });
  }
};
