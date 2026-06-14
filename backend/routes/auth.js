const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/auth');

router.post('/login', ctrl.login);
router.post('/request-reset', ctrl.requestPasswordReset);
router.post('/reset-password', ctrl.resetPassword);

module.exports = router;
