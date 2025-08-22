const express = require('express');
const { body } = require('express-validator');
const { auth, allowRoles } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/authController');

const router = express.Router();

/**
 * Public: Login
 */
router.post('/login', ctrl.login);

/**
 * Admin: Register a user
 */
router.post('/register',
  auth(true), allowRoles('admin'),
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['admin', 'pharmacist', 'viewer']),
  ctrl.register
);

module.exports = router;