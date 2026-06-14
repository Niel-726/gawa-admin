const moderationStore = [];

function listFlaggedContent(req, res) {
  const { type } = req.query;
  let filtered = [...moderationStore];
  if (type) filtered = filtered.filter((m) => m.type === type);
  res.json({ data: filtered });
}

function moderateContent(req, res) {
  const item = moderationStore.find((m) => m.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Content not found' });
  const { decision, decisionNotes } = req.body;
  item.decision = decision;
  item.decisionNotes = decisionNotes || '';
  item.resolvedAt = new Date().toISOString();
  item.moderatedBy = req.user?.id;
  res.json({ data: item, message: `Content moderated: ${decision}` });
}

module.exports = { listFlaggedContent, moderateContent };
