const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, index: true },
  batchNo: { type: String, required: true, trim: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  quantity: { type: Number, required: true, min: 0 },
  threshold: { type: Number, default: 5, min: 0 }, // low-stock alert threshold
  expiryDate: { type: Date, required: true },
  price: { type: Number, required: true, min: 0 }
}, { timestamps: true });

MedicineSchema.index({ name: 1, batchNo: 1 }, { unique: true });

module.exports = mongoose.model('Medicine', MedicineSchema);