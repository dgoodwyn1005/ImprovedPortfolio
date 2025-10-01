module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // This would typically fetch from a database
  // For now, return empty array to use localStorage on frontend
  res.json({
    success: true,
    posts: []
  });
}