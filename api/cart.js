const { supabase } = require('./_db');

function getSessionId(req) {
  return req.headers['x-session-id'] || req.query?.sessionId || null;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Session-Id');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const sessionId = getSessionId(req);
  if (!sessionId) return res.status(400).json({ success:false, error:'X-Session-Id header required' });

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ success:false, error:'Failed to fetch cart' });
    return res.json({ success:true, items: data || [] });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
      const { productId, name, price, image, size, quantity=1 } = body || {};
      if (!productId || !name || typeof price === 'undefined' || !size) {
        return res.status(400).json({ success:false, error:'productId, name, price, size are required' });
      }
      const payload = {
        session_id: String(sessionId),
        product_id: String(productId).trim(),
        name: String(name).trim(),
        price: Number(price),
        image: image || null,
        size: String(size).trim(),
        quantity: Math.max(1, parseInt(quantity, 10) || 1)
      };
      if (isNaN(payload.price)) return res.status(400).json({ success:false, error:'price must be numeric' });

      // upsert by (session_id, product_id, size)
      const { data: existing, error: err1 } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('session_id', payload.session_id)
        .eq('product_id', payload.product_id)
        .eq('size', payload.size)
        .maybeSingle();
      if (err1) return res.status(500).json({ success:false, error:'Failed to check cart' });

      if (existing) {
        const newQty = (existing.quantity || 0) + payload.quantity;
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity: newQty, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
          .select('*')
          .single();
        if (error) return res.status(400).json({ success:false, error: error.message });
        return res.json({ success:true, item: data });
      } else {
        const { data, error } = await supabase.from('cart_items').insert(payload).select('*').single();
        if (error) return res.status(400).json({ success:false, error: error.message });
        return res.json({ success:true, item: data });
      }
    } catch (e) {
      console.error('[cart][POST]', e);
      return res.status(500).json({ success:false, error:'Failed to add to cart' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const body = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
      const { id, quantity } = body || {};
      if (!id || typeof quantity === 'undefined') return res.status(400).json({ success:false, error:'id and quantity required' });
      const q = Math.max(1, parseInt(quantity, 10) || 1);
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: q, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('session_id', sessionId)
        .select('*')
        .single();
      if (error) return res.status(400).json({ success:false, error: error.message });
      return res.json({ success:true, item: data });
    } catch (e) {
      console.error('[cart][PUT]', e);
      return res.status(500).json({ success:false, error:'Failed to update cart' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const id = (req.query && req.query.id) || null;
      if (!id) return res.status(400).json({ success:false, error:'id required' });
      const { error } = await supabase.from('cart_items').delete().eq('id', id).eq('session_id', sessionId);
      if (error) return res.status(400).json({ success:false, error: error.message });
      return res.json({ success:true });
    } catch (e) {
      console.error('[cart][DELETE]', e);
      return res.status(500).json({ success:false, error:'Failed to remove from cart' });
    }
  }

  return res.status(405).json({ success:false, error:'Method not allowed' });
};
