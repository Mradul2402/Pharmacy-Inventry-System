const Medicine = require('../models/Medicine');
const StockLog = require('../models/StockLog');

exports.createMedicine = async (req, res) => {
  try {
    const med = await Medicine.create(req.body);
    res.status(201).json(med);
  } catch (err) {
    console.error('Create medicine error', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Medicine with same name and batch already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMedicines = async (req, res) => {
  try {
    const { q } = req.query;
    const filter = q ? { name: { $regex: q, $options: 'i' } } : {};
    const meds = await Medicine.find(filter).populate('supplier').sort({ createdAt: -1 });
    res.json(meds);
  } catch (err) {
    console.error('Get medicines error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMedicineById = async (req, res) => {
  try {
    const med = await Medicine.findById(req.params.id).populate('supplier');
    if (!med) return res.status(404).json({ message: 'Medicine not found' });
    res.json(med);
  } catch (err) {
    console.error('Get medicine by id error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateMedicine = async (req, res) => {
  try {
    const med = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!med) return res.status(404).json({ message: 'Medicine not found' });
    res.json(med);
  } catch (err) {
    console.error('Update medicine error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteMedicine = async (req, res) => {
  try {
    const med = await Medicine.findByIdAndDelete(req.params.id);
    if (!med) return res.status(404).json({ message: 'Medicine not found' });
    res.json({ message: 'Medicine deleted' });
  } catch (err) {
    console.error('Delete medicine error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.stockIn = async (req, res) => {
  try {
    const { quantity, note } = req.body;
    if (!quantity || quantity <= 0) return res.status(400).json({ message: 'Quantity must be > 0' });

    const med = await Medicine.findById(req.params.id);
    if (!med) return res.status(404).json({ message: 'Medicine not found' });

    med.quantity += quantity;
    await med.save();

    const log = await StockLog.create({
      medicine: med._id,
      type: 'IN',
      quantity,
      note,
      performedBy: req.user?.id
    });

    res.json({ message: 'Stock added', medicine: med, log });
  } catch (err) {
    console.error('Stock in error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.stockOut = async (req, res) => {
  try {
    const { quantity, note } = req.body;
    if (!quantity || quantity <= 0) return res.status(400).json({ message: 'Quantity must be > 0' });

    const med = await Medicine.findById(req.params.id);
    if (!med) return res.status(404).json({ message: 'Medicine not found' });
    if (med.quantity < quantity) return res.status(400).json({ message: 'Insufficient stock' });

    med.quantity -= quantity;
    await med.save();

    const log = await StockLog.create({
      medicine: med._id,
      type: 'OUT',
      quantity,
      note,
      performedBy: req.user?.id
    });

    res.json({ message: 'Stock deducted', medicine: med, log });
  } catch (err) {
    console.error('Stock out error', err);
    res.status(500).json({ message: 'Server error' });
  }
};