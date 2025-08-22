const express = require('express');
const { auth } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/alertController');

const router = express.Router();

router.get('/low-stock', auth(true), ctrl.lowStock);
router.get('/expiry', auth(true), ctrl.expiring);

module.exports = router;