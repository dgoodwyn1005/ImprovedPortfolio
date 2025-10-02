module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Instagram config request received');

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  console.log('Access token present:', !!accessToken);

  if (!accessToken) {
    console.log('Instagram access token not configured');
    return res.status(200).json({
      success: false,
      message: 'Instagram access token not configured'
    });
  }

  res.json({
    success: true,
    hasToken: true
  });
}