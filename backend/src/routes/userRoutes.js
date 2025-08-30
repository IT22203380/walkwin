const express = require('express');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');
const { listUsers, toggleActive } = require('../controllers/userController');

const router = express.Router();

router.get('/', authenticate, requireAdmin, listUsers);
router.patch('/:id/toggle', authenticate, requireAdmin, toggleActive);

module.exports = router;


