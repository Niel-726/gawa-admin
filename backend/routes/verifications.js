const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/verifications');
const { authenticate } = require('../middleware/auth');
const { authorize, ROLES } = require('../middleware/roles');

router.get('/', authenticate, ctrl.listVerifications);
router.get('/:id', authenticate, ctrl.getVerificationById);
router.post('/:id/approve', authenticate, authorize(ROLES.ADMIN, ROLES.CUSTOMER_SUPPORT), ctrl.approveVerification);
router.post('/:id/reject', authenticate, authorize(ROLES.ADMIN, ROLES.CUSTOMER_SUPPORT), ctrl.rejectVerification);

module.exports = router;
