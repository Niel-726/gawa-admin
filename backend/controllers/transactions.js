const transactionsStore = [];

function listTransactions(req, res) {
  const { type, status, paymentMethod, userId } = req.query;
  let filtered = [...transactionsStore];
  if (type) filtered = filtered.filter((t) => t.type === type);
  if (status) filtered = filtered.filter((t) => t.status === status);
  if (paymentMethod) filtered = filtered.filter((t) => t.paymentMethod === paymentMethod);
  if (userId) filtered = filtered.filter((t) => t.userId === userId);
  res.json({ data: filtered });
}

function getTransactionById(req, res) {
  const t = transactionsStore.find((t) => t.id === req.params.id);
  if (!t) return res.status(404).json({ error: 'Transaction not found' });
  res.json({ data: t });
}

function releaseEscrow(req, res) {
  const t = transactionsStore.find((t) => t.id === req.params.id);
  if (!t) return res.status(404).json({ error: 'Transaction not found' });
  if (t.status !== 'escrow' && t.status !== 'held') {
    return res.status(400).json({ error: 'Transaction is not in escrow/hold status' });
  }
  t.status = 'completed';
  res.json({ data: t, message: 'Escrow released successfully' });
}

function processRefund(req, res) {
  const t = transactionsStore.find((t) => t.id === req.params.id);
  if (!t) return res.status(404).json({ error: 'Transaction not found' });
  const refund = {
    id: `txn-${Date.now()}`,
    type: 'refund',
    amount: t.netAmount || t.amount,
    status: 'completed',
    paymentMethod: t.paymentMethod,
    reference: `${t.reference}-REF`,
    userId: t.userId,
    relatedId: t.relatedId,
    relatedType: t.relatedType,
    description: `Refund for ${t.description}`,
    fee: 0,
    netAmount: t.netAmount || t.amount,
    createdAt: new Date().toISOString(),
  };
  transactionsStore.push(refund);
  t.status = 'completed';
  res.json({ data: refund, message: 'Refund processed', original: t });
}

function approvePayout(req, res) {
  const t = transactionsStore.find((t) => t.id === req.params.id);
  if (!t) return res.status(404).json({ error: 'Transaction not found' });
  if (t.type !== 'payout') return res.status(400).json({ error: 'Transaction is not a payout' });
  if (t.status !== 'pending') return res.status(400).json({ error: 'Payout is not pending' });
  t.status = 'completed';
  res.json({ data: t, message: 'Payout approved' });
}

module.exports = { listTransactions, getTransactionById, releaseEscrow, processRefund, approvePayout };
