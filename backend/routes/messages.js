const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/messages');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, ctrl.listConversations);
router.get('/:id', authenticate, ctrl.getConversation);
router.post('/send', authenticate, ctrl.sendMessage);

module.exports = router;
