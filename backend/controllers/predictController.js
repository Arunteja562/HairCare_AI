const axios = require('axios');

exports.predictHairfall = async (req, res, next) => {
  try {
    // Forward the payload straight to your Flask service
    const { data } = await axios.post(
      `${process.env.PY_SERVICE_URL}/predict`,
      req.body,
      { timeout: 20000 }
    );
    res.json(data); // { prediction: ..., probability: ... }
  } catch (e) { next(e); }
};
