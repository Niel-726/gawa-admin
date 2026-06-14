const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/disputes');
const { authenticate } = require('../middleware/auth');
const { authorize, ROLES } = require('../middleware/roles');

router.get('/', authenticate, ctrl.listDisputes);
router.get('/:id', authenticate, ctrl.getDisputeById);
router.patch('/:id', authenticate, authorize(ROLES.ADMIN, ROLES.CUSTOMER_SUPPORT), ctrl.updateDisputeStatus);

module.exports = router;
