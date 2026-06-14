const disputesStore = [];

function listDisputes(req, res) {
  const { type, severity, status, assignedTo } = req.query;
  let filtered = [...disputesStore];
  if (type) filtered = filtered.filter((d) => d.type === type);
  if (severity) filtered = filtered.filter((d) => d.severity === severity);
  if (status) filtered = filtered.filter((d) => d.status === status);
  if (assignedTo) filtered = filtered.filter((d) => d.assignedTo === assignedTo);
  res.json({ data: filtered });
}

function getDisputeById(req, res) {
  const d = disputesStore.find((d) => d.id === req.params.id);
  if (!d) return res.status(404).json({ error: 'Dispute not found' });
  res.json({ data: d });
}

function updateDisputeStatus(req, res) {
  const d = disputesStore.find((d) => d.id === req.params.id);
  if (!d) return res.status(404).json({ error: 'Dispute not found' });
  const { status, resolution } = req.body;
  if (status) d.status = status;
  if (resolution) d.resolution = resolution;
  if (status === 'resolved' || status === 'dismissed') d.resolvedAt = new Date().toISOString();
  d.updatedAt = new Date().toISOString();
  res.json({ data: d, message: 'Dispute updated' });
}

module.exports = { listDisputes, getDisputeById, updateDisputeStatus };
