const Medicine = require('../models/Medicine');

exports.lowStock = async (req, res) => {
  try {
    const items = await Medicine.find({ $expr: { $lte: ["$quantity", "$threshold"] } }).populate('supplier');
    res.json(items);
  } catch (err) {
    console.error('Low stock error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.expiring = async (req, res) => {
  try {
    const days = parseInt(req.query.days || process.env.ALERT_WINDOW_DAYS || '30', 10);
    const now = new Date();
    const until = new Date(now.getTime() + days*24*60*60*1000);
    const items = await Medicine.find({ expiryDate: { $gte: now, $lte: until } }).populate('supplier');
    res.json(items);
  } catch (err) {
    console.error('Expiring error', err);
    res.status(500).json({ message: 'Server error' });
  }
};