const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/jobs');
const { authenticate } = require('../middleware/auth');
const { authorize, ROLES } = require('../middleware/roles');

router.get('/', authenticate, ctrl.listJobs);
router.get('/:id', authenticate, ctrl.getJobById);
router.post('/:id/flag', authenticate, authorize(ROLES.ADMIN, ROLES.CUSTOMER_SUPPORT), ctrl.flagJob);
router.post('/:id/remove', authenticate, authorize(ROLES.ADMIN), ctrl.removeJob);

module.exports = router;
