const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/verifications', require('./verifications'));
router.use('/jobs', require('./jobs'));
router.use('/listings', require('./listings'));
router.use('/rentals', require('./rentals'));
router.use('/transactions', require('./transactions'));
router.use('/disputes', require('./disputes'));
router.use('/reports', require('./reports'));
router.use('/moderation', require('./moderation'));
router.use('/messages', require('./messages'));
router.use('/appeals', require('./appeals'));
router.use('/incidents', require('./incidents'));
router.use('/galaw-points', require('./galawPoints'));
router.use('/fee-config', require('./feeConfig'));

router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'GAWA Admin API', version: '1.0.0', timestamp: new Date().toISOString() });
});

module.exports = router;
