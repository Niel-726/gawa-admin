const packsStore = [];
const pointsTransactionsStore = [];

function listPacks(req, res) {
  const { isActive } = req.query;
  let filtered = [...packsStore];
  if (isActive !== undefined) filtered = filtered.filter((p) => p.isActive === (isActive === 'true'));
  res.json({ data: filtered });
}

function createPack(req, res) {
  const pack = { id: `pack-${Date.now()}`, ...req.body, isActive: true, createdAt: new Date().toISOString() };
  packsStore.push(pack);
  res.status(201).json({ data: pack, message: 'Pack created' });
}

function updatePack(req, res) {
  const idx = packsStore.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Pack not found' });
  packsStore[idx] = { ...packsStore[idx], ...req.body, updatedAt: new Date().toISOString() };
  res.json({ data: packsStore[idx], message: 'Pack updated' });
}

function deletePack(req, res) {
  const idx = packsStore.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Pack not found' });
  packsStore.splice(idx, 1);
  res.json({ message: 'Pack deleted' });
}

function issuePoints(req, res) {
  const { userId, points, reason } = req.body;
  const txn = { id: `gp-txn-${Date.now()}`, userId, type: 'issued', points, adminId: req.user?.id, description: reason || 'Manual issue', createdAt: new Date().toISOString() };
  pointsTransactionsStore.push(txn);
  res.json({ data: txn, message: `${points} points issued to user ${userId}` });
}

function deductPoints(req, res) {
  const { userId, points, reason } = req.body;
  const txn = { id: `gp-txn-${Date.now()}`, userId, type: 'deducted', points: -Math.abs(points), adminId: req.user?.id, description: reason || 'Manual deduction', createdAt: new Date().toISOString() };
  pointsTransactionsStore.push(txn);
  res.json({ data: txn, message: `${points} points deducted from user ${userId}` });
}

function listPointsTransactions(req, res) {
  const { userId, type } = req.query;
  let filtered = [...pointsTransactionsStore];
  if (userId) filtered = filtered.filter((t) => t.userId === userId);
  if (type) filtered = filtered.filter((t) => t.type === type);
  res.json({ data: filtered });
}

module.exports = { listPacks, createPack, updatePack, deletePack, issuePoints, deductPoints, listPointsTransactions };
