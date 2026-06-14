const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/rentals');
const { authenticate } = require('../middleware/auth');
const { authorize, ROLES } = require('../middleware/roles');

router.get('/', authenticate, ctrl.listRentals);
router.get('/:id', authenticate, ctrl.getRentalById);
router.post('/:id/release-deposit', authenticate, authorize(ROLES.ADMIN), ctrl.releaseDeposit);
router.post('/:id/deduct-deposit', authenticate, authorize(ROLES.ADMIN), ctrl.deductDeposit);

module.exports = router;
