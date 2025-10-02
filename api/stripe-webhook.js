const Stripe = require('stripe');
const { supabase } = require('./_db');
const { getPool } = require('./_pg');
const { getStripeConfig } = require('./stripe-utils');

// Expected env: STRIPE_WEBHOOK_SECRET (from Stripe dashboard)

module.exports = async function handler(req, res) {
  // Only POST is allowed
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'] || req.headers['Stripe-Signature'] || req.headers['stripe_signature'];
  const body = req.rawBody || req.body; // Vercel provides rawBody on the request

  const config = await getStripeConfig();
  const stripe = new Stripe(config.secretKey || process.env.STRIPE_SECRET_KEY || '');

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (webhookSecret && sig && body) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      // If webhook secret not present, try to parse body directly (not secure) — only for local/dev
      event = typeof body === 'object' ? body : JSON.parse(body || '{}');
    }
  } catch (err) {
    console.error('[stripe-webhook] signature verification failed:', err && err.message ? err.message : err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed' || (event.type === 'checkout.session.async_payment_succeeded')) {
    const session = event.data.object;
    const sessionId = session.id;
    console.log('[stripe-webhook] checkout completed for session:', sessionId);

    // Try Postgres transaction first
    const pool = await getPool();
    if (pool) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        // Find order by stripe_session_id
        const orderRes = await client.query('SELECT id, items FROM orders WHERE stripe_session_id = $1 FOR UPDATE', [sessionId]);
        if (orderRes.rowCount === 0) {
          console.warn('[stripe-webhook] no order found for session:', sessionId);
        } else {
          const order = orderRes.rows[0];
          const items = order.items || [];

          // For each item, decrement stock atomically
          for (const it of items) {
            const productId = it.productId || it.product_id;
            const size = it.size;
            const qty = Number(it.quantity || 0);
            if (!productId || !size || qty <= 0) continue;

            // Use JSONB update to decrement sizes->size->stock and reserved safely
            // Fetch current sizes
            const prodRes = await client.query('SELECT id, sizes FROM products WHERE product_id = $1 FOR UPDATE', [productId]);
            if (prodRes.rowCount === 0) {
              console.warn('[stripe-webhook] product not found for', productId);
              continue;
            }
            const prod = prodRes.rows[0];
            const sizes = prod.sizes || {};
            const current = sizes[size] || { stock: 0, reserved: 0 };
            const newStock = Math.max((current.stock || 0) - qty, 0);
            const newReserved = Math.max((current.reserved || 0) - qty, 0);
            sizes[size] = { ...(sizes[size] || {}), stock: newStock, reserved: newReserved };

            // Update product sizes JSON
            await client.query('UPDATE products SET sizes = $1 WHERE id = $2', [sizes, prod.id]);
          }

          // Mark order as paid
          await client.query("UPDATE orders SET status = 'paid' WHERE id = $1", [order.id]);
        }

        await client.query('COMMIT');
        console.log('[stripe-webhook] transaction committed for session:', sessionId);
      } catch (txErr) {
        await client.query('ROLLBACK');
        console.error('[stripe-webhook] transaction failed:', txErr && txErr.message ? txErr.message : txErr);
        return res.status(500).send('Internal error');
      } finally {
        client.release();
      }
      return res.status(200).send('ok');
    }

    // Fallback: use Supabase (best-effort, not atomic)
    try {
      const { data: orderData, error: orderErr } = await supabase.from('orders').select('*').eq('stripe_session_id', sessionId).limit(1).single();
      if (orderErr) {
        console.warn('[stripe-webhook] order lookup failed (supabase):', orderErr.message || orderErr);
        return res.status(200).send('ok');
      }
      const order = orderData;
      if (!order) return res.status(200).send('ok');

      const items = Array.isArray(order.items) ? order.items : [];
      for (const it of items) {
        const productId = it.productId || it.product_id;
        const size = it.size;
        const qty = Number(it.quantity || 0);
        if (!productId || !size || qty <= 0) continue;

        // Fetch product
        const { data: prod, error: prodErr } = await supabase.from('products').select('*').eq('product_id', productId).limit(1).single();
        if (prodErr || !prod) {
          console.warn('[stripe-webhook] supabase product lookup failed for', productId, prodErr && prodErr.message);
          continue;
        }

        const sizes = prod.sizes || {};
        sizes[size] = sizes[size] || { stock: 0, reserved: 0 };
        sizes[size].stock = Math.max((sizes[size].stock || 0) - qty, 0);
        sizes[size].reserved = Math.max((sizes[size].reserved || 0) - qty, 0);

        await supabase.from('products').update({ sizes }).eq('id', prod.id);
      }

      await supabase.from('orders').update({ status: 'paid' }).eq('id', order.id);
      return res.status(200).send('ok');
    } catch (fallbackErr) {
      console.error('[stripe-webhook] fallback processing failed:', fallbackErr);
      return res.status(500).send('Internal error');
    }
  }

  // Unhandled event types should return 200 to acknowledge receipt
  res.status(200).send('ignored');
};
