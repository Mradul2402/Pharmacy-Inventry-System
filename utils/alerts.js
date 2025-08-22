const Medicine = require('../models/Medicine');

async function getLowStock() {
  return Medicine.find({ $expr: { $lte: ["$quantity", "$threshold"] } }).populate('supplier');
}

async function getExpiring(days = 30) {
  const now = new Date();
  const until = new Date(now.getTime() + days*24*60*60*1000);
  return Medicine.find({ expiryDate: { $gte: now, $lte: until } }).populate('supplier');
}

module.exports = { getLowStock, getExpiring };