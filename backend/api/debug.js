module.exports = (req, res) => {
  try {
    const errorDetails = {};
    try { require('../config/database'); } catch(e) { errorDetails.db = e.toString(); }
    try { require('../routes/auth'); } catch(e) { errorDetails.auth = e.toString(); }
    try { require('../models/Watchlist'); } catch(e) { errorDetails.watchlist = e.toString(); }
    res.status(200).json({ status: "ok", errorDetails, envs: Object.keys(process.env).filter(k => k.includes('DB') || k.includes('VERCEL')) });
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};
