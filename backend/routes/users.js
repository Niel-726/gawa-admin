const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/users');
const { authenticate } = require('../middleware/auth');
const { authorize, ROLES } = require('../middleware/roles');

router.get('/', authenticate, ctrl.listUsers);
router.get('/:id', authenticate, ctrl.getUserById);
router.post('/invite', authenticate, authorize(ROLES.ADMIN), ctrl.inviteUser);
router.post('/:id/suspend', authenticate, authorize(ROLES.ADMIN), ctrl.suspendUser);
router.post('/:id/reinstate', authenticate, authorize(ROLES.ADMIN), ctrl.reinstateUser);
router.delete('/:id', authenticate, authorize(ROLES.ADMIN), ctrl.deleteUser);

module.exports = router;
