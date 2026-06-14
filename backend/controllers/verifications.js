const verificationsStore = [];

function listVerifications(req, res) {
  const { status, userId } = req.query;
  let filtered = [...verificationsStore];
  if (status) filtered = filtered.filter((v) => v.status === status);
  if (userId) filtered = filtered.filter((v) => v.userId === userId);
  res.json({ data: filtered });
}

function getVerificationById(req, res) {
  const v = verificationsStore.find((v) => v.id === req.params.id);
  if (!v) return res.status(404).json({ error: 'Verification not found' });
  res.json({ data: v });
}

function approveVerification(req, res) {
  const v = verificationsStore.find((v) => v.id === req.params.id);
  if (!v) return res.status(404).json({ error: 'Verification not found' });
  v.status = 'approved';
  v.reviewerId = req.user?.id;
  v.remarks = req.body.remarks || '';
  v.reviewedAt = new Date().toISOString();
  res.json({ data: v, message: 'Verification approved' });
}

function rejectVerification(req, res) {
  const v = verificationsStore.find((v) => v.id === req.params.id);
  if (!v) return res.status(404).json({ error: 'Verification not found' });
  v.status = 'rejected';
  v.reviewerId = req.user?.id;
  v.remarks = req.body.remarks || '';
  v.reviewedAt = new Date().toISOString();
  res.json({ data: v, message: 'Verification rejected' });
}

module.exports = { listVerifications, getVerificationById, approveVerification, rejectVerification };
