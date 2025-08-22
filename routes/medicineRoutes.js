const express = require('express');
const { auth, allowRoles } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/medicineController');

const router = express.Router();

router.post('/', auth(true), allowRoles('admin', 'pharmacist'), ctrl.createMedicine);
router.get('/', auth(true), ctrl.getMedicines);
router.get('/:id', auth(true), ctrl.getMedicineById);
router.put('/:id', auth(true), allowRoles('admin', 'pharmacist'), ctrl.updateMedicine);
router.delete('/:id', auth(true), allowRoles('admin'), ctrl.deleteMedicine);

router.post('/:id/stock-in', auth(true), allowRoles('admin', 'pharmacist'), ctrl.stockIn);
router.post('/:id/stock-out', auth(true), allowRoles('admin', 'pharmacist'), ctrl.stockOut);

module.exports = router;