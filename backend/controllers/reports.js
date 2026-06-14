const reportsStore = [];

function listReports(req, res) {
  const { type, severity, status } = req.query;
  let filtered = [...reportsStore];
  if (type) filtered = filtered.filter((r) => r.type === type);
  if (severity) filtered = filtered.filter((r) => r.severity === severity);
  if (status) filtered = filtered.filter((r) => r.status === status);
  res.json({ data: filtered });
}

function moderateReport(req, res) {
  const r = reportsStore.find((r) => r.id === req.params.id);
  if (!r) return res.status(404).json({ error: 'Report not found' });
  const { decision, decisionNotes } = req.body;
  r.decision = decision;
  r.decisionNotes = decisionNotes || '';
  r.status = decision === 'remove' ? 'resolved' : 'resolved';
  r.resolvedAt = new Date().toISOString();
  res.json({ data: r, message: `Report moderated: ${decision}` });
}

module.exports = { listReports, moderateReport };
