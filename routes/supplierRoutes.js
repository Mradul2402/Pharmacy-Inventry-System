const express = require('express');
const { auth, allowRoles } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/supplierController');

const router = express.Router();

router.post('/', auth(true), allowRoles('admin', 'pharmacist'), ctrl.createSupplier);
router.get('/', auth(true), ctrl.getSuppliers);
router.put('/:id', auth(true), allowRoles('admin', 'pharmacist'), ctrl.updateSupplier);
router.delete('/:id', auth(true), allowRoles('admin'), ctrl.deleteSupplier);

module.exports = router;