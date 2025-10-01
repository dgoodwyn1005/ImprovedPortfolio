const { supabase } = require('./_db');
const { requireAdmin } = require('./_auth');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  console.log('[products] incoming', { method: req.method, headers: req.headers && { 'content-length': req.headers['content-length'], authorization: req.headers['authorization'] ? 'present' : 'missing' } });

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ success:false, error:'Failed to fetch products' });
    return res.json({ success:true, products: data || [] });
  }

  // Admin-only beyond this point
  const admin = requireAdmin(req, res);
  if (!admin) return;

  if (req.method === 'POST') {
    try {
      // guard for extremely large payloads (serverless platforms often limit body size)
      const contentLength = parseInt(req.headers['content-length'] || '0', 10) || 0;
      if (contentLength > 5 * 1024 * 1024) { // 5MB
        console.error('[products][POST] payload too large:', contentLength);
        return res.status(413).json({ success:false, error:'Payload too large. Please upload a smaller image (<=5MB).' });
      }
      const body = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
      console.log('[products][POST] body keys:', Object.keys(body || {}).slice(0,20));
      const { productId, name, price, image, sizes = {}, isAdminProduct = false } = body || {};
      if (!productId || !name || typeof price === 'undefined' || !image) {
        return res.status(400).json({ success:false, error:'productId, name, price, image are required' });
      }
      const payload = {
        product_id: String(productId).trim(),
        name: String(name).trim(),
        price: Number(price),
        image: String(image).trim(),
        sizes: sizes || {},
        is_admin_product: !!isAdminProduct
      };
      if (isNaN(payload.price)) return res.status(400).json({ success:false, error:'price must be a number' });

      const { data, error } = await supabase.from('products').insert(payload).select('*').single();
      if (error) return res.status(400).json({ success:false, error: error.message });
      return res.json({ success:true, product: data });
    } catch (e) {
      console.error('[products][POST]', e);
      return res.status(500).json({ success:false, error:'Failed to create product' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const body = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
      const { id, ...patch } = body || {};
      if (!id) return res.status(400).json({ success:false, error:'id required' });

      // map camelCase to snake_case where needed
      if (patch.productId) { patch.product_id = patch.productId; delete patch.productId; }
      if (patch.isAdminProduct !== undefined) { patch.is_admin_product = !!patch.isAdminProduct; delete patch.isAdminProduct; }

      if (patch.price !== undefined) patch.price = Number(patch.price);
      const { data, error } = await supabase.from('products').update(patch).eq('id', id).select('*').single();
      if (error) return res.status(400).json({ success:false, error: error.message });
      return res.json({ success:true, product: data });
    } catch (e) {
      console.error('[products][PUT]', e);
      return res.status(500).json({ success:false, error:'Failed to update product' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const id = (req.query && req.query.id) || null;
      if (!id) return res.status(400).json({ success:false, error:'id required' });
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) return res.status(400).json({ success:false, error: error.message });
      return res.json({ success:true });
    } catch (e) {
      console.error('[products][DELETE]', e);
      return res.status(500).json({ success:false, error:'Failed to delete product' });
    }
  }

  return res.status(405).json({ success:false, error:'Method not allowed' });
};
