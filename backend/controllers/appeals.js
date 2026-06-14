const appealsStore = [];

function listAppeals(req, res) {
  const { status } = req.query;
  let filtered = [...appealsStore];
  if (status) filtered = filtered.filter((a) => a.status === status);
  res.json({ data: filtered });
}

function getAppealById(req, res) {
  const a = appealsStore.find((a) => a.id === req.params.id);
  if (!a) return res.status(404).json({ error: 'Appeal not found' });
  res.json({ data: a });
}

function forwardAppeal(req, res) {
  const a = appealsStore.find((a) => a.id === req.params.id);
  if (!a) return res.status(404).json({ error: 'Appeal not found' });
  a.supportRecommendation = req.body.recommendation;
  a.supportNotes = req.body.notes || '';
  a.status = 'forwarded';
  a.timeline = a.timeline || [];
  a.timeline.push({ date: new Date().toISOString(), title: 'Appeal forwarded by support', actor: req.user?.name });
  res.json({ data: a, message: 'Appeal forwarded to admin' });
}

function decideAppeal(req, res) {
  const a = appealsStore.find((a) => a.id === req.params.id);
  if (!a) return res.status(404).json({ error: 'Appeal not found' });
  const { decision, decisionNotes } = req.body;
  a.decision = decision;
  a.decisionNotes = decisionNotes || '';
  a.decidedAt = new Date().toISOString();
  a.status = 'decided';
  a.timeline = a.timeline || [];
  a.timeline.push({ date: new Date().toISOString(), title: `Final decision: ${decision}`, actor: req.user?.name });
  res.json({ data: a, message: `Appeal decision: ${decision}` });
}

module.exports = { listAppeals, getAppealById, forwardAppeal, decideAppeal };
